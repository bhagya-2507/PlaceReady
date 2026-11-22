import React, { useEffect, useState } from "react";
import { X, BrainCircuit, Activity, BarChart, CheckCircle2, ShieldAlert, Layers } from "lucide-react";
import { getModelTelemetry } from "../utils/api";

export default function ModelTelemetryModal({ isOpen, onClose }) {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      getModelTelemetry()
        .then(setTelemetry)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const models = telemetry?.models_evaluated ?? {};
  const bestModel = telemetry?.best_model ?? "Logistic Regression";
  const featureImportances = telemetry?.feature_importances ?? [];
  const cm = models[bestModel]?.confusion_matrix ?? [[0, 0], [0, 0]]; // [[TN, FP], [FN, TP]]

  const tn = cm[0]?.[0] ?? 0;
  const fp = cm[0]?.[1] ?? 0;
  const fn = cm[1]?.[0] ?? 0;
  const tp = cm[1]?.[1] ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Machine Learning Model Telemetry & Evaluation
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Best: {bestModel}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Rigorous evaluation across 1,600 campus recruitment records with 80/20 stratified validation.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            Loading model telemetry...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Model Comparison Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                Algorithm Performance Comparison (Test Split = 320 Students)
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Model Architecture</th>
                      <th className="py-2.5 px-3">Accuracy</th>
                      <th className="py-2.5 px-3">Precision</th>
                      <th className="py-2.5 px-3">Recall</th>
                      <th className="py-2.5 px-3">F1-Score</th>
                      <th className="py-2.5 px-3">ROC-AUC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {Object.entries(models).map(([name, m]) => {
                      const isBest = name === bestModel;
                      return (
                        <tr
                          key={name}
                          className={isBest ? "bg-indigo-950/30 text-white font-medium" : "text-slate-300"}
                        >
                          <td className="py-2.5 px-3 font-sans font-medium flex items-center gap-1.5">
                            {name}
                            {isBest && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-emerald-400">{m.accuracy}%</td>
                          <td className="py-2.5 px-3">{m.precision}%</td>
                          <td className="py-2.5 px-3">{m.recall}%</td>
                          <td className="py-2.5 px-3 font-semibold text-indigo-300">{m.f1_score}%</td>
                          <td className="py-2.5 px-3 text-sky-400">{m.roc_auc}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Confusion Matrix and Feature Importances */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Confusion Matrix */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Confusion Matrix ({bestModel})
                </h4>
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono pt-1">
                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
                    <span className="text-[10px] text-slate-400 block font-sans">True Negative (Not Placed)</span>
                    <span className="text-xl font-bold text-emerald-400">{tn}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20">
                    <span className="text-[10px] text-slate-400 block font-sans">False Positive (Type I Error)</span>
                    <span className="text-xl font-bold text-rose-400">{fp}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20">
                    <span className="text-[10px] text-slate-400 block font-sans">False Negative (Type II Error)</span>
                    <span className="text-xl font-bold text-rose-400">{fn}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
                    <span className="text-[10px] text-slate-400 block font-sans">True Positive (Placed)</span>
                    <span className="text-xl font-bold text-emerald-400">{tp}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Demonstrates <strong>high precision ({models[bestModel]?.precision}%)</strong> to avoid false confidence for unready students.
                </p>
              </div>

              {/* Feature Importance Rankings */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <BarChart className="w-4 h-4 text-sky-400" />
                  Feature Importance / Weight Breakdown
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {featureImportances.map((f, i) => (
                    <div key={i} className="text-xs space-y-1">
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="font-medium">{f.display_name}</span>
                        <span className="font-mono text-indigo-400">{f.relative_importance_pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, f.relative_importance_pct * 3)}%` }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
          >
            Close Telemetry View
          </button>
        </div>
      </div>
    </div>
  );
}
