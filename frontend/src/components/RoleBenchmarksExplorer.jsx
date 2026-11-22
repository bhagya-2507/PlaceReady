import React, { useState } from "react";
import { Code2, BarChart3, Globe, Cpu, Check, Sparkles, Building2, Layers, Award } from "lucide-react";

const ROLE_ICONS = {
  sde: Code2,
  data_analyst: BarChart3,
  full_stack: Globe,
  ml_engineer: Cpu,
};

// Detailed company interview breakdown for each role
const ROLE_HIRING_PATTERNS = {
  sde: {
    rounds: [
      { round: "Round 1", name: "Online Coding Assessment (OA)", format: "2-3 DSA Questions (Arrays, Strings, Trees) + 20 MCQs (OS, DBMS, CS Fundamentals)" },
      { round: "Round 2", name: "Technical Interview I (DSA & Problem Solving)", format: "Live coding on Google Docs/CodePair: 2 Medium LeetCode problems + time complexity analysis" },
      { round: "Round 3", name: "Technical Interview II (System Design & Projects)", format: "Low-Level Design (OOP), database schema design, and deep dive into resume project architecture" },
      { round: "Round 4", name: "HR & Cultural Fit", format: "STAR method behavioral questions, willingness to relocate, team conflict scenarios" }
    ],
    sampleCompanies: ["Microsoft", "Amazon", "Atlassian", "Uber", "Swiggy", "Zomato", "Thoughtworks", "TCS Digital"]
  },
  data_analyst: {
    rounds: [
      { round: "Round 1", name: "Analytics & Aptitude Screener", format: "SQL query MCQs, Excel problem solving, and business probability statistics" },
      { round: "Round 2", name: "Live SQL & Data Wrangling", format: "Complex SQL Joins, Window Functions (RANK, DENSE_RANK), and Pandas aggregation tasks" },
      { round: "Round 3", name: "Business Case Study & Dashboard Presentation", format: "Walkthrough of customer churn or sales analysis using Power BI / Tableau dashboards" },
      { round: "Round 4", name: "Stakeholder Communication & HR", format: "Explaining complex metrics to non-technical stakeholders, scenario-based decisions" }
    ],
    sampleCompanies: ["Deloitte", "Mu Sigma", "EY", "Tiger Analytics", "Fractal", "Accenture", "Flipkart"]
  },
  full_stack: {
    rounds: [
      { round: "Round 1", name: "Frontend/Backend Machine Coding", format: "Build a responsive React application or FastAPI backend endpoint within 90 minutes" },
      { round: "Round 2", name: "Core JavaScript / React & Architecture", format: "Event loop, closures, hooks, state management (Redux), and REST API design" },
      { round: "Round 3", name: "Database & Project Defense", format: "Database normalization (SQL vs NoSQL), indexing, authentication (JWT), and live demo" },
      { round: "Round 4", name: "Product Mindset & HR", format: "Speed vs quality tradeoffs, user experience empathy, agile team workflows" }
    ],
    sampleCompanies: ["Postman", "Razorpay", "Juspay", "BrowserStack", "Freshworks", "Infosys Sp", "Cognizant"]
  },
  ml_engineer: {
    rounds: [
      { round: "Round 1", name: "ML Theory & Math Screener", format: "Linear Algebra, Calculus, Supervised vs Unsupervised ML, Bias-Variance tradeoff" },
      { round: "Round 2", name: "Model Building & Feature Engineering", format: "Handling class imbalance, feature scaling, training Scikit-learn pipelines with cross-validation" },
      { round: "Round 3", name: "MLOps & Deep Learning / LLM Architecture", format: "FastAPI inference serving, Docker packaging, PyTorch/TensorFlow, and vector search" },
      { round: "Round 4", name: "Research & Ethical AI Discussion", format: "Model explainability, data privacy, latency constraints in production" }
    ],
    sampleCompanies: ["Google AI", "Samsung R&D", "NVIDIA", "Wipro AI Labs", "Oracle Cloud", "InMobi"]
  }
};

export default function RoleBenchmarksExplorer({ roles, onSelectRoleForTest }) {
  const [activeRoleId, setActiveRoleId] = useState(roles[0]?.id || "sde");

  const currentRole = roles.find((r) => r.id === activeRoleId) || roles[0];
  const Icon = ROLE_ICONS[activeRoleId] || Code2;
  const hiring = ROLE_HIRING_PATTERNS[activeRoleId] || ROLE_HIRING_PATTERNS.sde;

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-xs font-mono uppercase font-bold text-sky-400">
            Industry Benchmark Matrix & Hiring Rounds
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white">
          Campus Recruitment Role Expectations & Criteria
        </h1>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          Aggregated from 100+ fresh-graduate campus hiring drives across Tier-1 Product and IT Services companies.
        </p>
      </div>

      {/* Role Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {roles.map((r) => {
          const TabIcon = ROLE_ICONS[r.id] || Code2;
          const isSelected = r.id === activeRoleId;

          return (
            <button
              key={r.id}
              onClick={() => setActiveRoleId(r.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? "bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <TabIcon className={`w-5 h-5 ${isSelected ? "text-indigo-400" : "text-slate-400"}`} />
                <span className="font-mono text-[11px] text-emerald-400">{r.avg_package}</span>
              </div>
              <h3 className="font-semibold text-xs text-white leading-tight">{r.title}</h3>
              <span className="text-[10px] text-slate-500 mt-0.5 block">{r.department}</span>
            </button>
          );
        })}
      </div>

      {/* Active Role Deep Dive */}
      {currentRole && (
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Icon className="w-6 h-6 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">{currentRole.title}</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">{currentRole.description}</p>
            </div>

            <button
              onClick={() => onSelectRoleForTest(currentRole.id)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Test My Resume for this Role</span>
            </button>
          </div>

          {/* 4 Typical Hiring Rounds */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Typical Campus Recruitment Interview Stages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {hiring.rounds.map((rnd, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold">
                    {rnd.round}
                  </span>
                  <h4 className="text-xs font-bold text-white pt-1">{rnd.name}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{rnd.format}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hiring Companies Bar */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
              Recruiting Companies for this Profile:
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {hiring.sampleCompanies.map((c, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
