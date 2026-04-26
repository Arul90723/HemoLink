const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true,
  },
  fromHospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
  },
  toHospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
  },
  status: {
    type: String,
    enum: ['REQUESTED', 'ACCEPTED', 'IN_TRANSIT', 'COMPLETED'],
    default: 'REQUESTED',
  }
}, { timestamps: true });

module.exports = mongoose.model('Transfer', transferSchema);
