const mongoose = require("mongoose");
const Shipping = require("./Shipping");
const Order = require("./Order");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: [String],
      enum: ["wallet", "shipping", "weight_reconciliation", "refund","payment"],
      required: true,
    },

    debitAmount: {
      type: Number,
      default: 0,
    },
    creditAmount: {
      type: Number,
      default: 0,
    },

    amount: {
      type: Number,
      required: true,
      comment: "Total amount value for the transaction",
    },

    currency: {
      type: String,
      default: "INR",
    },

    balance: {
      type: Number,
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "success", "rejected"],
      default: "pending",
    },

    transactionMode: {
      type: String,
      enum: ["debit", "credit","razorpay"],
      required: true,
    },

    transactionId: {
      type: String,
      unique: true,
    },

    paymentId: {
      type: String,
    },

    // 🚚 Shipping specific fields
    courier: {
      type: String,
      required: function () {
        return this.type.includes("shipping");
      },
    },
    awbNumber: {
      type: String,
      required: function () {
        return this.type.includes("shipping");
      },
    },
    shipmentId: {
      type: String,
    },

    freightCharges: {
      type: Number,
      default: 0,
    },
    codCharges: {
      type: Number,
      default: 0,
    },

    enteredWeight: {
      type: Number,
      default: 0,
    },
    enteredDimension: {
    length: { type: Number },
    breadth: { type: Number },
    height: { type: Number },
    actualWeight: { type: Number },
    volumetricWeight: { type: Number },
    deadWeight: { type: Number },
  },
    appliedWeight: {
      type: Number,
      default: 0,
    },
    extraWeightCharges: {
      type: Number,
      default: 0,
    },
    rtoCharges: {
      type: Number,
      default: 0,
    },
    rtoExtraWeightCharges: {
      type: Number,
      default: 0,
    },
    freightReverse: {
      type: Number,
      default: 0,
    },
    codChargeReverse: {
      type: Number,
      default: 0,
    },

    // 🆕 🆕 Newly added fields for Invoice
    orderId: {
      type: String,
    },
    paymentType: {
      type: String,
    },
    pincode: {
      type: String,
    },
    city: {
      type: String,
    },
    zone: {
      type: String,
    },
    originCity: {
      type: String,
    },
    originState: {
      type: String,
    },
    destinationCity: {
      type: String,
    },
    destinationState: {
      type: String,
    },
    pickupPincode: {
      type: String,
    },
    chargedWeight: {
      type: Number,
      default: 0,
    },
    gst: {
      type: Number,
      default: 0,
    },
    sgst: {
      type: Number,
      default: 0,
    },
    cgst: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    details:{
      type:Object,
      default:{}
    }
  },
  { timestamps: true }
);
transactionSchema.pre("save", async function (next) {
  if (this.enteredWeight) {
    const actual = this.enteredDimension.actualWeight || 0;
    const volumetric = this.enteredDimension.volumetricWeight || 0;
    this.enteredDimension.deadWeight = Math.max(actual, volumetric);
  }
  if(this.totalAmount) {
    this.totalAmount = this.freightCharges + this.codCharges + this.gst + this.sgst + this.cgst+this.extraWeightCharges+this.rtoCharges+this.rtoExtraWeightCharges -this.codChargeReverse-this.freightReverse;
  }

  if(this.awbNumber) {
        const shippingDetails = await Shipping.findOne({ awbNumber: this.awbNumber }).populate("orderIds");
        if (shippingDetails) {
          this.details.shipping = shippingDetails;
          if (shippingDetails.orderIds.length > 0) {
  this.details.order = await Order.findById(shippingDetails.orderIds[0]);
}
        }
  }
  next();
});

module.exports = mongoose.model("Transaction", transactionSchema);
