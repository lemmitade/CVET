"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  UploadCloud,
  FileCheck,
  SearchCheck,
  AlertTriangle,
  XCircle,
  Info,
  CheckCircle2,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Target,
  RefreshCw,
} from "lucide-react";

export default function AtsCheckerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedCvText, setPastedCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");

  const MAX_FILE_SIZE = 1048576; // 1 MB (1,048,576 bytes)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Frontend Size Validation: strictly max 1 MB (1,048,576 bytes)
      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage(
          `File size exceeds the 1 MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB). Please upload a file under 1,048,576 bytes.`
        );
        setSelectedFile(null);
        return;
      }

      // Frontend File Type Validation
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext !== "pdf" && ext !== "docx" && ext !== "doc" && ext !== "txt") {
        setErrorMessage("Invalid file type. Please upload a PDF (.pdf) or Microsoft Word (.docx) document.");
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile && !pastedCvText.trim()) {
      setErrorMessage("Please select a CV file or paste your CV text to scan.");
      return;
    }

    setIsScanning(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      if (pastedCvText.trim()) {
        formData.append("cvText", pastedCvText.trim());
      }
      if (jobDescription.trim()) {
        formData.append("jobDescription", jobDescription.trim());
      }

      const res = await fetch("/api/ats/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "ATS analysis failed.");
      }

      setScanResult(data.analysis);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during ATS analysis.");
    } finally {
      setIsScanning(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 border-emerald-500";
    if (score >= 60) return "text-amber-500 border-amber-500";
    return "text-red-500 border-red-500";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00AEEF]/10 border border-[#00AEEF]/20 text-[#00AEEF] text-xs font-bold uppercase tracking-wider mb-3">
            <SearchCheck className="w-3.5 h-3.5" />
            ATS Compatibility Scanner
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Check Your ATS Score & Get Hired
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Upload your CV (PDF or DOCX, max 1 MB) to detect parsing bottlenecks, missing contact headers, keyword gaps, and formatting red flags.
          </p>
        </div>

        {/* INPUT FORM SECTION */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Toggle Upload vs Paste */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
                activeTab === "upload"
                  ? "border-[#00AEEF] text-[#00AEEF]"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Upload Document (PDF / DOCX)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("paste")}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
                activeTab === "paste"
                  ? "border-[#00AEEF] text-[#00AEEF]"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Paste CV Text Directly
            </button>
          </div>

          <div className="space-y-6">
            {activeTab === "upload" ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  1. Select Resume Document (Max 1 MB) *
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-800/20 hover:border-[#00AEEF] transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-[#00AEEF]/10 flex items-center justify-center text-[#00AEEF]">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    {selectedFile ? (
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(selectedFile.size / 1024).toFixed(1)} KB (Under 1 MB limit)
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          Click to browse or drag & drop your CV
                        </p>
                        <p className="text-xs text-slate-500">
                          PDF or DOCX • Max file size: 1,048,576 bytes (1 MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Paste Resume Plain Text *
                </label>
                <textarea
                  rows={6}
                  value={pastedCvText}
                  onChange={e => setPastedCvText(e.target.value)}
                  placeholder="Paste your CV text here..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00AEEF]"
                />
              </div>
            )}

            {/* Optional Job Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#7259FF]" />
                  <span>2. Target Job Description (Optional — Enables Job Match Score)</span>
                </label>
                <span className="text-[11px] text-slate-400">Match keywords</span>
              </div>
              <textarea
                rows={4}
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the job advertisement / requirements here to calculate your job-match alignment..."
                className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00AEEF]"
              />
            </div>

            {/* Submit scan button */}
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isScanning}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00AEEF] to-[#7259FF] text-white font-bold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running ATS Diagnostics...
                </>
              ) : (
                <>
                  <SearchCheck className="w-4 h-4" />
                  Analyze My CV Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* RESULTS SECTION */}
        {scanResult && (
          <div className="mt-12 max-w-4xl mx-auto space-y-8 text-left">
            {/* Top Score Banner */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    ATS Audit Results
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    Overall Compatibility Score
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 max-w-md">
                    Based on machine readability, standard CV sections, action verbs, and keyword density.
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  {/* Main Score Gauge */}
                  <div className="text-center">
                    <div
                      className={`w-20 h-20 rounded-full border-4 flex items-center justify-center font-extrabold text-3xl shadow-sm ${getScoreColor(
                        scanResult.score
                      )}`}
                    >
                      {scanResult.score}
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 mt-1 block">
                      Overall ATS
                    </span>
                  </div>

                  {/* Job Match Score (Only if JD provided) */}
                  {scanResult.hasJobDescription && scanResult.jobMatchScore !== null && (
                    <div className="text-center border-l border-slate-200 dark:border-slate-800 pl-6">
                      <div
                        className={`w-20 h-20 rounded-full border-4 flex items-center justify-center font-extrabold text-3xl shadow-sm ${getScoreColor(
                          scanResult.jobMatchScore
                        )}`}
                      >
                        {scanResult.jobMatchScore}%
                      </div>
                      <span className="text-[11px] font-bold text-[#7259FF] mt-1 block">
                        Job Match
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sub-scores breakdown */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[
                  { label: "Readability", val: scanResult.readabilityScore },
                  { label: "Sections", val: scanResult.sectionsScore },
                  { label: "Experience", val: scanResult.experienceScore },
                  { label: "Skills Density", val: scanResult.skillsScore },
                  { label: "Formatting", val: scanResult.formattingScore },
                ].map((s, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    <div className="text-[11px] text-slate-500">{s.label}</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {s.val}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyword Matching Breakdown (if JD provided) */}
            {scanResult.hasJobDescription && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#7259FF]" />
                  Job Description Keyword Analysis
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Matched */}
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Matched Keywords ({scanResult.matchedKeywords?.length || 0})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {scanResult.matchedKeywords?.map((kw: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                    <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      Missing Target Keywords ({scanResult.missingKeywords?.length || 0})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {scanResult.missingKeywords?.length > 0 ? (
                        scanResult.missingKeywords.map((kw: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[11px] bg-amber-500/20 text-amber-700 dark:text-amber-300 font-medium"
                          >
                            {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No major keyword gaps identified.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Diagnostic Issues & Fixes */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#00AEEF]" />
                Diagnostics & Severity Findings ({scanResult.issues?.length || 0})
              </h3>

              <div className="space-y-3">
                {scanResult.issues?.map((issue: any, idx: number) => {
                  const isCrit = issue.severity === "CRITICAL";
                  const isWarn = issue.severity === "WARNING";
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border space-y-1.5 ${
                        isCrit
                          ? "bg-red-500/10 border-red-500/20"
                          : isWarn
                          ? "bg-amber-500/10 border-amber-500/20"
                          : "bg-blue-500/10 border-blue-500/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isCrit ? (
                            <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                          ) : isWarn ? (
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                          ) : (
                            <Info className="w-4 h-4 text-blue-500 shrink-0" />
                          )}
                          <span
                            className={`text-xs font-bold ${
                              isCrit ? "text-red-700 dark:text-red-300" : isWarn ? "text-amber-700 dark:text-amber-300" : "text-blue-700 dark:text-blue-300"
                            }`}
                          >
                            {issue.title}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            isCrit
                              ? "bg-red-500/20 text-red-600 dark:text-red-300"
                              : isWarn
                              ? "bg-amber-500/20 text-amber-600 dark:text-amber-300"
                              : "bg-blue-500/20 text-blue-600 dark:text-blue-300"
                          }`}
                        >
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {issue.message}
                      </p>
                      <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-200 pt-1">
                        👉 Action: {issue.recommendation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-[11px] text-slate-500 leading-relaxed">
              <span className="font-bold text-slate-700 dark:text-slate-300">Disclaimer: </span>
              {scanResult.disclaimer}
            </div>

            {/* CTA Button to fix in Builder */}
            <div className="text-center pt-4">
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00AEEF] to-[#7259FF] text-white font-bold text-sm shadow-lg hover:opacity-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Fix Issues in CVET Builder Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
