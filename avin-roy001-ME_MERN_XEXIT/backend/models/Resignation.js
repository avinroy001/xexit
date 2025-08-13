const mongoose = require('mongoose');

const resignationSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lwd: { type: Date, required: true }, // Last Working Day
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  exitDate: { type: Date }
});

module.exports = mongoose.model('Resignation', resignationSchema);