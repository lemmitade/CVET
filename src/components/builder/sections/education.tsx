"use client";

import React from "react";
import { Plus, Trash2, MoveUp, MoveDown } from "lucide-react";

export interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade: string;
}

interface EducationSectionProps {
  educations: EducationEntry[];
  onChange: (educations: EducationEntry[]) => void;
}

export function EducationSection({ educations, onChange }: EducationSectionProps) {
  const addEducation = () => {
    onChange([
      ...educations,
      {
        id: `edu_${Date.now()}`,
        school: "",
        degree: "Bachelor of Science",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        grade: "",
      },
    ]);
  };

  const removeEducation = (id: string) => {
    onChange(educations.filter(e => e.id !== id));
  };

  const moveEducation = (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= educations.length) return;
    const items = [...educations];
    const [moved] = items.splice(index, 1);
    items.splice(newIdx, 0, moved);
    onChange(items);
  };

  const updateItem = (id: string, field: keyof EducationEntry, val: string) => {
    onChange(
      educations.map(item => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Education & Qualifications
        </h2>
        <button
          type="button"
          onClick={addEducation}
          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Education
        </button>
      </div>

      <div className="space-y-3">
        {educations.map((edu, index) => (
          <div
            key={edu.id}
            className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 space-y-2.5"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
              <span className="text-xs font-bold text-slate-500">
                Degree #{index + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveEducation(index, "up")}
                  disabled={index === 0}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  title="Move up"
                >
                  <MoveUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveEducation(index, "down")}
                  disabled={index === educations.length - 1}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  title="Move down"
                >
                  <MoveDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeEducation(edu.id)}
                  className="p-1 rounded text-slate-400 hover:text-red-500"
                  title="Remove education"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                  School / University *
                </label>
                <input
                  type="text"
                  value={edu.school}
                  onChange={e => updateItem(edu.id, "school", e.target.value)}
                  placeholder="e.g. Addis Ababa University (AAiT)"
                  className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                  Degree *
                </label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={e => updateItem(edu.id, "degree", e.target.value)}
                  placeholder="e.g. Bachelor of Science"
                  className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                  Field of Study *
                </label>
                <input
                  type="text"
                  value={edu.fieldOfStudy}
                  onChange={e => updateItem(edu.id, "fieldOfStudy", e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                  Graduation Year
                </label>
                <input
                  type="text"
                  value={edu.endDate}
                  onChange={e => updateItem(edu.id, "endDate", e.target.value)}
                  placeholder="e.g. 2022"
                  className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                  Grade / Honors (Optional)
                </label>
                <input
                  type="text"
                  value={edu.grade}
                  onChange={e => updateItem(edu.id, "grade", e.target.value)}
                  placeholder="e.g. 3.85 GPA - Very Great Distinction"
                  className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
