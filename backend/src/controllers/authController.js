const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const Company = require('../models/Company');
const ApiResponse = require('../utils/apiResponse');

/**
 * Generate JWT Token Helper
 */
const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'placeready_super_secure_jwt_secret_key_2026_capstone_college_project',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (Student or Recruiter)
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = 'student',
      branch,
      rollNumber,
      cgpa,
      companyName,
      designation,
      phone,
    } = req.body;

    // Disallow public registration as Admin
    if (role === 'admin') {
      return ApiResponse.error(res, 'Administrator accounts cannot be created via public registration.', 403);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return ApiResponse.error(res, 'This email is already registered. Please sign in.', 400);
    }

    // Create User
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=6366f1&color=fff&size=200&bold=true`,
      isApproved: role !== 'recruiter', // Recruiters require TPO approval
    });

    let profileData = null;

    if (role === 'student') {
      // Create StudentProfile
      const autoRoll = rollNumber
        ? rollNumber.trim().toUpperCase()
        : `22CSE${Math.floor(100 + Math.random() * 900)}`;

      profileData = await StudentProfile.create({
        user: user._id,
        rollNumber: autoRoll,
        branch: branch || 'Computer Science (CSE)',
        cgpa: cgpa ? parseFloat(cgpa) : 7.5,
        skills: [],
        resumeUploaded: false,
      });
      profileData.calculateCompletion();
      await profileData.save();
    } else if (role === 'recruiter') {
      // Find or create Company
      const cleanCompany = companyName ? companyName.trim() : 'Recruiting Organization';
      let company = await Company.findOne({ name: new RegExp(`^${cleanCompany}$`, 'i') });
      if (!company) {
        company = await Company.create({
          name: cleanCompany,
          industry: 'Technology & Enterprise',
          isVerified: false,
        });
      }

      profileData = await RecruiterProfile.create({
        user: user._id,
        companyName: company.name,
        companyRef: company._id,
        designation: designation || 'Talent Acquisition Specialist',
        phone: phone || '',
        approvalStatus: 'pending',
      });
    }

    const token = signToken(user._id);

    return ApiResponse.success(
      res,
      role === 'recruiter'
        ? 'Recruiter account registered successfully! Your account is pending TPO approval.'
        : 'Student registration successful! Welcome to PlaceReady.',
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isApproved: user.isApproved,
          profile: profileData,
        },
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get JWT token
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return ApiResponse.error(res, 'Please provide both email and password.', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return ApiResponse.error(res, 'Invalid credentials. User not found.', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return ApiResponse.error(res, 'Invalid email or password.', 401);
    }

    // Role check if specified by client
    if (role && user.role !== role) {
      return ApiResponse.error(
        res,
        `Role mismatch: This account is registered as '${user.role}'. Please select the '${user.role}' portal.`,
        400
      );
    }

    // Recruiter approval check
    if (user.role === 'recruiter' && !user.isApproved) {
      const recProfile = await RecruiterProfile.findOne({ user: user._id });
      if (recProfile && recProfile.approvalStatus === 'rejected') {
        return ApiResponse.error(
          res,
          `Your recruiter registration was rejected by TPO. Reason: ${recProfile.rejectionReason || 'Institutional policy'}`,
          403
        );
      }
      return ApiResponse.error(
        res,
        'Your recruiter account is pending verification and approval by the TPO placement cell.',
        403
      );
    }

    // Fetch related profile
    let profileData = null;
    if (user.role === 'student') {
      profileData = await StudentProfile.findOne({ user: user._id });
    } else if (user.role === 'recruiter') {
      profileData = await RecruiterProfile.findOne({ user: user._id }).populate('companyRef');
    }

    const token = signToken(user._id);

    return ApiResponse.success(res, `Welcome back, ${user.name}!`, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isApproved: user.isApproved,
        profile: profileData,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged in user profile
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let profileData = null;

    if (user.role === 'student') {
      profileData = await StudentProfile.findOne({ user: user._id });
    } else if (user.role === 'recruiter') {
      profileData = await RecruiterProfile.findOne({ user: user._id }).populate('companyRef');
    }

    return ApiResponse.success(res, 'User session verified', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isApproved: user.isApproved,
        profile: profileData,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user & clear session
 * @access  Public
 */
const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  return ApiResponse.success(res, 'Logged out successfully');
};

module.exports = {
  register,
  login,
  getMe,
  logout,
};
