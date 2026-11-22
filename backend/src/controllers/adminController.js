const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const Company = require('../models/Company');
const PlacementDrive = require('../models/PlacementDrive');
const Application = require('../models/Application');
const ApiResponse = require('../utils/apiResponse');

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get aggregate metrics and status for TPO / Admin Overview
 * @access  Private (Admin)
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalRecruiters,
      pendingRecruiters,
      totalCompanies,
      totalDrives,
      totalApplications,
      placedStudents,
    ] = await Promise.all([
      StudentProfile.countDocuments(),
      RecruiterProfile.countDocuments(),
      RecruiterProfile.countDocuments({ approvalStatus: 'pending' }),
      Company.countDocuments(),
      PlacementDrive.countDocuments(),
      Application.countDocuments(),
      StudentProfile.countDocuments({ isPlaced: true }),
    ]);

    const placementRate = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;

    // Recent applications
    const recentApplications = await Application.find()
      .populate({
        path: 'studentProfileRef',
        populate: { path: 'user', select: 'name email' },
      })
      .sort({ appliedAt: -1 })
      .limit(6);

    // Recent drives
    const recentDrives = await PlacementDrive.find()
      .sort({ createdAt: -1 })
      .limit(5);

    return ApiResponse.success(res, 'Admin dashboard metrics retrieved', {
      metrics: {
        totalStudents,
        totalRecruiters,
        pendingRecruiters,
        totalCompanies,
        totalDrives,
        totalApplications,
        placedStudents,
        placementRate,
      },
      recentApplications,
      recentDrives,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/placement-statistics
 * @desc    Branch-wise and package distribution analytics
 * @access  Private (Admin)
 */
const getPlacementAnalytics = async (req, res, next) => {
  try {
    // Branch breakdown
    const branchStats = await StudentProfile.aggregate([
      {
        $group: {
          _id: '$branch',
          total: { $sum: 1 },
          placed: { $sum: { $cond: ['$isPlaced', 1, 0] } },
          avgCgpa: { $avg: '$cgpa' },
        },
      },
      {
        $project: {
          branch: '$_id',
          total: 1,
          placed: 1,
          placementRate: {
            $cond: [
              { $gt: ['$total', 0] },
              { $round: [{ $multiply: [{ $divide: ['$placed', '$total'] }, 100] }, 1] },
              0,
            ],
          },
          avgCgpa: { $round: ['$avgCgpa', 2] },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Top placed companies
    const companyStats = await StudentProfile.aggregate([
      { $match: { isPlaced: true, placedCompany: { $ne: null } } },
      { $group: { _id: '$placedCompany', hires: { $sum: 1 } } },
      { $sort: { hires: -1 } },
      { $limit: 6 },
    ]);

    return ApiResponse.success(res, 'Placement analytics retrieved', {
      branchStats,
      companyStats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/reports
 * @desc    Get detailed tabular placement report for download/export
 * @access  Private (Admin)
 */
const getReportsData = async (req, res, next) => {
  try {
    const students = await StudentProfile.find()
      .populate('user', 'name email createdAt')
      .sort({ isPlaced: -1, cgpa: -1 });

    const reportRows = students.map((s) => ({
      rollNumber: s.rollNumber,
      name: s.user ? s.user.name : 'Unknown',
      email: s.user ? s.user.email : 'N/A',
      branch: s.branch,
      cgpa: s.cgpa,
      skillsCount: s.skills.length,
      internshipsCount: s.internshipsCount,
      isPlaced: s.isPlaced ? 'PLACED' : 'UNPLACED',
      placedCompany: s.placedCompany || 'N/A',
      placedPackage: s.placedPackage || 'N/A',
    }));

    return ApiResponse.success(res, 'Placement report data generated', {
      generatedAt: new Date().toISOString(),
      totalRecords: reportRows.length,
      records: reportRows,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getPlacementAnalytics,
  getReportsData,
};
