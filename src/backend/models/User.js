const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  userType: {
    type: String,
    enum: ['startup', 'student'],
    required: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailDeliveryStatus: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'bounced', 'failed', 'complained'],
    default: 'pending'
  },
  emailBounceReason: {
    type: String,
    default: null
  },
  emailBounceDate: {
    type: Date,
    default: null
  },
  emailSentDate: {
    type: Date,
    default: null
  },
  emailVerifiedDate: {
    type: Date,
    default: null
  },
  signupDate: {
    type: Date,
    default: Date.now
  },
  // Student-specific fields
  cvUrl: {
    type: String,
    default: null
  },
  cvFilename: {
    type: String,
    default: null
  },
  cvSize: {
    type: Number,
    default: null
  },
  cvUploadDate: {
    type: Date,
    default: null
  },
  // Startup-specific fields
  companyDescription: {
    type: String,
    default: null
  },
  companyWebsite: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('User', userSchema); 