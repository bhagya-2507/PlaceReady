const express = require('express');
const router = express.Router();
const {
  uploadResume,
  getMyResume,
  downloadResume,
} = require('../controllers/resumeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadResume: multerUpload } = require('../middleware/uploadMiddleware');

router.post('/upload', protect, authorize('student'), multerUpload.single('resume'), uploadResume);
router.get('/my', protect, authorize('student'), getMyResume);
router.get('/:id/download', protect, downloadResume);

module.exports = router;
