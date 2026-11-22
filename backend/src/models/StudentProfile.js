const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      trim: true,
      uppercase: true,
      index: true,
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      enum: [
        'Computer Science (CSE)',
        'Information Tech (IT)',
        'Electronics (ECE)',
        'Electrical (EE)',
        'Mechanical (ME)',
        'Civil Engineering',
        'Other',
      ],
      default: 'Computer Science (CSE)',
    },
    cgpa: {
      type: Number,
      required: [true, 'CGPA is required'],
      min: [0, 'CGPA cannot be negative'],
      max: [10, 'CGPA cannot exceed 10.0'],
      default: 7.5,
    },
    batch: {
      type: String,
      default: '2026',
    },
    phone: {
      type: String,
      default: '',
    },
    targetRole: {
      type: String,
      enum: ['sde', 'data_analyst', 'web_dev', 'devops', 'cloud_engineer'],
      default: 'sde',
    },
    skills: {
      type: [String],
      default: [],
    },
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        techStack: { type: [String], default: [] },
        link: { type: String, default: '' },
      },
    ],
    internshipsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    dsaSolved: {
      type: Number,
      default: 0,
      min: 0,
    },
    resumeUploaded: {
      type: Boolean,
      default: false,
    },
    activeResumeRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      default: null,
    },
    isPlaced: {
      type: Boolean,
      default: false,
      index: true,
    },
    placedCompany: {
      type: String,
      default: null,
    },
    placedPackage: {
      type: String,
      default: null,
    },
    profileCompletion: {
      type: Number,
      default: 40,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Method to compute dynamic profile completion percentage
studentProfileSchema.methods.calculateCompletion = function () {
  let score = 20; // user account created
  if (this.rollNumber && this.branch) score += 20;
  if (this.cgpa > 0) score += 10;
  if (this.skills && this.skills.length >= 3) score += 20;
  if (this.projects && this.projects.length >= 1) score += 15;
  if (this.resumeUploaded) score += 15;
  this.profileCompletion = Math.min(100, score);
  return this.profileCompletion;
};

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
