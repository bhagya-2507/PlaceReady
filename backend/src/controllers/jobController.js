const JobPosting = require('../models/JobPosting');
const RecruiterProfile = require('../models/RecruiterProfile');
const Application = require('../models/Application');
const ApiResponse = require('../utils/apiResponse');

const getJobs = async (req, res, next) => {
  try {
    const query = {};
    // If recruiter, show their own
    if (req.user && req.user.role === 'recruiter') {
      query.recruiterRef = req.user._id;
    } else {
      query.status = 'active';
    }

    const jobs = await JobPosting.find(query).sort({ createdAt: -1 }).populate('companyRef');
    return ApiResponse.success(res, 'Job postings retrieved', jobs);
  } catch (error) {
    next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    const recruiterProfile = await RecruiterProfile.findOne({ user: req.user._id });
    if (!recruiterProfile) {
      return ApiResponse.error(res, 'Recruiter profile required to post jobs', 400);
    }

    if (recruiterProfile.approvalStatus !== 'approved') {
      return ApiResponse.error(res, 'Your recruiter account must be approved by TPO before posting jobs.', 403);
    }

    const {
      title,
      description,
      packageLpa,
      location,
      minCgpa,
      eligibleBranches,
      skillsRequired,
      experienceRequired,
      deadline,
    } = req.body;

    const job = await JobPosting.create({
      recruiterRef: req.user._id,
      companyRef: recruiterProfile.companyRef,
      companyName: recruiterProfile.companyName,
      title,
      description,
      packageLpa,
      location: location || 'Bengaluru / Hybrid',
      minCgpa: minCgpa ? parseFloat(minCgpa) : 7.0,
      eligibleBranches: eligibleBranches || ['Computer Science (CSE)', 'Information Tech (IT)'],
      skillsRequired: skillsRequired || [],
      experienceRequired: experienceRequired || 'Fresher',
      deadline: deadline || '15 December 2026',
    });

    return ApiResponse.success(res, 'Job posting created successfully', job, 201);
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await JobPosting.findOne({ _id: req.params.id, recruiterRef: req.user._id });
    if (!job) {
      return ApiResponse.error(res, 'Job posting not found or unauthorized', 404);
    }

    const updated = await JobPosting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return ApiResponse.success(res, 'Job posting updated', updated);
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await JobPosting.findOne({ _id: req.params.id, recruiterRef: req.user._id });
    if (!job) {
      return ApiResponse.error(res, 'Job posting not found or unauthorized', 404);
    }

    await JobPosting.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ jobRef: req.params.id });

    return ApiResponse.success(res, 'Job posting and related applications deleted');
  } catch (error) {
    next(error);
  }
};

const getJobApplicants = async (req, res, next) => {
  try {
    const job = await JobPosting.findById(req.params.id);
    if (!job) {
      return ApiResponse.error(res, 'Job posting not found', 404);
    }

    const applications = await Application.find({ jobRef: req.params.id })
      .populate({
        path: 'studentProfileRef',
        populate: { path: 'user', select: 'name email avatar' },
      })
      .populate('resumeRef')
      .sort({ appliedAt: -1 });

    return ApiResponse.success(res, 'Applicants retrieved', {
      job,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  getJobApplicants,
};
