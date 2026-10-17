"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

export interface LanguageEntry {
  id: string;
  name: string;
  proficiency: string;
}

interface LanguagesSectionProps {
  languages: LanguageEntry[];
  onChange: (items: LanguageEntry[]) => void;
}

const PROFICIENCY_LEVELS = [
  "Native / Mother Tongue",
  "Fluent / Professional",
  "Intermediate",
  "Basic / Conversational",
];

export function LanguagesSection({
  languages,
  onChange,
}: LanguagesSectionProps) {
  const addLanguage = () => {
    onChange([
      ...languages,
      {
        id: `lang_${Date.now()}`,
        name: "",
        proficiency: "Fluent / Professional",
      },
    ]);
  };

  const removeLanguage = (id: string) => {
    onChange(languages.filter(l => l.id !== id));
  };

  const updateLanguage = (id: string, field: keyof LanguageEntry, value: string) => {
    onChange(
      languages.map(l => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Languages
        </h2>
        <button
          type="button"
          onClick={addLanguage}
          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Language
        </button>
      </div>

      <div className="space-y-3">
        {languages.map((lang, index) => (
          <div
            key={lang.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850"
          >
            <div className="flex-1">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                Language
              </label>
              <input
                type="text"
                value={lang.name}
                onChange={e => updateLanguage(lang.id, "name", e.target.value)}
                placeholder="e.g. Amharic, English, Afaan Oromoo"
                className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="w-48">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                Proficiency
              </label>
              <select
                value={lang.proficiency}
                onChange={e => updateLanguage(lang.id, "proficiency", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {PROFICIENCY_LEVELS.map(level => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => removeLanguage(lang.id)}
              className="p-1.5 rounded text-slate-400 hover:text-red-500 mt-3"
              title="Remove language"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
