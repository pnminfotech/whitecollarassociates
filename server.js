const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const formRoutes = require('./routes/formRoutes'); // Routes
const connectDB = require('./config/db'); // Database connection logic
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
app.use(express.json());
dotenv.config();
const authRoutes = require('./routes/authRoutes');
const SECRET_KEY = '.pnmINFOtech.';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', formRoutes);
app.use('/api', authRoutes);
let users = []; 


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
