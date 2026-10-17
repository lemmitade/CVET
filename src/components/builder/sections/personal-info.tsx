"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export interface PersonalInfoData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  targetJobTitle: string;
  yearsOfExperience: number;
  summary: string;
}

interface PersonalInfoSectionProps {
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
  onAiImproveSummary: () => void;
  aiLoading: boolean;
}

export function PersonalInfoSection({
  data,
  onChange,
  onAiImproveSummary,
  aiLoading,
}: PersonalInfoSectionProps) {
  const updateField = (field: keyof PersonalInfoData, value: string | number) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Contact Info Card */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center justify-between">
          <span>Personal & Contact Information</span>
          <span className="text-xs font-normal text-slate-400">Section 1 of 5</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={data.fullName}
              onChange={e => updateField("fullName", e.target.value)}
              placeholder="e.g. Abebe Kebede"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00AEEF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Target Job Title *
            </label>
            <input
              type="text"
              value={data.targetJobTitle}
              onChange={e => updateField("targetJobTitle", e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00AEEF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={data.email}
              onChange={e => updateField("email", e.target.value)}
              placeholder="e.g. abebe@example.com"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00AEEF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Phone Number (+251) *
            </label>
            <input
              type="tel"
              value={data.phone}
              onChange={e => updateField("phone", e.target.value)}
              placeholder="e.g. +251 911 234 567"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00AEEF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Location (City, Country) *
            </label>
            <input
              type="text"
              value={data.location}
              onChange={e => updateField("location", e.target.value)}
              placeholder="e.g. Addis Ababa, Ethiopia"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00AEEF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              min={0}
              max={40}
              value={data.yearsOfExperience}
              onChange={e => updateField("yearsOfExperience", parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00AEEF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              value={data.linkedin}
              onChange={e => updateField("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00AEEF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Portfolio / GitHub URL
            </label>
            <input
              type="url"
              value={data.portfolio}
              onChange={e => updateField("portfolio", e.target.value)}
              placeholder="https://yourportfolio.dev"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00AEEF]"
            />
          </div>
        </div>
      </div>

      {/* 2. Professional Summary Card */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Professional Summary
          </h2>
          <button
            type="button"
            onClick={onAiImproveSummary}
            disabled={aiLoading}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-[#00AEEF]/10 to-[#7259FF]/10 hover:from-[#00AEEF]/20 hover:to-[#7259FF]/20 border border-[#00AEEF]/30 text-xs font-bold text-[#00AEEF] transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00AEEF]" />
            {aiLoading ? "Improving..." : "AI Improve Summary"}
          </button>
        </div>

        <textarea
          rows={4}
          value={data.summary}
          onChange={e => updateField("summary", e.target.value)}
          placeholder="Highlight 3-4 sentences outlining your target role, years of experience, and primary strengths."
          className="w-full p-3 text-xs leading-relaxed rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00AEEF]"
        />
        <p className="text-[11px] text-slate-400 italic">
          Tip: CVET's Gemini AI preserves your truthful qualifications without fabricating fake metrics or unearned positions.
        </p>
      </div>
    </div>
  );
}
