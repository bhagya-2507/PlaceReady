const express = require('express');
const router = express.Router();
const {
  getStudentDashboard,
  getStudentProfile,
  updateStudentProfile,
  updateStudentSkills,
  getAllStudents,
  getStudentById,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, authorize('student'), getStudentDashboard);
router.get('/profile', protect, authorize('student'), getStudentProfile);
router.put('/profile', protect, authorize('student'), updateStudentProfile);
router.put('/skills', protect, authorize('student'), updateStudentSkills);

// Admin & Recruiter endpoints
router.get('/', protect, authorize('admin', 'recruiter'), getAllStudents);
router.get('/:id', protect, authorize('admin', 'recruiter'), getStudentById);

module.exports = router;
