const express = require('express');
const router = express.Router();
const {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllAnnouncements);
router.post('/', protect, authorize('admin', 'tpo'), createAnnouncement);
router.put('/:id', protect, authorize('admin', 'tpo'), updateAnnouncement);
router.delete('/:id', protect, authorize('admin', 'tpo'), deleteAnnouncement);

module.exports = router;
