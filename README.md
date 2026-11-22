# PlaceReady – Smart Campus Placement Management Portal (MERN Stack)

**PlaceReady** is a full-stack enterprise campus placement & training portal designed to bridge the gap between graduating students, corporate recruiters, and the college Training & Placement Officer (TPO).

Built with the **MERN Stack** (MongoDB, Express.js, React.js 19, Node.js), PlaceReady features real-time placement readiness scoring, resume verification via NLP heuristics, 3 dedicated role-based portals, placement drives management, candidate pipelines, and comprehensive institutional placement analytics.

---

## 🌟 Key Features & Architectural Highlights

### 1. 🎓 Student Module
- **Live Readiness Engine:** Transparent 100-point diagnostic based on CGPA, verified skills, DSA problem counts, and industry internships.
- **Strict PDF Resume Verification:** Validates genuine academic/technical resumes, rejecting non-PDF or incomplete documents. Automatically extracts technical skills.
- **1-Click Campus Drive Applications:** Direct application tracking (`Applied` → `Shortlisted` → `Selected`).
- **Interactive ML / Placement Lab:** Includes **Readiness Gauge**, **Skill Gap Card**, **What-If Simulator**, **Profile Fine-Tuner**, and **Viva Defense Modal**.

### 2. 🏛️ TPO / Admin Module
- **Institutional KPI Dashboard:** Total students, placement rate, active drives, and hiring pipeline.
- **Student Cohort Directory:** Full-text search and filters (Branch, Placement Status, CGPA) with 1-click status updates.
- **Recruiter Approvals:** Review and verify corporate recruiter accounts before granting access to student data.
- **Placement Drive Management:** Publish and broadcast on-campus and virtual hiring drives.
- **Placement Analytics & CSV Export:** Download comprehensive cohort reports formatted for college accreditation (NAAC/NBA).

### 3. 💼 Corporate Recruiter Module
- **Company Profile Management:** Manage hiring profile, industry, website, and office locations.
- **Job Openings Publisher:** Post opportunities specifying CTC in LPA, CGPA cutoffs, and required skills.
- **Candidate Pipeline:** View eligible student applicants, inspect academic records and verified resumes, and update recruitment status (`Shortlist`, `Select`, `Reject`).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, React Router DOM, Axios, Lucide React Icons |
| **Backend** | Node.js, Express.js, JWT, bcryptjs, Multer, Helmet, CORS, Express Validator |
| **Database** | MongoDB (`placeready_db`), Mongoose ODM |
| **Diagnostic Logic** | Pure JavaScript transparent benchmark calculator (`readinessService.js` / `placementEngine.js`) |

---

## 📂 Project Structure

```text
PlaceReady/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/              # Icons, banners, visuals
│   │   ├── components/          # Reusable UI & Diagnostic components
│   │   ├── context/             # AuthContext.jsx
│   │   ├── services/            # Axios API services (auth, student, admin, recruiter, drive)
│   │   ├── utils/               # Resume PDF validator & helper functions
│   │   ├── App.jsx              # Main router & role switcher
│   │   └── main.jsx             # React entrypoint
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/              # MongoDB database connection
│   │   ├── controllers/         # REST API business logic
│   │   ├── middleware/          # JWT protect, role authorize, Multer upload, error handler
│   │   ├── models/              # 11 Mongoose Schemas (User, StudentProfile, RecruiterProfile, Drive, etc.)
│   │   ├── routes/              # Express API endpoints
│   │   ├── services/            # Readiness diagnostic calculation service
│   │   ├── utils/               # Database seeder & API response wrappers
│   │   ├── app.js               # Express application configuration
│   │   └── server.js            # Node HTTP server startup
│   ├── .env.example
│   └── package.json
│
├── TEAM-CONTRIBUTION.md
└── README.md
```

---

## 🚀 Quick Setup & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB installed locally on `127.0.0.1:27017` or a MongoDB Atlas URI

### 1. Backend Setup
```bash
cd PlaceReady/backend
npm install

# Configure environment variables
# Copy .env.example to .env
# Default PORT=5000, MONGODB_URI=mongodb://127.0.0.1:27017/placeready_db

# Populate database with sample students, admin, recruiter, companies, and drives
node src/utils/seedData.js

# Start backend server
npm run dev
# Server running at: http://localhost:5000
```

### 2. Frontend Setup
```bash
cd PlaceReady/frontend
npm install

# Start Vite dev server
npm run dev
# Frontend running at: http://localhost:5173
```

---

## 🔑 Demo Login Credentials

PlaceReady includes built-in 1-click login buttons on the Sign-In modal, or you can use these seeded credentials:

| Role | Email | Password | Details |
|---|---|---|---|
| **Student (Placed/Active)** | `rahul@college.edu` | `student123` | 82% Readiness, CSE, 8.4 CGPA |
| **Student (New Account)** | `newstudent@college.edu` | `student123` | 0% Readiness (Requires Resume Upload) |
| **TPO / Admin** | `admin@placeready.edu` | `admin123` | Head of Training & Placement Cell |
| **Corporate Recruiter** | `recruiter@amazon.com` | `recruiter123` | Amazon Campus Hiring Lead |

---

## 🎓 Academic Viva Defense Guide

1. **How is the Readiness Score calculated?**
   - The diagnostic runs transparent weighted heuristics:
     - **Verified Technical Skills:** 40%
     - **Academic CGPA:** 25%
     - **Projects & Practical Implementation:** 20%
     - **Internships & Industry Experience:** 15%
   - Avoids "black box" claims so examiners can trace every percentage point.

2. **How does Resume Upload work?**
   - Files are validated against MIME type and `%PDF-` header signature.
   - Genuine resume sections are parsed to extract candidate skills and projects.
   - Clean files are uploaded via Multer to `backend/src/uploads` with database reference tracking.

3. **How is Role-Based Access Control implemented?**
   - Stateless JWT tokens stored in HTTP headers (`Bearer <token>`).
   - Server-side `authorize('admin')`, `authorize('recruiter')`, and `authorize('student')` middleware guarantees users cannot spoof privileges.

---

## 👥 Authors
Developed as a B.Tech College Mini Project by a 3-Member Engineering Team. See [TEAM-CONTRIBUTION.md](./TEAM-CONTRIBUTION.md) for individual module assignments.
