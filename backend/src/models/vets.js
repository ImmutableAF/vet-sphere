const mongoose = require('mongoose');

const vetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  licenseNumber: {
    type: String,
    unique: true, 
    sparse: true,
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
  verificationStatus: {
    type: String,
    enum: ['not_submitted', 'pending', 'verified', 'rejected'],
    default: 'not_submitted',
  },
  verificationDetails: {
    licenseIssuingAuthority: { type: String },
    licenseIssueDate: { type: Date },
    additionalNotes: { type: String },
  },
  proofDocumentPath: {
    type: String,
  },
  rejectionReason: {
    type: String,
  },
  submittedAt: {
    type: Date,
  },
  reviewedAt: {
    type: Date,
  },
});

module.exports = mongoose.model('Vet', vetSchema);