const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

// Temporary protected demo admin setup
router.post('/setup-demo-admin', async (req, res) => {
  try {
    const setupKey = process.env.DEMO_SETUP_KEY;

    if (!setupKey || req.headers['x-setup-key'] !== setupKey) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    const email = 'admin@placeready.edu';
    let admin = await User.findOne({ email });

    if (admin && admin.role !== 'admin') {
      return res.status(409).json({
        success: false,
        message: 'Email already belongs to a non-admin account.'
      });
    }

    if (!admin) {
      admin = new User({
        name: 'Dr. Rajesh Sharma (TPO)',
        email,
        role: 'admin'
      });
    }

    admin.password = 'admin123';
    admin.isApproved = true;
    admin.isActive = true;
    await admin.save();

    return res.json({
      success: true,
      message: 'Demo admin is ready',
      email
    });
  } catch (error) {
    console.error('Demo admin setup failed:', error);
    return res.status(500).json({ success: false, message: 'Setup failed' });
  }
});

module.exports = router;
