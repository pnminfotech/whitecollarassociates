const mongoose = require('mongoose');
const PaymentSchema = new mongoose.Schema({
     amount :{ type: Number, required: true},
     description : {type:String, require: true},
     date:{type:Date , default: Date.now},    
  });

  const MaterialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    payments: { type: [PaymentSchema], default: [] }, // Payment history per material
  });

  const SupplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNo: { type: String, required: true },
    address: { type: String, required: true },
    materials: { type: [MaterialSchema], default: [] }, // Now stores multiple materials
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  });
  SupplierSchema.virtual("remainingBalance").get(function () {
    let totalGiven = 0;
    this.materials.forEach((material) => {
      totalGiven += material.payments.reduce((acc, payment) => acc + payment.amount, 0);
    });
    return totalGiven; // Total payments across all materials
  });
  module.exports = SupplierSchema;