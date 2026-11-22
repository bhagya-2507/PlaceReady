require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/database');

const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const Company = require('../models/Company');
const PlacementDrive = require('../models/PlacementDrive');
const JobPosting = require('../models/JobPosting');
const Application = require('../models/Application');
const Announcement = require('../models/Announcement');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting PlaceReady Database Seeding...');
    await connectDB();

    // Clear existing data
    console.log('🧹 Clearing previous database collections...');
    await Promise.all([
      User.deleteMany(),
      StudentProfile.deleteMany(),
      RecruiterProfile.deleteMany(),
      Company.deleteMany(),
      PlacementDrive.deleteMany(),
      JobPosting.deleteMany(),
      Application.deleteMany(),
      Announcement.deleteMany(),
    ]);

    // 1. Create Companies
    console.log('🏢 Creating companies...');
    const companies = await Company.create([
      {
        name: 'Amazon India',
        industry: 'E-Commerce & Cloud Computing',
        website: 'https://amazon.jobs',
        logo: '🛒',
        coverImage: 'https://images.unsplash.com/photo-1523474253243-231a5476a6d6?w=600&auto=format&fit=crop&q=80',
        location: 'Bengaluru / Hyderabad',
        description: 'World leading technology enterprise delivering cloud, commerce, and AI solutions.',
        isVerified: true,
      },
      {
        name: 'TCS Digital',
        industry: 'IT Services & Consulting',
        website: 'https://tcs.com/careers',
        logo: '💻',
        coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
        location: 'Pan India',
        description: 'Global leader in IT consulting and digital transformation solutions.',
        isVerified: true,
      },
      {
        name: 'Deloitte USI',
        industry: 'Management & Financial Consulting',
        website: 'https://deloitte.com/careers',
        logo: '📊',
        coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
        location: 'Gurugram / Mumbai / Hyderabad',
        description: 'Audit, consulting, advisory, and analytics global service firm.',
        isVerified: true,
      },
      {
        name: 'Infosys',
        industry: 'Digital Services & Consulting',
        website: 'https://infosys.com/careers',
        logo: '🌐',
        coverImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80',
        location: 'Bengaluru / Pune',
        description: 'Next-generation digital services and technology consulting pioneer.',
        isVerified: true,
      },
      {
        name: 'Razorpay',
        industry: 'Fintech & Payments Infrastructure',
        website: 'https://razorpay.com/jobs',
        logo: '💳',
        coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
        location: 'Bengaluru (Hybrid)',
        description: 'Powering seamless digital banking and payment gateway architectures across Asia.',
        isVerified: true,
      },
    ]);

    // 2. Create Users
    console.log('👤 Creating users (Admin, Recruiters, Students)...');

    // Admin
    const adminUser = await User.create({
      name: 'Dr. Rajesh Sharma (TPO)',
      email: 'admin@placeready.edu',
      password: 'admin123',
      role: 'admin',
      isApproved: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    });

    // Approved Recruiter
    const recruiterUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'recruiter@amazon.com',
      password: 'recruiter123',
      role: 'recruiter',
      isApproved: true,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    });

    await RecruiterProfile.create({
      user: recruiterUser._id,
      companyName: 'Amazon India',
      companyRef: companies[0]._id,
      designation: 'Senior Technical Recruiter',
      phone: '+91 98765 43210',
      approvalStatus: 'approved',
      approvedBy: adminUser._id,
      approvedAt: new Date(),
    });

    // Pending Recruiter
    const pendingRecruiter = await User.create({
      name: 'Vikram Mehta',
      email: 'recruiter@startup.io',
      password: 'recruiter123',
      role: 'recruiter',
      isApproved: false,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    });

    await RecruiterProfile.create({
      user: pendingRecruiter._id,
      companyName: 'NextGen AI Labs',
      designation: 'Head of People & Culture',
      phone: '+91 98111 22334',
      approvalStatus: 'pending',
    });

    // Student 1: Rahul Sharma (Competitive SDE)
    const rahulUser = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@college.edu',
      password: 'student123',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      isApproved: true,
    });

    const rahulProfile = await StudentProfile.create({
      user: rahulUser._id,
      rollNumber: '21CSE085',
      branch: 'Computer Science (CSE)',
      cgpa: 8.4,
      batch: '2026',
      phone: '+91 91234 56789',
      targetRole: 'sde',
      skills: ['Java', 'Python', 'Data Structures', 'Algorithms', 'SQL', 'Git', 'System Design'],
      projects: [
        {
          title: 'Distributed Placement Tracker',
          description: 'High-throughput student tracking portal with React & Node.js',
          techStack: ['React', 'Node.js', 'MongoDB'],
          link: 'https://github.com/rahul/placement-portal',
        },
        {
          title: 'Algorithmic Visualizer',
          description: 'Interactive visualization for graph traversal and sorting algorithms',
          techStack: ['JavaScript', 'Canvas', 'HTML5'],
          link: 'https://github.com/rahul/algo-vis',
        },
      ],
      internshipsCount: 1,
      dsaSolved: 240,
      resumeUploaded: true,
      isPlaced: false,
      profileCompletion: 95,
    });

    // Student 2: Priya Patel (Placed at Amazon)
    const priyaUser = await User.create({
      name: 'Priya Patel',
      email: 'priya@college.edu',
      password: 'student123',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isApproved: true,
    });

    await StudentProfile.create({
      user: priyaUser._id,
      rollNumber: '21CSE042',
      branch: 'Computer Science (CSE)',
      cgpa: 8.9,
      batch: '2026',
      targetRole: 'sde',
      skills: ['C++', 'Java', 'Python', 'Data Structures', 'SQL', 'Git', 'System Design', 'Docker'],
      projects: [
        {
          title: 'Cloud Microservices Architecture',
          description: 'Scalable payment gateway simulation using Docker and AWS ECS',
          techStack: ['Java', 'Spring Boot', 'AWS'],
        },
      ],
      internshipsCount: 2,
      dsaSolved: 340,
      resumeUploaded: true,
      isPlaced: true,
      placedCompany: 'Amazon India',
      placedPackage: '₹24.0 LPA',
      profileCompletion: 100,
    });

    // Student 3: Ananya Verma (Data Analyst)
    const ananyaUser = await User.create({
      name: 'Ananya Verma',
      email: 'ananya@college.edu',
      password: 'student123',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      isApproved: true,
    });

    await StudentProfile.create({
      user: ananyaUser._id,
      rollNumber: '21IT023',
      branch: 'Information Tech (IT)',
      cgpa: 7.6,
      batch: '2026',
      targetRole: 'data_analyst',
      skills: ['Python', 'SQL', 'Excel', 'Pandas', 'Power BI', 'Statistics'],
      projects: [
        {
          title: 'E-Commerce Churn Prediction',
          description: 'Customer segmentation and predictive churn model in Python and Power BI',
          techStack: ['Python', 'Pandas', 'Power BI'],
        },
      ],
      internshipsCount: 1,
      dsaSolved: 60,
      resumeUploaded: true,
      isPlaced: false,
      profileCompletion: 85,
    });

    // Student 4: New Student (0% Score Demo)
    const newUser = await User.create({
      name: 'Aman Gupta',
      email: 'newstudent@college.edu',
      password: 'student123',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
      isApproved: true,
    });

    await StudentProfile.create({
      user: newUser._id,
      rollNumber: '22ECE018',
      branch: 'Electronics (ECE)',
      cgpa: 7.2,
      batch: '2026',
      targetRole: 'sde',
      skills: [],
      projects: [],
      internshipsCount: 0,
      dsaSolved: 0,
      resumeUploaded: false,
      profileCompletion: 30,
    });

    // 3. Create Placement Drives
    console.log('🚀 Creating campus placement drives...');
    const drives = await PlacementDrive.create([
      {
        companyName: 'Amazon India',
        companyRef: companies[0]._id,
        role: 'Software Development Engineer (SDE-1)',
        packageLpa: '₹24.0 LPA',
        packageNumeric: 24.0,
        location: 'Bengaluru / Hyderabad',
        minCgpa: 7.5,
        eligibleBranches: ['Computer Science (CSE)', 'Information Tech (IT)', 'Electronics (ECE)'],
        skillsRequired: ['Data Structures', 'Algorithms', 'Java', 'SQL', 'System Design'],
        rounds: '1 OA (Coding) + 3 Technical Interviews + 1 HR Round',
        deadline: '30 November 2026',
        status: 'active',
        logoBadge: '🛒',
        companyImage: companies[0].coverImage,
        createdBy: adminUser._id,
        createdByRole: 'admin',
      },
      {
        companyName: 'TCS Digital',
        companyRef: companies[1]._id,
        role: 'Digital Systems Engineer',
        packageLpa: '₹7.5 LPA',
        packageNumeric: 7.5,
        location: 'Pan India',
        minCgpa: 6.8,
        eligibleBranches: ['Computer Science (CSE)', 'Information Tech (IT)', 'Electronics (ECE)', 'Electrical (EE)'],
        skillsRequired: ['Python', 'Java', 'SQL', 'Aptitude', 'Data Structures'],
        rounds: 'National Qualifier Test (NQT) + Tech Interview + HR',
        deadline: '25 November 2026',
        status: 'active',
        logoBadge: '💻',
        companyImage: companies[1].coverImage,
        createdBy: adminUser._id,
        createdByRole: 'admin',
      },
      {
        companyName: 'Deloitte USI',
        companyRef: companies[2]._id,
        role: 'Associate Analyst Trainee',
        packageLpa: '₹8.2 LPA',
        packageNumeric: 8.2,
        location: 'Gurugram / Mumbai',
        minCgpa: 7.0,
        eligibleBranches: ['Computer Science (CSE)', 'Information Tech (IT)', 'Electronics (ECE)'],
        skillsRequired: ['SQL', 'Excel', 'Python', 'Power BI'],
        rounds: 'Aptitude Screening + SQL Case Study + Partner Interview',
        deadline: '05 December 2026',
        status: 'active',
        logoBadge: '📊',
        companyImage: companies[2].coverImage,
        createdBy: adminUser._id,
        createdByRole: 'admin',
      },
      {
        companyName: 'Infosys',
        companyRef: companies[3]._id,
        role: 'Specialist Programmer (SP)',
        packageLpa: '₹9.5 LPA',
        packageNumeric: 9.5,
        location: 'Bengaluru / Pune',
        minCgpa: 7.0,
        eligibleBranches: ['Computer Science (CSE)', 'Information Tech (IT)'],
        skillsRequired: ['Data Structures', 'Python', 'C++', 'Algorithms'],
        rounds: 'HackWithInfy Coding Screener + Technical Interview',
        deadline: '10 December 2026',
        status: 'upcoming',
        logoBadge: '🌐',
        companyImage: companies[3].coverImage,
        createdBy: adminUser._id,
        createdByRole: 'admin',
      },
      {
        companyName: 'Razorpay',
        companyRef: companies[4]._id,
        role: 'Frontend Software Engineer',
        packageLpa: '₹14.0 LPA',
        packageNumeric: 14.0,
        location: 'Bengaluru (Hybrid)',
        minCgpa: 7.2,
        eligibleBranches: ['Computer Science (CSE)', 'Information Tech (IT)', 'Electronics (ECE)'],
        skillsRequired: ['React', 'JavaScript', 'HTML', 'CSS', 'Git', 'REST APIs'],
        rounds: 'Take-home React Architecture Assignment + Live Technical Defense',
        deadline: '15 December 2026',
        status: 'active',
        logoBadge: '💳',
        companyImage: companies[4].coverImage,
        createdBy: adminUser._id,
        createdByRole: 'admin',
      },
    ]);

    // 4. Create Job Posting from Recruiter
    console.log('💼 Creating recruiter job postings...');
    await JobPosting.create({
      recruiterRef: recruiterUser._id,
      companyRef: companies[0]._id,
      companyName: 'Amazon India',
      title: 'Cloud Support Associate',
      description: 'Provide technical assistance and architectural guidance on AWS cloud services.',
      packageLpa: '₹12.0 LPA',
      location: 'Hyderabad',
      minCgpa: 7.0,
      eligibleBranches: ['Computer Science (CSE)', 'Information Tech (IT)'],
      skillsRequired: ['Linux', 'Networking', 'Python', 'AWS Basics'],
      deadline: '20 December 2026',
      status: 'active',
    });

    // 5. Create Sample Applications
    console.log('📝 Creating sample student applications...');
    await Application.create([
      {
        studentRef: rahulUser._id,
        studentProfileRef: rahulProfile._id,
        driveRef: drives[0]._id,
        companyName: 'Amazon India',
        roleTitle: 'Software Development Engineer (SDE-1)',
        packageLpa: '₹24.0 LPA',
        status: 'shortlisted',
        notes: 'Cleared online assessment with 100% score. Scheduled for Tech Round 1.',
      },
      {
        studentRef: rahulUser._id,
        studentProfileRef: rahulProfile._id,
        driveRef: drives[1]._id,
        companyName: 'TCS Digital',
        roleTitle: 'Digital Systems Engineer',
        packageLpa: '₹7.5 LPA',
        status: 'applied',
      },
    ]);

    // 6. Create Announcements
    console.log('📢 Creating placement announcements...');
    await Announcement.create([
      {
        title: '📢 Amazon India SDE-1 Campus Drive Registration Open',
        content: 'Final year CSE and IT students meeting the CGPA cutoff of 7.5 can register via the portal. OA scheduled for next Saturday.',
        author: 'Dr. Rajesh Sharma (TPO)',
        authorRole: 'admin',
        priority: 'high',
        targetAudience: 'all',
        isPinned: true,
      },
      {
        title: '💻 Mandatory Mock Technical Coding Assessment',
        content: 'Placement cell is conducting an online DSA & SQL screening test on Saturday 11:00 AM in Computer Lab 3 & 4.',
        author: 'Placement & Training Cell',
        authorRole: 'admin',
        priority: 'medium',
        targetAudience: 'students',
      },
      {
        title: '📄 Resume Verification Drive Notice',
        content: 'All pre-final and final year candidates must upload their validated PDF resumes on the portal to calculate readiness metrics.',
        author: 'Placement Committee',
        authorRole: 'admin',
        priority: 'low',
        targetAudience: 'students',
      },
    ]);

    console.log('\n======================================================');
    console.log('✅ PlaceReady Database Seeded Successfully!');
    console.log('======================================================');
    console.log('🔑 TEST DEMO CREDENTIALS:');
    console.log('------------------------------------------------------');
    console.log('1. TPO / Admin:');
    console.log('   Email:    admin@placeready.edu');
    console.log('   Password: admin123');
    console.log('------------------------------------------------------');
    console.log('2. Recruiter (Approved):');
    console.log('   Email:    recruiter@amazon.com');
    console.log('   Password: recruiter123');
    console.log('------------------------------------------------------');
    console.log('3. Student (Placed SDE):');
    console.log('   Email:    rahul@college.edu');
    console.log('   Password: student123');
    console.log('------------------------------------------------------');
    console.log('4. New Student (0% Score Demo):');
    console.log('   Email:    newstudent@college.edu');
    console.log('   Password: student123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
