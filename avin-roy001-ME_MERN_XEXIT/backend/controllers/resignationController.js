const Resignation = require('../models/Resignation');
const User = require('../models/User');
const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

const API_KEY = process.env.CALENDARIFIC_API_KEY;

// Helper: Check if date is weekend
const isWeekend = (date) => {
  const day = new Date(date).getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

// Helper: Check if date is holiday in country
const isHoliday = async (date, country = 'US') => {
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;
  const day = new Date(date).getDate();

  try {
    const res = await axios.get('https://calendarific.com/api/v2/holidays', {
      params: {
        api_key: API_KEY,
        country,
        year,
        month,
        day
      }
    });
    return res.data.response.holidays.length > 0;
  } catch (err) {
    console.error("Holiday check failed:", err.message);
    return false;
  }
};

// Submit resignation
exports.submitResignation = async (req, res) => {
  const { lwd } = req.body;
  const userId = req.userId;

  if (!lwd) return res.status(400).json({ message: "Last working day is required" });

  const date = new Date(lwd);
  if (isNaN(date.getTime())) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  if (isWeekend(lwd)) {
    return res.status(400).json({ message: "Last working day cannot be a weekend" });
  }

  const user = await User.findById(userId);
  const country = user.country || 'US'; // You can enhance this later

  const holiday = await isHoliday(lwd, country);
  if (holiday) {
    return res.status(400).json({ message: "Last working day cannot be a holiday" });
  }

  const resignation = new Resignation({
    employeeId: userId,
    lwd: date,
    status: 'pending'
  });

  await resignation.save();

  res.json({
    data: {
      resignation: { _id: resignation._id }
    }
  });
};

// Get all resignations (admin)
exports.getAllResignations = async (req, res) => {
  try {
    const resignations = await Resignation.find().populate('employeeId', 'username');
    res.json({ data: resignations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve/Reject resignation
exports.concludeResignation = async (req, res) => {
  const { resignationId, approved, lwd } = req.body;

  const resignation = await Resignation.findById(resignationId).populate('employeeId');
  if (!resignation) return res.status(404).json({ message: "Resignation not found" });

  resignation.status = approved ? 'approved' : 'rejected';
  if (approved) resignation.exitDate = new Date(lwd);

  await resignation.save();

  // Send email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: `${resignation.employeeId.username}@company.com`, // mock email
    subject: `Resignation ${approved ? 'Approved' : 'Rejected'}`,
    text: `Your resignation has been ${approved ? 'approved' : 'rejected'}.
           Exit Date: ${approved ? lwd : 'N/A'}`
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) console.error("Email failed:", err);
  });

  res.status(200).send();
};