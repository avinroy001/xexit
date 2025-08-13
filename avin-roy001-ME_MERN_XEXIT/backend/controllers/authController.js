const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register Employee
exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already exists" });

    const user = new User({ username, password, role: 'employee' });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login (for both employee and admin)
exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Admin credentials
  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign({ id: 'admin', role: 'hr' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token });
  }

  // Employee login
  const user = await User.findOne({ username });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
};