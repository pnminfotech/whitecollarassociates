const mongoose = require('mongoose');

const archiveSchema = new mongoose.Schema(
  {
    originalFormId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form' },
    srNo: { type: String, required: true },
    name: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    roomNo: { type: String, required: true },
    depositAmount: { type: Number, required: true },
    phoneNo: { type: Number, required: true },
    address: { type: String, required: true },

    // relativeAddress1: { type: String },
    // relativeAddress2: { type: String },
    floorNo: { type: String, required: true },
    // bedNo: { type: String, required: true },
    // companyAddress: { type: String },
    // dateOfJoiningCollege: { type: Date, required: true },
    // dob: { type: Date, required: true },
    rents: [
      {
        rentAmount: { type: Number },
        date: { type: Date },
      },
    ],
    adharFile: { type: String },
    // leaveDate: { type: String , required: true },
  });

module.exports = mongoose.model('Archive', archiveSchema);
