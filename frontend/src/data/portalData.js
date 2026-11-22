/**
 * Simple, Realistic College Placement Portal Data.
 * Zero complex ML formulas - Clean, intuitive, transparent points system!
 */

export const INITIAL_STUDENTS = [
  {
    id: "std-1",
    name: "Rahul Sharma",
    roll: "21CSE085",
    branch: "Computer Science (CSE)",
    cgpa: 8.2,
    email: "rahul.sharma@college.edu",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
    skills: ["Java", "Python", "SQL", "React", "Data Structures", "Git"],
    targetRole: "sde",
    internships: 1,
    projects: 3,
    dsaSolved: 180,
    placed: false,
    placedCompany: null,
    appliedJobIds: ["drive-1", "drive-2"],
    resumeUploaded: true,
    resumeFileName: "Rahul_Sharma_Resume.pdf"
  },
  {
    id: "std-2",
    name: "Priya Patel",
    roll: "21CSE042",
    branch: "Computer Science (CSE)",
    cgpa: 8.9,
    email: "priya.patel@college.edu",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    skills: ["C++", "Java", "Python", "Data Structures", "SQL", "Git", "Docker"],
    targetRole: "sde",
    internships: 2,
    projects: 4,
    dsaSolved: 320,
    placed: true,
    placedCompany: "Amazon (SDE-1)",
    appliedJobIds: ["drive-1"],
    resumeUploaded: true,
    resumeFileName: "Priya_Patel_Resume.pdf"
  },
  {
    id: "std-3",
    name: "Ananya Verma",
    roll: "21IT023",
    branch: "Information Tech (IT)",
    cgpa: 7.6,
    email: "ananya.verma@college.edu",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    skills: ["Python", "SQL", "Excel", "Pandas", "Power BI", "Statistics"],
    targetRole: "data_analyst",
    internships: 1,
    projects: 2,
    dsaSolved: 60,
    placed: false,
    placedCompany: null,
    appliedJobIds: ["drive-3"],
    resumeUploaded: true,
    resumeFileName: "Ananya_Verma_Resume.pdf"
  },
  {
    id: "std-4",
    name: "Vikram Singh",
    roll: "21ECE014",
    branch: "Electronics (ECE)",
    cgpa: 6.9,
    email: "vikram.singh@college.edu",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
    skills: ["HTML", "CSS", "JavaScript", "React", "Git"],
    targetRole: "web_dev",
    internships: 0,
    projects: 1,
    dsaSolved: 30,
    placed: false,
    placedCompany: null,
    appliedJobIds: ["drive-2"],
    resumeUploaded: true,
    resumeFileName: "Vikram_Singh_Resume.pdf"
  },
  {
    id: "std-5",
    name: "Sneha Roy",
    roll: "21CSE112",
    branch: "Computer Science (CSE)",
    cgpa: 7.9,
    email: "sneha.roy@college.edu",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80",
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express", "REST APIs", "Git"],
    targetRole: "web_dev",
    internships: 1,
    projects: 3,
    dsaSolved: 120,
    placed: true,
    placedCompany: "TCS Digital",
    appliedJobIds: ["drive-2", "drive-5"],
    resumeUploaded: true,
    resumeFileName: "Sneha_Roy_Resume.pdf"
  }
];

export const DEMO_TEACHER = {
  name: "Dr. Rajesh Sharma",
  title: "Professor & Head of Training & Placement (TPO)",
  department: "Training & Placement Cell, College of Engineering",
  email: "tpo@college.edu",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
};

export const INITIAL_DRIVES = [
  {
    id: "drive-1",
    company: "Amazon",
    logoBadge: "🛒",
    role: "Software Development Engineer (SDE-1)",
    packageLpa: "₹24.0 LPA",
    location: "Bengaluru / Hyderabad",
    minCgpa: 7.5,
    eligibleBranches: ["CSE", "IT", "ECE"],
    deadline: "15 November 2026",
    skillsRequired: ["Data Structures", "Algorithms", "Java", "SQL"],
    status: "Active Registration",
    rounds: "1 OA (Coding) + 3 Technical + 1 HR",
    companyImage: "https://images.unsplash.com/photo-1523474253243-231a5476a6d6?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "drive-2",
    company: "TCS Digital",
    logoBadge: "💻",
    role: "Digital Systems Engineer",
    packageLpa: "₹7.5 LPA",
    location: "Pan India",
    minCgpa: 6.8,
    eligibleBranches: ["All Branches"],
    deadline: "20 November 2026",
    skillsRequired: ["Python", "Java", "SQL", "Aptitude"],
    status: "Active Registration",
    rounds: "National Qualifier Test (NQT) + Tech Interview + HR",
    companyImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "drive-3",
    company: "Deloitte",
    logoBadge: "📊",
    role: "Associate Analyst Trainee",
    packageLpa: "₹8.2 LPA",
    location: "Gurugram / Mumbai",
    minCgpa: 7.0,
    eligibleBranches: ["CSE", "IT", "ECE"],
    deadline: "25 November 2026",
    skillsRequired: ["SQL", "Excel", "Python", "Power BI"],
    status: "Active Registration",
    rounds: "Aptitude + SQL Case Study + Partner Interview",
    companyImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "drive-4",
    company: "Infosys",
    logoBadge: "🌐",
    role: "Specialist Programmer (SP)",
    packageLpa: "₹9.5 LPA",
    location: "Bengaluru / Pune",
    minCgpa: 7.0,
    eligibleBranches: ["CSE", "IT"],
    deadline: "30 November 2026",
    skillsRequired: ["Data Structures", "Python", "C++", "Algorithms"],
    status: "Upcoming Next Week",
    rounds: "HackWithInfy Coding Screener + Technical Interview",
    companyImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "drive-5",
    company: "Razorpay",
    logoBadge: "💳",
    role: "Frontend Software Engineer",
    packageLpa: "₹14.0 LPA",
    location: "Bengaluru (Hybrid)",
    minCgpa: 7.2,
    eligibleBranches: ["CSE", "IT", "ECE"],
    deadline: "05 December 2026",
    skillsRequired: ["React", "JavaScript", "HTML", "CSS", "Git"],
    status: "Shortlisting Soon",
    rounds: "Take-home React Assignment + Live Architecture Defense",
    companyImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80"
  }
];

export const TARGET_ROLES = {
  sde: {
    id: "sde",
    title: "Software Development Engineer (SDE)",
    avgPackage: "₹6.5 - 18 LPA",
    description: "Builds core software, algorithms, backend systems, and database architecture.",
    requiredSkills: ["Data Structures", "Algorithms", "Java", "Python", "SQL", "Git"],
    recommendedCgpa: 7.5,
    minProjects: 2,
    minInternship: 1
  },
  data_analyst: {
    id: "data_analyst",
    title: "Data Analyst / BI Specialist",
    avgPackage: "₹5.0 - 12 LPA",
    description: "Extracts business insights from raw data, writes SQL queries, and builds dashboards.",
    requiredSkills: ["Python", "SQL", "Excel", "Pandas", "Power BI", "Statistics"],
    recommendedCgpa: 7.0,
    minProjects: 2,
    minInternship: 1
  },
  web_dev: {
    id: "web_dev",
    title: "Full Stack Web Developer",
    avgPackage: "₹5.5 - 14 LPA",
    description: "Designs attractive web frontends and builds scalable REST API backends.",
    requiredSkills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Git", "SQL"],
    recommendedCgpa: 6.8,
    minProjects: 2,
    minInternship: 1
  }
};

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: "ann-1",
    title: "📢 TCS Digital Campus Drive Registration Open",
    date: "Today, 10:30 AM",
    author: "Training & Placement Cell",
    content: "All final year B.Tech students with CGPA >= 6.8 can register for TCS Digital via the Placement Portal before Friday 5:00 PM."
  },
  {
    id: "ann-2",
    title: "💻 Mock Technical Coding Test Scheduled for Saturday",
    date: "Yesterday",
    author: "Prof. Rajesh Sharma (TPO)",
    content: "A 90-minute online coding screening round (DSA & SQL) will be conducted in Computer Lab 3 & 4 on Saturday at 11:00 AM."
  },
  {
    id: "ann-3",
    title: "📄 Mandatory Resume Verification Deadline",
    date: "2 days ago",
    author: "Placement Committee",
    content: "Please ensure your skills and project links on your student profile are verified before upcoming company drives."
  }
];

// Simple, Understandable Placement Readiness Score Calculation (Out of 100)
// No complex formulas - Just 4 clear, logical criteria:
// 1. CGPA Score: Up to 35 Points
// 2. Skills Match: Up to 35 Points
// 3. Projects Count: Up to 15 Points (5 pts per project, max 15)
// 4. Internship: 15 Points if completed, 0 if not
export function calculateSimpleReadiness(student, targetRoleId = "sde") {
  const role = TARGET_ROLES[targetRoleId] || TARGET_ROLES.sde;
  const studentSkills = student.skills || [];
  const required = role.requiredSkills;

  // IF NO RESUME UPLOADED -> SCORE IS STRICTLY 0%
  if (!student.resumeUploaded) {
    return {
      totalScore: 0,
      status: "Resume Not Uploaded (0%)",
      badgeColor: "rose",
      resumeMissing: true,
      matchedSkills: [],
      missingSkills: required,
      breakdown: [
        { name: "Academic CGPA", score: 0, max: 35, detail: "Upload Resume to Verify" },
        { name: "Technical Skills Match", score: 0, max: 35, detail: "0 Skills Verified" },
        { name: "Projects Built", score: 0, max: 15, detail: "0 Verified Projects" },
        { name: "Work Internship", score: 0, max: 15, detail: "Pending Verification" }
      ]
    };
  }

  // 1. CGPA points (Max 35)
  const cgpa = Number(student.cgpa) || 7.0;
  const cgpaPoints = Math.min(35, Math.round((cgpa / 10) * 35));

  // 2. Skill Match points (Max 35)
  const matchedSkills = required.filter(skill =>
    studentSkills.some(s => s.toLowerCase() === skill.toLowerCase())
  );
  const missingSkills = required.filter(skill =>
    !studentSkills.some(s => s.toLowerCase() === skill.toLowerCase())
  );
  const skillPoints = Math.round((matchedSkills.length / required.length) * 35);

  // 3. Project points (Max 15 - 5 points per project up to 3 projects)
  const projectCount = Number(student.projects) || 0;
  const projectPoints = Math.min(15, projectCount * 5);

  // 4. Internship points (Max 15)
  const internshipCount = Number(student.internships) || 0;
  const internshipPoints = internshipCount > 0 ? 15 : 0;

  // Total Score (0 - 100)
  const totalScore = Math.min(100, cgpaPoints + skillPoints + projectPoints + internshipPoints);

  // Status classification
  let status = "";
  let badgeColor = "";
  if (totalScore >= 75) {
    status = "Placement Ready (High Chance)";
    badgeColor = "emerald";
  } else if (totalScore >= 55) {
    status = "Moderate Readiness (Good Chance)";
    badgeColor = "blue";
  } else {
    status = "Needs Preparation (Low Chance)";
    badgeColor = "rose";
  }

  return {
    totalScore,
    status,
    badgeColor,
    resumeMissing: false,
    matchedSkills,
    missingSkills,
    breakdown: [
      { name: "Academic CGPA", score: cgpaPoints, max: 35, detail: `${cgpa.toFixed(1)} / 10 CGPA` },
      { name: "Technical Skills Match", score: skillPoints, max: 35, detail: `${matchedSkills.length} of ${required.length} Skills` },
      { name: "Projects Built", score: projectPoints, max: 15, detail: `${projectCount} Portfolio Project(s)` },
      { name: "Work Internship", score: internshipPoints, max: 15, detail: internshipCount > 0 ? `${internshipCount} Internship(s)` : "None (Missing)" }
    ]
  };
}
