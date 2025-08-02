const mongoose = require("mongoose");

// const LightBillEntrySchema = new mongoose.Schema({
//   roomNo: { type: String, required: true },
//   meterNo: { type: String, required: true },
//   totalReading: { type: Number, required: true },
//   amount: { type: Number, required: true },
//    status: {
//     type: String,
//     enum: ['paid', 'pending'],
//     default: 'pending'
//   },
//   date: { type: Date, required: true },
// });

// module.exports = mongoose.model("LightBillEntry", LightBillEntrySchema);




//const mongoose = require("mongoose");


const lightBillSchema = new mongoose.Schema({
  meterNo: { type: String, required: true },
  oldUnits: { type: Number, required: true },
  newUnits: { type: Number, required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  roomNo: { type: String, default: '' },
  status: {
    type: String,
    enum: ['paid', 'pending'],
    // default: 'pending'
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LightBillEntry", lightBillSchema);
