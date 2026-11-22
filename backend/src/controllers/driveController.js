const PlacementDrive = require('../models/PlacementDrive');
const Company = require('../models/Company');
const Application = require('../models/Application');
const ApiResponse = require('../utils/apiResponse');

/**
 * @route   GET /api/drives
 * @desc    Get all placement drives with filtering
 * @access  Public / Private
 */
const getAllDrives = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { companyName: new RegExp(search, 'i') },
        { role: new RegExp(search, 'i') },
      ];
    }

    const drives = await PlacementDrive.find(query).sort({ createdAt: -1 });

    return ApiResponse.success(res, 'Placement drives retrieved', drives);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/drives/:id
 * @desc    Get drive by ID
 * @access  Public / Private
 */
const getDriveById = async (req, res, next) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id);
    if (!drive) {
      return ApiResponse.error(res, 'Placement drive not found', 404);
    }
    return ApiResponse.success(res, 'Drive details retrieved', drive);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/drives
 * @desc    Create new campus placement drive (Admin or Approved Recruiter)
 * @access  Private (Admin, Recruiter)
 */
const createDrive = async (req, res, next) => {
  try {
    const {
      companyName,
      role,
      packageLpa,
      location,
      minCgpa,
      eligibleBranches,
      skillsRequired,
      rounds,
      deadline,
      logoBadge,
      companyImage,
    } = req.body;

    if (!companyName || !role || !packageLpa) {
      return ApiResponse.error(res, 'Company name, role title, and package are required.', 400);
    }

    // Parse numeric package
    const match = packageLpa.match(/[\d.]+/);
    const packageNumeric = match ? parseFloat(match[0]) : 0;

    // Check or find company
    const company = await Company.findOne({ name: new RegExp(`^${companyName.trim()}$`, 'i') });

    const drive = await PlacementDrive.create({
      companyName: companyName.trim(),
      companyRef: company ? company._id : null,
      role: role.trim(),
      packageLpa: packageLpa.includes('LPA') ? packageLpa : `₹${packageLpa} LPA`,
      packageNumeric,
      location: location || 'Pan India',
      minCgpa: minCgpa ? parseFloat(minCgpa) : 6.5,
      eligibleBranches: eligibleBranches || ['Computer Science (CSE)', 'Information Tech (IT)', 'Electronics (ECE)'],
      skillsRequired: skillsRequired || ['Data Structures', 'Algorithms', 'SQL'],
      rounds: rounds || 'Online Assessment + Technical Interview + HR Round',
      deadline: deadline || '30 November 2026',
      logoBadge: logoBadge || '🏢',
      companyImage:
        companyImage ||
        (company ? company.coverImage : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80'),
      createdBy: req.user._id,
      createdByRole: req.user.role,
    });

    return ApiResponse.success(res, `Placement drive for ${drive.companyName} created successfully!`, drive, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/drives/:id
 * @desc    Update drive
 * @access  Private (Admin, Recruiter owner)
 */
const updateDrive = async (req, res, next) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id);
    if (!drive) {
      return ApiResponse.error(res, 'Placement drive not found', 404);
    }

    // Role check: recruiter can only edit their own
    if (req.user.role === 'recruiter' && drive.createdBy.toString() !== req.user._id.toString()) {
      return ApiResponse.error(res, 'You can only edit drives created by your organization.', 403);
    }

    const updated = await PlacementDrive.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return ApiResponse.success(res, 'Drive updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/drives/:id
 * @desc    Delete drive (with confirmation in frontend)
 * @access  Private (Admin)
 */
const deleteDrive = async (req, res, next) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id);
    if (!drive) {
      return ApiResponse.error(res, 'Drive not found', 404);
    }

    await PlacementDrive.findByIdAndDelete(req.params.id);
    // Also remove associated applications or mark cancelled
    await Application.deleteMany({ driveRef: req.params.id });

    return ApiResponse.success(res, 'Placement drive and associated applications deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDrives,
  getDriveById,
  createDrive,
  updateDrive,
  deleteDrive,
};
