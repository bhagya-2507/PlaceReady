# PlaceReady – Team Contribution & Viva Distribution Report

**Project Title:** PlaceReady – Smart Campus Placement Management Portal  
**Domain:** Enterprise Web Applications / MERN Stack / Placement Informatics  
**Team Size:** 3 Members  
**Academic Year:** 2026  

---

## 👨‍💻 Member 1: Frontend Architecture & UI/UX Design

### Assigned Modules & Components:
1. **Frontend Application Architecture:**
   - Designed modular React 19 structure with Vite, Tailwind CSS, and Lucide Icons.
   - Built responsive TopNavbar with role identity chips, user avatars, and session controls.
   - Implemented animated 0-100% Loading Screen and Welcome Landing Page.
2. **Student Dashboard & AI Diagnostics UI:**
   - Implemented interactive `ReadinessGauge`, `SkillGapCard`, `RecommendationsView`, `WhatIfSimulator`, and `ProfileFineTuner`.
   - Designed student application tracker with real-time status chips (`Applied`, `Shortlisted`, `Selected`).
3. **Viva Defense Documentation Modal:**
   - Created the comprehensive in-app viva defense modal answering examiner questions on tech stack, readiness scoring formula, and data flow.

### Viva Defense Focus Topics:
- Component lifecycle, state management, and props drilling minimization.
- Client-side validation techniques (strict PDF file header `%PDF-` validation).
- UX responsiveness across desktop, tablet, and mobile breakpoints.

---

## 👩‍💻 Member 2: Backend Development, REST APIs & Security

### Assigned Modules & Components:
1. **Express REST API Engine:**
   - Designed 10 dedicated router modules (`/api/auth`, `/api/students`, `/api/recruiters`, `/api/companies`, `/api/drives`, `/api/jobs`, `/api/applications`, `/api/resumes`, `/api/announcements`, `/api/admin`).
   - Implemented standard JSON response wrapper (`ApiResponse.js`) ensuring consistent HTTP status codes.
2. **Authentication & Authorization (RBAC):**
   - Implemented JWT token generation with expiration and secure payload decoding.
   - Engineered `protect` middleware verifying Bearer tokens.
   - Built strict `authorize(...roles)` middleware ensuring students, recruiters, and admins cannot access unauthorized endpoints.
3. **File Upload System & Heuristic Service:**
   - Configured Multer middleware for PDF-only resume uploads (8 MB ceiling).
   - Developed `readinessService.js` implementing the 100-point transparent readiness calculation formula across 5 target roles.

### Viva Defense Focus Topics:
- Password hashing with salt rounds via `bcryptjs`.
- Stateless JWT authentication lifecycle vs session-based cookies.
- REST API design principles, status codes, and centralized error handling middleware.

---

## 👨‍💻 Member 3: Database Engineering, Data Modeling & Full-Stack Integration

### Assigned Modules & Components:
1. **MongoDB Database Architecture (`placeready_db`):**
   - Designed 11 normalized Mongoose models:
     - `User`, `StudentProfile`, `RecruiterProfile`, `Company`, `PlacementDrive`, `JobPosting`, `Application`, `Resume`, `Announcement`, `StudentSkill`, `ReadinessReport`.
   - Defined compound unique indexes (e.g. `studentRef + driveRef`) preventing duplicate drive applications.
2. **Recruiter & Admin Modules Integration:**
   - Built the Corporate Recruiter Dashboard allowing job creation, applicant inspection, and candidate stage transitions (`Shortlist`, `Select`, `Reject`).
   - Integrated TPO Recruiter Verification approval pipeline (`pending` → `approved` / `rejected`).
   - Built CSV export utility generating NAAC/NBA placement accreditation data reports.
3. **Database Seeding & Cross-Platform Orchestration:**
   - Authored `seedData.js` populating demo accounts, companies, drives, and student records for instant evaluation.
   - Integrated Axios interceptors handling automatic Bearer token injection and error interception.

### Viva Defense Focus Topics:
- Schema design, referencing (`ObjectId`), and Mongoose `.populate()`.
- MongoDB indexing strategies for fast candidate filtering and duplicate prevention.
- End-to-end integration between React components and MongoDB collections.

---

## 📊 Summary Contribution Matrix

| Feature | Member 1 | Member 2 | Member 3 |
|---|:---:|:---:|:---:|
| Frontend UI/UX & Tailwind Design | **100%** | - | - |
| Interactive AI Placement Diagnostic Widgets | **100%** | - | - |
| Backend Express Server & Routing | - | **80%** | 20% |
| JWT Authentication & Role-Based Middleware | - | **90%** | 10% |
| Multer PDF Resume File Upload Pipeline | - | **80%** | 20% |
| MongoDB Database Schemas & Indexing | - | 20% | **80%** |
| Recruiter Dashboard & Candidate Pipeline | 30% | - | **70%** |
| Database Seeder Script & Sample Records | - | 20% | **80%** |
| Report Generation & CSV Export | 20% | 20% | **60%** |
| Viva Defense Guide & Documentation | **50%** | 25% | 25% |

---

*This document is prepared as academic project documentation for external examiners and project guides.*
