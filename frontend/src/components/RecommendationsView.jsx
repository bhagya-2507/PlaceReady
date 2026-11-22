import React, { useState } from "react";
import { BookOpen, FolderCode, Calendar, ExternalLink, CheckCircle2, Clock, Sparkles } from "lucide-react";

export default function RecommendationsView({ recommendations }) {
  const [activeTab, setActiveTab] = useState("roadmap");

  if (!recommendations) return null;

  const {
    recommended_courses = [],
    project_blueprints = [],
    placement_roadmap = [],
  } = recommendations;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
      {/* Header and Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Actionable Roadmap & Skill Gap Resolution
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Personalized guidance engineered to bridge your specific missing skills.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "roadmap"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>30-Day Sprint</span>
          </button>

          <button
            onClick={() => setActiveTab("courses")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "courses"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Target Courses ({recommended_courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "projects"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FolderCode className="w-3.5 h-3.5" />
            <span>Project Blueprints ({project_blueprints.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: 30-Day Sprint Roadmap */}
      {activeTab === "roadmap" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {placement_roadmap.map((week, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between space-y-3 relative group hover:border-indigo-500/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {week.phase}
                    </span>
                    <span className="text-[11px] text-slate-500">Days {idx * 7 + 1}–{(idx + 1) * 7}</span>
                  </div>

                  <h4 className="text-sm font-semibold text-white leading-snug">
                    {week.title}
                  </h4>
                  <p className="text-xs text-indigo-300/90 mt-1 font-medium">
                    Goal: {week.goal}
                  </p>

                  <ul className="mt-3 space-y-2 text-xs text-slate-400">
                    {week.key_actions.map((act, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Milestone Verification</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Target Courses */}
      {activeTab === "courses" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommended_courses.map((course, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between space-y-3 hover:border-indigo-500/30 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="font-semibold text-indigo-400 px-2 py-0.5 rounded bg-indigo-950/50 border border-indigo-800/40">
                    Skill: {course.target_skill}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {course.duration}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-white leading-snug">
                  {course.title}
                </h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Provider: <span className="text-slate-300">{course.provider}</span>
                </p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-900 hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-800 hover:border-indigo-500"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Project Blueprints */}
      {activeTab === "projects" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project_blueprints.map((proj, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3 hover:border-sky-500/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-950/50 text-sky-400 border border-sky-800/40">
                  Difficulty: {proj.difficulty}
                </span>
                <span className="text-xs text-emerald-400 font-mono font-medium">
                  Portfolio Ready
                </span>
              </div>

              <h4 className="text-base font-bold text-white">
                {proj.title}
              </h4>

              <div className="flex flex-wrap gap-1.5">
                {proj.tech_stack.map((t, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 text-slate-300 border border-slate-800"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {proj.description}
              </p>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-indigo-300">
                <strong className="text-slate-200">Interview Value: </strong>
                {proj.impact_pitch}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
