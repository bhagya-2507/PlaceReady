import React, { useState, useEffect } from "react";
import { Sparkles, TrendingUp, CheckCircle, ArrowRight, Zap, RefreshCw } from "lucide-react";
import { simulateOutcome } from "../utils/api";

export default function WhatIfSimulator({ baseFeatures, originalProb }) {
  const [boostInternship, setBoostInternship] = useState(false);
  const [boostDsa, setBoostDsa] = useState(false);
  const [boostProjects, setBoostProjects] = useState(0);
  const [addedSkillsCount, setAddedSkillsCount] = useState(0);

  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Automatically recalculate simulation when toggles change
  useEffect(() => {
    if (!baseFeatures) return;

    const runSim = async () => {
      setLoading(true);
      try {
        const res = await simulateOutcome({
          base_features: baseFeatures,
          boost_internship: boostInternship,
          boost_dsa: boostDsa,
          boost_projects: boostProjects,
          added_skills_count: addedSkillsCount,
        });
        setSimResult(res);
      } catch (err) {
        console.error("Simulation error", err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(runSim, 200);
    return () => clearTimeout(debounceTimer);
  }, [baseFeatures, boostInternship, boostDsa, boostProjects, addedSkillsCount]);

  if (!baseFeatures) return null;

  const simProb = simResult?.simulated_probability ?? originalProb;
  const delta = (simProb - originalProb).toFixed(1);
  const isPositive = parseFloat(delta) > 0;

  return (
    <div className="bg-gradient-to-b from-indigo-950/30 to-slate-900/60 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden space-y-5">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
              What-If Placement Probability Simulator
            </h3>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Interactive
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulate future milestones to see your real-time placement probability jump.
          </p>
        </div>

        {/* Dynamic Delta Badge */}
        <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2 rounded-xl border border-indigo-500/40 shrink-0">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium">Estimated Boost</span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              +{delta}% Probability
            </span>
          </div>
        </div>
      </div>

      {/* Comparison Meter */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Current: <strong className="text-slate-200 font-mono">{originalProb.toFixed(1)}%</strong>
          </span>
          <ArrowRight className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-300 font-medium">
            Simulated Outcome:{" "}
            <strong className="text-emerald-400 font-mono text-sm font-bold">
              {simProb.toFixed(1)}%
            </strong>
          </span>
        </div>

        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800 relative">
          {/* Base bar */}
          <div
            style={{ width: `${originalProb}%` }}
            className="h-full bg-slate-600 transition-all duration-300"
          />
          {/* Delta bar */}
          {isPositive && (
            <div
              style={{ width: `${Math.min(100 - originalProb, parseFloat(delta))}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 animate-pulse"
            />
          )}
        </div>
      </div>

      {/* Interactive Levers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Lever 1: Add 1 Internship */}
        <button
          type="button"
          onClick={() => setBoostInternship(!boostInternship)}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            boostInternship
              ? "bg-indigo-950/50 border-indigo-400 text-white shadow-sm shadow-indigo-500/20"
              : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-200">
              +1 Industry Internship
            </span>
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                boostInternship ? "bg-indigo-500 text-white" : "border border-slate-700"
              }`}
            >
              {boostInternship ? "✓" : "+"}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Simulates securing a summer tech internship
          </p>
        </button>

        {/* Lever 2: Upgrade DSA Level */}
        <button
          type="button"
          onClick={() => setBoostDsa(!boostDsa)}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            boostDsa
              ? "bg-indigo-950/50 border-indigo-400 text-white shadow-sm shadow-indigo-500/20"
              : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-200">
              Upgrade DSA Practice
            </span>
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                boostDsa ? "bg-indigo-500 text-white" : "border border-slate-700"
              }`}
            >
              {boostDsa ? "✓" : "+"}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Simulates solving 100+ LeetCode problems
          </p>
        </button>

        {/* Lever 3: Build 1-2 Projects */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200">Add Portfolio Projects</span>
            <span className="font-mono font-bold text-indigo-400">+{boostProjects}</span>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setBoostProjects(num)}
                className={`flex-1 py-1 rounded text-xs font-semibold ${
                  boostProjects === num
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                }`}
              >
                +{num}
              </button>
            ))}
          </div>
        </div>

        {/* Lever 4: Close Missing Skills */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200">Bridge Missing Skills</span>
            <span className="font-mono font-bold text-emerald-400">+{addedSkillsCount}</span>
          </div>
          <div className="flex gap-1">
            {[0, 2, 4].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setAddedSkillsCount(num)}
                className={`flex-1 py-1 rounded text-xs font-semibold ${
                  addedSkillsCount === num
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                }`}
              >
                +{num}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
