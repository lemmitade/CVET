"use client";

import React, { useState } from "react";
import { Sparkles, Plus, X } from "lucide-react";

export interface SkillEntry {
  id: string;
  name: string;
  category?: string;
}

interface SkillsSectionProps {
  skills: SkillEntry[];
  onChange: (skills: SkillEntry[]) => void;
  onAiSuggestSkills: () => void;
  aiLoading: boolean;
}

export function SkillsSection({
  skills,
  onChange,
  onAiSuggestSkills,
  aiLoading,
}: SkillsSectionProps) {
  const [newSkillName, setNewSkillName] = useState("");

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    onChange([
      ...skills,
      {
        id: `sk_${Date.now()}`,
        name: newSkillName.trim(),
        category: "Technical",
      },
    ]);
    setNewSkillName("");
  };

  const removeSkill = (id: string) => {
    onChange(skills.filter(s => s.id !== id));
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Key Skills & Proficiencies
        </h2>
        <button
          type="button"
          onClick={onAiSuggestSkills}
          disabled={aiLoading}
          className="flex items-center gap-1.5 text-xs font-bold text-[#00AEEF] hover:underline disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {aiLoading ? "Suggesting..." : "AI Suggest Skills"}
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newSkillName}
          onChange={e => setNewSkillName(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
          placeholder="Type a skill (e.g. Next.js, Accounting, Python) and press Enter"
          className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00AEEF]"
        />
        <button
          type="button"
          onClick={addSkill}
          className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          Add
        </button>
      </div>

      {/* Skill Chips */}
      <div className="flex flex-wrap gap-2 pt-1">
        {skills.map(skill => (
          <span
            key={skill.id}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#00AEEF]/10 text-[#00AEEF] border border-[#00AEEF]/20 text-xs font-semibold"
          >
            {skill.name}
            <button
              type="button"
              onClick={() => removeSkill(skill.id)}
              className="hover:text-red-500 ml-1"
              title="Remove skill"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
