const mongoose = require("mongoose");

const lightBillSchema = new mongoose.Schema({

  meterNo: { type: String, required: true },
  totalReading: { type: Number, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("LightBill", lightBillSchema);


