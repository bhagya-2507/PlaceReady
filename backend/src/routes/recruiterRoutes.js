const express = require('express');
const router = express.Router();
const {
  getRecruiterProfile,
  updateRecruiterProfile,
  getAllRecruiters,
  approveRejectRecruiter,
} = require('../controllers/recruiterController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/profile', protect, authorize('recruiter'), getRecruiterProfile);
router.put('/profile', protect, authorize('recruiter'), updateRecruiterProfile);

// Admin endpoints
router.get('/', protect, authorize('admin'), getAllRecruiters);
router.put('/:id/approval', protect, authorize('admin'), approveRejectRecruiter);

module.exports = router;
