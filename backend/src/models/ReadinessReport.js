const mongoose = require('mongoose');

const readinessReportSchema = new mongoose.Schema(
  {
    studentRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: true,
      index: true,
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetRole: {
      type: String,
      required: true,
      default: 'sde',
    },
    totalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      default: 'Moderate Readiness',
    },
    breakdown: {
      cgpaScore: { type: Number, default: 0 },
      cgpaMax: { type: Number, default: 35 },
      skillsScore: { type: Number, default: 0 },
      skillsMax: { type: Number, default: 35 },
      projectsScore: { type: Number, default: 0 },
      projectsMax: { type: Number, default: 15 },
      internshipsScore: { type: Number, default: 0 },
      internshipsMax: { type: Number, default: 15 },
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    recommendations: [
      {
        priority: { type: String, default: 'High' },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        resource: { type: String, default: '' },
      },
    ],
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ReadinessReport', readinessReportSchema);
