const mongoose = require('mongoose');

const studentSkillSchema = new mongoose.Schema(
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
    skillName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['programming', 'frontend', 'backend', 'database', 'cloud_devops', 'analytics', 'soft_skills'],
      default: 'programming',
    },
    proficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

studentSkillSchema.index({ studentRef: 1, skillName: 1 }, { unique: true });

module.exports = mongoose.model('StudentSkill', studentSkillSchema);
