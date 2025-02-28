const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const formRoutes = require('./routes/formRoutes'); // Routes
const maintenanceRoutes = require('./routes/MaintRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const ProjectRoutes = require('./routes/Project')
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
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api", ProjectRoutes)


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


// app.get("/api/year", async (req, res) => {
//   try {
//     const year = parseInt(req.query.year) || new Date().getFullYear();
    
//     const startDate = new Date(`${year}-01-01`);
//     const endDate = new Date(`${year}-12-31`);

//     const data = await YourModel.find({
//       "rents.date": { $gte: startDate, $lte: endDate }
//     });

//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
