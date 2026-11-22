const Announcement = require('../models/Announcement');
const ApiResponse = require('../utils/apiResponse');

const getAllAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find().sort({ isPinned: -1, createdAt: -1 });
    return ApiResponse.success(res, 'Announcements retrieved', announcements);
  } catch (error) {
    next(error);
  }
};

const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, priority, targetAudience, isPinned } = req.body;

    if (!title || !content) {
      return ApiResponse.error(res, 'Title and content are required.', 400);
    }

    const announcement = await Announcement.create({
      title,
      content,
      author: req.user.name || 'Placement & Training Cell',
      authorRef: req.user._id,
      authorRole: req.user.role,
      priority: priority || 'medium',
      targetAudience: targetAudience || 'all',
      isPinned: isPinned || false,
    });

    return ApiResponse.success(res, 'Announcement broadcasted successfully!', announcement, 201);
  } catch (error) {
    next(error);
  }
};

const updateAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!announcement) {
      return ApiResponse.error(res, 'Announcement not found', 404);
    }
    return ApiResponse.success(res, 'Announcement updated', announcement);
  } catch (error) {
    next(error);
  }
};

const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return ApiResponse.error(res, 'Announcement not found', 404);
    }
    return ApiResponse.success(res, 'Announcement deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
