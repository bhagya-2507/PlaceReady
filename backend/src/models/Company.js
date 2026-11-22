const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      unique: true,
      trim: true,
      index: true,
    },
    industry: {
      type: String,
      default: 'Technology & Software',
    },
    website: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '🏢',
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    },
    description: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'Bengaluru / Pan India',
    },
    contactEmail: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Company', companySchema);
