const ExitResponse = require('../models/ExitResponse');
const Resignation = require('../models/Resignation');
const User = require('../models/User');

// Submit exit questionnaire
exports.submitExitResponses = async (req, res) => {
  const { responses } = req.body;
  const userId = req.userId;

  const resignation = await Resignation.findOne({ employeeId: userId, status: 'approved' });
  if (!resignation) {
    return res.status(403).json({ message: "Only approved resignations can submit exit interview" });
  }

  const existing = await ExitResponse.findOne({ employeeId: userId });
  if (existing) {
    return res.status(400).json({ message: "Exit interview already submitted" });
  }

  const exitResponse = new ExitResponse({ employeeId: userId, responses });
  await exitResponse.save();

  res.status(200).send();
};

// Get all exit responses (admin)
exports.getAllExitResponses = async (req, res) => {
  try {
    const responses = await ExitResponse.find().populate('employeeId', 'username');
    res.json({ data: responses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};