const mongoose = require('mongoose');

const RentSchema = new mongoose.Schema({
    name: String,
    roomNo: Number,
    joiningDate: Date,
    depositAmount: Number,
    rents: [
      {
        rentAmount: Number,
        date: Date,
      }
    ],
    year: Number
  });
  
  module.exports = mongoose.model('Rent', RentSchema);