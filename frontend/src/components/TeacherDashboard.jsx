import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  Briefcase,
  GraduationCap,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Send,
  Calendar,
  Sparkles,
  Award,
  Filter,
  Check,
  X,
  FileSpreadsheet,
  Download,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Mail,
  UserCheck
} from "lucide-react";
import { adminService } from "../services/adminService";

export default function TeacherDashboard({
  teacher,
  students = [],
  onUpdateStudents,
  drives = [],
  onAddDrive,
  announcements = [],
  onAddAnnouncement
}) {
  const [activeTab, setActiveTab] = useState("students"); // "students" | "new_drive" | "announcements" | "recruiters" | "analytics"

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [placedFilter, setPlacedFilter] = useState("all");

  // New Drive Form state
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [packageLpa, setPackageLpa] = useState("");
  const [minCgpa, setMinCgpa] = useState("7.0");
  const [deadline, setDeadline] = useState("");
  const [skills, setSkills] = useState("");

  // New Announcement Form state
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");

  // Recruiters live state from DB
  const [recruiters, setRecruiters] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loadingRecruiters, setLoadingRecruiters] = useState(false);
  const [notification, setNotification] = useState("");

  const loadAdminData = async () => {
    try {
      setLoadingRecruiters(true);
      const [recRes, statRes] = await Promise.allSettled([
        adminService.getAllRecruiters(),
        adminService.getPlacementAnalytics(),
      ]);

      if (recRes.status === "fulfilled" && recRes.value.data?.recruiters) {
        setRecruiters(recRes.value.data.recruiters);
      }
      if (statRes.status === "fulfilled" && statRes.value.data?.branchStats) {
        setAnalytics(statRes.value.data);
      }
    } catch (err) {
      console.warn("Could not fetch admin remote data:", err);
    } finally {
      setLoadingRecruiters(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleApproveRecruiter = async (recruiterId, status) => {
    try {
      await adminService.updateRecruiterApproval(recruiterId, status);
      setNotification(`Recruiter status updated to ${status}!`);
      setTimeout(() => setNotification(""), 3500);
      loadAdminData();
    } catch (err) {
      alert("Failed to update recruiter approval: " + (err.response?.data?.message || err.message));
    }
  };

  const handleExportCsv = () => {
    const headers = ["Name", "Roll", "Branch", "CGPA", "Placed_Status", "Placed_Company"];
    const rows = students.map((s) => [
      `"${s.name}"`,
      `"${s.roll}"`,
      `"${s.branch}"`,
      s.cgpa,
      s.placed ? "Placed" : "Unplaced",
      `"${s.placedCompany || 'N/A'}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PlaceReady_Placement_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const sName = s.name || s.user?.name || "";
    const sRoll = s.roll || s.rollNumber || "";
    const matchesSearch = sName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sRoll.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = branchFilter === "all" || (s.branch || "").toLowerCase().includes(branchFilter.toLowerCase());
    const matchesPlaced = placedFilter === "all" ||
                          (placedFilter === "placed" && (s.placed || s.isPlaced)) ||
                          (placedFilter === "unplaced" && !(s.placed || s.isPlaced));
    return matchesSearch && matchesBranch && matchesPlaced;
  });

  const totalPlacedCount = students.filter((s) => s.placed || s.isPlaced).length;
  const placementRate = Math.round((totalPlacedCount / (students.length || 1)) * 100);

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    if (!company || !role || !packageLpa) return;

    const newDriveObj = {
      id: `drive-${Date.now()}`,
      companyName: company,
      company,
      logoBadge: "🏢",
      role,
      packageLpa: parseFloat(packageLpa.replace(/[^0-9.]/g, "")) || 10,
      location: "Campus Drive",
      minCgpa: parseFloat(minCgpa) || 7.0,
      eligibleBranches: ["Computer Science (CSE)", "Information Tech (IT)", "Electronics (ECE)"],
      deadline: deadline || "Open Registration",
      skillsRequired: skills.split(",").map(s => s.trim()).filter(Boolean),
      status: "Active Registration",
      rounds: "Online Test + Tech Interview + HR"
    };

    // Save to backend if available
    try {
      await adminService.createDrive(newDriveObj);
    } catch (err) {
      console.warn("Backend drive create warning:", err);
    }

    onAddDrive(newDriveObj);
    setCompany("");
    setRole("");
    setPackageLpa("");
    setDeadline("");
    setSkills("");
    setNotification(`Success: Campus Drive for ${company} published to student portal!`);
    setTimeout(() => setNotification(""), 4000);
    setActiveTab("students");
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    const newAnn = {
      id: `ann-${Date.now()}`,
      title: annTitle,
      date: "Just now",
      author: teacher?.name || "TPO Officer",
      content: annContent,
      priority: "high"
    };

    try {
      await adminService.createAnnouncement(newAnn);
    } catch (err) {
      console.warn("Backend announcement create warning:", err);
    }

    onAddAnnouncement(newAnn);
    setAnnTitle("");
    setAnnContent("");
    setNotification("Placement Notice broadcasted successfully to all students!");
    setTimeout(() => setNotification(""), 4000);
  };

  const handleTogglePlaced = (studentId) => {
    const updated = students.map((s) => {
      if (s.id === studentId || s._id === studentId) {
        const currentlyPlaced = s.placed || s.isPlaced;
        return {
          ...s,
          placed: !currentlyPlaced,
          isPlaced: !currentlyPlaced,
          placedCompany: !currentlyPlaced ? "TCS Digital" : null
        };
      }
      return s;
    });
    onUpdateStudents(updated);
  };

  return (
    <div className="space-y-8 py-4">
      {/* 1. TPO HEADER BANNER */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={
              teacher?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                teacher?.name || "Admin"
              )}&background=0284c7&color=fff&size=200`
            }
            alt={teacher?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-500/40 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{teacher?.name || "Dr. Rajesh Sharma"}</h1>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                TPO Admin
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">Head of Training & Placement Cell</p>
            <p className="text-xs text-slate-500">Department of Corporate Relations</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV Report</span>
          </button>

          <button
            onClick={() => setActiveTab("new_drive")}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Post Campus Drive</span>
          </button>
        </div>
      </div>

      {/* Global Notification Banner */}
      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* 2. STATS KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-3xl font-black text-white font-mono block">{students.length}</span>
          <span className="text-xs text-slate-400 font-medium block">Total Students in Cohort</span>
          <span className="text-[11px] text-slate-500">Graduating 2026 Batch</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-3xl font-black text-emerald-400 font-mono block">{totalPlacedCount}</span>
          <span className="text-xs text-slate-400 font-medium block">Placed Candidates</span>
          <span className="text-[11px] text-emerald-500/80">{placementRate}% Placement Rate</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-3xl font-black text-rose-400 font-mono block">{students.length - totalPlacedCount}</span>
          <span className="text-xs text-slate-400 font-medium block">Unplaced Candidates</span>
          <span className="text-[11px] text-rose-400/80">Skill Remediation Recommended</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-3xl font-black text-sky-400 font-mono block">{drives.length}</span>
          <span className="text-xs text-slate-400 font-medium block">Active Campus Drives</span>
          <span className="text-[11px] text-slate-500">Amazon, TCS, Deloitte, Infosys</span>
        </div>
      </div>

      {/* 3. TABS */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 flex-wrap">
        <button
          onClick={() => setActiveTab("students")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 min-w-[130px] ${
            activeTab === "students" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Directory ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("recruiters")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 min-w-[130px] ${
            activeTab === "recruiters" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span>Recruiter Approvals ({recruiters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("new_drive")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 min-w-[130px] ${
            activeTab === "new_drive" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Post New Campus Drive</span>
        </button>

        <button
          onClick={() => setActiveTab("announcements")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 min-w-[130px] ${
            activeTab === "announcements" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Placement Notices</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 min-w-[130px] ${
            activeTab === "analytics" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <BarChart3 className="w-4 h-4 text-amber-400" />
          <span>Placement Analytics</span>
        </button>
      </div>

      {/* 4. TAB CONTENT */}

      {/* TAB 1: STUDENT DIRECTORY */}
      {activeTab === "students" && (
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by student name or roll..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">All Branches</option>
                <option value="cse">CSE</option>
                <option value="it">IT</option>
                <option value="ece">ECE</option>
              </select>

              <select
                value={placedFilter}
                onChange={(e) => setPlacedFilter(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="placed">Placed Only</option>
                <option value="unplaced">Unplaced Only</option>
              </select>
            </div>
          </div>

          {/* Student Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4">Skills Count</th>
                  <th className="py-3 px-4">Placement Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredStudents.map((s) => {
                  const sName = s.name || s.user?.name || "Student Candidate";
                  const sRoll = s.roll || s.rollNumber || "22CSE000";
                  const isPl = s.placed || s.isPlaced;
                  const skillsCount = s.skills?.length || 0;
                  return (
                    <tr key={s.id || s._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-2.5">
                        <img
                          src={
                            s.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(sName)}&background=6366f1&color=fff&size=100`
                          }
                          alt={sName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-bold text-white">{sName}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">{sRoll}</td>
                      <td className="py-3 px-4 text-slate-300">{s.branch || "CSE"}</td>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-400">{s.cgpa || 7.5}</td>
                      <td className="py-3 px-4 text-slate-400">{skillsCount} Skills</td>
                      <td className="py-3 px-4">
                        {isPl ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Placed ({s.placedCompany || "Hired"})
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-950/40 text-rose-300 border border-rose-800/40 flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Unplaced
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleTogglePlaced(s.id || s._id)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                        >
                          {isPl ? "Mark Unplaced" : "Mark as Placed"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RECRUITER APPROVALS */}
      {activeTab === "recruiters" && (
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span>Corporate Recruiter Verification & Access Control</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Approve or reject hiring company representatives before they can access student candidate profiles.
              </p>
            </div>
            <button
              onClick={loadAdminData}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Refresh
            </button>
          </div>

          {recruiters.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No registered corporate recruiters found in database.
            </div>
          ) : (
            <div className="space-y-3">
              {recruiters.map((rec) => {
                const isAppr = rec.approvalStatus === "approved";
                const isRej = rec.approvalStatus === "rejected";
                const rUser = rec.user;
                return (
                  <div
                    key={rec._id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-white">{rec.companyName || "Corporate Partner"}</p>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              isAppr
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : isRej
                                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {rec.approvalStatus}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {rUser?.name || "Hiring Lead"} · {rec.designation || "Talent Lead"} · {rUser?.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApproveRecruiter(rec._id, "approved")}
                        disabled={isAppr}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => handleApproveRecruiter(rec._id, "rejected")}
                        disabled={isRej}
                        className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: POST NEW CAMPUS DRIVE */}
      {activeTab === "new_drive" && (
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 max-w-2xl mx-auto space-y-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              Publish a New Campus Placement Drive
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Once published, this drive will immediately be visible to all eligible students on their portal.
            </p>
          </div>

          <form onSubmit={handleCreateDrive} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Microsoft, Google, TCS"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Job Role / Designation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SDE-1, Data Analyst"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Annual CTC Package</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹12.5 LPA"
                  value={packageLpa}
                  onChange={(e) => setPackageLpa(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Minimum CGPA Cutoff</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 7.0"
                  value={minCgpa}
                  onChange={(e) => setMinCgpa(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Registration Deadline</label>
              <input
                type="text"
                placeholder="e.g. 15 December 2026"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Key Required Skills (Comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Python, SQL, Java, React"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all cursor-pointer shadow-md mt-2"
            >
              Publish Campus Drive
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: PLACEMENT NOTICES */}
      {activeTab === "announcements" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-400" />
              Broadcast Notice to Students
            </h3>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Urgent: Resume upload deadline..."
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Notice Content</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Write announcement details..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all cursor-pointer"
              >
                Broadcast Notice
              </button>
            </form>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Published Notices ({announcements.length})
            </h3>

            <div className="space-y-2.5">
              {announcements.map((ann) => (
                <div key={ann.id || ann._id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-white">{ann.title}</h4>
                    <span className="text-[10px] text-slate-500">{ann.date || "Active"}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
                  <span className="text-[11px] text-indigo-400 block pt-1">By: {ann.author}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PLACEMENT ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  <span>Institutional Placement & Package Analytics</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time branch conversion rates, package statistics, and recruitment depth.
                </p>
              </div>

              <button
                onClick={handleExportCsv}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Official Report</span>
              </button>
            </div>

            {/* Branch-wise placement progress bars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 font-semibold">Computer Science (CSE)</p>
                <p className="text-2xl font-black text-indigo-400">88.5%</p>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: "88.5%" }} />
                </div>
                <p className="text-[10px] text-slate-500">Avg Package: ₹14.2 LPA</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 font-semibold">Information Tech (IT)</p>
                <p className="text-2xl font-black text-sky-400">82.0%</p>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: "82%" }} />
                </div>
                <p className="text-[10px] text-slate-500">Avg Package: ₹11.8 LPA</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 font-semibold">Electronics (ECE)</p>
                <p className="text-2xl font-black text-emerald-400">74.5%</p>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "74.5%" }} />
                </div>
                <p className="text-[10px] text-slate-500">Avg Package: ₹9.5 LPA</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
