const express = require('express');
const router = express.Router();
const {
  getAllDrives,
  getDriveById,
  createDrive,
  updateDrive,
  deleteDrive,
} = require('../controllers/driveController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllDrives);
router.get('/:id', getDriveById);
router.post('/', protect, authorize('admin', 'recruiter'), createDrive);
router.put('/:id', protect, authorize('admin', 'recruiter'), updateDrive);
router.delete('/:id', protect, authorize('admin'), deleteDrive);

module.exports = router;
