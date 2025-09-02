const mongoose = require("mongoose");

const weightReconciliationSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shipment",
    required: true,
  },
  weightAppliedDate: { type: Date, required: true },
  awbNumber: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  enteredWeight: {
    length: { type: Number, required: true },
    breadth: { type: Number, required: true },
    height: { type: Number, required: true },
    actualWeight: { type: Number, required: true },
    volumetricWeight: { type: Number, required: true },
    deadWeight: { type: Number },
  },
  orderType: {
    type: String,
    enum: ["COD", "PREPAID"],
    required: true,
  },

  appliedWeight: {
    type: Number,
    required: true,
  },
  ExtraWeightCharges: {
    type: Number,
    required: true,
    default: 0,
   
  },
  ExtraWeight: {
    type: Number,
    required: true,
  },
  partnerDetails: {
    name: { type: String, required: true },
    id: { type: String, required: true },
    charges: { type: Number, required: true },
    cod_charges: { type: Number },
  
    freight_charges: { type: Number },
  },

  product: { type: String, required: true },

  status: {
    type: String,
    enum: ["accepted", "requested", "dispute" ,"rejected", "approved"],
    default: "requested",
  },

  action: {
    type: String,
    enum: ["reject", "raise", "dispute", "approve"],
    default: "raise",
  },
  transactionId: { type: String},
  actionDate: { type: Date },
  resolveDate:{ type: Date },
  Image: { type: String },
  remark: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Auto-calculate deadWeight before save
weightReconciliationSchema.pre("save", function (next) {
  if (this.enteredWeight) {
    const actual = this.enteredWeight.actualWeight || 0;
    const volumetric = this.enteredWeight.volumetricWeight || 0;
    this.enteredWeight.deadWeight = Math.max(actual, volumetric);
  }
  next();
});

// Auto-accept after 2 days
weightReconciliationSchema.post("init", function (doc) {
  const twoDays = 2 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  if (
    doc.status !== "accepted" &&
    doc.status !== "rejected" &&
    now - doc.createdAt.getTime() >= twoDays
  ) {
    doc.status = "accepted";
    doc.save();
  }
});

module.exports = mongoose.model(
  "WeightReconciliation",
  weightReconciliationSchema
);
