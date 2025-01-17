
const mongoose = require('mongoose');

const archiveSchema = new mongoose.Schema(
  {
    originalFormId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form' },
    name: { type: String, required: true },
    roomNo: { type: String, required: true },
    joiningDate: { type: Date },
    depositAmount: { type: Number },
    leaveDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Archive', archiveSchema);
