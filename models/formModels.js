const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  srNo: {
  type: Number,
  unique: true,
  required: true
},
  name: { type: String, required: true },
  members: { type: Number, required: true },

  joiningDate: { type: Date, required: true },
  roomNo: { type: String, required: true },
  depositAmount: { type: Number, required: true },
  address: { type: String, required: true },
  phoneNo: { type: Number, required: true },
  // relativeAddress1: { type: String },
  // relativeAddress2: { type: String },
  floorNo: { type: String, required: true },

  // ✅ New field added here



  rents: [
    {
      rentAmount: { type: Number },
      date: { type: Date },
      month: { type: String },
    },
  ],


  adharFile: { type: String }, // Just stores filename

});


module.exports = mongoose.model('Form', formSchema);
