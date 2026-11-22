const RecruiterProfile = require('../models/RecruiterProfile');
const User = require('../models/User');
const Company = require('../models/Company');
const ApiResponse = require('../utils/apiResponse');

/**
 * @route   GET /api/recruiters/profile
 * @desc    Get logged in recruiter profile & company data
 * @access  Private (Recruiter)
 */
const getRecruiterProfile = async (req, res, next) => {
  try {
    const profile = await RecruiterProfile.findOne({ user: req.user._id })
      .populate('user', 'name email avatar isApproved')
      .populate('companyRef');

    if (!profile) {
      return ApiResponse.error(res, 'Recruiter profile not found', 404);
    }

    return ApiResponse.success(res, 'Recruiter profile retrieved', profile);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/recruiters/profile
 * @desc    Update recruiter and associated company info
 * @access  Private (Recruiter)
 */
const updateRecruiterProfile = async (req, res, next) => {
  try {
    const { designation, phone, companyDescription, website, location } = req.body;

    let profile = await RecruiterProfile.findOne({ user: req.user._id });
    if (!profile) {
      return ApiResponse.error(res, 'Recruiter profile not found', 404);
    }

    if (designation) profile.designation = designation;
    if (phone) profile.phone = phone;
    await profile.save();

    // Update company details if provided
    if (profile.companyRef) {
      const updateData = {};
      if (companyDescription) updateData.description = companyDescription;
      if (website) updateData.website = website;
      if (location) updateData.location = location;

      await Company.findByIdAndUpdate(profile.companyRef, { $set: updateData });
    }

    const updated = await RecruiterProfile.findById(profile._id)
      .populate('user', 'name email avatar isApproved')
      .populate('companyRef');

    return ApiResponse.success(res, 'Recruiter profile updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/recruiters
 * @desc    Get all recruiters with approval status (Admin only)
 * @access  Private (Admin)
 */
const getAllRecruiters = async (req, res, next) => {
  try {
    const recruiters = await RecruiterProfile.find()
      .populate('user', 'name email avatar isActive isApproved createdAt')
      .populate('companyRef')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, 'Recruiters list retrieved', recruiters);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/recruiters/:id/approval
 * @desc    Approve or reject a recruiter registration (Admin only)
 * @access  Private (Admin)
 */
const approveRejectRecruiter = async (req, res, next) => {
  try {
    const { status, reason } = req.body; // status: 'approved' | 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return ApiResponse.error(res, "Status must be either 'approved' or 'rejected'.", 400);
    }

    const profile = await RecruiterProfile.findById(req.params.id);
    if (!profile) {
      return ApiResponse.error(res, 'Recruiter profile not found', 404);
    }

    profile.approvalStatus = status;
    profile.approvedBy = req.user._id;
    profile.approvedAt = new Date();
    if (reason) profile.rejectionReason = reason;
    await profile.save();

    // Update User approval state
    await User.findByIdAndUpdate(profile.user, {
      isApproved: status === 'approved',
    });

    return ApiResponse.success(
      res,
      `Recruiter account successfully ${status === 'approved' ? 'approved' : 'rejected'}.`,
      profile
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecruiterProfile,
  updateRecruiterProfile,
  getAllRecruiters,
  approveRejectRecruiter,
};
