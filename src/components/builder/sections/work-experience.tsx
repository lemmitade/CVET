"use client";

import React from "react";
import { Plus, Trash2, MoveUp, MoveDown, Sparkles } from "lucide-react";

export interface WorkExperienceEntry {
  id: string;
  company: string;
  jobTitle: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  responsibilities: string;
}

interface WorkExperienceSectionProps {
  workExperiences: WorkExperienceEntry[];
  onChange: (items: WorkExperienceEntry[]) => void;
  onAiRewriteBullet: (expId: string) => void;
  aiLoading: boolean;
}

export function WorkExperienceSection({
  workExperiences,
  onChange,
  onAiRewriteBullet,
  aiLoading,
}: WorkExperienceSectionProps) {
  const addWorkExperience = () => {
    onChange([
      ...workExperiences,
      {
        id: `exp_${Date.now()}`,
        company: "",
        jobTitle: "",
        location: "Addis Ababa, Ethiopia",
        startDate: "",
        endDate: "",
        isCurrent: false,
        responsibilities: "",
      },
    ]);
  };

  const removeWorkExperience = (id: string) => {
    onChange(workExperiences.filter(e => e.id !== id));
  };

  const moveWorkExperience = (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= workExperiences.length) return;
    const items = [...workExperiences];
    const [moved] = items.splice(index, 1);
    items.splice(newIdx, 0, moved);
    onChange(items);
  };

  const updateItem = (id: string, field: keyof WorkExperienceEntry, value: any) => {
    onChange(
      workExperiences.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Work Experience
        </h2>
        <button
          type="button"
          onClick={addWorkExperience}
          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Position
        </button>
      </div>

      <div className="space-y-4">
        {workExperiences.map((exp, index) => (
          <div
            key={exp.id}
            className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Role #{index + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveWorkExperience(index, "up")}
                  disabled={index === 0}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  title="Move up"
                >
                  <MoveUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveWorkExperience(index, "down")}
                  disabled={index === workExperiences.length - 1}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  title="Move down"
                >
                  <MoveDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeWorkExperience(exp.id)}
                  className="p-1 rounded text-slate-400 hover:text-red-500 ml-1"
                  title="Remove entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                  Company / Employer *
                </label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={e => updateItem(exp.id, "company", e.target.value)}
                  placeholder="e.g. Ethio Telecom"
                  className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={exp.jobTitle}
                  onChange={e => updateItem(exp.id, "jobTitle", e.target.value)}
                  placeholder="e.g. Senior Developer"
                  className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                  Start Date (YYYY-MM) *
                </label>
                <input
                  type="text"
                  value={exp.startDate}
                  onChange={e => updateItem(exp.id, "startDate", e.target.value)}
                  placeholder="2022-03"
                  className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-0.5">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    End Date
                  </label>
                  <label className="flex items-center gap-1 text-[11px] text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exp.isCurrent}
                      onChange={e => {
                        updateItem(exp.id, "isCurrent", e.target.checked);
                        if (e.target.checked) updateItem(exp.id, "endDate", "");
                      }}
                      className="rounded text-[#00AEEF]"
                    />
                    <span>Present</span>
                  </label>
                </div>
                <input
                  type="text"
                  disabled={exp.isCurrent}
                  value={exp.isCurrent ? "Present" : exp.endDate}
                  onChange={e => updateItem(exp.id, "endDate", e.target.value)}
                  placeholder="2024-01"
                  className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Responsibilities & Key Accomplishments (One per line)
                </label>
                <button
                  type="button"
                  onClick={() => onAiRewriteBullet(exp.id)}
                  disabled={aiLoading}
                  className="flex items-center gap-1 text-[10.5px] font-bold text-[#00AEEF] hover:underline"
                >
                  <Sparkles className="w-3 h-3" />
                  AI Rewrite Bullet
                </button>
              </div>
              <textarea
                rows={3}
                value={exp.responsibilities}
                onChange={e => updateItem(exp.id, "responsibilities", e.target.value)}
                placeholder="• Spearheaded the deployment of...\n• Optimized response latency by 35%...\n• Mentored 4 junior engineers on..."
                className="w-full p-2.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white leading-relaxed font-mono text-[11px]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
