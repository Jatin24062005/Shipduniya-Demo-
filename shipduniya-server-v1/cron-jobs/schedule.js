const cron = require("node-cron");
const axios = require("axios");
const User = require("../models/User");
const Order = require("../models/Order");
const { trackShipment } = require("../controllers/trackShipmentController");
const {
  trackShipmentWithoutLogin,
} = require("../controllers/shippingController");
const Shipping = require("../models/Shipping");
const NDROrder = require("../models/NDR");
const RemittanceRequest = require("../models/RemittanceRequest");
const NDR = require("../models/NDR");
const weightRecociliation = require("../models/weightRecociliation");
const Transaction = require("../models/Transaction");
// Helper to fetch tracking details based on the shipping partner
const fetchTrackingStatus = async (partner, awbNumber) => {
  if (!partner || !awbNumber) {
    console.error("Missing partner or AWB number for tracking.");
    return null;
  }

  try {
    let response;
    switch (partner.toLowerCase()) {
      case "xpressbees":
        response = await axios.get(
          `https://shipment.xpressbees.com/api/shipments2/track/${awbNumber}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.EXPRESSBEES_TOKEN}`,
            },
          }
        );
        return response.data?.data?.status?.toLowerCase();
      case "delhivery":
        response = await axios.get(
          `https://track.delhivery.com/api/v1/track/${awbNumber}`,
          {
            headers: { Authorization: `Bearer ${process.env.DELHIVERY_TOKEN}` },
          }
        );
        return response.data?.status?.toLowerCase();
      case "ekart":
        response = await axios.get(
          `https://api.ekartlogistics.com/v2/shipments/${awbNumber}`,
          {
            headers: { Authorization: `Bearer ${process.env.EKART_TOKEN}` },
          }
        );
        return response.data?.shipment_status?.toLowerCase();
      default:
        console.error(`Unsupported shipping partner: ${partner}`);
        return null;
    }
  } catch (error) {
    console.error(
      `Error fetching tracking status for AWB ${awbNumber} from ${partner}:`,
      error.message
    );
    return null;
  }
};

// Function to fetch and calculate metrics for all orders of a user
const getUserOrderMetrics = async (userId) => {
  try {
    const orders = await Order.find({ userId });

    const metrics = {
      totalParcels: 0,
      totalDelivered: 0,
      totalRTO: 0,
      totalPendingPickup: 0,
      totalInTransit: 0,
      totalLost: 0,
    };

    const orderStatuses = await Promise.all(
      orders.map((order) =>
        order.partner && order.awbNumber
          ? fetchTrackingStatus(order.partner, order.awbNumber)
          : Promise.resolve(null)
      )
    );

    orderStatuses.forEach((status) => {
      if (status) {
        metrics.totalParcels += 1;
        switch (status) {
          case "delivered":
            metrics.totalDelivered += 1;
            break;
          case "rto":
            metrics.totalRTO += 1;
            break;
          case "pending pickup":
            metrics.totalPendingPickup += 1;
            break;
          case "in transit":
            metrics.totalInTransit += 1;
            break;
          case "lost":
            metrics.totalLost += 1;
            break;
        }
      }
    });

    return metrics;
  } catch (error) {
    console.error(
      `Error calculating metrics for user ${userId}:`,
      error.message
    );
    return null;
  }
};

// Function to update metrics for all users
const updateMetricsForAllUsers = async () => {
  try {
    const users = await User.find();
    console.log(`Found ${users.length} users to update metrics.`);

    for (const user of users) {
      const metrics = await getUserOrderMetrics(user._id);
      if (metrics) {
        await User.findByIdAndUpdate(user._id, { metrics });
        console.log(`Metrics updated for user ${user._id}`);
      } else {
        console.warn(`No metrics calculated for user ${user._id}`);
      }
    }

    console.log("All user metrics updated successfully!");
  } catch (error) {
    console.error("Error updating metrics for all users:", error.message);
  }
};
const getStatusFromRTO = (shippingPartner, trackingDetails) => {
  if (!trackingDetails || !shippingPartner) return null;

  if (shippingPartner.toLowerCase() === "xpressbees") {
    const data = trackingDetails?.trackingDetails?.history;

    if (Array.isArray(data)) {
      const rtoStatus = data[0]?.message?.toLowerCase();
      if (rtoStatus) {
        return {rtoStatus:rtoStatus, code: data[0]?.status_code?.toLowerCase()};
      }
    }
  }

  return null;
};
const createNdr = async (shipment,shippingPartner)=>{
  try {
      const res = await NDR.create({
    userId:shipment.userId,
    shippingId: shipment._id,
    awb:shipment.awbNumber,
    courier:shippingPartner
  })
  return {   status: "success",
      Ndr: res

  }
    
  } catch (error) {
    console.log("failed to create Ndr ",error.message)
  }

}

const createRtoTransaction = async (shipment, awbNumber) => {
  const reconciliation = await weightRecociliation.findOne({ awbNumber });
  const user = await User.findById(shipment.userId);
  const shippingTransaction = await Transaction.findOne({ awbNumber, type: "shipping" });

  if (!user) {
    console.warn(`User not found for ID: ${shipment.userId}`);
    return;
  }
  if (!shippingTransaction) {
    console.warn(`Shipping transaction not found for AWB: ${awbNumber}`);
    return;
  }

  let amount = 0;

  // 1️⃣ Handle Extra Weight Charges
  if (reconciliation) {
    amount = reconciliation.ExtraWeightCharges || 0;
    shippingTransaction.appliedWeight = reconciliation.ExtraWeight;
    shippingTransaction.rtoExtraWeightCharges = reconciliation.ExtraWeightCharges;

    user.wallet -= amount;

    await Transaction.create({
      userId: shipment.userId,
      type: "wallet",
      debitAmount: amount,
      creditAmount: 0,
      amount,
      currency: "INR",
      balance: user.wallet,
      description: "RTO Extra Weight Charges",
      status: "success",
      transactionMode: "debit",
      transactionId: `TRANS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      courier: shipment?.partnerDetails?.name || "N/A",
      totalAmount: amount,
      awbNumber,
      shipmentId: shipment?.shipmentId || "N/A",
    });
  }

  // 2️⃣ Handle COD Refund
  const isCodShipment = (shipment?.orderIds?.orderType || "")?.toLowerCase() === "cod";
  if (isCodShipment) {
    amount = shipment.partnerDetails.cod_charges || 0;
    shippingTransaction.codChargeReverse = amount;

    user.wallet += amount;

    await Transaction.create({
      userId: shipment.userId,
      type: "wallet",
      debitAmount: 0,
      creditAmount: amount,
      amount,
      currency: "INR",
      balance: user.wallet,
      description: "COD Charges Refund due to RTO",
      status: "success",
      transactionMode: "credit",
      transactionId: `TRANS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      courier: shipment?.partnerDetails?.name || "N/A",
      totalAmount: amount,
      awbNumber,
      shipmentId: shipment?.shipmentId || "N/A",
    });
  }

  // 3️⃣ Handle RTO Freight Charges
  amount = shipment.partnerDetails.freight_charges || 0;
  shippingTransaction.rtoCharges = amount;

  user.wallet -= amount;

  await Transaction.create({
    userId: shipment.userId,
    type: "wallet",
    debitAmount: amount,
    creditAmount: 0,
    amount,
    currency: "INR",
    balance: user.wallet,
    description: "RTO Charges",
    status: "success",
    transactionMode: "debit",
    transactionId: `TRANS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    courier: shipment?.partnerDetails?.name || "N/A",
    totalAmount: amount,
    awbNumber,
    shipmentId: shipment?.shipmentId || "N/A",
  });

  // 4️⃣ Save Updates
  await Promise.all([user.save(), shippingTransaction.save()]);

  return {
    status: "success",
    message: "RTO Charges processed successfully.",
  };
};


const CodRemittance = async (shipment) => {
  try {
    // Implement your logic for COD remittance here
    const order = await Order.findById(shipment.orderIds[0]);
    const remittanceExists = await RemittanceRequest.findOne({
      userId: shipment.userId,
      orderId: order._id,
    });

    if (remittanceExists) {
     
      console.log("Remittance already exists for this order.");
      return { status: "success", message: "Remittance already exists." };
    }

const remittanceRequest = await RemittanceRequest.create({
  userId: shipment.userId,
  orderId: order._id,
  orderType: order.orderType,
  awbNumber: shipment.awbNumber,
  pincode: order.pincode,
  status: "unpaid",
  codAmount: order.collectableValue,
  courier: shipment.partnerDetails.name,
  consignee:order.consignee,
  orderNumber:order.orderId
});

  
    return {
      status: "success",
      Remittance: remittanceRequest
    };
  } catch (error) {
    console.error("Error in CodRemittance:", error.message);
  }
};

const updateShipmentStatus = async () => {
  const shipments = await Shipping.find({
    status: { $nin: ["canceled", "cancelled"] },
  });

  console.log("Shipments:", shipments.length);

  for (const shipment of shipments) {
    const awbNumber = shipment?.awbNumber;
    let shippingPartner = shipment?.partnerDetails?.name;

    if (!awbNumber || !shippingPartner) continue;

    shippingPartner = shippingPartner.toString().trim().toLowerCase();

    if (shippingPartner.includes("xpressbees")) {
      shippingPartner = "xpressbees";
    } else if (shippingPartner.includes("delhivery")) {
      shippingPartner = "delhivery";
    } else {
      continue; // Unknown partner, skip
    }
    try {
      const response = await axios.post(
        `https://shipduniya-service-1039728025215.asia-south1.run.app/api/shipping/track-without-login`,
        {
          courier: shippingPartner,
          awb: awbNumber,
        }
      );
  
    let history = [];
    let status = null;

    
    if (shippingPartner === "xpressbees") {
      history = response?.data?.trackingDetails?.history || [];
      status =
        response?.data?.trackingDetails?.status ||
        response?.data?.trackingDetails?.status ||
        response?.data?.trackingDetails?.[1]?.status;
    } else if (shippingPartner === "ecom") {
      history =
        response?.trackingDetails?.ShipmentData?.[0]?.Shipment?.Scans?.map(
          (scan) => ({
            status_code: scan?.ScanDetail?.StatusCode || "N/A",
            message: scan?.ScanDetail?.Scan || "No message",
            location: scan?.ScanDetail?.ScannedLocation || "Unknown",
            event_time: scan?.ScanDetail?.ScanDateTime || "Unknown time",
          })
        ) || [];
    } else if (shippingPartner === "delhivery") {
      history =
        response?.data?.trackingDetails?.ShipmentData?.[0]?.Shipment?.Scans?.map(
          (scan) => ({
            status_code: scan?.ScanDetail?.StatusCode || "N/A",
            status: scan?.ScanDetail?.Scan,
            message: scan?.ScanDetail?.Instructions || "No message",
            location: scan?.ScanDetail?.ScannedLocation || "Unknown",
            event_time: scan?.ScanDetail?.ScanDateTime || "Unknown time",
          })
        ).reverse() || [];


      status = history[0]?.status.toLowerCase();
    }
      const trackingDetails = response?.data;
      const latestStatus = status;

      if (latestStatus && shipment.status !== latestStatus) {
        shipment.status = latestStatus;
        await shipment.save(); // Save the update to DB
        console.log(`✅ Updated AWB ${awbNumber} to status: ${latestStatus}`);

        if (latestStatus === "delivered") {
          // Handle delivery status
          const codRemittance = await CodRemittance(shipment);
        }
  if(latestStatus.toLowerCase()==="exception"){
        const newNdr = await createNdr(shipment,shippingPartner);
        console.log("Ndr created Successfully !");
      }

      if(latestStatus.toLowerCase() === "rto" && !shipment.status.toLowerCase().includes("rto")){
       const response = await createRtoTransaction(shipment,awbNumber);
        console.log("RTO Transaction Created Successfully !");
      }
        
      }

    

      if (latestStatus.toLowerCase() === "rto") {
        const rtoStatus = getStatusFromRTO(shippingPartner, trackingDetails);


        // Define your valid enum statuses (adjust this list as per your schema)
        const validStatuses = [
          "rto intransit",
          "rto delivered",
          "rto lost",
          "rto received",
        ];

        // Check if rtoStatus is valid, else set to "rto-lost"
        shipment.status =
          rtoStatus.rtoStatus && validStatuses.includes(rtoStatus.rtoStatus)
            ? rtoStatus.rtoStatus
            : rtoStatus.code === "rt-it"?"rto intransit":"rto lost";

        await shipment.save(); // Save the update to DB
        console.log(
          `✅ Updated AWB ${awbNumber} to RTO status: ${shipment.status}`
        );
      }
    } catch (error) {
      console.error(
        `❌ Error tracking AWB ${awbNumber} with ${shippingPartner}:`,
        error.message
      );
    }
  }
};

// Export the functions for external usage (if needed)
module.exports = {
  fetchTrackingStatus,
  getUserOrderMetrics,
  updateMetricsForAllUsers,
  updateShipmentStatus,
};
