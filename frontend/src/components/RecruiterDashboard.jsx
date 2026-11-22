import React, { useState, useEffect } from "react";
import {
  Building2,
  Briefcase,
  Users,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  ExternalLink,
  Search,
  Filter,
  AlertCircle,
  Edit,
  Trash2,
  ChevronRight,
  TrendingUp,
  Award,
  Sparkles,
  MapPin,
  Globe,
  Mail,
  UserCheck
} from "lucide-react";
import { recruiterService } from "../services/recruiterService";
import { driveService } from "../services/driveService";

export default function RecruiterDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("jobs"); // 'jobs' | 'applicants' | 'profile'
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Create Job Modal state
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    packageLpa: 12,
    minCgpa: 7.0,
    eligibleBranches: ["Computer Science (CSE)", "Information Tech (IT)"],
    skillsRequired: "React, Node.js, DSA, System Design",
    location: "Bangalore / Hybrid",
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [profileRes, jobsRes, appsRes] = await Promise.allSettled([
        recruiterService.getProfile(),
        recruiterService.getMyJobs(),
        driveService.getAllApplications(),
      ]);

      if (profileRes.status === "fulfilled" && profileRes.value.data?.profile) {
        setProfile(profileRes.value.data.profile);
      }
      if (jobsRes.status === "fulfilled" && jobsRes.value.data?.jobs) {
        setJobs(jobsRes.value.data.jobs);
      }
      if (appsRes.status === "fulfilled" && appsRes.value.data?.applications) {
        setApplications(appsRes.value.data.applications);
      }
    } catch (err) {
      console.error("Error loading recruiter data", err);
      setError("Failed to load recruiter records. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = typeof jobForm.skillsRequired === "string"
        ? jobForm.skillsRequired.split(",").map((s) => s.trim()).filter(Boolean)
        : jobForm.skillsRequired;

      const payload = {
        title: jobForm.title,
        description: jobForm.description,
        packageLpa: parseFloat(jobForm.packageLpa) || 10,
        minCgpa: parseFloat(jobForm.minCgpa) || 6.5,
        eligibleBranches: jobForm.eligibleBranches,
        skillsRequired: skillsArray,
        location: jobForm.location,
      };

      await recruiterService.createJob(payload);
      setShowJobModal(false);
      setSuccessMsg("Job posting created successfully!");
      setTimeout(() => setSuccessMsg(""), 3500);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job posting.");
    }
  };

  const handleUpdateApplicant = async (appId, newStatus) => {
    try {
      await recruiterService.updateApplicantStatus(appId, newStatus, `Status updated to ${newStatus}`);
      setSuccessMsg(`Candidate marked as ${newStatus}!`);
      setTimeout(() => setSuccessMsg(""), 3500);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status.");
    }
  };

  const isApproved = profile?.approvalStatus === "approved" || user?.isApproved;

  const filteredApplicants = applications.filter((app) => {
    const studentName = app.studentProfileRef?.user?.name?.toLowerCase() || "";
    const matchesSearch = studentName.includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === "all" || app.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* ── Top Header & Stats ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">
                {profile?.companyName || user?.companyName || "Corporate Partner Portal"}
              </h1>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isApproved
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                {isApproved ? "Verified Partner" : "Pending Approval"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {user?.name} · {profile?.designation || "Hiring Lead"} · {user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowJobModal(true)}
            disabled={!isApproved}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Opening</span>
          </button>
        </div>
      </div>

      {/* Warning banner if not approved */}
      {!isApproved && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-amber-200">Account Approval In Progress</p>
            <p className="text-amber-300/80">
              Your recruiter profile is currently under review by the College Placement & Training Cell (TPO).
              Once authorized, you will be able to publish live job postings and access student candidate pools.
            </p>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium">Active Openings</p>
            <Briefcase className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">{jobs.length}</p>
          <p className="text-[10px] text-slate-500 mt-1">Total posted hiring drives</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium">Total Applicants</p>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">{applications.length}</p>
          <p className="text-[10px] text-slate-500 mt-1">Verified college students</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium">Shortlisted Candidates</p>
            <UserCheck className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">
            {applications.filter((a) => a.status === "Shortlisted" || a.status === "Selected").length}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Ready for technical rounds</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium">Final Offers Made</p>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">
            {applications.filter((a) => a.status === "Selected").length}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Campus selections</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("jobs")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "jobs"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Briefcase className="w-4 h-4 text-emerald-400" />
          <span>Hiring Openings ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("applicants")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "applicants"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Users className="w-4 h-4 text-indigo-400" />
          <span>Candidate Pipeline ({applications.length})</span>
        </button>
      </div>

      {/* TAB 1: JOBS LIST */}
      {activeTab === "jobs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Your Campus Opportunities</h2>
            <p className="text-xs text-slate-400">Live drives synced with student portals</p>
          </div>

          {jobs.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No Job Openings Posted Yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create a new job posting to notify eligible students and start receiving applications.
              </p>
              {isApproved && (
                <button
                  onClick={() => setShowJobModal(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Post First Job
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">{job.title}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {job.location || "Multiple Locations"}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-black">
                      ₹{job.packageLpa} LPA
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">{job.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.skillsRequired?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Min CGPA: <strong className="text-white">{job.minCgpa}</strong></span>
                    <span className="capitalize">{job.eligibleBranches?.length || 0} Branches Eligible</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: APPLICANTS PIPELINE */}
      {activeTab === "applicants" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-white">Student Applicant Pool</h2>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search candidate name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {filteredApplicants.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-2">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No Applicants Found</p>
              <p className="text-xs text-slate-500">
                Applicants who apply to your drives will appear here with verified academic records and resumes.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApplicants.map((app) => {
                const sProfile = app.studentProfileRef;
                const sUser = sProfile?.user;
                return (
                  <div
                    key={app._id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                        {sUser?.name ? sUser.name.charAt(0) : "S"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-white">{sUser?.name || "Student Candidate"}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                            {sProfile?.rollNumber || "Roll N/A"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {sProfile?.branch} · CGPA: <strong className="text-white">{sProfile?.cgpa}</strong> · Target: {sProfile?.targetRole || "Software Engineer"}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Drive: <strong className="text-indigo-400">{app.driveRef?.companyName || "Placement Drive"}</strong> ({app.driveRef?.role})
                        </p>
                      </div>
                    </div>

                    {/* Actions and Status */}
                    <div className="flex items-center gap-3 self-end md:self-center">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-xl font-bold ${
                          app.status === "Selected"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : app.status === "Shortlisted"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : app.status === "Rejected"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        }`}
                      >
                        {app.status}
                      </span>

                      {/* Status Decision buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleUpdateApplicant(app._id, "Shortlisted")}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold cursor-pointer"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleUpdateApplicant(app._id, "Selected")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold cursor-pointer"
                        >
                          Select
                        </button>
                        <button
                          onClick={() => handleUpdateApplicant(app._id, "Rejected")}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── CREATE JOB POSTING MODAL ── */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                <span>Post Campus Hiring Drive</span>
              </h3>
              <button
                onClick={() => setShowJobModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Job Title / Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Associate Software Development Engineer"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Package (CTC in LPA) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={jobForm.packageLpa}
                    onChange={(e) => setJobForm({ ...jobForm, packageLpa: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Minimum CGPA Cutoff *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={jobForm.minCgpa}
                    onChange={(e) => setJobForm({ ...jobForm, minCgpa: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Required Technical Skills (Comma separated) *</label>
                <input
                  type="text"
                  required
                  placeholder="React, Node.js, Python, DSA, System Design"
                  value={jobForm.skillsRequired}
                  onChange={(e) => setJobForm({ ...jobForm, skillsRequired: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Bangalore / Hyderabad / Hybrid"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Job Description</label>
                <textarea
                  rows="3"
                  placeholder="Provide role expectations, interview rounds, and requirements..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg"
                >
                  Publish Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
