const axios = require("axios");
const { getXpressbeesToken } = require("../helpers/authHelpers");
require("dotenv").config();
const User = require("../models/User");
const Order = require("../models/Order");
const Warehouse = require("../models/wareHouse");
const mongoose = require("mongoose");

// Utility function to get the multiplier based on carrier and customer type
const getMultiplier = (carrier, userProfile) => {
  if (userProfile.customerType === "custom") {
    return userProfile.multiplier || 1;
  } else {
    const multiplierMaps = {
      xpressbees: {
        bronze: 3,
        silver: 2.5,
        gold: 2.2,
        platinum: 1.5,
        special1: 1.5,
      },
      delhivery: {
        bronze: 2.5,
        silver: 2.3,
        gold: 2,
        platinum: 1.5,
        special1: 1.5,
      },
      default: {
        bronze: 2.5,
        silver: 2.3,
        gold: 2,
        platinum: 1.8,
        special1: 1.5,
      },
    };

    const carrierKey = carrier.toLowerCase();
    return (
      multiplierMaps[carrierKey]?.[userProfile.customerType.toLowerCase()] ||
      multiplierMaps.default[userProfile.customerType.toLowerCase()] ||
      1
    );
  }
};

async function calculateCharges(req, res) {
  const {
    chargeableWeight,
    CODAmount = 0,
    productType,
    originPincode,
    destinationPincode,
    carrierName,
    height = 10,
    breadth = 10,
    length = 10,
  } = req.body;

  try {
    // Validate required fields
    if (
      !chargeableWeight ||
      !productType ||
      !originPincode ||
      !destinationPincode
    ) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Get user profile and customer type
    const userId = req?.user?.id || req?.body?.userId;
    const userProfile = await User.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    }

    // Normalize product type for consistent comparison
    const normalizedProductType = productType.toLowerCase();

    let chargesBreakdown = [];

    const apiPromises = [
      // Xpressbees promise
      !carrierName || carrierName.toLowerCase() === "xpressbees"
        ? getXpressbeesCharges(
            originPincode,
            destinationPincode,
            chargeableWeight,
            CODAmount,
            normalizedProductType,
            height,
            breadth,
            length
          )
        : Promise.resolve(null),

      // Delhivery promise
      !carrierName || carrierName.toLowerCase() === "delhivery"
        ? getDelhiveryCharges(
            originPincode,
            destinationPincode,
            chargeableWeight,
            CODAmount,
            normalizedProductType
          )
        : Promise.resolve(null),
    ];

    const [xpressbeesCharges, delhiveryCharges] = await Promise.all(
      apiPromises
    );

    // Process Xpressbees charges
    if (xpressbeesCharges?.services) {
      xpressbeesCharges.services.forEach((service) => {
        let codCharge, freightCharge, otherCharges, totalPrice;
        if (
          userProfile.customerType === "custom" &&
          userProfile.multiplier?.[service.name]
        ) {
          console.log(service.name);
          const custom = userProfile.multiplier[service.name];
          const baseCod = service.cod_charges || 0;
          const baseFreight = service.freight_charges || 0;
          const baseTotal = service.total_charges || 0;
          const multiplier = Number(custom.multiplier) || 1;
          const codAmount = Number(custom.codAmount) || 0;
          
          freightCharge = baseFreight * multiplier;
          otherCharges = (baseTotal - baseCod - baseFreight) * multiplier;
          codCharge = baseCod > 0 ? baseCod + codAmount : 0;
          totalPrice = freightCharge + otherCharges + codCharge;
        } else {
          const multiplier = getMultiplier("xpressbees", userProfile);
          const baseCod = service.cod_charges || 0;
          const baseFreight = service.freight_charges || 0;
          const baseTotal = service.total_charges || 0;

          freightCharge = baseFreight * multiplier;
          otherCharges = (baseTotal - baseCod - baseFreight) * multiplier;
          codCharge = baseCod * multiplier;
          totalPrice = baseTotal * multiplier;
        }

        chargesBreakdown.push({
          id: service.id,
          carrierName: "Xpressbees",
          serviceType: service.name,
          totalPrice,
          codCharge,
          freightCharge,
          otherCharges,
        });
      });
    }

    // Process Delhivery charges
    if (delhiveryCharges?.services) {
      delhiveryCharges.services.forEach((service) => {
        let codCharge, freightCharge, otherCharges, totalPrice;
        if (
          userProfile.customerType === "custom" &&
          userProfile.multiplier?.[service.name]
        ) {
          const custom = userProfile.multiplier[service.name];
          const baseCod = service.cod_charge || 0;
          const baseFreight = service.freight_charge || 0;
          const baseTotal = service.total_charges || 0;
          const multiplier = parseFloat(custom.multiplier) || 1;
          const codAmount = parseFloat(custom.codAmount) || 0;

          freightCharge = baseFreight * multiplier;
          otherCharges = (baseTotal - baseCod - baseFreight) * multiplier;
          codCharge = baseCod > 0 ? baseCod + codAmount : 0;
          totalPrice = freightCharge + otherCharges + codCharge;
        } else {
          const multiplier = getMultiplier("delhivery", userProfile);
          const baseCod = service.cod_charge || 0;
          const baseFreight = service.freight_charge || 0;
          const baseTotal = service.total_charges || 0;

          freightCharge = baseFreight * multiplier;
          otherCharges = (baseTotal - baseCod - baseFreight) * multiplier;
          codCharge = baseCod * multiplier;
          totalPrice = baseTotal * multiplier;
        }

        chargesBreakdown.push({
          carrierName: "Delhivery",
          serviceType: service.name,
          totalPrice,
          codCharge,
          freightCharge,
          otherCharges,
        });
      });
    }

    res.json({
      message: "Charges calculated successfully.",
      charges: chargesBreakdown,
    });
  } catch (error) {
    console.error("Error calculating charges:", error);
    res.status(500).json({
      message: "Error calculating charges.",
      error: error.message,
    });
  }
}

async function calculateShippingCharges(req, res) {
  const {
    orderIds,
    pickUpWareHouse,
    returnWarehouse,
    carrierName,
    CODAmount = 0,
  } = req.body;

  try {
    const userId = req.user.id;
    const userProfile = await User.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    }

    const customerType = userProfile.customerType.toLowerCase();

    let originPincode;
    if (pickUpWareHouse === "Ship Duniya") {
      originPincode = "201301";
    } else {
      if (!mongoose.Types.ObjectId.isValid(pickUpWareHouse)) {
        return res
          .status(400)
          .json({ message: "Invalid pickup warehouse ID." });
      }
      const warehouse = await Warehouse.findById(pickUpWareHouse);
      originPincode = warehouse?.pincode;
    }

    if (!originPincode) {
      return res
        .status(400)
        .json({ message: "Could not determine origin pincode." });
    }

    let requestedCarrier = carrierName?.toLowerCase().trim();
    if (requestedCarrier === "ecom express") {
      requestedCarrier = "ecom";
    }

    const uniqueServices = new Map();

    for (const orderId of orderIds) {
      const orderDetails = await fetchOrderDetails(orderId);
      if (!orderDetails) continue;

      const {
        chargeableWeight,
        CODAmount,
        productType,
        pincode: destinationPincode,
        height,
        breadth,
        length,
      } = orderDetails;

      if (!destinationPincode || isNaN(chargeableWeight)) continue;

      const carrierResponse = await getCarrierCharges(
        requestedCarrier,
        originPincode,
        destinationPincode,
        chargeableWeight,
        CODAmount,
        productType,
        height,
        breadth,
        length
      );

      if (carrierResponse?.services) {
        carrierResponse.services.forEach((service) => {
          let totalPrice, codCharge, freightCharge, otherChargesTotal;
          // Check for custom multiplier logic
          if (
            userProfile.customerType === "custom" &&
            userProfile.multiplier?.[service.name]
          ) {
            const custom = userProfile.multiplier[service.name];
            const baseTotal = service.total_charges || 0;
            const baseCod =
              service.cod_charges !== undefined
                ? service.cod_charges
                : service.cod_charge || 0;
            const baseFreight =
              service.freight_charges !== undefined
                ? service.freight_charges
                : service.freight_charge || 0;
            const multiplier = parseFloat(custom.multiplier) || 1;
            const codAmount = parseFloat(custom.codAmount) || 0;
            const otherCharges = baseTotal - baseCod - baseFreight;

            freightCharge = baseFreight * multiplier;
            otherChargesTotal = otherCharges * multiplier;
            codCharge = baseCod + codAmount;
            totalPrice = freightCharge + otherChargesTotal + codCharge;
          } else {
            const multiplier = getMultiplier(requestedCarrier, userProfile);
            const baseTotal = service.total_charges || 0;
            const baseCod =
              service.cod_charges !== undefined
                ? service.cod_charges
                : service.cod_charge || 0;
            const baseFreight =
              service.freight_charges !== undefined
                ? service.freight_charges
                : service.freight_charge || 0;
            const otherCharges = baseTotal - baseCod - baseFreight;

            totalPrice = baseTotal * multiplier;
            codCharge = baseCod * multiplier;
            freightCharge = baseFreight * multiplier;
            otherChargesTotal = otherCharges * multiplier;
          }

          const carrierNameFormatted =
            requestedCarrier.charAt(0).toUpperCase() +
            requestedCarrier.slice(1);
          const serviceKey = `${carrierNameFormatted}|${service.name}`;

          if (uniqueServices.has(serviceKey)) {
            const existing = uniqueServices.get(serviceKey);
            existing.totalPrice += totalPrice;
            existing.codCharge += codCharge;
            existing.freightCharge += freightCharge;
            existing.otherCharges += otherChargesTotal;
            existing.orders.push({
              orderId: orderId,
              chargeableWeight,
              totalPrice,
              codCharge,
              freightCharge,
              otherCharges: otherChargesTotal,
            });
          } else {
            uniqueServices.set(serviceKey, {
              serviceId: service.id,
              carrierName: carrierNameFormatted,
              serviceType: service.name,
              totalPrice: totalPrice,
              codCharge: codCharge,
              freightCharge: freightCharge,
              otherCharges: otherChargesTotal,
              orders: [
                {
                  orderId: orderId,
                  chargeableWeight,
                  totalPrice,
                  codCharge,
                  freightCharge,
                  otherCharges: otherChargesTotal,
                },
              ],
            });
          }
        });
      }
    }

    const chargesBreakdown = Array.from(uniqueServices.values()).sort(
      (a, b) => a.totalPrice - b.totalPrice
    );

    res.json({
      message: "Shipping charges calculated successfully.",
      charges: chargesBreakdown,
    });
  } catch (error) {
    console.error("Error calculating shipping charges:", error);
    res.status(500).json({
      message: "Error calculating shipping charges.",
      error: error.message,
    });
  }
}

async function fetchOrderDetails(orderId) {
  const order = await Order.findById(orderId);
  const volumetricWeight = parseFloat(order.volumetricWeight);
  const actualWeight = parseFloat(order.actualWeight);

  if (!order) return null;
  return {
    chargeableWeight:
      volumetricWeight > actualWeight ? volumetricWeight : actualWeight,
    CODAmount: parseFloat(order.collectableValue) || 0,
    pincode: order.pincode,
    productType: order.orderType.toLowerCase(),
    height: order.height,
    breadth: order.breadth,
    length: order.length,
  };
}

async function getCarrierCharges(
  carrier,
  origin,
  destination,
  weight,
  codAmount,
  productType,
  height,
  breadth,
  length
) {
  switch (carrier) {
    case "ecom":
      return getEcomCharges(
        origin,
        destination,
        weight,
        codAmount,
        productType
      );
    case "xpressbees":
      return getXpressbeesCharges(
        origin,
        destination,
        weight,
        codAmount,
        productType,
        height,
        breadth,
        length
      );
    case "delhivery":
      return getDelhiveryCharges(
        origin,
        destination,
        weight,
        codAmount,
        productType
      );
    default:
      return null;
  }
}

// Carrier API Helpers
async function getXpressbeesCharges(
  origin,
  destination,
  weight,
  codAmount,
  productType
) {
  try {
    const token = await getXpressbeesToken();
    const payload = {
      origin: origin.toString(),
      destination: destination.toString(),
      payment_type: productType === "cod" ? "cod" : "prepaid",
      weight: weight,
      length: 10,
      breadth: 10,
      height: 10,
    };

    if (productType === "cod") {
      payload.order_amount = codAmount;
    }

    const response = await axios.post(
      "https://shipment.xpressbees.com/api/courier/serviceability",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    return {
      services: response.data.data.map((service) => ({
        id: service.id,
        name: service.name,
        total_charges: service.total_charges,
        cod_charges: service.cod_charges,
        freight_charges: service.freight_charges,
      })),
    };
  } catch (error) {
    console.log(error);
    console.error("Xpressbees API error:", error.message);
    return null;
  }
}

async function getDelhiveryCharges(
  origin,
  destination,
  weight,
  codAmount,
  productType
) {
  try {
    if (!origin || !destination) return null;
    if (isNaN(weight) || weight <= 0) return null;

    // Convert weight to grams as required by the API
    const weightInGrams = Math.round(weight);

    // Construct the API URLs for md=E and md=S
    const urlE = `https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=E&ss=Delivered&d_pin=${destination}&o_pin=${origin}&cgm=${weightInGrams}&pt=${
      productType === "cod" ? "COD" : "Pre-paid"
    }&cod=${codAmount}`;

    const urlS = `https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=S&ss=Delivered&d_pin=${destination}&o_pin=${origin}&cgm=${weightInGrams}&pt=${
      productType === "cod" ? "COD" : "Pre-paid"
    }&cod=${codAmount}`;

    // Log the request URLs for debugging
    // console.log("Delhivery API Request URLs:", { urlE, urlS });

    // Make both API requests in parallel
    const [responseE, responseS] = await Promise.all([
      axios.get(urlE, {
        headers: {
          Authorization: `Token ${process.env.DELHIVERY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: 5000,
      }),
      axios.get(urlS, {
        headers: {
          Authorization: `Token ${process.env.DELHIVERY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: 5000,
      }),
    ]);

    // Log the raw responses for debugging
    // console.log("Delhivery API Response for md=E:", responseE.data);
    // console.log("Delhivery API Response for md=S:", responseS.data);

    // Validate and process the responses
    const servicesE =
      responseE.data?.map((service) => ({
        name: service.service_type || "Delhivery Service (E)",
        total_charges: service.total_amount || 0,
        cod_charge: service.charge_COD || 0,
        freight_charge: service.charge_DL || 0,
      })) || [];

    const servicesS =
      responseS.data?.map((service) => ({
        name: service.service_type || "Delhivery Service (S)",
        total_charges: service.total_amount || 0,
        cod_charge: service.charge_COD || 0,
        freight_charge: service.charge_DL || 0,
      })) || [];

    // Combine the services from both responses
    const combinedServices = [...servicesE, ...servicesS];

    return {
      services: combinedServices,
    };
  } catch (error) {
    console.error("❌ Error fetching Delhivery charges:", error.message);
    console.error("❌ Error Details:", error.response?.data || error);
    return null;
  }
}

async function getEcomCharges(
  origin,
  destination,
  weight,
  codAmount,
  productType
) {
  try {
    // Convert weight to number and handle minimum weight
    const numericWeight = Math.max(0.5, parseFloat(weight / 1000));

    const payload = {
      orginPincode: origin.toString(), // Note the API's spelling
      destinationPincode: destination.toString(),
      productType: productType === "cod" ? "cod" : "ppd",
      chargeableWeight: numericWeight,
      codAmount: productType === "cod" ? parseFloat(codAmount) || 0 : 0,
    };

    const formData = new URLSearchParams();
    formData.append(
      "username",
      process.env.ECOM_USERID || "SHIPDARTLOGISTIC-BA333267"
    );
    formData.append("password", process.env.ECOM_PASSWORD || "3PIXOLLg3t");
    formData.append("json_input", JSON.stringify([payload]));

    // console.log("Ecom API Request:", {
    //   url: "https://ratecard.ecomexpress.in/services/rateCalculatorAPI/",
    //   payload: payload,
    // });

    const response = await axios.post(
      "https://ratecard.ecomexpress.in/services/rateCalculatorAPI/",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 100000,
      }
    );

    // Handle empty or invalid responses
    if (!Array.isArray(response.data) || response.data.length === 0) {
      console.error("Ecom API Error: Empty response array");
      return null;
    }

    const ecomData = response.data[0];

    if (!ecomData || ecomData.success === false) {
      const errorMsg = ecomData?.errors
        ? Array.isArray(ecomData.errors)
          ? ecomData.errors.join(", ")
          : ecomData.errors
        : "Unknown Ecom API error";
      console.error("Ecom API Error:", errorMsg);
      return null;
    }

    // Extract charges from response
    const charges = ecomData.chargesBreakup || {};
    const service = {
      name: "Ecom Express",
      total_charges: parseFloat(charges.total_charge) || 0,
      cod_charge: parseFloat(charges.COD) || 0,
      freight_charge: parseFloat(charges.FRT) || 0,
    };

    // console.log("Ecom API Success:", service);
    return { services: [service] };
  } catch (error) {
    // Improved error logging
    const errorDetails = {
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
      },
      response: {
        status: error.response?.status,
        data: error.response?.data,
      },
    };
    console.error(
      "Ecom Express API Error Details:",
      JSON.stringify(errorDetails, null, 2)
    );
    return null;
  }
}

module.exports = {
  calculateCharges,
  calculateShippingCharges,
  getXpressbeesCharges,
  getDelhiveryCharges,
  getCarrierCharges,
  calculateCharges
};
