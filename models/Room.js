// models/Room.js
const mongoose = require('mongoose');

// const bedSchema = new mongoose.Schema({
//   bedNo: String,
//   category: String,
//   price: Number
// });

const roomSchema = new mongoose.Schema({
  roomNo: String,
  floorNo: String,

});

module.exports = mongoose.model('Room', roomSchema);
