const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const Application = require('../models/Application');
const PlacementDrive = require('../models/PlacementDrive');
const Announcement = require('../models/Announcement');
const StudentSkill = require('../models/StudentSkill');
const { calculateReadiness } = require('../services/readinessService');
const ApiResponse = require('../utils/apiResponse');

/**
 * @route   GET /api/students/dashboard
 * @desc    Get aggregated student dashboard data
 * @access  Private (Student)
 */
const getStudentDashboard = async (req, res, next) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = await StudentProfile.create({
        user: req.user._id,
        rollNumber: `22CSE${Math.floor(100 + Math.random() * 900)}`,
        branch: 'Computer Science (CSE)',
        cgpa: 7.5,
      });
    }

    // Calculate dynamic readiness score
    const readiness = calculateReadiness(profile, profile.targetRole || 'sde');

    // Get student's applied drive IDs
    const applications = await Application.find({ studentRef: req.user._id })
      .populate('driveRef')
      .sort({ appliedAt: -1 });

    const appliedDriveIds = applications
      .filter((app) => app.driveRef)
      .map((app) => app.driveRef._id.toString());

    // Get active drives
    const drives = await PlacementDrive.find({ status: { $ne: 'closed' } })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get announcements
    const announcements = await Announcement.find({
      targetAudience: { $in: ['all', 'students'] },
    })
      .sort({ createdAt: -1 })
      .limit(5);

    return ApiResponse.success(res, 'Student dashboard loaded successfully', {
      student: {
        id: profile._id,
        userId: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        roll: profile.rollNumber,
        branch: profile.branch,
        cgpa: profile.cgpa,
        skills: profile.skills,
        projects: profile.projects.length,
        internships: profile.internshipsCount,
        dsaSolved: profile.dsaSolved,
        targetRole: profile.targetRole,
        resumeUploaded: profile.resumeUploaded,
        isPlaced: profile.isPlaced,
        placedCompany: profile.placedCompany,
        appliedJobIds: appliedDriveIds,
        profileCompletion: profile.profileCompletion,
      },
      readiness,
      drives,
      applications,
      announcements,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/students/profile
 * @desc    Get current student full profile
 * @access  Private (Student)
 */
const getStudentProfile = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id }).populate('user', 'name email avatar');
    if (!profile) {
      return ApiResponse.error(res, 'Student profile not found', 404);
    }
    return ApiResponse.success(res, 'Profile retrieved', profile);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/students/profile
 * @desc    Update student academic and personal info
 * @access  Private (Student)
 */
const updateStudentProfile = async (req, res, next) => {
  try {
    const { branch, rollNumber, cgpa, phone, targetRole, internshipsCount, dsaSolved, projects } = req.body;

    let profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) {
      return ApiResponse.error(res, 'Student profile not found', 404);
    }

    if (branch) profile.branch = branch;
    if (rollNumber) profile.rollNumber = rollNumber.trim().toUpperCase();
    if (cgpa !== undefined) profile.cgpa = parseFloat(cgpa);
    if (phone !== undefined) profile.phone = phone;
    if (targetRole) profile.targetRole = targetRole;
    if (internshipsCount !== undefined) profile.internshipsCount = parseInt(internshipsCount);
    if (dsaSolved !== undefined) profile.dsaSolved = parseInt(dsaSolved);
    if (projects && Array.isArray(projects)) profile.projects = projects;

    profile.calculateCompletion();
    await profile.save();

    return ApiResponse.success(res, 'Student profile updated successfully', profile);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/students/skills
 * @desc    Add or remove technical skills
 * @access  Private (Student)
 */
const updateStudentSkills = async (req, res, next) => {
  try {
    const { skills, action, skill } = req.body;

    let profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) {
      return ApiResponse.error(res, 'Student profile not found', 404);
    }

    if (skills && Array.isArray(skills)) {
      profile.skills = Array.from(new Set(skills.map((s) => s.trim())));
    } else if (action === 'add' && skill) {
      const trimmed = skill.trim();
      if (!profile.skills.includes(trimmed)) {
        profile.skills.push(trimmed);
        await StudentSkill.findOneAndUpdate(
          { studentRef: profile._id, skillName: trimmed },
          { userRef: req.user._id, skillName: trimmed },
          { upsert: true, new: true }
        );
      }
    } else if (action === 'remove' && skill) {
      profile.skills = profile.skills.filter((s) => s !== skill.trim());
      await StudentSkill.findOneAndDelete({ studentRef: profile._id, skillName: skill.trim() });
    }

    profile.calculateCompletion();
    await profile.save();

    return ApiResponse.success(res, 'Skills updated successfully', {
      skills: profile.skills,
      readiness: calculateReadiness(profile, profile.targetRole),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/students
 * @desc    Get all students (for Admin & Recruiters) with search & filters
 * @access  Private (Admin, Recruiter)
 */
const getAllStudents = async (req, res, next) => {
  try {
    const { search, branch, isPlaced, minCgpa, page = 1, limit = 50 } = req.query;

    const query = {};

    if (branch && branch !== 'all') {
      query.branch = branch;
    }

    if (isPlaced !== undefined && isPlaced !== 'all') {
      query.isPlaced = isPlaced === 'true';
    }

    if (minCgpa) {
      query.cgpa = { $gte: parseFloat(minCgpa) };
    }

    let students = await StudentProfile.find(query)
      .populate('user', 'name email avatar isActive')
      .sort({ cgpa: -1 });

    if (search) {
      const lowerSearch = search.toLowerCase();
      students = students.filter(
        (s) =>
          (s.user && s.user.name.toLowerCase().includes(lowerSearch)) ||
          s.rollNumber.toLowerCase().includes(lowerSearch) ||
          (s.skills && s.skills.some((sk) => sk.toLowerCase().includes(lowerSearch)))
      );
    }

    return ApiResponse.success(res, 'Students retrieved successfully', students, 200, {
      total: students.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/students/:id
 * @desc    Get single student details with readiness report
 * @access  Private (Admin, Recruiter)
 */
const getStudentById = async (req, res, next) => {
  try {
    const student = await StudentProfile.findById(req.params.id).populate('user', 'name email avatar');
    if (!student) {
      return ApiResponse.error(res, 'Student not found', 404);
    }

    const readiness = calculateReadiness(student, student.targetRole || 'sde');

    return ApiResponse.success(res, 'Student details retrieved', {
      student,
      readiness,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentDashboard,
  getStudentProfile,
  updateStudentProfile,
  updateStudentSkills,
  getAllStudents,
  getStudentById,
};
