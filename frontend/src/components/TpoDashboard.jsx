import React, { useState } from "react";
import {
  Building2,
  Users,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Download,
  Filter,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";

export default function TpoDashboard({ onOpenPredictor }) {
  const [selectedBranch, setSelectedBranch] = useState("all");

  // Simulated College Cohort Statistics (1,600 Final Year Batch)
  const stats = {
    totalStudents: 1600,
    placementRatePredicted: "73.4%",
    avgExpectedCtc: "₹8.45 LPA",
    highestExpectedCtc: "₹24.0 LPA",
    atRiskStudentsCount: 218,
    tier1EligibleCount: 540,
  };

  const branchData = [
    { name: "Computer Science & Eng (CSE)", count: 620, readinessPct: 82.4, avgCgpa: 8.12, placedEst: 510 },
    { name: "Information Technology (IT)", count: 380, readinessPct: 77.8, avgCgpa: 7.85, placedEst: 295 },
    { name: "Electronics & Comm (ECE)", count: 340, readinessPct: 64.2, avgCgpa: 7.42, placedEst: 218 },
    { name: "Mechanical & Civil (Core)", count: 260, readinessPct: 51.5, avgCgpa: 7.15, placedEst: 134 },
  ];

  // Batch-wide missing skill deficits (Identifies what workshops college needs to conduct)
  const topSkillDeficits = [
    { skill: "Docker & Containerization", missingPct: 62.4, impactRole: "SDE / Web Dev", recommendation: "Host 3-Day DevOps Workshop" },
    { skill: "Power BI & Tableau", missingPct: 54.8, impactRole: "Data Analyst", recommendation: "Mandate BI Dashboard Module" },
    { skill: "Advanced DSA (Graphs & DP)", missingPct: 48.2, impactRole: "Tier-1 SDE Hiring", recommendation: "Daily 2-Hour OA Problem Sprints" },
    { skill: "Redis & Distributed Caching", missingPct: 44.5, impactRole: "Backend Engineering", recommendation: "Microservices Architecture Seminar" },
    { skill: "System Design (HLD/LLD)", missingPct: 41.0, impactRole: "Product Companies", recommendation: "Senior Alumni Mock Interviews" },
  ];

  // Sample At-Risk Candidates needing intervention
  const atRiskCohort = [
    { roll: "21CSE104", name: "Kunal Mehra", branch: "CSE", cgpa: 6.82, missingCount: 5, dsa: "Novice", status: "Critical Shortlist Risk" },
    { roll: "21IT089", name: "Pooja Deshmukh", branch: "IT", cgpa: 6.95, missingCount: 4, dsa: "Novice", status: "Needs 1 Internship" },
    { roll: "21ECE045", name: "Aman Tyagi", branch: "ECE", cgpa: 6.40, missingCount: 6, dsa: "Novice", status: "Active Backlog Penalty" },
    { roll: "21CSE211", name: "Sneha Roy", branch: "CSE", cgpa: 7.10, missingCount: 3, dsa: "Novice", status: "Missing Core DBMS/SQL" },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase font-bold text-emerald-400">
              Live College TPO Intelligence Dashboard
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Campus Placement Cell & Cohort Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional overview of 2025/2026 Graduating Engineering Cohort (1,600 Candidates).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export TPO Summary</span>
          </button>
          <button
            onClick={onOpenPredictor}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test Individual Student Audit</span>
          </button>
        </div>
      </div>

      {/* Cohort KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Graduating Batch</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-3xl font-extrabold text-white font-mono block">
            {stats.totalStudents}
          </span>
          <span className="text-[11px] text-slate-500">Across CSE, IT, ECE & Core</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Predicted Placement Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono block">
            {stats.placementRatePredicted}
          </span>
          <span className="text-[11px] text-emerald-500/80">~1,174 Students Placement Ready</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Average Projected CTC</span>
            <GraduationCap className="w-4 h-4 text-sky-400" />
          </div>
          <span className="text-3xl font-extrabold text-sky-400 font-mono block">
            {stats.avgExpectedCtc}
          </span>
          <span className="text-[11px] text-slate-500">Max Projected: {stats.highestExpectedCtc}</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>At-Risk Students (Action Needed)</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-3xl font-extrabold text-rose-400 font-mono block">
            {stats.atRiskStudentsCount}
          </span>
          <span className="text-[11px] text-rose-400/80">Identified 6 Months Before Day-1</span>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            Branch-Wise Placement Readiness Distribution
          </h3>
          <span className="text-xs text-slate-400">Evaluated on Coursework & Technical Benchmarks</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {branchData.map((b, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-200">{b.name}</span>
                <span className="text-xs font-mono font-bold text-indigo-400">{b.readinessPct}% Ready</span>
              </div>

              {/* Progress */}
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div
                  style={{ width: `${b.readinessPct}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-sky-400"
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 pt-1 font-mono">
                <span>Avg CGPA: <strong>{b.avgCgpa}</strong></span>
                <span>Cohort: <strong>{b.count}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* College-Wide Missing Skill Deficits (Workshop Planner for College) */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Campus-Wide Technical Deficits & Recommended Interventions
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Identifies systemic skill gaps across the student body so the placement cell can organize targeted corporate bootcamps.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Missing Competency</th>
                <th className="py-3 px-4">% of Batch Lacking</th>
                <th className="py-3 px-4">Impacted Roles</th>
                <th className="py-3 px-4">TPO Recommended Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {topSkillDeficits.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-semibold text-slate-200">{item.skill}</td>
                  <td className="py-3 px-4 font-mono font-bold text-rose-400">{item.missingPct}%</td>
                  <td className="py-3 px-4 text-slate-300">{item.impactRole}</td>
                  <td className="py-3 px-4 font-medium text-indigo-300">{item.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Early Warning / At-Risk Student Cohort */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Proactive At-Risk Student Intervention List
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Identified 6 months before recruiters arrive to enable personalized mentoring and prevent placement failures.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Roll No</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Branch</th>
                <th className="py-2.5 px-3">CGPA</th>
                <th className="py-2.5 px-3">Missing Core Skills</th>
                <th className="py-2.5 px-3">DSA Level</th>
                <th className="py-2.5 px-3">Diagnostic Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {atRiskCohort.map((student, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 text-slate-400">{student.roll}</td>
                  <td className="py-2.5 px-3 font-sans font-semibold text-white">{student.name}</td>
                  <td className="py-2.5 px-3 text-slate-300">{student.branch}</td>
                  <td className="py-2.5 px-3 text-amber-400">{student.cgpa}</td>
                  <td className="py-2.5 px-3 text-rose-400">{student.missingCount} Skills</td>
                  <td className="py-2.5 px-3 text-slate-400">{student.dsa}</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950/40 text-rose-300 border border-rose-800/40">
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
