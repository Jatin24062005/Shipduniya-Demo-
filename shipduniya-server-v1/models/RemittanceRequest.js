const mongoose = require("mongoose");

const remittanceRequestSchema = new mongoose.Schema(
  {
 
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      default: "67a5aa4ae8b063608e70e826"
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    awbNumber: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["unpaid", "approval_pending", "paid", "rejected"],
      default: "unpaid",
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    codAmount: {
      type: Number,
      default: 0,
    },
    courier: {
      type: String,
      required: true,
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },orderType: {
      type: String,
      enum: ["cod", "prepaid","COD"],
      required: true,
    },
    consignee:{
      type:String
    },
    orderNumber:{
      type:String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RemittanceRequest", remittanceRequestSchema);
