const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = 'your-secret-key'; // Use a secure key

// Register user
const registerUser = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Create new user
      const newUser = new User({ username, email, password });
      await newUser.save();
  
      res.status(201).json({ success: true });
    } catch (error) {
      console.error(error); // Log the error
      res.status(500).json({ message: 'Server error' }); // Handle server errors
    }
  };
  
  
// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' }); // Send JSON response
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' }); // Send JSON response
    }
  
    const token = jwt.sign({ userId: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token }); // Send the token as JSON
  };
  

// Protected route to get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
