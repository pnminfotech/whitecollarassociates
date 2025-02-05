const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const formRoutes = require('./routes/formRoutes'); // Routes
const connectDB = require('./config/db'); // Database connection logic
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
const json2xls = require('json2xls');
app.use(express.json());
dotenv.config();
const authRoutes = require('./routes/authRoutes');
const SECRET_KEY = '.pnmINFOtech.';
const fs = require('fs');
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', formRoutes);
app.use('/api', authRoutes);

let users = []; 

const lightBillSchema = new mongoose.Schema({
  meterNo: { type: String, required: true },
  totalReading: { type: Number, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

const otherExpenseSchema = new mongoose.Schema({
  mainAmount: { type: Number, required: true },
  expenses: { type: [String], required: true },
  date: { type: Date, required: true }, // Automatically adds the current date
});

// Mongoose Models
const LightBill = mongoose.model("LightBill", lightBillSchema);
const OtherExpense = mongoose.model("OtherExpense", otherExpenseSchema);



app.post("/api/light-bill", async (req, res) => {
  const { meterNo, totalReading, amount, date } = req.body;
  if (!meterNo || !totalReading || !amount || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newLightBill = new LightBill({ meterNo, totalReading, amount, date });
    await newLightBill.save();
    res.status(201).json({ message: "Light Bill submitted successfully" });
  } catch (error) {
    console.error("Error saving Light Bill:", error);
    res.status(500).json({ message: "Failed to save Light Bill" });
  }
});

// Other Expense Route
app.post("/api/other-expense", async (req, res) => {
  const { mainAmount, expenses , date } = req.body;
  if (!mainAmount || !expenses || !expenses.length || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newOtherExpense = new OtherExpense({ mainAmount, expenses , date });
    await newOtherExpense.save();
    res.status(201).json({ message: "Other Expense submitted successfully" });
  } catch (error) {
    console.error("Error saving Other Expense:", error);
    res.status(500).json({ message: "Failed to save Other Expense" });
  }
});

app.get("/api/light-bill/all", async (req, res) => {
  try {
    const data = await LightBill.find(); // Replace with your model
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch data." });
  }
});

app.get("/api/other-expense/all", async (req, res) => {
  try {
    const data = await OtherExpense.find(); // Replace with your model
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch data." });
  }
});

app.get("/api/year", async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const data = await YourModel.find({
      "rents.date": { $gte: startDate, $lte: endDate }
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.sendStatus(403); // Forbidden
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    next();
  });
};

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
  res.send(`Hello ${req.user.username}, this is a protected route`);
});

// Connect to the database
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
