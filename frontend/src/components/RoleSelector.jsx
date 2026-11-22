import React from "react";
import { Code2, BarChart3, Globe, Cpu, ChevronRight, Check } from "lucide-react";

const ROLE_ICONS = {
  sde: Code2,
  data_analyst: BarChart3,
  full_stack: Globe,
  ml_engineer: Cpu,
};

export default function RoleSelector({ roles, selectedRole, onSelectRole }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
            Step 1: Select Target Career Role
          </h2>
          <p className="text-xs text-slate-400">
            Real market benchmark criteria evaluated against 100+ hiring drives.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {roles.map((role) => {
          const Icon = ROLE_ICONS[role.id] || Code2;
          const isSelected = selectedRole === role.id;

          return (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 relative group flex flex-col justify-between ${
                isSelected
                  ? "bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/50"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-800 text-slate-400 group-hover:text-indigo-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-sm text-slate-100 group-hover:text-white leading-tight">
                  {role.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {role.description}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Avg CTC:</span>
                <span className="font-mono font-medium text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/30">
                  {role.avg_package}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
