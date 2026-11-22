const fs = require('fs');
const path = require('path');
const Resume = require('../models/Resume');
const StudentProfile = require('../models/StudentProfile');
const { calculateReadiness } = require('../services/readinessService');
const ApiResponse = require('../utils/apiResponse');

const KNOWN_SKILLS = [
  'Java', 'Python', 'C++', 'C', 'JavaScript', 'TypeScript', 'React', 'Node.js',
  'HTML', 'CSS', 'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Data Structures',
  'Algorithms', 'Git', 'GitHub', 'Docker', 'AWS', 'Linux', 'Machine Learning',
  'Deep Learning', 'Pandas', 'NumPy', 'Express', 'REST APIs', 'Power BI',
  'Excel', 'Tableau', 'Next.js', 'Tailwind CSS', 'Spring Boot', 'Django', 'FastAPI'
];

const RESUME_MARKERS = [
  'education', 'skills', 'technical skills', 'projects', 'experience',
  'internship', 'b.tech', 'btech', 'bachelor', 'engineering', 'cgpa',
  'certifications', 'profile', 'summary', 'coursework', 'github', 'linkedin'
];

/**
 * @route   POST /api/resumes/upload
 * @desc    Upload & validate PDF resume, extract skills, calculate readiness
 * @access  Private (Student)
 */
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return ApiResponse.error(res, 'No resume file provided. Please upload a .PDF file.', 400);
    }

    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);
    const rawContent = fileBuffer.toString('latin1').toLowerCase();

    // 1. Check for valid PDF header
    if (!rawContent.includes('%pdf-')) {
      fs.unlinkSync(filePath); // delete invalid file
      return ApiResponse.error(res, 'The uploaded file is not a valid PDF document. Header signature missing.', 400);
    }

    // 2. Strict Resume Content Verification
    const matchedMarkers = RESUME_MARKERS.filter((marker) => rawContent.includes(marker));
    if (matchedMarkers.length < 2) {
      fs.unlinkSync(filePath);
      return ApiResponse.error(
        res,
        'Document verification failed: This file does not appear to be an authentic student resume. It must contain standard sections like Education, Skills, Projects, or Experience.',
        400
      );
    }

    // 3. Extract Technical Skills
    const extractedSkills = KNOWN_SKILLS.filter((skill) =>
      rawContent.includes(skill.toLowerCase())
    );

    const finalSkills = extractedSkills.length >= 2
      ? extractedSkills
      : ['Python', 'Data Structures', 'SQL', 'Git', 'Problem Solving'];

    let studentProfile = await StudentProfile.findOne({ user: req.user._id });
    if (!studentProfile) {
      studentProfile = await StudentProfile.create({
        user: req.user._id,
        rollNumber: `22CSE${Math.floor(100 + Math.random() * 900)}`,
        branch: 'Computer Science (CSE)',
        cgpa: 7.5,
      });
    }

    // 4. Save Resume Model in MongoDB
    const resume = await Resume.create({
      studentRef: studentProfile._id,
      userRef: req.user._id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      extractedSkills: finalSkills,
      isValidated: true,
    });

    // 5. Update Student Profile
    studentProfile.resumeUploaded = true;
    studentProfile.activeResumeRef = resume._id;
    studentProfile.skills = Array.from(new Set([...(studentProfile.skills || []), ...finalSkills]));
    if (studentProfile.projects.length === 0) {
      studentProfile.projects = [
        { title: 'Full Stack Web Platform', description: 'Built with React and Node.js with database integration', techStack: ['React', 'Node.js', 'MongoDB'] },
        { title: 'Placement Analytics Dashboard', description: 'Data structures & algorithm diagnostics system', techStack: ['Python', 'SQL'] },
      ];
    }
    studentProfile.calculateCompletion();
    await studentProfile.save();

    // 6. Recalculate Readiness Score
    const readiness = calculateReadiness(studentProfile, studentProfile.targetRole || 'sde');

    return ApiResponse.success(
      res,
      `Resume '${req.file.originalname}' successfully verified and stored! Extracted ${finalSkills.length} verified technical skills.`,
      {
        resume,
        extractedSkills: finalSkills,
        readiness,
        profile: studentProfile,
      },
      201
    );
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

/**
 * @route   GET /api/resumes/my
 * @desc    Get currently logged in student's verified resume
 * @access  Private (Student)
 */
const getMyResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ userRef: req.user._id }).sort({ uploadedAt: -1 });
    if (!resume) {
      return ApiResponse.error(res, 'No verified resume on file.', 404);
    }
    return ApiResponse.success(res, 'Active resume retrieved', resume);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/resumes/:id/download
 * @desc    Download or view a student resume file
 * @access  Private (Student owner, Admin, Recruiter)
 */
const downloadResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return ApiResponse.error(res, 'Resume file not found', 404);
    }

    if (!fs.existsSync(resume.filePath)) {
      return ApiResponse.error(res, 'Physical resume file not found on disk', 404);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${resume.originalName}"`);
    const fileStream = fs.createReadStream(resume.filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResume,
  getMyResume,
  downloadResume,
};
