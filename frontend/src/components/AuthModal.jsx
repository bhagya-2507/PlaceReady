import React, { useState } from "react";
import {
  X,
  GraduationCap,
  Building2,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  User,
  Hash,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Briefcase,
  Award,
  LogIn
} from "lucide-react";
import { authService } from "../services/authService";

export default function AuthModal({
  isOpen,
  onClose,
  initialRole = "student",
  onLoginSuccess
}) {
  const [role, setRole] = useState(initialRole === "teacher" ? "admin" : initialRole);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roll, setRoll] = useState("");
  const [branch, setBranch] = useState("Computer Science (CSE)");
  const [cgpa, setCgpa] = useState("8.2");
  const [companyName, setCompanyName] = useState("");
  const [designation, setDesignation] = useState("Technical Hiring Lead");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Verifying credentials...");

  if (!isOpen) return null;

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRoll("");
    setCompanyName("");
    setError("");
  };

  // Quick 1-Click Demo Login
  const handleDemoLogin = async (demoRole) => {
    setError("");
    setLoading(true);

    let creds = { email: "rahul@college.edu", password: "student123" };
    if (demoRole === "admin") {
      creds = { email: "admin@placeready.edu", password: "admin123" };
    } else if (demoRole === "recruiter") {
      creds = { email: "recruiter@amazon.com", password: "recruiter123" };
    } else if (demoRole === "newstudent") {
      creds = { email: "newstudent@college.edu", password: "student123" };
    }

    setLoadingText(`Logging in as Demo ${demoRole.toUpperCase()}...`);

    try {
      const res = await authService.login(creds);
      setLoading(false);
      resetForm();
      onLoginSuccess(res.data.user);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Demo login failed. Make sure backend is running.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    setLoadingText(isSignUp ? "Creating Profile..." : "Authenticating with Central Database...");

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError("Please enter your full name.");
          setLoading(false);
          return;
        }

        const registrationPayload = {
          name,
          email,
          password,
          role: role === "teacher" ? "admin" : role,
          rollNumber: roll || "22CSE" + Math.floor(100 + Math.random() * 900),
          branch,
          cgpa: parseFloat(cgpa) || 7.5,
          companyName: companyName || "Campus Partner",
          designation: designation || "Recruiter",
        };

        const res = await authService.register(registrationPayload);
        setLoading(false);
        resetForm();
        onLoginSuccess(res.data.user);
        onClose();
      } else {
        const res = await authService.login({ email, password });
        setLoading(false);
        resetForm();
        onLoginSuccess(res.data.user);
        onClose();
      }
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || err.message || "Authentication failed.";
      setError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      {/* Split Card Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 relative my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── LEFT COLUMN: VISUAL BRANDING ── */}
        <div className="hidden md:flex md:col-span-5 relative flex-col justify-between p-8 overflow-hidden text-white bg-slate-950 border-r border-slate-800">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 transform hover:scale-105 transition-transform duration-1000"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80')"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-indigo-950/40" />

          {/* Top Brand badge */}
          <div className="relative z-10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center shadow-lg backdrop-blur-md">
              <GraduationCap className="w-6 h-6 text-indigo-300" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                Institutional Placement Core
              </span>
              <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
                PlaceReady Portal
              </h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real-time placement diagnostic engine, corporate job drives, and student skill benchmarking.
            </p>
          </div>

          {/* Middle Stat Cards */}
          <div className="relative z-10 space-y-2.5 my-6">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">78% Batch Placed</p>
                <p className="text-[10px] text-slate-400">Current Academic Year 2026</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">₹24.0 LPA Highest</p>
                <p className="text-[10px] text-slate-400">Amazon SDE Recruitment</p>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>MongoDB Connected & JWT Encrypted</span>
          </div>
        </div>

        {/* ── RIGHT COLUMN: AUTHENTICATION FORM ── */}
        <div className="md:col-span-7 p-6 sm:p-8 space-y-5 flex flex-col justify-center">
          {/* Header */}
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              {isSignUp ? "Create Campus Account" : "Sign In to Portal"}
            </h3>
            <p className="text-xs text-slate-400">
              {isSignUp
                ? "Register a student or corporate recruiter profile"
                : "Enter your registered credentials to access your dashboard"}
            </p>
          </div>

          {/* 3 Role Selection Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setRole("student");
                setError("");
              }}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                role === "student"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole("admin");
                setError("");
              }}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                role === "admin" || role === "teacher"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>TPO / Admin</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole("recruiter");
                setError("");
              }}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                role === "recruiter"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Recruiter</span>
            </button>
          </div>

          {/* Quick Demo Logins Pills */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-indigo-400">⚡ 1-Click Demo Logins:</span>
              <span>Instant Test</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleDemoLogin("student")}
                className="py-1 px-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium transition cursor-pointer text-center truncate"
                title="Rahul Sharma (82% Ready)"
              >
                Demo Student
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("admin")}
                className="py-1 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-medium transition cursor-pointer text-center truncate"
                title="TPO Placement Head"
              >
                Demo TPO
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("recruiter")}
                className="py-1 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium transition cursor-pointer text-center truncate"
                title="Amazon Recruiter"
              >
                Demo Recruiter
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isSignUp && (
              <>
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder={role === "student" ? "e.g. Pooja Sharma" : "e.g. Priya Nair"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Student specific fields */}
                {role === "student" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Roll Number
                      </label>
                      <div className="relative">
                        <Hash className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          placeholder="22CSE105"
                          value={roll}
                          onChange={(e) => setRoll(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Current CGPA
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="4.0"
                        max="10.0"
                        value={cgpa}
                        onChange={(e) => setCgpa(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {/* Recruiter specific fields */}
                {role === "recruiter" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Company Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Microsoft"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Designation
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lead Talent Partner"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {/* Branch / Department (for student) */}
                {role === "student" && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Branch / Stream
                    </label>
                    <div className="relative">
                      <BookOpen className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                      <select
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Computer Science (CSE)">Computer Science (CSE)</option>
                        <option value="Information Tech (IT)">Information Tech (IT)</option>
                        <option value="Electronics (ECE)">Electronics (ECE)</option>
                        <option value="Mechanical (ME)">Mechanical (ME)</option>
                        <option value="Electrical (EE)">Electrical (EE)</option>
                      </select>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder={
                    role === "student"
                      ? "student@college.edu"
                      : role === "admin"
                      ? "admin@placeready.edu"
                      : "recruiter@company.com"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>{loadingText}</span>
              ) : (
                <>
                  <span>{isSignUp ? "Complete Registration" : "Enter Secure Portal"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Sign In / Sign Up */}
          <div className="pt-2 text-center text-xs text-slate-400">
            {role === "admin" ? (
              <p className="text-[11px] text-slate-500">
                Institutional Admin accounts are issued by College Administration. Use demo credentials above.
              </p>
            ) : (
              <p>
                {isSignUp ? "Already registered?" : "Don't have an account yet?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError("");
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-bold ml-1 cursor-pointer"
                >
                  {isSignUp ? "Sign In here" : "Create an account"}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
