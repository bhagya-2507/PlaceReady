import React from "react";
import {
  Sparkles,
  BrainCircuit,
  Building2,
  FileText,
  Home,
  Target,
  Compass,
  Trophy,
} from "lucide-react";

export default function Navbar({
  activeView,
  onNavigate,
  onOpenReport,
  onOpenVivaModal,
  hasResult,
  backendHealthy,
}) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "predictor", label: "Student Predictor", icon: Target },
    { id: "tpo", label: "College TPO Portal", icon: Building2 },
    { id: "ml_lab", label: "ML Algorithm Lab", icon: BrainCircuit },
    { id: "roles", label: "Role Benchmarks", icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-3 text-left cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                Place<span className="text-indigo-400">Ready</span> AI
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hidden sm:inline">
                500-Marks Capstone
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden lg:block">
              Campus Recruitment Predictor & Skill Gap Engine
            </p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Backend Status indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
            {backendHealthy ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 hidden sm:inline">API Online</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-amber-300 hidden sm:inline">API Offline</span>
              </>
            )}
          </div>

          {/* Viva Guide Button */}
          <button
            onClick={onOpenVivaModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all cursor-pointer"
            title="Open 500-Marks Capstone Defense Guide & Viva Questions"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Viva Guide</span>
          </button>

          {/* Printable Report button */}
          {hasResult && (
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-sm shadow-indigo-500/30 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Dossier</span>
              <span className="sm:hidden">PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950 px-2 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors ${
                isActive ? "text-indigo-400 font-bold" : "text-slate-400"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
