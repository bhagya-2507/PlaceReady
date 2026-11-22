const express = require('express');
const router = express.Router();

const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const Company = require('../models/Company');

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

// Temporary protected setup for demo student and recruiter
router.post('/setup-demo-users', async (req, res) => {
  try {
    const setupKey = process.env.DEMO_SETUP_KEY;

    if (!setupKey || req.headers['x-setup-key'] !== setupKey) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    // DEMO STUDENT
    const studentEmail = 'rahul@college.edu';
    let student = await User.findOne({ email: studentEmail });

    if (student && student.role !== 'student') {
      return res.status(409).json({
        success: false,
        message: 'Student demo email belongs to another role.'
      });
    }

    if (!student) {
      student = new User({
        name: 'Rahul Sharma',
        email: studentEmail,
        role: 'student'
      });
    }

    student.password = 'student123';
    student.isApproved = true;
    student.isActive = true;
    await student.save();

    await StudentProfile.findOneAndUpdate(
      { user: student._id },
      {
        $setOnInsert: {
          user: student._id,
          rollNumber: 'DEMO2026',
          branch: 'Computer Science (CSE)',
          cgpa: 7.5,
          batch: '2026'
        }
      },
      { upsert: true, new: true, runValidators: true }
    );

    // DEMO RECRUITER
    const recruiterEmail = 'recruiter@amazon.com';
    let recruiter = await User.findOne({ email: recruiterEmail });

    if (recruiter && recruiter.role !== 'recruiter') {
      return res.status(409).json({
        success: false,
        message: 'Recruiter demo email belongs to another role.'
      });
    }

    if (!recruiter) {
      recruiter = new User({
        name: 'Amazon Demo Recruiter',
        email: recruiterEmail,
        role: 'recruiter'
      });
    }

    recruiter.password = 'recruiter123';
    recruiter.isApproved = true;
    recruiter.isActive = true;
    await recruiter.save();

    const company = await Company.findOneAndUpdate(
      { name: 'Amazon India' },
      {
        $setOnInsert: {
          name: 'Amazon India',
          industry: 'Technology & Software',
          website: 'https://www.amazon.jobs/',
          location: 'Bengaluru / Pan India',
          contactEmail: recruiterEmail,
          isVerified: true
        }
      },
      { upsert: true, new: true, runValidators: true }
    );

    await RecruiterProfile.findOneAndUpdate(
      { user: recruiter._id },
      {
        $set: {
          companyName: 'Amazon India',
          companyRef: company._id,
          approvalStatus: 'approved',
          approvedAt: new Date()
        },
        $setOnInsert: {
          user: recruiter._id,
          designation: 'Talent Acquisition Partner'
        }
      },
      { upsert: true, new: true, runValidators: true }
    );

    return res.json({
      success: true,
      message: 'Demo student and recruiter are ready',
      accounts: [studentEmail, recruiterEmail]
    });
  } catch (error) {
    console.error('Demo users setup failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Setup failed',
      error: error.message
    });
  }
});

module.exports = router;
