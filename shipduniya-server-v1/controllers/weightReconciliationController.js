const { default: axios } = require("axios");
const Shipping = require("../models/Shipping");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const WeightReconciliation = require("../models/weightRecociliation");
const ExcelJS = require("exceljs");
const mongoose = require("mongoose");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const CreateWeightReconciliation = async (req, res) => {
  const id = req.user.id;

  if (!id)
    return res
      .status(400)
      .json({ success: false, message: "User ID is required." });

  const { awbNumber, appliedWeight } = req.body;

  if (!awbNumber || !appliedWeight)
    return res.status(400).json({
      success: false,
      message: "AWB Number and Applied Weight are required.",
    });

  const isValidReconciliation = await WeightReconciliation.find({
    awbNumber: awbNumber,
  });
  if (isValidReconciliation.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Weight reconciliation already exists for this AWB number.",
    });
  }

  const shipment = await Shipping.findOne({ awbNumber }).populate("orderIds");

  if (!shipment)
    return res
      .status(404)
      .json({ success: false, message: "Shipment not found." });
  try {
    const ExtraWeight =
      appliedWeight -
      Math.max(
        shipment.orderIds[0].actualWeight,
        shipment.orderIds[0].volumetricWeight
      );

    if (ExtraWeight < 0)
      return res.status(400).json({
        success: false,
        message:
          "Applied weight cannot be less than actual or volumetric weight.",
      });

    const getCarrierName = (str) => {
      if (str.toLowerCase().includes("xpressbees")) {
        return "xpressbees";
      } else {
        return "delhivery";
      }
    };

    const carrierName = getCarrierName(shipment?.partnerDetails?.name);
    console.log("Carrier Name:", carrierName);
    const response = await axios.post(
      `https://shipduniya-service-1039728025215.asia-south1.run.app/api/calculate/calculate-OnBackend-charges`,
      {
        chargeableWeight: appliedWeight,
        CODAmount: shipment.orderIds[0].collectableValue || 0,
        productType: shipment.orderIds[0].orderType,
        originPincode: shipment.pickupAddress.pincode,
        destinationPincode: shipment.orderIds[0].pincode,
        carrierName: carrierName,
        height: shipment.orderIds[0].height || 10,
        breadth: shipment.orderIds[0].breadth || 10,
        length: shipment.orderIds[0].length || 10,
        userId: shipment.userId,
      }
    );

    console.log("Response from calculate charges:", response.data);
    const matchingCharge = response.data.charges.find((charge) =>
      shipment.partnerDetails.name
        .toLowerCase()
        .includes(charge.serviceType.toLowerCase())
    );

    if (!matchingCharge) {
      return res
        .status(404)
        .json({ success: false, message: "Matching charge not found." });
    }

    console.log("charged Slab:", matchingCharge);

    const ChargeForAppliedWeight = {
      totalPrice: matchingCharge?.totalPrice || 0,
      freightCharge: matchingCharge?.freightCharge || 0,
      codCharge: matchingCharge?.codCharge || 0,
    };

    console.log("ChargeForAppliedWeight:", ChargeForAppliedWeight);

    const ExtraWeightCharge =
      ChargeForAppliedWeight.totalPrice - shipment.priceForCustomer;

    console.log("ExtraWeightCharge : ", ExtraWeightCharge);

    if (ExtraWeight <= 0) {
      // No extra weight charges apply
      return res
        .status(200)
        .json({ success: true, message: "No extra weight charges apply." });
    }

    // Proceed with creating the weight reconciliation
    const transactionId = `TRANS-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    const weightReconciliation = new WeightReconciliation({
      adminId: id,
      userId: shipment.userId,
      shipmentId: shipment._id,
      weightAppliedDate: new Date(),
      awbNumber,
      orderId: shipment.orderIds[0]._id,
      orderType: shipment.orderIds[0].orderType,
      enteredWeight: {
        length: shipment.orderIds[0].length,
        breadth: shipment.orderIds[0].breadth,
        height: shipment.orderIds[0].height,
        actualWeight: shipment.orderIds[0].actualWeight,
        volumetricWeight: shipment.orderIds[0].volumetricWeight,
      },
      appliedWeight,
      partnerDetails: shipment.partnerDetails,
      ExtraWeightCharges: ExtraWeightCharge,
      ExtraWeight: ExtraWeight,
      product: shipment.orderIds[0].itemDescription,
      transactionId: transactionId,
    });

    await weightReconciliation.save();

    const user = await User.findById(shipment.userId);

    user.wallet -= ExtraWeightCharge;
    await user.save();

    const transaction = await Transaction.create({
      userId: shipment.userId,
      type: ["wallet", "weight_reconciliation"], // Payment type
      debitAmount: ExtraWeightCharge, // No debit
      creditAmount: 0,
      amount: ExtraWeightCharge, // Wallet top-up
      currency: "INR",
      balance: user.wallet, // Updated wallet balance
      description: `Extra Weight Reconciliation Charges`,
      status: "success",
      transactionId: transactionId,
      awbNumber: awbNumber,
      appliedWeight: appliedWeight,
      courier: carrierName,
      transactionMode: "debit", // Mode is credit
    });

   const shippingTransaction = await Transaction.findOne({ awbNumber, type: "shipping" });
   if (shippingTransaction) {
     // If a shipping transaction exists, you can use it
     console.log("Shipping transaction found!");
      shippingTransaction.extraWeightCharges = ExtraWeightCharge;
      shippingTransaction.appliedWeight = appliedWeight;
      shippingTransaction.enteredDimension =  {
        length: shipment.orderIds[0].length,
        breadth: shipment.orderIds[0].breadth,
        height: shipment.orderIds[0].height,
        actualWeight: shipment.orderIds[0].actualWeight,
        volumetricWeight: shipment.orderIds[0].volumetricWeight,
      };
      shippingTransaction.save();


   } else {
     console.log("No shipping transaction found.");
   }

    res.status(201).json({ success: true, data: weightReconciliation });
  } catch (error) {
    console.error("Error creating weight reconciliation:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const CreateWeightReconciliationBulk = async (req, res) => {
  const id = req.user.id;
  if (!id)
    return res
      .status(400)
      .json({ success: false, message: "User ID is required." });

  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Excel file is required." });
  }

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer, { type: "buffer" });

    const worksheet = workbook.worksheets[0]; // first sheet
    let results = [];
    for (let i = 1; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      console.log(`Row ${i}:`, row.values);
    }
    // Assuming Excel headers: AWBNumber | AppliedWeight
    for (let i = 2; i <= worksheet.rowCount; i++) {
      // start from row 2 (skip header)
      const awbNumber = worksheet.getRow(i).getCell(3).value; // Column A
      const appliedWeight = worksheet.getRow(i).getCell(11).value; // Column B

      if (!awbNumber || !appliedWeight) {
        results.push({
          awbNumber,
          success: false,
          message: "AWB Number and Applied Weight are required.",
        });
        continue;
      }

      const isValidReconciliation = await WeightReconciliation.find({
        awbNumber: awbNumber,
      });
      if (isValidReconciliation.length > 0) {
        continue;
      }

      const shipment = await Shipping.findOne({ awbNumber }).populate(
        "orderIds"
      );
      if (!shipment) {
        results.push({
          awbNumber,
          success: false,
          message: "Shipment not found.",
        });
        continue;
      }

      const ExtraWeight =
        appliedWeight -
        Math.max(
          shipment.orderIds[0].actualWeight,
          shipment.orderIds[0].volumetricWeight
        );

      if (ExtraWeight < 0) {
        results.push({
          awbNumber,
          success: false,
          message:
            "Applied weight cannot be less than actual or volumetric weight.",
        });
        continue;
      }

      const getCarrierName = (str) => {
        return str?.toLowerCase().includes("xpressbees")
          ? "xpressbees"
          : "delhivery";
      };

      const carrierName = getCarrierName(shipment?.partnerDetails?.name);

      const response = await axios.post(
        `https://shipduniya-service-1039728025215.asia-south1.run.app/api/calculate/calculate-OnBackend-charges`,
        {
          chargeableWeight: appliedWeight,
          CODAmount: shipment.orderIds[0].collectableValue || 0,
          productType: shipment.orderIds[0].orderType,
          originPincode: shipment.pickupAddress.pincode,
          destinationPincode: shipment.orderIds[0].pincode,
          carrierName,
          height: shipment.orderIds[0].height || 10,
          breadth: shipment.orderIds[0].breadth || 10,
          length: shipment.orderIds[0].length || 10,
          userId: shipment.userId,
        }
      );

      const matchingCharge = response.data.charges.find((charge) =>
        shipment.partnerDetails.name
          .toLowerCase()
          .includes(charge.serviceType.toLowerCase())
      );

      if (!matchingCharge) {
        results.push({
          awbNumber,
          success: false,
          message: "Matching charge not found.",
        });
        continue;
      }

      const ChargeForAppliedWeight = {
        totalPrice: matchingCharge?.totalPrice || 0,
        freightCharge: matchingCharge?.freightCharge || 0,
        codCharge: matchingCharge?.codCharge || 0,
      };

      const ExtraWeightCharge =
        ChargeForAppliedWeight.totalPrice - shipment.priceForCustomer;

      if (ExtraWeight <= 0) {
        results.push({
          awbNumber,
          success: true,
          message: "No extra weight charges apply.",
        });
        continue;
      }
      const transactionId = `TRANS-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;

      // Save reconciliation
      const weightReconciliation = new WeightReconciliation({
        adminId: id,
        userId: shipment.userId,
        shipmentId: shipment._id,
        weightAppliedDate: new Date(),
        awbNumber,
        orderId: shipment.orderIds[0]._id,
        orderType: shipment.orderIds[0].orderType,
        enteredWeight: {
          length: shipment.orderIds[0].length,
          breadth: shipment.orderIds[0].breadth,
          height: shipment.orderIds[0].height,
          actualWeight: shipment.orderIds[0].actualWeight,
          volumetricWeight: shipment.orderIds[0].volumetricWeight,
        },
        appliedWeight,
        partnerDetails: shipment.partnerDetails,
        ExtraWeightCharges: ExtraWeightCharge,
        ExtraWeight: ExtraWeight,
        product: shipment.orderIds[0].itemDescription,
        transactionId: transactionId,
      });

      await weightReconciliation.save();

      // Wallet update
      const user = await User.findById(shipment.userId);
      user.wallet -= ExtraWeightCharge;
      await user.save();

      // Transaction
      await Transaction.create({
        userId: shipment.userId,
        type: ["wallet", "weight_reconciliation"],
        debitAmount: ExtraWeightCharge,
        creditAmount: 0,
        amount: ExtraWeightCharge,
        currency: "INR",
        balance: user.wallet,
        description: `Extra Weight Reconciliation Charges`,
        status: "success",
        transactionId: transactionId,
        transactionMode: "debit",
        appliedWeight: appliedWeight,
        courier: carrierName,
        awbNumber: awbNumber,
      });

         const shippingTransaction = await Transaction.findOne({ awbNumber, type: "shipping" });
   if (shippingTransaction) {
     // If a shipping transaction exists, you can use it
     console.log("Shipping transaction found!");
      shippingTransaction.extraWeightCharges = ExtraWeightCharge;
      shippingTransaction.appliedWeight = appliedWeight;
      shippingTransaction.enteredDimension =  {
        length: shipment.orderIds[0].length,
        breadth: shipment.orderIds[0].breadth,
        height: shipment.orderIds[0].height,
        actualWeight: shipment.orderIds[0].actualWeight,
        volumetricWeight: shipment.orderIds[0].volumetricWeight,
      };
      shippingTransaction.save();


   } else {
     console.log("No shipping transaction found.");
   }

      results.push({
        awbNumber,
        success: true,
        message: "Weight reconciliation completed successfully.",
      });
    }

    res.status(200).json({ success: true, results });
  } catch (error) {
    console.error("Error processing bulk weight reconciliation:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const getWeightReconcilitionForAdmin = async (req, res) => {
  try {
    const adminId = req.user.id;

    if (!adminId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access." });
    }

    const result = await WeightReconciliation.aggregate([
      { $match: { adminId: new mongoose.Types.ObjectId(adminId) } },

      // Populate seller (exclude avatar)
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "seller",
          pipeline: [{ $project: { avatar: 0 } }],
        },
      },

      { $unwind: "$seller" },

      // Group by userId
      {
        $group: {
          _id: "$userId",
          seller: { $first: "$seller" },
          totalAwb: { $sum: 1 },
          totalExtraWeight: { $sum: "$ExtraWeight" },
          totalExtraCharges: { $sum: "$ExtraWeightCharges" },
          totalDisputeAwb: {
            $sum: {
              $cond: [{ $eq: ["$status", "dispute"] }, 1, 0],
            },
          },
          weightReconciliationIds: { $push: "$_id" },
          details: {
            $push: {
              _id: "$_id",
              shipmentId: "$shipmentId",
              weightAppliedDate: "$weightAppliedDate",
              awbNumber: "$awbNumber",
              orderId: "$orderId",
              enteredWeight: "$enteredWeight",
              orderType: "$orderType",
              appliedWeight: "$appliedWeight",
              ExtraWeightCharges: "$ExtraWeightCharges",
              ExtraWeight: "$ExtraWeight",
              partnerDetails: "$partnerDetails",
              product: "$product",
              status: "$status",
              action: "$action",
              createdAt: "$createdAt",
              transactionId: "$transactionId",
              Image: "$Image",
              remark: "$remark",
              actionDate: "$actionDate",
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          userId: "$_id",
          seller: 1,
          totalAwb: 1,
          totalExtraWeight: 1,
          totalExtraCharges: 1,
              totalDisputeAwb: 1,  
          weightReconciliationIds: 1,
          details: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching weight reconciliations:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getWeightReconcilition = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access." });
  }

  try {
    const reconciliations = await WeightReconciliation.find({ userId });
    res.status(200).json({ success: true, data: reconciliations });
  } catch (error) {
    console.error("Error fetching weight reconciliations:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

const UserRaisedAction = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access." });
  }

  const { weightReconciliationId, remark } = req.body;

  if (!weightReconciliationId) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Weight reconciliation ID is required.",
      });
  }

  if (!remark) {
    return res
      .status(400)
      .json({ success: false, message: "Remark is required." });
  }

  try {
    const reconciliation = await WeightReconciliation.findById(
      weightReconciliationId
    );
    if (!reconciliation) {
      return res
        .status(404)
        .json({ success: false, message: "Reconciliation not found." });
    }

    reconciliation.action = "dispute";
    reconciliation.status = "dispute";
    reconciliation.actionDate = Date.now();
    reconciliation.remark = remark;

    // File upload if exists
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "tickets");
      reconciliation.Image = result.secure_url;
    }

    await reconciliation.save();
    res.status(200).json({ success: true, data: reconciliation });
  } catch (error) {
    console.error("Error updating weight reconciliation:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const RejectDispute = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access." });
  }

  const { weightReconciliationIds } = req.body;

  try {
    const reconciliations = await WeightReconciliation.find({
      _id: { $in: weightReconciliationIds },
    });
    if (!reconciliations || reconciliations.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Reconciliation not found." });
    }

    reconciliations.forEach(async (reconciliation) => {
      reconciliation.action = "reject";
      reconciliation.status = "rejected";
      reconciliation.resolveDate = Date.now();
      await reconciliation.save();
    });
    res.status(200).json({ success: true, data: reconciliations });
  } catch (error) {
    console.error("Error updating weight reconciliation:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const ResolveDispute = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access." });
  }

  const { weightReconciliationIds } = req.body;

  try {
    const reconciliations = await WeightReconciliation.find({
      _id: { $in: weightReconciliationIds },
    });
    if (!reconciliations || reconciliations.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Reconciliation not found." });
    }

    reconciliations.forEach(async (reconciliation) => {
      reconciliation.action = "resolve";
      reconciliation.status = "resolved";
      reconciliation.resolveDate = Date.now();

      const transactionId = `TRANS-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;
      const user = await User.findById(userId);
      user.wallet += reconciliation.ExtraWeightCharge;
      await user.save();
      // Transaction
      await Transaction.create({
        userId: reconciliation.userId,
        type: ["wallet", "weight_reconciliation", "refund"],
        debitAmount: 0,
        creditAmount: reconciliation.ExtraWeightCharge,
        amount: reconciliation.ExtraWeightCharge,
        currency: "INR",
        balance: user.wallet,
        description: `Refund Extra Weight Reconciliation Charges`,
        status: "success",
        transactionId: transactionId,
        transactionMode: "debit",
        courier: reconciliation.partnerDetails.name,
        awbNumber: awbNumber,
        appliedWeight: appliedWeight,
      }); 

      await reconciliation.save();
       const shippingTransaction = await Transaction.findOne({ awbNumber, type: "shipping" });
   if (shippingTransaction) {
     // If a shipping transaction exists, you can use it
     console.log("Shipping transaction found!");
      shippingTransaction.extraWeightCharges = 0;
      shippingTransaction.appliedWeight = 0;
      shippingTransaction.enteredDimension =  {
        length: shipment.orderIds[0].length,
        breadth: shipment.orderIds[0].breadth,
        height: shipment.orderIds[0].height,
        actualWeight: shipment.orderIds[0].actualWeight,
        volumetricWeight: shipment.orderIds[0].volumetricWeight,
      };
      shippingTransaction.save();


   } else {
     console.log("No shipping transaction found.");
   }
    });

    res.status(200).json({ success: true, data: reconciliations });
  } catch (error) {
    console.error("Error updating weight reconciliation:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = {
  CreateWeightReconciliation,
  CreateWeightReconciliationBulk,
  getWeightReconcilitionForAdmin,
  getWeightReconcilition,
  UserRaisedAction,
  RejectDispute,
  ResolveDispute,
};
