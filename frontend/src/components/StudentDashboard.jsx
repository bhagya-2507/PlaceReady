import React, { useState, useRef } from "react";
import {
  GraduationCap,
  Award,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  FolderGit2,
  BookOpen,
  Code2,
  Plus,
  X,
  Building2,
  ArrowRight,
  TrendingUp,
  FileText,
  Calendar,
  Sparkles,
  HelpCircle,
  Clock,
  ExternalLink,
  Upload,
  FileCheck,
  AlertCircle,
  Lock,
  RefreshCw
} from "lucide-react";
import { TARGET_ROLES, calculateSimpleReadiness } from "../data/portalData";
import { validateAndParseResumePdf } from "../utils/resumeValidator";

export default function StudentDashboard({
  student,
  onUpdateStudent,
  drives = [],
  onApplyDrive,
  announcements = []
}) {
  const [activeTab, setActiveTab] = useState("readiness"); // "readiness" | "resume" | "drives" | "profile" | "prep"
  const [targetRole, setTargetRole] = useState(student.targetRole || "sde");
  const [newSkill, setNewSkill] = useState("");

  // Resume upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef(null);

  // Calculate readiness score
  const readiness = calculateSimpleReadiness(student, targetRole);
  const currentRoleInfo = TARGET_ROLES[targetRole] || TARGET_ROLES.sde;

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const trimmed = newSkill.trim();
    const currentSkills = student.skills || [];
    if (!currentSkills.includes(trimmed)) {
      onUpdateStudent({
        ...student,
        skills: [...currentSkills, trimmed]
      });
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    onUpdateStudent({
      ...student,
      skills: (student.skills || []).filter((s) => s !== skillToRemove)
    });
  };

  // Handle PDF Resume Upload with Strict Verification
  const handleResumeFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const result = await validateAndParseResumePdf(file);

      if (!result.valid) {
        setUploadError(result.message);
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // Valid Resume -> Extract skills and update student data!
      const updatedStudent = {
        ...student,
        resumeUploaded: true,
        resumeFileName: result.fileName,
        resumeUploadedAt: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric"
        }),
        skills: Array.from(new Set([...(student.skills || []), ...(result.extractedSkills || [])])),
        projects: Math.max(student.projects || 0, result.projectsCount || 2),
        internships: Math.max(student.internships || 0, result.internshipsCount || 0)
      };

      onUpdateStudent(updatedStudent);
      setUploadSuccess(
        `Resume "${result.fileName}" successfully verified! Extracted ${result.extractedSkills?.length || 0} technical skills. Placement readiness score calculated!`
      );
    } catch (err) {
      setUploadError("Error verifying resume. Please ensure file is a readable PDF.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* 1. STUDENT PROFILE WELCOME BANNER */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-4">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{student.name}</h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {student.roll}
              </span>
              {student.resumeUploaded ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <FileCheck className="w-3 h-3" /> Resume Verified
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Resume Required
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {student.branch} &bull; Email: <span className="text-slate-300">{student.email}</span>
            </p>
            <div className="flex items-center gap-3 text-xs pt-1">
              <span className="text-slate-300 font-semibold">
                CGPA: <strong className="text-indigo-400 font-mono text-sm">{student.cgpa}</strong> / 10
              </span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-slate-300 font-semibold">
                Projects: <strong className="text-emerald-400 font-mono">{student.projects || 0}</strong>
              </span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-slate-300 font-semibold">
                Internships: <strong className="text-sky-400 font-mono">{student.internships || 0}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Readiness Badge Header */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left md:text-right space-y-1 shrink-0">
          <span className="text-[11px] text-slate-400 block uppercase tracking-wider font-medium">
            Overall Placement Status
          </span>
          <div className="flex items-center md:justify-end gap-2">
            <span className={`text-2xl font-black font-mono ${student.resumeUploaded ? "text-emerald-400" : "text-slate-400"}`}>
              {readiness.totalScore}%
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded border ${
                student.resumeUploaded
                  ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/40"
                  : "bg-rose-950/60 text-rose-300 border-rose-800/40"
              }`}
            >
              {student.resumeUploaded ? readiness.status.split(" ")[0] : "Resume Pending"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. PROMINENT RESUME PENDING ALERT (If New Account without Resume) */}
      {!student.resumeUploaded && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Upload className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-white">
                Official Resume PDF Not Uploaded (Readiness Score is 0%)
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                As a new student, your readiness score remains <strong>0%</strong> until your resume is uploaded and validated. Our system will automatically verify your PDF and extract skills, projects, and CGPA metrics.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("resume")}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Resume PDF Now</span>
          </button>
        </div>
      )}

      {/* 3. NAVIGATION TABS */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab("readiness")}
          className={`flex-1 min-w-[140px] py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "readiness"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Readiness Score ({readiness.totalScore}%)</span>
        </button>

        <button
          onClick={() => setActiveTab("resume")}
          className={`flex-1 min-w-[140px] py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "resume"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Resume & Verification {student.resumeUploaded ? "✓" : "(!)"}</span>
        </button>

        <button
          onClick={() => setActiveTab("drives")}
          className={`flex-1 min-w-[140px] py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "drives"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Company Drives ({drives.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 min-w-[140px] py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "profile"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Skills & Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("prep")}
          className={`flex-1 min-w-[140px] py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "prep"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Interview Prep Checklist</span>
        </button>
      </div>

      {/* 4. TAB CONTENT */}

      {/* TAB A: READINESS SCORE METER */}
      {activeTab === "readiness" && (
        <div className="space-y-6">
          {/* Target Role Selector */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Target Placement Track:
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Role benchmarks calculate your score according to specific industry requirements.
              </p>
            </div>

            <div className="flex gap-2">
              {Object.values(TARGET_ROLES).map((role) => (
                <button
                  key={role.id}
                  onClick={() => setTargetRole(role.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    targetRole === role.id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-bold"
                      : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {role.title.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Big Score Card */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Circular Gauge */}
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-slate-800"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="56"
                    stroke={student.resumeUploaded ? "#10b981" : "#f43f5e"}
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 56}
                    strokeDashoffset={(2 * Math.PI * 56) * (1 - readiness.totalScore / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span
                    className={`text-3xl font-black font-mono ${
                      student.resumeUploaded ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {readiness.totalScore}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                    {student.resumeUploaded ? "Ready" : "Pending"}
                  </span>
                </div>
              </div>

              {/* Status Explanation */}
              <div className="space-y-2 text-center sm:text-left flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Target Track: {currentRoleInfo.title} ({currentRoleInfo.avgPackage})
                </span>
                <h3 className="text-xl font-bold text-white">{readiness.status}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {!student.resumeUploaded
                    ? "Your score is 0% because no resume has been uploaded yet. Please upload your academic/technical resume PDF in the 'Resume & Verification' tab to calculate your readiness."
                    : readiness.totalScore >= 75
                    ? "Outstanding! Your verified profile meets the shortlisting criteria for Day-1 companies like Amazon and TCS Digital. Focus on mock interview rounds and behavioral preparation."
                    : readiness.totalScore >= 55
                    ? "Good foundation! You are competitive for standard campus drives. Adding 1-2 missing skills below will boost your readiness above 80%."
                    : "You are currently at risk of missing initial company shortlisting cutoffs. Add the missing skills and build 1 portfolio project to quickly improve your score."}
                </p>

                {!student.resumeUploaded && (
                  <button
                    onClick={() => setActiveTab("resume")}
                    className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Resume to Unlock Score</span>
                  </button>
                )}
              </div>
            </div>

            {/* 4 Logical Criteria Breakdown */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                How Your {readiness.totalScore}% Score is Calculated (100 Points Breakdown):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {readiness.breakdown.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">{item.name}</span>
                      <span className="font-mono font-bold text-indigo-400">
                        {item.score} / {item.max} pts
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${(item.score / item.max) * 100}%` }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full"
                      />
                    </div>

                    <span className="text-[11px] text-slate-500 font-mono block">{item.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing vs Matched Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Matched */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Skills You Have ({readiness.matchedSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {readiness.matchedSkills.length > 0 ? (
                    readiness.matchedSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">None extracted yet (Upload resume).</span>
                  )}
                </div>
              </div>

              {/* Missing */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-2">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Recommended Skills to Learn ({readiness.missingSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {readiness.missingSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-950/60 text-rose-300 border border-rose-800/40"
                    >
                      + {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: RESUME UPLOAD & STRICT VERIFICATION */}
      {activeTab === "resume" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-400" />
                Official Resume PDF Verification & Skill Extraction
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Upload your engineering resume in PDF format. The system verifies that the file is an authentic academic/technical resume and extracts your verified skills, projects, and work experience.
              </p>
            </div>

            {/* Current Resume Status Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                    student.resumeUploaded
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                  }`}
                >
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">
                      {student.resumeUploaded ? student.resumeFileName : "No Resume Uploaded"}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        student.resumeUploaded
                          ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                          : "bg-rose-950/60 text-rose-300 border border-rose-800/40"
                      }`}
                    >
                      {student.resumeUploaded ? "VERIFIED" : "PENDING (0%)"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {student.resumeUploaded
                      ? `Verified on ${student.resumeUploadedAt || "Current Session"} • Readiness score active`
                      : "Upload a valid PDF resume to calculate your score"}
                  </p>
                </div>
              </div>

              {student.resumeUploaded && (
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Extracted Skills</span>
                  <span className="text-sm font-bold font-mono text-indigo-400">
                    {(student.skills || []).length} Verified
                  </span>
                </div>
              )}
            </div>

            {/* Alerts */}
            {uploadError && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Resume Verification Failed:</strong>
                  <span>{uploadError}</span>
                </div>
              </div>
            )}

            {uploadSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Verification Successful:</strong>
                  <span>{uploadSuccess}</span>
                </div>
              </div>
            )}

            {/* Upload Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-3xl p-8 text-center cursor-pointer transition-all bg-slate-950/50 hover:bg-indigo-950/10 space-y-3 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleResumeFileChange}
                className="hidden"
              />

              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20 group-hover:scale-110 transition-transform">
                {uploading ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
                ) : (
                  <Upload className="w-6 h-6 text-indigo-400" />
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-bold text-white">
                  {uploading ? "Analyzing & Verifying PDF Content..." : "Click or Drag to Upload Official Resume PDF"}
                </p>
                <p className="text-xs text-slate-400">
                  Strictly accepts <strong>.PDF</strong> format (5 KB - 8 MB). Checks for Education, Skills, and Projects sections.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                <span>Anti-Spam Filter: Random non-resume PDFs will be rejected</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB C: COMPANY DRIVES */}
      {activeTab === "drives" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Campus Recruitment Openings ({drives.length} Companies)
            </h3>
            <span className="text-xs text-slate-400">
              {student.resumeUploaded
                ? "Click Register to submit your verified profile"
                : "⚠️ Upload resume to unlock drive registration"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drives.map((drive) => {
              const isApplied = student.appliedJobIds?.includes(drive.id);
              const isEligible = student.cgpa >= drive.minCgpa;

              return (
                <div
                  key={drive.id}
                  className="rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between overflow-hidden hover:border-slate-700 transition-all shadow-md group"
                >
                  {/* Company Photo Header */}
                  {drive.companyImage && (
                    <div className="relative h-28 w-full overflow-hidden border-b border-slate-800/80">
                      <img
                        src={drive.companyImage}
                        alt={drive.company}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                      <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded border border-slate-700">
                          {drive.location}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-emerald-800/50">
                          {drive.packageLpa}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{drive.logoBadge}</span>
                        <div>
                          <h4 className="text-base font-bold text-white">{drive.company}</h4>
                          <span className="text-xs text-slate-400">{drive.role}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Min CGPA Required</span>
                          <span className="font-bold text-white">{drive.minCgpa} / 10</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Registration Deadline</span>
                          <span className="font-bold text-amber-400">{drive.deadline}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">Required Tech Skills:</span>
                        <div className="flex flex-wrap gap-1">
                          {drive.skillsRequired.map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded text-[11px] bg-slate-950 text-slate-300 border border-slate-800">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        {!student.resumeUploaded ? (
                          <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" /> Resume Required
                          </span>
                        ) : isEligible ? (
                          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Eligible to Apply
                          </span>
                        ) : (
                          <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> CGPA Below {drive.minCgpa}
                          </span>
                        )}
                      </div>

                      {isApplied ? (
                        <span className="px-4 py-2 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                        </span>
                      ) : !student.resumeUploaded ? (
                        <button
                          onClick={() => setActiveTab("resume")}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                        >
                          Upload Resume to Apply
                        </button>
                      ) : isEligible ? (
                        <button
                          onClick={() => onApplyDrive(drive.id)}
                          className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                        >
                          Register for Drive
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-500 text-xs font-semibold cursor-not-allowed"
                        >
                          Not Eligible
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB D: UPDATE SKILLS & PROFILE */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
            <h3 className="text-base font-bold text-white">Manual Skill Inventory</h3>
            <p className="text-xs text-slate-400">
              Add or remove skills to observe real-time changes in your placement readiness meter.
            </p>

            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Docker, AWS, React, MongoDB"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </form>

            <div className="flex flex-wrap gap-2 pt-2">
              {(student.skills || []).map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950 text-slate-200 border border-slate-800 flex items-center gap-2 group hover:border-slate-700"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-500 hover:text-rose-400 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB E: INTERVIEW PREPARATION CHECKLIST */}
      {activeTab === "prep" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                Comprehensive Campus Interview Prep Roadmap
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Structured preparation modules curated by college placement officers and corporate recruiters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phase 1 */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col group hover:border-slate-700 transition-all">
                <div className="relative h-32 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=80"
                    alt="Coding Problem Solving"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                  <span className="absolute bottom-2 left-3 px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-600/90 text-white backdrop-blur-md">
                    Phase 1: DSA Mastery
                  </span>
                </div>
                <div className="p-4 space-y-1.5 flex-1">
                  <span className="text-xs font-bold text-indigo-300">Data Structures & Algorithms</span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Master essential patterns: Two Pointers, Sliding Window, Dynamic Programming, and Binary Trees. Recommended: 80+ problems solved on LeetCode/CodeChef.
                  </p>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col group hover:border-slate-700 transition-all">
                <div className="relative h-32 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=80"
                    alt="System Architecture & DBMS"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                  <span className="absolute bottom-2 left-3 px-2.5 py-0.5 rounded text-[11px] font-bold bg-sky-600/90 text-white backdrop-blur-md">
                    Phase 2: CS Core
                  </span>
                </div>
                <div className="p-4 space-y-1.5 flex-1">
                  <span className="text-xs font-bold text-sky-300">Computer Science Fundamentals</span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Core subjects tested in OA & technical rounds: Operating Systems (Threads, Virtual Memory), DBMS (Indexes, Normalization, SQL), and Computer Networks.
                  </p>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col group hover:border-slate-700 transition-all">
                <div className="relative h-32 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=80"
                    alt="Full-Stack Web Projects"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                  <span className="absolute bottom-2 left-3 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-600/90 text-white backdrop-blur-md">
                    Phase 3: Portfolio
                  </span>
                </div>
                <div className="p-4 space-y-1.5 flex-1">
                  <span className="text-xs font-bold text-emerald-300">Industry-Grade Projects</span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Build 2-3 end-to-end applications demonstrating clean GitHub commits, REST API integrations, responsive interfaces, and live cloud deployment links.
                  </p>
                </div>
              </div>

              {/* Phase 4 */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col group hover:border-slate-700 transition-all">
                <div className="relative h-32 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80"
                    alt="Behavioral HR Interview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                  <span className="absolute bottom-2 left-3 px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-600/90 text-white backdrop-blur-md">
                    Phase 4: Behavioral
                  </span>
                </div>
                <div className="p-4 space-y-1.5 flex-1">
                  <span className="text-xs font-bold text-amber-300">HR & Culture Fit Readiness</span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Formulate structured STAR method stories for: "Tell me about a challenging bug", "How you resolved team disagreement", and "Why this company".
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
