const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    required: true,
  },
  units: {
    type: Number,
    required: true,
    min: 1,
  },
  urgency: {
    type: String,
    enum: ['CRITICAL', 'URGENT', 'NORMAL'],
    required: true,
  },
  status: {
    type: String,
    enum: ['OPEN', 'MATCHED', 'COMPLETED'],
    default: 'OPEN',
  }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
