const Application = require('../models/Application');
const StudentProfile = require('../models/StudentProfile');
const PlacementDrive = require('../models/PlacementDrive');
const JobPosting = require('../models/JobPosting');
const ApiResponse = require('../utils/apiResponse');

/**
 * @route   POST /api/applications
 * @desc    Submit application to a Placement Drive or Job Posting
 * @access  Private (Student)
 */
const apply = async (req, res, next) => {
  try {
    const { driveId, jobId } = req.body;

    if (!driveId && !jobId) {
      return ApiResponse.error(res, 'Please specify a placement drive or job ID to apply.', 400);
    }

    const studentProfile = await StudentProfile.findOne({ user: req.user._id });
    if (!studentProfile) {
      return ApiResponse.error(res, 'Student profile not found. Please complete profile setup.', 400);
    }

    // Strict requirement: Resume must be uploaded to apply
    if (!studentProfile.resumeUploaded) {
      return ApiResponse.error(
        res,
        'Resume verification required: Please upload your official PDF resume in the Resume tab before registering for campus drives.',
        400
      );
    }

    let companyName = '';
    let roleTitle = '';
    let packageLpa = '';
    let minCgpa = 0;
    let eligibleBranches = [];

    if (driveId) {
      const drive = await PlacementDrive.findById(driveId);
      if (!drive) {
        return ApiResponse.error(res, 'Placement drive not found', 404);
      }
      if (drive.status === 'closed') {
        return ApiResponse.error(res, 'Registrations for this placement drive are closed.', 400);
      }
      companyName = drive.companyName;
      roleTitle = drive.role;
      packageLpa = drive.packageLpa;
      minCgpa = drive.minCgpa;
      eligibleBranches = drive.eligibleBranches;

      // Check CGPA Eligibility
      if (studentProfile.cgpa < minCgpa) {
        return ApiResponse.error(
          res,
          `Ineligible: Your CGPA (${studentProfile.cgpa}) does not meet the minimum requirement of ${minCgpa} for ${companyName}.`,
          400
        );
      }

      // Check duplicate application
      const existing = await Application.findOne({
        studentRef: req.user._id,
        driveRef: driveId,
      });
      if (existing) {
        return ApiResponse.error(res, `You have already registered for the ${companyName} (${roleTitle}) drive.`, 400);
      }
    } else if (jobId) {
      const job = await JobPosting.findById(jobId);
      if (!job) {
        return ApiResponse.error(res, 'Job posting not found', 404);
      }
      companyName = job.companyName;
      roleTitle = job.title;
      packageLpa = job.packageLpa;
      minCgpa = job.minCgpa;
      eligibleBranches = job.eligibleBranches;

      const existing = await Application.findOne({
        studentRef: req.user._id,
        jobRef: jobId,
      });
      if (existing) {
        return ApiResponse.error(res, `You have already applied for this opening at ${companyName}.`, 400);
      }
    }

    const application = await Application.create({
      studentRef: req.user._id,
      studentProfileRef: studentProfile._id,
      driveRef: driveId || null,
      jobRef: jobId || null,
      companyName,
      roleTitle,
      packageLpa,
      resumeRef: studentProfile.activeResumeRef,
      status: 'applied',
    });

    return ApiResponse.success(
      res,
      `Application submitted successfully for ${companyName} (${roleTitle})! Your profile has been sent to recruiters.`,
      application,
      201
    );
  } catch (error) {
    if (error.code === 11000) {
      return ApiResponse.error(res, 'You have already submitted an application for this opportunity.', 400);
    }
    next(error);
  }
};

/**
 * @route   GET /api/applications/my
 * @desc    Get current student's applications with real-time status tracking
 * @access  Private (Student)
 */
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ studentRef: req.user._id })
      .populate('driveRef')
      .populate('jobRef')
      .populate('resumeRef')
      .sort({ appliedAt: -1 });

    return ApiResponse.success(res, 'My applications retrieved', applications);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/applications
 * @desc    Get all applications (Admin & Recruiters)
 * @access  Private (Admin, Recruiter)
 */
const getAllApplications = async (req, res, next) => {
  try {
    const { status, company, driveId } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (company) {
      query.companyName = new RegExp(company, 'i');
    }

    if (driveId) {
      query.driveRef = driveId;
    }

    // If recruiter, only see their company's applications
    if (req.user.role === 'recruiter') {
      const RecruiterProfile = require('../models/RecruiterProfile');
      const recProfile = await RecruiterProfile.findOne({ user: req.user._id });
      if (recProfile) {
        query.companyName = recProfile.companyName;
      }
    }

    const applications = await Application.find(query)
      .populate({
        path: 'studentProfileRef',
        populate: { path: 'user', select: 'name email avatar' },
      })
      .populate('driveRef')
      .populate('jobRef')
      .populate('resumeRef')
      .sort({ appliedAt: -1 });

    return ApiResponse.success(res, 'Applications retrieved successfully', applications);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/applications/:id/status
 * @desc    Update candidate application selection status (Admin, Recruiter)
 * @access  Private (Admin, Recruiter)
 */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes, feedback, interviewSchedule } = req.body;
    const validStatuses = ['applied', 'under_review', 'shortlisted', 'technical_round', 'selected', 'rejected'];

    if (!validStatuses.includes(status)) {
      return ApiResponse.error(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return ApiResponse.error(res, 'Application not found', 404);
    }

    application.status = status;
    if (notes !== undefined) application.notes = notes;
    if (feedback !== undefined) application.feedback = feedback;
    if (interviewSchedule !== undefined) application.interviewSchedule = interviewSchedule;
    await application.save();

    // If status is 'selected', mark student as placed in StudentProfile!
    if (status === 'selected') {
      await StudentProfile.findByIdAndUpdate(application.studentProfileRef, {
        isPlaced: true,
        placedCompany: application.companyName,
        placedPackage: application.packageLpa,
      });
    }

    return ApiResponse.success(
      res,
      `Application status updated to '${status.replace('_', ' ').toUpperCase()}'.`,
      application
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  apply,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
};
