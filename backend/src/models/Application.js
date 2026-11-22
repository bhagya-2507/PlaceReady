const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    studentRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    studentProfileRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: true,
    },
    driveRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlacementDrive',
      default: null,
      index: true,
    },
    jobRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPosting',
      default: null,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    roleTitle: {
      type: String,
      required: true,
    },
    packageLpa: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'applied',
        'under_review',
        'shortlisted',
        'technical_round',
        'selected',
        'rejected',
      ],
      default: 'applied',
      index: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    resumeRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
    feedback: {
      type: String,
      default: '',
    },
    interviewSchedule: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Unique Indexes to prevent duplicate applications
applicationSchema.index(
  { studentRef: 1, driveRef: 1 },
  { unique: true, partialFilterExpression: { driveRef: { $type: 'objectId' } } }
);

applicationSchema.index(
  { studentRef: 1, jobRef: 1 },
  { unique: true, partialFilterExpression: { jobRef: { $type: 'objectId' } } }
);

module.exports = mongoose.model('Application', applicationSchema);
