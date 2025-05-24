// const LightBill = require("../models/lightBill");

// exports.createLightBill = async (req, res) => {
//   try {
//     const bill = new LightBill(req.body);
//     await bill.save();
//     res.status(201).json({ message: "Light bill saved successfully." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to save light bill." });
//   }
// };

// exports.getAllLightBills = async (req, res) => {
//   try {
//     const bills = await LightBill.find().sort({ date: -1 });
//     res.json(bills);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch light bills." });
//   }
// };



const LightBillEntry = require("../models/LightBillEntry");

exports.createLightBill = async (req, res) => {
  try {
    const { roomNo, meterNo, totalReading, amount,status, date } = req.body;

    const bill = new LightBillEntry({ roomNo, meterNo, totalReading, amount,status, date });
    await bill.save();

    res.status(201).json({ message: "Light bill saved successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save light bill." });
  }
};

exports.getAllLightBills = async (req, res) => {
  try {
    const bills = await LightBillEntry.find().sort({ date: -1 });
    res.json(bills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch light bills." });
  }
};
