/**
 * Placement Readiness Diagnostic & Benchmark Service
 * 100% Explainable, transparent scoring system designed for College Viva Defense
 */

const ROLE_BENCHMARKS = {
  sde: {
    id: 'sde',
    title: 'Software Development Engineer (SDE)',
    avgPackage: '₹6.5 - 24 LPA',
    description: 'Builds core software, algorithms, backend architecture, and high-scale services.',
    requiredSkills: ['Data Structures', 'Algorithms', 'Java', 'Python', 'SQL', 'Git', 'System Design'],
    recommendedCgpa: 7.5,
  },
  data_analyst: {
    id: 'data_analyst',
    title: 'Data Analyst / BI Specialist',
    avgPackage: '₹5.0 - 14 LPA',
    description: 'Extracts business insights from raw data, writes complex SQL queries, and builds dashboards.',
    requiredSkills: ['Python', 'SQL', 'Excel', 'Pandas', 'Power BI', 'Statistics', 'Tableau'],
    recommendedCgpa: 7.0,
  },
  web_dev: {
    id: 'web_dev',
    title: 'Full Stack Web Developer',
    avgPackage: '₹5.5 - 16 LPA',
    description: 'Designs responsive modern frontends and builds scalable REST API backends.',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Git'],
    recommendedCgpa: 6.8,
  },
  devops: {
    id: 'devops',
    title: 'DevOps & Site Reliability Engineer',
    avgPackage: '₹7.0 - 18 LPA',
    description: 'Automates CI/CD pipelines, container orchestration, and cloud infrastructure.',
    requiredSkills: ['Linux', 'Docker', 'Kubernetes', 'AWS', 'Git', 'CI/CD', 'Python'],
    recommendedCgpa: 7.0,
  },
  cloud_engineer: {
    id: 'cloud_engineer',
    title: 'Cloud Solutions Architect',
    avgPackage: '₹6.5 - 20 LPA',
    description: 'Designs and manages enterprise distributed applications on AWS and GCP.',
    requiredSkills: ['AWS', 'Linux', 'Networking', 'Python', 'Docker', 'SQL', 'Terraform'],
    recommendedCgpa: 7.2,
  },
};

/**
 * Calculate placement readiness score
 */
function calculateReadiness(studentProfile, targetRoleId = 'sde') {
  const role = ROLE_BENCHMARKS[targetRoleId] || ROLE_BENCHMARKS.sde;
  const studentSkills = studentProfile.skills || [];
  const required = role.requiredSkills;

  // Strict check: If resume is not uploaded, readiness is 0%
  if (!studentProfile.resumeUploaded) {
    return {
      totalScore: 0,
      status: 'Resume Pending (0%)',
      badgeColor: 'rose',
      resumeMissing: true,
      roleInfo: role,
      matchedSkills: [],
      missingSkills: required,
      breakdown: {
        cgpaScore: 0,
        cgpaMax: 35,
        skillsScore: 0,
        skillsMax: 35,
        projectsScore: 0,
        projectsMax: 15,
        internshipsScore: 0,
        internshipsMax: 15,
      },
      recommendations: [
        {
          priority: 'Critical',
          title: 'Upload Official Resume PDF',
          description: 'Upload your verified technical resume to unlock skill extraction and company applications.',
          resource: 'Go to Resume tab in Student Dashboard',
        },
      ],
    };
  }

  // 1. CGPA points (Max 35)
  const cgpa = Number(studentProfile.cgpa) || 7.0;
  const cgpaPoints = Math.min(35, Math.round((cgpa / 10) * 35));

  // 2. Skill Match points (Max 35)
  const matchedSkills = required.filter((reqSkill) =>
    studentSkills.some((s) => s.toLowerCase() === reqSkill.toLowerCase())
  );
  const missingSkills = required.filter(
    (reqSkill) => !studentSkills.some((s) => s.toLowerCase() === reqSkill.toLowerCase())
  );
  const skillPoints = Math.round((matchedSkills.length / required.length) * 35);

  // 3. Project points (Max 15 - 5 points per project up to 3 projects)
  const projectsCount = studentProfile.projects ? studentProfile.projects.length : 0;
  const projectPoints = Math.min(15, projectsCount * 5);

  // 4. Internship points (Max 15)
  const internshipsCount = Number(studentProfile.internshipsCount) || 0;
  const internshipPoints = internshipsCount > 0 ? 15 : 0;

  // Total Score (0 - 100)
  const totalScore = Math.min(100, cgpaPoints + skillPoints + projectPoints + internshipPoints);

  // Status classification
  let status = '';
  let badgeColor = '';
  if (totalScore >= 75) {
    status = 'Placement Ready (High Shortlisting Probability)';
    badgeColor = 'emerald';
  } else if (totalScore >= 55) {
    status = 'Moderate Readiness (Competitive for Campus Drives)';
    badgeColor = 'blue';
  } else {
    status = 'Needs Technical Preparation (Low Probability)';
    badgeColor = 'rose';
  }

  // Recommendations
  const recommendations = [];
  if (missingSkills.length > 0) {
    recommendations.push({
      priority: 'High',
      title: `Learn Missing Target Skills: ${missingSkills.slice(0, 3).join(', ')}`,
      description: `Target role '${role.title}' requires strong proficiency in ${missingSkills.join(', ')}.`,
      resource: 'FreeCodeCamp / Coursera / Official Docs',
    });
  }

  if (projectsCount < 2) {
    recommendations.push({
      priority: 'High',
      title: 'Build at least 2 Portfolio Projects with Live Demos',
      description: 'Host projects on GitHub with clean README, live deployment URL, and API integrations.',
      resource: 'Vercel / Render / GitHub Pages',
    });
  }

  if (internshipsCount === 0) {
    recommendations.push({
      priority: 'Medium',
      title: 'Gain Industrial / Open-Source Internship Experience',
      description: 'Contribute to open source or complete a virtual internship on Forage to earn 15 points.',
      resource: 'TheForage / Internshala / Summer Internships',
    });
  }

  return {
    totalScore,
    status,
    badgeColor,
    resumeMissing: false,
    roleInfo: role,
    matchedSkills,
    missingSkills,
    breakdown: {
      cgpaScore: cgpaPoints,
      cgpaMax: 35,
      skillsScore: skillPoints,
      skillsMax: 35,
      projectsScore: projectPoints,
      projectsMax: 15,
      internshipsScore: internshipPoints,
      internshipsMax: 15,
    },
    recommendations,
  };
}

module.exports = {
  ROLE_BENCHMARKS,
  calculateReadiness,
};
