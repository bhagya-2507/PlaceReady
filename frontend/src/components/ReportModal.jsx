import React from "react";
import { X, Printer, Download, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";

export default function ReportModal({ isOpen, onClose, analysisResult, candidateProfile }) {
  if (!isOpen || !analysisResult) return null;

  const handlePrint = () => {
    window.print();
  };

  const prob = analysisResult.placement_probability_pct;
  const role = analysisResult.role_title;
  const skills = candidateProfile?.candidate_skills ?? [];
  const missingCore = analysisResult.skill_gap?.missing_core_skills ?? [];
  const missingPref = analysisResult.skill_gap?.missing_preferred_skills ?? [];
  const courses = analysisResult.recommendations?.recommended_courses ?? [];
  const roadmap = analysisResult.recommendations?.placement_roadmap ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto print:p-0 print:max-h-none print:shadow-none print:border-none">
        {/* Controls - Hidden on print */}
        <div className="no-print flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-sm">
              Placement Readiness Diagnostic Dossier
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Header */}
        <div className="space-y-6">
          <div className="flex justify-between items-start border-b-2 border-indigo-600 pb-4">
            <div>
              <span className="text-[11px] font-bold tracking-widest text-indigo-600 uppercase font-mono">
                Official Campus Placement Intelligence
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-0.5">
                Placement Readiness Audit
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Candidate: <strong>{candidateProfile?.candidate_name || "Final Year Student"}</strong> | Date: {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold font-mono text-indigo-600">
                {prob.toFixed(1)}%
              </span>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Placement Odds
              </span>
            </div>
          </div>

          {/* Student Profile Summary */}
          <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Target Role</span>
              <span className="font-bold text-slate-800">{role}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Academic CGPA</span>
              <span className="font-bold text-slate-800">{Number(candidateProfile?.cgpa).toFixed(2)} / 10</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Internships</span>
              <span className="font-bold text-slate-800">{candidateProfile?.internships_count} Experience(s)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Readiness Rating</span>
              <span className="font-bold text-indigo-600">{analysisResult.readiness_status}</span>
            </div>
          </div>

          {/* Skill Diagnostic */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-1">
              Technical Skill Gaps & Deficiencies
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg">
                <span className="font-bold text-red-800 block text-[11px] mb-1">
                  Missing Core Required Skills ({missingCore.length}):
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {missingCore.length > 0 ? missingCore.join(", ") : "None — All core benchmark skills acquired!"}
                </p>
              </div>
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg">
                <span className="font-bold text-amber-800 block text-[11px] mb-1">
                  Missing Differentiator Skills ({missingPref.length}):
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {missingPref.length > 0 ? missingPref.slice(0, 5).join(", ") : "None missing."}
                </p>
              </div>
            </div>
          </div>

          {/* Curated 30-Day Sprint Roadmap */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-1">
              Targeted 30-Day Placement Resolution Plan
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {roadmap.map((week, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-indigo-700 text-[11px] block">
                    {week.phase}: {week.title}
                  </span>
                  <p className="text-slate-600 text-[11px] mt-0.5">{week.goal}</p>
                </div>
              ))}
            </div>
          </div>

          {/* High Yield Courses */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-1">
              Curated Skill Acquisition Links
            </h4>
            <ul className="text-xs space-y-1 text-slate-700">
              {courses.slice(0, 3).map((c, idx) => (
                <li key={idx} className="flex justify-between">
                  <span><strong>{c.target_skill}:</strong> {c.title} ({c.provider})</span>
                  <span className="text-indigo-600 font-mono text-[11px]">{c.duration}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Signoff stamp */}
          <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
            <span>PlaceReady AI Engine | Model: {analysisResult.model_used}</span>
            <span>Verified Campus Recruitment Predictive Evaluation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
