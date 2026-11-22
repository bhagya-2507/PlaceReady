import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Sparkles,
  Building2,
  CheckCircle2,
  Shield,
  Cpu,
  Database,
  Briefcase,
  Layers,
  ArrowRight
} from "lucide-react";

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: "Connecting Institutional Placement Core & Database", icon: Database },
    { label: "Calibrating 100-Point Placement Readiness Diagnostic", icon: Cpu },
    { label: "Syncing Active Corporate Hiring Drives & Matrices", icon: Briefcase },
    { label: "Configuring Student Skill Verification Modules", icon: Layers },
    { label: "PlaceReady Enterprise Portal Ready. Launching Session...", icon: Shield }
  ];

  useEffect(() => {
    // Slower, smooth, realistic loading progression (approx 3.5 - 4.2 seconds)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onFinish();
          }, 600);
          return 100;
        }

        // Smooth smaller increments
        const increment = Math.floor(Math.random() * 3) + 2;
        const next = Math.min(100, prev + increment);

        // Update step index
        if (next < 25) setCurrentStep(0);
        else if (next < 50) setCurrentStep(1);
        else if (next < 75) setCurrentStep(2);
        else if (next < 95) setCurrentStep(3);
        else setCurrentStep(4);

        return next;
      });
    }, 75);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white select-none px-4 overflow-hidden">
      {/* 1. Futuristic Ambient Neon Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-indigo-600/25 via-purple-600/20 to-sky-500/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-lg w-full text-center space-y-7">
        {/* 2. Animated Multi-Layer Hologram Icon */}
        <div className="relative flex items-center justify-center">
          {/* Outer rotating dashed ring */}
          <div className="absolute w-28 h-28 rounded-full border-2 border-dashed border-indigo-500/30 animate-spin duration-[12000ms]" />
          
          {/* Middle pulsing ring */}
          <div className="absolute w-24 h-24 rounded-full border border-indigo-400/20 animate-ping duration-1000" />

          {/* Central Logo Box with Gradient Glow */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/50 border border-indigo-400/40 relative">
            <GraduationCap className="w-10 h-10 text-white drop-shadow-md" />
            
            {/* Sparkle badge */}
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg">
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            </div>
          </div>
        </div>

        {/* 3. Branding Typography */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-semibold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PlaceReady Institutional Core</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Campus Placement Portal
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Centralized placement readiness analytics, verified resume evaluation, and corporate drives.
          </p>
        </div>

        {/* 4. Large Glowing Counter (0% - 100%) */}
        <div className="flex flex-col items-center pt-1">
          <div className="relative flex items-baseline justify-center">
            <span className="text-6xl sm:text-7xl font-black font-mono tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-indigo-300 drop-shadow-lg">
              {progress}
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-indigo-400 ml-1">
              %
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mt-1">
            System Initialization Progress
          </span>
        </div>

        {/* 5. Sleek Neon Progress Bar */}
        <div className="w-full space-y-2">
          <div className="w-full bg-slate-900/90 border border-slate-800 rounded-full h-3.5 p-0.5 overflow-hidden shadow-inner relative">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-100 ease-out shadow-lg shadow-indigo-500/60 relative"
              style={{ width: `${progress}%` }}
            >
              {/* Glowing head of progress bar */}
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white rounded-full shadow-[0_0_12px_#fff]" />
            </div>
          </div>

          {/* Micro milestone indicators */}
          <div className="flex justify-between text-[10px] font-mono text-slate-600 px-1">
            <span>0% CORE</span>
            <span>25% BENCHMARK</span>
            <span>50% DRIVES</span>
            <span>75% VERIFY</span>
            <span>100% READY</span>
          </div>
        </div>

        {/* 6. Dynamic Diagnostics Checklist */}
        <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-left space-y-2.5 backdrop-blur-sm">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isDone = progress >= (idx + 1) * 20;
            const isCurrent = currentStep === idx;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                  isDone
                    ? "text-emerald-400 font-medium"
                    : isCurrent
                    ? "text-indigo-300 font-semibold"
                    : "text-slate-600"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 text-[10px] transition-colors ${
                    isDone
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : isCurrent
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 animate-pulse"
                      : "bg-slate-800 text-slate-600 border border-slate-700/50"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Icon className="w-3 h-3" />
                  )}
                </div>

                <span className="truncate">{step.label}</span>

                {isCurrent && !isDone && (
                  <span className="ml-auto text-[10px] font-mono text-indigo-400 animate-pulse">
                    RUNNING...
                  </span>
                )}
                {isDone && (
                  <span className="ml-auto text-[10px] font-mono text-emerald-400">
                    DONE
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Skip button for quick convenience */}
        <button
          onClick={onFinish}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer flex items-center gap-1 mx-auto pt-1"
        >
          <span>Skip initialization & enter portal</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
