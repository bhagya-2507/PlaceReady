const express = require('express');
const router = express.Router();
const {
  apply,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('student'), apply);
router.get('/my', protect, authorize('student'), getMyApplications);
router.get('/', protect, authorize('admin', 'recruiter'), getAllApplications);
router.put('/:id/status', protect, authorize('admin', 'recruiter'), updateApplicationStatus);

module.exports = router;
