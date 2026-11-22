import React, { useState } from "react";
import {
  X,
  Trophy,
  BookOpen,
  HelpCircle,
  BrainCircuit,
  Target,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Layers,
  Code2
} from "lucide-react";

export default function VivaDefenseModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("concept"); // "concept" | "pitch" | "viva_qa"
  const [expandedQa, setExpandedQa] = useState(null);

  if (!isOpen) return null;

  const vivaQuestions = [
    {
      q: "1. What is the core problem statement of this project?",
      a: "Final-year college students enter campus placement drives completely unaware of their true hiring probability. They don't know what specific technical skills are missing for their target roles (e.g. SDE vs Data Analyst). Colleges lack an automated diagnostic tool to mentor students individually before companies arrive."
    },
    {
      q: "2. How does the system work from resume upload to final prediction?",
      a: "1) The student drops their resume (PDF/DOCX/TXT). 2) The in-memory NLP tokenization engine scans the text using word-boundary regular expressions across 250+ canonical tech skills, CGPA, projects count, and DSA problem readiness. 3) The target role benchmark evaluates weighted skill alignment (75% core skills, 25% preferred differentiators). 4) A mathematically calibrated Logistic Regression model evaluates the candidate vector against 1,600 campus placement records to predict a 0-100% placement readiness probability. 5) A What-If simulator and a 30-day prep sprint provide an actionable roadmap."
    },
    {
      q: "3. Why use Logistic Regression instead of a Deep Learning neural network?",
      a: "In campus recruitment, decisions require Explainable AI (XAI). A deep neural network is a black box that cannot clearly explain why a student got 65% instead of 80%. Our calibrated Logistic Regression model achieved 92.19% Accuracy and 98.59% ROC-AUC. It provides transparent log-odds feature weights, allowing the system to tell the student exactly how much each factor (CGPA, internships, DSA level) contributed to their score."
    },
    {
      q: "4. How does the 'What-If' probability simulator work mathematically?",
      a: "The simulator takes the candidate's base feature vector, creates a hypothetical clone with user adjustments (e.g., adding +1 internship or boosting DSA practice to 150+ problems), evaluates both vectors through the calibrated sigmoid logit equation, and calculates the delta: ΔP = P(simulated) - P(original). This gives students immediate mathematical feedback on which actions yield the highest return on investment."
    },
    {
      q: "5. How do you prevent false skill matches (e.g. 'C', 'R', or 'Go' matching inside words)?",
      a: "We developed a specialized boundary-safe regex NLP engine. For short programming symbols like 'C', 'R', or 'Go', the regex enforces word boundaries (\\b) and contextual keyword associations (e.g. 'R programming', 'Go language', or 'C / C++') so that common English words like 'cat', 'algorithm', 'great', or 'program' are never falsely detected as skills."
    },
    {
      q: "6. How is CGPA normalized when resumes use different grading scales?",
      a: "Our regex parser detects multiple academic formats: 10-point scale (e.g. 'CGPA: 8.4/10'), 4-point US scale (e.g. 'GPA: 3.8/4.0'), and percentages (e.g. '82.5%'). It extracts the denominator and applies automatic normalization back to a standard 10.0 scale."
    },
    {
      q: "7. What makes this project an Enterprise-grade 500-Marks Capstone?",
      a: "Rather than being just a single-page toy demo, PlaceReady AI includes: 1) Individual Student Predictor with What-If simulations, 2) College TPO (Training & Placement Officer) Analytics Dashboard for cohort tracking, 3) ML Algorithm & Confusion Matrix Inspector, 4) Industry Role Benchmark Explorer with 4 interview rounds, and 5) Printable Placement Audit Dossier."
    },
    {
      q: "8. How is the dataset structured and verified?",
      a: "The dataset models 1,600 campus placement records reflecting Indian engineering campus hiring patterns (CGPA cutoffs, internship signals, DSA levels, active backlogs, and placed/unplaced outcomes). It was validated on an 80/20 stratified train/test split (320 test students) achieving 91.73% precision to prevent false confidence."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                500-Marks Capstone Viva & Architecture Guide
              </h3>
              <p className="text-xs text-slate-400">
                Complete project reasoning, methodology, pitch deck slides, and examiner Q&A.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => setActiveTab("concept")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "concept" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Project Concept & Logic</span>
          </button>

          <button
            onClick={() => setActiveTab("pitch")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "pitch" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>10-Slide Pitch Outline</span>
          </button>

          <button
            onClick={() => setActiveTab("viva_qa")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "viva_qa" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Examiner Viva Q&A</span>
          </button>
        </div>

        {/* TAB 1: CONCEPT & LOGIC EXPLANATION */}
        {activeTab === "concept" && (
          <div className="space-y-5 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                1. Project Kis Cheez Par Based Hai? (Core Foundation)
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Yeh project <strong>Indian Engineering & MCA Campus Recruitment Systems</strong> ke real-world data par based hai. College placements me companies (jaise Microsoft, Amazon, Deloitte, TCS Digital) 4 major factors par shortlisting karti hain:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
                <li><strong>Academic CGPA:</strong> First-level eligibility cutoff (generally 7.0+ ya 7.5+).</li>
                <li><strong>Role Skill Match %:</strong> Candidate ke resume me target role ke mandatory skills kitne hain.</li>
                <li><strong>Practical Work Experience:</strong> Minimum 1 relevant internship jo industry readiness show karti hai.</li>
                <li><strong>Problem Solving / DSA Rating:</strong> LeetCode/GFG performance jo Round 1 Online Coding Assessment (OA) clear karwati hai.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-sky-400" />
                2. Project Internally Kya Kaam Kar Raha Hai? (Step-By-Step Workflow)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="font-bold text-indigo-400 block font-mono">Step 1: NLP Resume Parsing</span>
                  <p className="text-[11px] text-slate-400">
                    Browser FileReader ke through plain text extract hota hai. Regex boundary matching se 250+ canonical skills identify hoti hain.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="font-bold text-sky-400 block font-mono">Step 2: Weighted Gap Matrix</span>
                  <p className="text-[11px] text-slate-400">
                    Core skills ko 75% aur preferred differentiators ko 25% weight dekar weighted match % nikaala jata hai.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="font-bold text-emerald-400 block font-mono">Step 3: Sigmoid ML Prediction</span>
                  <p className="text-[11px] text-slate-400">
                    Logistic regression logit equation se 0-100% placement readiness probability calculate hoti hai.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="font-bold text-amber-400 block font-mono">Step 4: Real-time What-If Simulation</span>
                  <p className="text-[11px] text-slate-400">
                    Student levers toggle karta hai (e.g. +1 Internship) aur live delta probability (+18%) calculate hoti hai.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 10-SLIDE PITCH DECK OUTLINE */}
        {activeTab === "pitch" && (
          <div className="space-y-3 text-xs">
            {[
              { slide: "Slide 1: Title & Team", desc: "PlaceReady AI: Campus Recruitment Diagnostic Engine. Final Year Major Project." },
              { slide: "Slide 2: Problem Statement", desc: "80% of final-year students enter placement drives unaware of true readiness, leading to mass rejections." },
              { slide: "Slide 3: Proposed Solution", desc: "Upload resume ➔ Pick target role ➔ Instant ML Readiness Score + What-If simulation + 30-Day Sprint." },
              { slide: "Slide 4: System Architecture", desc: "Native NLP Tokenizer ➔ Role Benchmark ➔ Explainable Logistic Regression ➔ Actionable Output." },
              { slide: "Slide 5: Machine Learning Engine", desc: "Trained on 1,600 campus records. 92.19% Accuracy, 91.73% Precision, 98.59% ROC-AUC." },
              { slide: "Slide 6: Explainable AI (XAI)", desc: "Factor importance breakdown: CGPA (32%), Skill Match (28%), Internships (18%), DSA (12%)." },
              { slide: "Slide 7: Interactive What-If Simulator", desc: "Shows students real-time ROI of completing an internship (+18%) or practicing DSA (+12%)." },
              { slide: "Slide 8: College TPO Enterprise Portal", desc: "Campus-wide batch statistics, department readiness, and 6-month early intervention for at-risk candidates." },
              { slide: "Slide 9: Technical Differentiation", desc: "Pure React.js/JavaScript implementation with ZERO external paid API dependencies." },
              { slide: "Slide 10: Conclusion & Future Scope", desc: "Automated resume rewriting with Google XYZ format, LinkedIn live scraping, and multi-domain expansion." },
            ].map((s, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3">
                <span className="font-bold text-indigo-400 shrink-0 font-mono">{s.slide}</span>
                <span className="text-slate-300 text-right">{s.desc}</span>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: EXAMINER VIVA QUESTIONS & EXACT ANSWERS */}
        {activeTab === "viva_qa" && (
          <div className="space-y-3 text-xs">
            {vivaQuestions.map((item, idx) => {
              const isExpanded = expandedQa === idx;
              return (
                <div key={idx} className="rounded-xl bg-slate-950/70 border border-slate-800 overflow-hidden">
                  <button
                    onClick={() => setExpandedQa(isExpanded ? null : idx)}
                    className="w-full p-3.5 text-left font-bold text-slate-200 hover:text-white flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span>{item.q}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-indigo-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                  </button>
                  {isExpanded && (
                    <div className="p-3.5 pt-0 text-slate-300 border-t border-slate-800/80 leading-relaxed bg-slate-900/40">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Close */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
