const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getPlacementAnalytics,
  getReportsData,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/placement-statistics', protect, authorize('admin'), getPlacementAnalytics);
router.get('/analytics', protect, authorize('admin'), getPlacementAnalytics);
router.get('/reports', protect, authorize('admin'), getReportsData);

module.exports = router;
