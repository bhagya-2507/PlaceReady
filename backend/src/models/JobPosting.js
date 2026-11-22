const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema(
  {
    recruiterRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    companyRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    packageLpa: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: 'Bengaluru / Hybrid',
    },
    minCgpa: {
      type: Number,
      default: 7.0,
      min: 0,
      max: 10,
    },
    eligibleBranches: {
      type: [String],
      default: ['Computer Science (CSE)', 'Information Tech (IT)'],
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    experienceRequired: {
      type: String,
      default: 'Fresher / 0-1 Years',
    },
    deadline: {
      type: String,
      default: '15 December 2026',
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('JobPosting', jobPostingSchema);
