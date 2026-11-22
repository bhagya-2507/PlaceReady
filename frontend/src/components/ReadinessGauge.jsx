import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Award, CheckCircle, AlertTriangle, XCircle, TrendingUp } from "lucide-react";

export default function ReadinessGauge({ analysisResult }) {
  const prob = analysisResult?.placement_probability_pct ?? 0;
  const status = analysisResult?.readiness_status ?? "Analyzing...";
  const badge = analysisResult?.readiness_badge ?? "Pending";
  const factors = analysisResult?.factors_breakdown ?? [];

  // Trigger celebratory confetti if readiness is >= 80%
  useEffect(() => {
    if (prob >= 80) {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.65 },
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [prob]);

  // Color scheme based on score
  const getColorClass = () => {
    if (prob >= 80) return { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", stroke: "#10b981" };
    if (prob >= 62) return { text: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/30", stroke: "#38bdf8" };
    if (prob >= 45) return { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", stroke: "#f59e0b" };
    return { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", stroke: "#f43f5e" };
  };

  const scheme = getColorClass();

  // SVG Gauge calculations
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (prob / 100) * circumference;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Circular Gauge */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-44 h-44 transform -rotate-90">
            {/* Background track */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              className="text-slate-800/80"
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke={scheme.stroke}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-4xl font-extrabold tracking-tight font-mono ${scheme.text}`}>
              {prob.toFixed(1)}%
            </span>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
              Placement Odds
            </span>
          </div>
        </div>

        {/* Status & Factors Breakdown */}
        <div className="flex-1 text-center lg:text-left space-y-3">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${scheme.bg} ${scheme.text} ${scheme.border} flex items-center gap-1.5`}>
              <Award className="w-3.5 h-3.5" />
              <span>{badge} Rating</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">
              ML Model: <span className="text-slate-200 font-mono">{analysisResult.model_used}</span>
            </span>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">
            {status}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {prob >= 75
              ? "Your profile aligns well with campus hiring bars for this role. Maintaining technical consistency in Data Structures and system design will secure Day-1 company offers."
              : prob >= 50
              ? "Strong potential, but key technical differentiators (specific framework depth, internship signals, or advanced DSA practice) need bridging before interview shortlists."
              : "Substantial gaps detected against target company benchmarks. Follow the tailored 30-day sprint below to quickly elevate your resume into the interview eligibility pool."}
          </p>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
            {factors.slice(0, 3).map((f, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-left">
                <span className="text-[10px] text-slate-400 block truncate">{f.factor}</span>
                <span className="text-xs font-semibold text-slate-200 font-mono mt-0.5 block truncate">
                  {f.value}
                </span>
                <span className={`text-[10px] mt-0.5 block truncate ${
                  f.status === 'pass' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {f.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
