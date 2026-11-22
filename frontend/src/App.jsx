import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  LogOut,
  BookOpen,
  User,
  Menu,
  X,
  Sparkles,
  Shield,
  LogIn,
  Building2,
  Briefcase
} from "lucide-react";

import WelcomePage from "./components/WelcomePage";
import AuthModal from "./components/AuthModal";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import RecruiterDashboard from "./components/RecruiterDashboard";
import VivaDefenseModal from "./components/VivaDefenseModal";
import LoadingScreen from "./components/LoadingScreen";

import {
  INITIAL_STUDENTS,
  INITIAL_DRIVES,
  INITIAL_ANNOUNCEMENTS
} from "./data/portalData";

import { authService } from "./services/authService";
import { driveService } from "./services/driveService";
import { adminService } from "./services/adminService";

// ─── Top Navigation Bar ────────────────────────────────────────────────────
function TopNavbar({ currentUser, onLogout, onOpenAuth, onOpenGuide }) {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-white leading-none">PlaceReady</p>
            <p className="text-[10px] text-indigo-400 font-medium tracking-widest uppercase">
              Campus Placement Portal
            </p>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              {/* User Identity Chip */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700">
                <img
                  src={
                    currentUser.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      currentUser.name
                    )}&background=6366f1&color=fff&size=200`
                  }
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-indigo-400/30"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-white leading-tight">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {currentUser.role === "teacher" || currentUser.role === "admin"
                      ? "TPO Officer"
                      : currentUser.role === "recruiter"
                      ? currentUser.companyName || "Corporate Partner"
                      : currentUser.roll || currentUser.rollNumber || "Student"}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    currentUser.role === "teacher" || currentUser.role === "admin"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : currentUser.role === "recruiter"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  }`}
                >
                  {currentUser.role === "teacher" || currentUser.role === "admin"
                    ? "Faculty / TPO"
                    : currentUser.role === "recruiter"
                    ? "Recruiter"
                    : "Student"}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold hover:bg-rose-500/20 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth("student")}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            </div>
          )}

          {/* Viva Guide Trigger */}
          <button
            onClick={onOpenGuide}
            title="Open Viva Defense Guide"
            className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-amber-400 hover:bg-slate-700 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Main Application ──────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authRole, setAuthRole] = useState("student");
  const [showVivaModal, setShowVivaModal] = useState(false);

  // Live Portal State
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [drives, setDrives] = useState(INITIAL_DRIVES);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);

  // Check existing session or load backend records
  useEffect(() => {
    const existingUser = authService.getCurrentUser();
    if (existingUser) {
      setCurrentUser(existingUser);
    }

    // Attempt to sync drives and announcements from backend
    const syncBackendData = async () => {
      try {
        const [drivesRes, annRes] = await Promise.allSettled([
          driveService.getAllDrives(),
          adminService.getAnnouncements(),
        ]);

        if (drivesRes.status === "fulfilled" && drivesRes.value.data?.drives?.length) {
          setDrives(drivesRes.value.data.drives);
        }
        if (annRes.status === "fulfilled" && annRes.value.data?.announcements?.length) {
          setAnnouncements(annRes.value.data.announcements);
        }
      } catch (e) {
        // Fallback gracefully to bundled initial data
      }
    };

    syncBackendData();
  }, []);

  // ── Auth Handlers ────────────────────────────────────────────────────────
  const handleOpenAuth = (role = "student") => {
    setAuthRole(role);
    setShowAuthModal(true);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === "student") {
      setStudents((prev) => {
        const exists = prev.some((s) => s.id === user.id || s.email === user.email);
        if (exists) {
          return prev.map((s) => (s.email === user.email ? { ...s, ...user } : s));
        }
        return [user, ...prev];
      });
    }
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  // ── Student Actions ──────────────────────────────────────────────────────
  const handleUpdateStudent = (updatedStudent) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    if (currentUser && (currentUser.id === updatedStudent.id || currentUser._id === updatedStudent._id)) {
      const merged = { ...currentUser, ...updatedStudent };
      setCurrentUser(merged);
      localStorage.setItem("placeready_user", JSON.stringify(merged));
    }
  };

  const handleApplyDrive = async (driveId) => {
    if (!currentUser) return;

    const currentApplied = currentUser.appliedJobIds || [];
    if (currentApplied.includes(driveId)) return;

    try {
      await driveService.apply({ driveId });
    } catch (e) {
      // Offline fallback
    }

    const updated = {
      ...currentUser,
      appliedJobIds: [...currentApplied, driveId],
    };

    handleUpdateStudent(updated);
  };

  // ── Teacher Actions ──────────────────────────────────────────────────────
  const handleUpdateStudents = (updatedList) => {
    setStudents(updatedList);
  };

  const handleAddDrive = (newDrive) => {
    setDrives((prev) => [newDrive, ...prev]);
  };

  const handleAddAnnouncement = (newAnn) => {
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 0 to 100% Animated Loading Screen */}
      {loading && <LoadingScreen onFinish={() => setLoading(false)} />}

      {/* Top Navbar */}
      <TopNavbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
        onOpenGuide={() => setShowVivaModal(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 1. NOT LOGGED IN → WELCOME / LANDING PAGE */}
        {!currentUser && (
          <WelcomePage
            onOpenAuth={handleOpenAuth}
            onOpenGuide={() => setShowVivaModal(true)}
            drives={drives}
          />
        )}

        {/* 2. LOGGED IN AS STUDENT → STUDENT DASHBOARD */}
        {currentUser?.role === "student" && (
          <StudentDashboard
            student={currentUser}
            onUpdateStudent={handleUpdateStudent}
            drives={drives}
            onApplyDrive={handleApplyDrive}
            announcements={announcements}
          />
        )}

        {/* 3. LOGGED IN AS TEACHER / TPO / ADMIN → TEACHER DASHBOARD */}
        {(currentUser?.role === "teacher" || currentUser?.role === "admin") && (
          <TeacherDashboard
            teacher={currentUser}
            students={students}
            onUpdateStudents={handleUpdateStudents}
            drives={drives}
            onAddDrive={handleAddDrive}
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
          />
        )}

        {/* 4. LOGGED IN AS CORPORATE RECRUITER → RECRUITER DASHBOARD */}
        {currentUser?.role === "recruiter" && (
          <RecruiterDashboard
            user={currentUser}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-300 font-semibold">PlaceReady Portal</span>
            <span>&bull;</span>
            <span>Campus Placement & Training Management System</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setShowVivaModal(true)}
              className="text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
            >
              Viva Defense Documentation
            </button>
            <span>&bull;</span>
            <span>MERN Stack Production Build</span>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialRole={authRole}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Viva Defense Guide Modal */}
      <VivaDefenseModal
        isOpen={showVivaModal}
        onClose={() => setShowVivaModal(false)}
      />
    </div>
  );
}
