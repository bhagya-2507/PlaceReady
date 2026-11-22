import React, { useState } from "react";
import { Sliders, Plus, X, GraduationCap, Briefcase, FolderGit2, Award, Terminal, AlertTriangle, RefreshCw } from "lucide-react";

export default function ProfileFineTuner({
  profile,
  onChangeProfile,
  onRunAnalysis,
  analyzing,
}) {
  const [newSkillInput, setNewSkillInput] = useState("");

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    const trimmed = newSkillInput.trim();
    if (!profile.candidate_skills.includes(trimmed)) {
      onChangeProfile({
        ...profile,
        candidate_skills: [...profile.candidate_skills, trimmed],
      });
    }
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    onChangeProfile({
      ...profile,
      candidate_skills: profile.candidate_skills.filter((s) => s !== skillToRemove),
    });
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">
              Extracted Profile Parameters
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-extracted from your resume. Adjust parameters if needed before running predictions.
          </p>
        </div>

        <button
          onClick={onRunAnalysis}
          disabled={analyzing}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          {analyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Running ML Model...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>Calculate Placement Readiness</span>
            </>
          )}
        </button>
      </div>

      {/* Grid of Sliders and Numeric Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CGPA */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              CGPA (Scale 10)
            </span>
            <span className="font-mono font-bold text-indigo-300 text-sm">
              {Number(profile.cgpa).toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="5.0"
            max="10.0"
            step="0.05"
            value={profile.cgpa}
            onChange={(e) =>
              onChangeProfile({ ...profile, cgpa: parseFloat(e.target.value) })
            }
            className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>5.0</span>
            <span className="text-amber-400 font-semibold">7.0 (Shortlist Cutoff)</span>
            <span>10.0</span>
          </div>
        </div>

        {/* Internships Count */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Briefcase className="w-4 h-4 text-sky-400" />
              Internships Count
            </span>
            <span className="font-mono font-bold text-sky-300 text-sm">
              {profile.internships_count}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() =>
                  onChangeProfile({ ...profile, internships_count: num })
                }
                className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                  profile.internships_count === num
                    ? "bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/30"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400">
            Industry work experience heavily boosts conversion
          </p>
        </div>

        {/* Projects Count */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <FolderGit2 className="w-4 h-4 text-emerald-400" />
              Portfolio Projects
            </span>
            <span className="font-mono font-bold text-emerald-300 text-sm">
              {profile.projects_count}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() =>
                  onChangeProfile({ ...profile, projects_count: num })
                }
                className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                  profile.projects_count === num
                    ? "bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400">
            Recommended: Minimum 2-3 production projects
          </p>
        </div>

        {/* DSA Readiness Level */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Terminal className="w-4 h-4 text-amber-400" />
              DSA / Coding OA
            </span>
            <span className="font-mono font-bold text-amber-300 text-xs">
              {["Novice", "Intermediate", "Advanced"][profile.dsa_level]}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { val: 0, label: "Novice" },
              { val: 1, label: "50-150" },
              { val: 2, label: "200+" },
            ].map((lvl) => (
              <button
                key={lvl.val}
                type="button"
                onClick={() =>
                  onChangeProfile({ ...profile, dsa_level: lvl.val })
                }
                className={`flex-1 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  profile.dsa_level === lvl.val
                    ? "bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400">
            Solved questions on LeetCode/GFG
          </p>
        </div>
      </div>

      {/* Skills Tags Manager */}
      <div className="space-y-2.5 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-semibold text-slate-300">
            Extracted Technical Skills ({profile.candidate_skills.length} recognized):
          </label>
          {/* Add skill input */}
          <form onSubmit={handleAddSkill} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add skill (e.g. Docker, Redis)..."
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-48"
            />
            <button
              type="submit"
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-medium flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 max-h-36 overflow-y-auto">
          {profile.candidate_skills.length === 0 ? (
            <span className="text-xs text-slate-500 italic">
              No skills recognized yet. Upload a resume or select a sample profile above.
            </span>
          ) : (
            profile.candidate_skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-900 border border-slate-700/80 text-slate-200 group"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
