const mongoose = require('mongoose');

const vetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  specialization: {
    type: String,
  },
  experienceYears: {
    type: Number,
  },
  contactInfo: {
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  city: {
    type: String,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Vet', vetSchema); 