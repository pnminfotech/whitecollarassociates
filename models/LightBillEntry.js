const mongoose = require("mongoose");

const LightBillEntrySchema = new mongoose.Schema({
  roomNo: { type: String, required: true },
  meterNo: { type: String, required: true },
  totalReading: { type: Number, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("LightBillEntry", LightBillEntrySchema);