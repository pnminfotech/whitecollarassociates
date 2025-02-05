const Rent = require('../models/newYearschema'); // Import the DuplicateForm model
const json2xls = require('json2xls');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(json2xls.middleware);

exports.getRent = async (req, res) => {
    const { year } = req.query;
    const rents = await Rent.find({ year: year || new Date().getFullYear() });
    res.json(rents);
  };
  
  // Save rent details
exports.saveRent = async (req, res) => {
    const { name, roomNo, joiningDate, depositAmount, rents } = req.body;
    const year = new Date().getFullYear();
  
    const newRent = new Rent({ name, roomNo, joiningDate, depositAmount, rents, year });
    await newRent.save();
    res.status(201).json(newRent);
  };
  
  // Export archived data as Excel
exports.year = async (req, res) => {
    const { year } = req.params;
    const rentData = await Rent.find({ year });
  
    if (!rentData.length) {
      return res.status(404).send('No data found for this year.');
    }
  
    const filePath = `${year}_rents.xlsx`;
    fs.writeFileSync(filePath, json2xls(rentData), 'binary');
    
    res.download(filePath, () => fs.unlinkSync(filePath)); // Delete file after download
  };
  