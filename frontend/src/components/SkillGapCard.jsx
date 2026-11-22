import React from "react";
import { Check, X, AlertCircle, Sparkles, Target } from "lucide-react";

export default function SkillGapCard({ skillGap }) {
  if (!skillGap) return null;

  const {
    role_title,
    overall_skill_match_pct,
    core_match_pct,
    preferred_match_pct,
    matched_core_skills = [],
    missing_core_skills = [],
    matched_preferred_skills = [],
    missing_preferred_skills = [],
  } = skillGap;

  const totalCore = matched_core_skills.length + missing_core_skills.length;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-5">
      {/* Header & Overall Match bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">
              Skill Alignment Diagnostic ({role_title})
            </h3>
          </div>
          <span className="font-mono text-sm font-bold text-indigo-400">
            {overall_skill_match_pct}% Match
          </span>
        </div>

        {/* Multi-segment progress bar */}
        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
          <div
            style={{ width: `${overall_skill_match_pct}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-700"
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5">
          <span>Core Skills Match: <strong className="text-slate-200">{core_match_pct}%</strong></span>
          <span>Preferred Match: <strong className="text-slate-200">{preferred_match_pct}%</strong></span>
        </div>
      </div>

      {/* Core Skills (Crucial for Interviews) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Core Required Skills ({matched_core_skills.length}/{totalCore} acquired)
          </span>
          <span className="text-slate-400 text-[11px]">Mandatory for Screening</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Matched Core */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 space-y-1.5">
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Matched Core Skills ({matched_core_skills.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {matched_core_skills.length > 0 ? (
                matched_core_skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-800/40"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">None matched yet</span>
              )}
            </div>
          </div>

          {/* Missing Core */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-rose-500/20 space-y-1.5">
            <span className="text-[11px] font-semibold text-rose-400 flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Missing Core Skills ({missing_core_skills.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {missing_core_skills.length > 0 ? (
                missing_core_skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded text-xs font-medium bg-rose-950/40 text-rose-300 border border-rose-800/40"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-400 font-medium">All core skills covered! 🎉</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preferred & Bonus Skills */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Preferred / Differentiator Skills
          </span>
          <span className="text-slate-400 text-[11px]">Boosts CTC & Tier 1 Odds</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Matched Preferred */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-sky-500/20 space-y-1.5">
            <span className="text-[11px] font-semibold text-sky-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Bonus Skills Present ({matched_preferred_skills.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {matched_preferred_skills.length > 0 ? (
                matched_preferred_skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded text-xs font-medium bg-sky-950/40 text-sky-300 border border-sky-800/40"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">None present</span>
              )}
            </div>
          </div>

          {/* Missing Preferred */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              Recommended Additions ({missing_preferred_skills.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {missing_preferred_skills.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded text-xs font-medium bg-slate-900 text-slate-400 border border-slate-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
