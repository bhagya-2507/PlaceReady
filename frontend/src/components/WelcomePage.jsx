import React from "react";
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  Building2,
  CheckCircle2,
  Briefcase,
  Users,
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  ShieldCheck,
  HelpCircle,
  Laptop,
  Check
} from "lucide-react";

export default function WelcomePage({
  onOpenAuth,
  onOpenGuide,
  drives = []
}) {
  return (
    <div className="space-y-16 py-4">
      {/* 1. HERO SECTION WITH REAL CAMPUS PHOTO & ATTRACTIVE VISUALS */}
      <section className="relative overflow-hidden pt-4 pb-10 sm:pt-10 sm:pb-14">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-sky-500/20 to-teal-500/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Central Campus Placement & Training Management System</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                Accelerate Your <br className="hidden sm:inline" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-sky-300 to-teal-300">
                  Campus Placement
                </span>{" "}
                Career.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Check real-time placement readiness, bridge target skill deficits, and register directly for on-campus drives with industry leaders including Amazon, TCS, Deloitte, Infosys, and Razorpay.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => onOpenAuth("student")}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>Student Portal Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenAuth("teacher")}
                  className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-5 h-5 text-sky-400" />
                  <span>Teacher & TPO Portal</span>
                </button>
              </div>

              {/* Quick Feature Ticks */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100-Point Readiness Meter
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1-Click Drive Registration
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> TPO Student Analytics
                </span>
              </div>
            </div>

            {/* Right Visual Image Card (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
                  alt="College students preparing for placements"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Floating Placement Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/90 border border-indigo-500/40 backdrop-blur-md space-y-1.5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      Active Hiring Season 2026-27
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      78% Batch Placed
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Over 25+ product & IT service enterprises conducting campus interviews this semester.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BANNER */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-3xl font-black text-indigo-400 font-mono block">120+</span>
            <span className="text-xs text-slate-300 font-semibold block">Registered Students</span>
            <span className="text-[11px] text-slate-500">CSE, IT, ECE & Core branches</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-3xl font-black text-emerald-400 font-mono block">85</span>
            <span className="text-xs text-slate-300 font-semibold block">Students Placed</span>
            <span className="text-[11px] text-slate-500">Across Day-1 & Super Dream drives</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-3xl font-black text-sky-400 font-mono block">₹24.0 LPA</span>
            <span className="text-xs text-slate-300 font-semibold block">Highest CTC Offered</span>
            <span className="text-[11px] text-slate-500">Offered by Amazon India</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-3xl font-black text-amber-400 font-mono block">₹7.4 LPA</span>
            <span className="text-xs text-slate-300 font-semibold block">Average Package</span>
            <span className="text-[11px] text-slate-500">Institutional campus median</span>
          </div>
        </div>
      </section>

      {/* 3. HOW THE PORTAL WORKS */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-indigo-400">
            Enterprise Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Comprehensive Placement Workflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Synchronized coordination between students, academic faculty, and recruiting organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-indigo-500/40 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xl border border-indigo-500/20">
              01
            </div>
            <h3 className="text-base font-bold text-white">Student Readiness Diagnostic</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every student gets a clear 100-point readiness breakdown across 4 key pillars: Academic CGPA (35 pts), Skill Match (35 pts), Portfolio Projects (15 pts), and Internships (15 pts).
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-sky-500/40 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-xl border border-sky-500/20">
              02
            </div>
            <h3 className="text-base font-bold text-white">Direct Drive Registrations</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Students can view live campus hiring drives with clear eligibility criteria, CTC packages, round timelines, and submit direct applications with 1 click.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-emerald-500/40 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-500/20">
              03
            </div>
            <h3 className="text-base font-bold text-white">TPO & Faculty Governance</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Placement officers can filter candidate records by branch or placement status, post new corporate drives, track batch statistics, and broadcast critical campus notices.
            </p>
          </div>
        </div>
      </section>

      {/* 4. ACTIVE CAMPUS HIRING DRIVES PREVIEW */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs uppercase font-mono font-bold tracking-widest text-indigo-400">
              Corporate Recruitment
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Active Campus Placement Drives
            </h2>
          </div>

          <button
            onClick={() => onOpenAuth("student")}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Sign in to apply for drives</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drives.slice(0, 3).map((drive) => (
            <div
              key={drive.id}
              className="rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between overflow-hidden shadow-lg group"
            >
              {/* Company Image Cover */}
              {drive.companyImage && (
                <div className="relative h-28 w-full overflow-hidden border-b border-slate-800">
                  <img
                    src={drive.companyImage}
                    alt={drive.company}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                  <span className="absolute top-2 right-2 font-mono font-bold text-emerald-400 bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded text-xs border border-emerald-800/40">
                    {drive.packageLpa}
                  </span>
                </div>
              )}

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{drive.logoBadge}</span>
                    <h3 className="text-base font-bold text-white">{drive.company}</h3>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-200">{drive.role}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Location: {drive.location}</p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-2 border-t border-slate-800 mt-3">
                    <span>Min CGPA: <strong className="text-slate-200">{drive.minCgpa}</strong></span>
                    <span>Deadline: <strong className="text-amber-400">{drive.deadline}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenAuth("student")}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer mt-3"
                >
                  View & Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TOP RECRUITERS & PLACEMENT STARS (NEW PHOTO SHOWCASE) */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-indigo-400">
            Hall of Fame
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Recent Batch Placement Success Stories
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Our students placed at premier product and technology companies through campus drives.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex items-center gap-4 hover:border-slate-700 transition-all">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
              alt="Priya Patel"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shrink-0"
            />
            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                ₹24.0 LPA • Placed
              </span>
              <h4 className="text-sm font-bold text-white">Priya Patel</h4>
              <p className="text-xs text-indigo-300 font-medium">Amazon (SDE-1)</p>
              <p className="text-[11px] text-slate-400">Computer Science (CSE) &bull; CGPA 8.9</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex items-center gap-4 hover:border-slate-700 transition-all">
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80"
              alt="Sneha Roy"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40 shrink-0"
            />
            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
                ₹7.5 LPA • Placed
              </span>
              <h4 className="text-sm font-bold text-white">Sneha Roy</h4>
              <p className="text-xs text-indigo-300 font-medium">TCS Digital</p>
              <p className="text-[11px] text-slate-400">Computer Science (CSE) &bull; CGPA 7.9</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex items-center gap-4 hover:border-slate-700 transition-all">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
              alt="Placement Cell"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/40 shrink-0"
            />
            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-800/40">
                Corporate Relations
              </span>
              <h4 className="text-sm font-bold text-white">Prof. Rajesh Sharma</h4>
              <p className="text-xs text-amber-300 font-medium">Head of Training & Placement</p>
              <p className="text-[11px] text-slate-400">Direct Industry Tie-ups with 30+ MNCs</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VIVA DOCUMENTATION MODAL TRIGGER (Clean, subtle footer section) */}
      <section className="max-w-5xl mx-auto px-4 pt-4">
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center justify-center sm:justify-start gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Academic Presentation & Project Viva Companion
            </h4>
            <p className="text-xs text-slate-400">
              Need to defend this architecture in front of external examiners? Review the complete slide deck & technical Q&A guide.
            </p>
          </div>

          <button
            onClick={onOpenGuide}
            className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Open Viva Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
