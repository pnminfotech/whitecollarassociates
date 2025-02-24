const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  amount: Number,
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
});

const EmployeeSchema = new mongoose.Schema({
  
  name: { type: String, required: true },
  phoneNo: { type: String, required: true },
  roleOrMaterial: { type: String, required: true }, // Role for employees, Material for suppliers
  salaryOrTotalPayment: { type: Number }, // Salary for employees, Total payment for suppliers
  payments: { type: [PaymentSchema], default: [] },
});

const SupplierSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },  
  name: { type: String, required: true },
  phoneNo: { type: String, required: true },
  totalPayment: { type: Number, required: true },
  payments: { type: [PaymentSchema], default: [] },
});

const ProjectSchema = new mongoose.Schema({
  heading: String,
  date: { type: Date, default: Date.now },
  description: String,
  employees: [EmployeeSchema],
  suppliers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Supplier" }],
});

module.exports = ProjectSchema;



// const PaymentSchema = new mongoose.Schema({
//   amount: Number,
//   date: { type: Date, default: Date.now },
  
// });

// const EmployeeSchema = new mongoose.Schema({
//   name: String,
//   role: String,
//   salary: Number,
//   payments: [PaymentSchema]
// });
