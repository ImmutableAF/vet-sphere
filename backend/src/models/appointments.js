const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true,
  },
  vet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vet',
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  reason: {
    type: String,
  },
});

module.exports = mongoose.model('Appointment', appointmentSchema);