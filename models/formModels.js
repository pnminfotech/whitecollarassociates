const mongoose = require('mongoose');

const formSchema = new mongoose.Schema(
  {
    srNo: { type: String, required: true },
    name: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    roomNo: { type: String, required: true },
    depositAmount: { type: Number, required: true },
    rents: [
      {
        rentAmount: { type: Number, required: true },
        date: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Form', formSchema);
