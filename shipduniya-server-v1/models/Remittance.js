
const mongoose = require("mongoose");
const Counter = require("./counter");

const RemittanceSchema = new mongoose.Schema({
   remittanceId: {
    type: String,
    unique: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  adminId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
default: () => new mongoose.Types.ObjectId("67a5aa4ae8b063608e70e826") 
 },
  superAdminId:{
     type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  default: () => new mongoose.Types.ObjectId("6799f55080fb8f10d772be40")
  },
  pincode: {
    type: Number,
  },
  totalDeliveredCod: {
    type: Number,
    required: true,
    default: 0,
  },
  totalAwb: {
    type: Number,
    required: true,
    default: 0,
  },
  remittanceRequestIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "RemittanceRequest",
    required: true,
  }],
  status:{
    type:String,
    enum:["approval_pending", "paid", "rejected"],
    default:"approval_pending"
  },
  paymentDate:{
      type: Date,
      default: Date.now,
  },
  transactionId:{
    type:String,
    unique:true
    
  },remark:{
    type:String,
    default:"Request For Approve Remittance"
  }
},
  {
    timestamps: true,
  });

RemittanceSchema.pre('save',async function(next) {
   if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "remittance" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.remittanceId = `REM-${String(counter.seq).padStart(5, "0")}`;
  }
   
  if (this.isModified("status") && this.status === "paid") {
    this.paymentDate = new Date();
  }

  next();
  if (this.isModified('status') && this.status === 'paid') {
    this.paymentDate = new Date();
  }
  next();
});

module.exports = mongoose.model("Remittance", RemittanceSchema);