const mongoose = require('mongoose');

const placementDriveSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      index: true,
    },
    companyRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
    },
    role: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
    },
    packageLpa: {
      type: String,
      required: [true, 'Package (LPA) is required'],
    },
    packageNumeric: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      default: 'Pan India / Hybrid',
    },
    minCgpa: {
      type: Number,
      required: true,
      default: 6.5,
      min: 0,
      max: 10,
    },
    eligibleBranches: {
      type: [String],
      default: ['Computer Science (CSE)', 'Information Tech (IT)', 'Electronics (ECE)'],
    },
    skillsRequired: {
      type: [String],
      default: ['Data Structures', 'Algorithms', 'SQL', 'Git'],
    },
    rounds: {
      type: String,
      default: 'Online Assessment + Technical Interview + HR Round',
    },
    deadline: {
      type: String,
      default: '30 November 2026',
    },
    status: {
      type: String,
      enum: ['active', 'upcoming', 'closed'],
      default: 'active',
      index: true,
    },
    logoBadge: {
      type: String,
      default: '🏢',
    },
    companyImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdByRole: {
      type: String,
      enum: ['admin', 'recruiter'],
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PlacementDrive', placementDriveSchema);
