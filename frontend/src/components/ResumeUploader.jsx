import React, { useRef, useState } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, Loader2, ArrowRight } from "lucide-react";

export default function ResumeUploader({
  onUploadFile,
  onSelectSample,
  sampleResumes,
  loading,
  uploadedFileName,
  candidateName,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUploadFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
            Step 2: Upload Resume or Try 1-Click Samples
          </h2>
          <p className="text-xs text-slate-400">
            Extracts skills, CGPA, projects count, and internships using NLP tokenization.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Dropzone (2 cols on large screens) */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`lg:col-span-2 border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
            isDragging
              ? "border-indigo-400 bg-indigo-950/20 scale-[0.99]"
              : uploadedFileName
              ? "border-emerald-500/50 bg-emerald-950/10 hover:bg-emerald-950/20"
              : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
            className="hidden"
          />

          {loading ? (
            <div className="flex flex-col items-center py-4">
              <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-3" />
              <p className="text-sm font-medium text-slate-200">
                Parsing resume with NLP engine...
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Extracting technical skills, projects, and CGPA metrics
              </p>
            </div>
          ) : uploadedFileName ? (
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white">
                {uploadedFileName}
              </p>
              <p className="text-xs text-emerald-400 mt-0.5 font-medium">
                Successfully parsed for candidate: {candidateName || "Candidate"}
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                Click or drag another file to replace (PDF, DOCX, TXT)
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 border border-indigo-500/20">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Click to browse or drag and drop your resume
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports PDF, DOCX, or Plain Text files (Max 10MB)
              </p>
            </div>
          )}
        </div>

        {/* 1-Click Sample Resumes for instant testing */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Instant Test Resumes</span>
            </div>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              No resume file handy? Test the ML engine immediately with pre-configured student profiles:
            </p>

            <div className="space-y-2">
              {sampleResumes.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSelectSample(sample.id)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950/70 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 transition-all group flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                      {sample.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {sample.summary}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1">
            <span>✨ Automatically loads skills, CGPA & experiences</span>
          </div>
        </div>
      </div>
    </div>
  );
}
