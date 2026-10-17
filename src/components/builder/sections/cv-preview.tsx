"use client";

import React from "react";
import { Download } from "lucide-react";
import { PersonalInfoData } from "./personal-info";
import { WorkExperienceEntry } from "./work-experience";
import { EducationEntry } from "./education";
import { SkillEntry } from "./skills";
import { CertificationEntry } from "./certifications";
import { LanguageEntry } from "./languages";

interface CvPreviewProps {
  personalInfo: PersonalInfoData;
  workExperiences: WorkExperienceEntry[];
  educations: EducationEntry[];
  skills: SkillEntry[];
  certifications: CertificationEntry[];
  languages: LanguageEntry[];
  onDownloadClick: () => void;
}

export function CvPreview({
  personalInfo,
  workExperiences,
  educations,
  skills,
  certifications,
  languages,
  onDownloadClick,
}: CvPreviewProps) {
  const {
    fullName,
    targetJobTitle,
    email,
    phone,
    location,
    linkedin,
    portfolio,
    summary,
  } = personalInfo;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0c121e] p-3 sm:p-4 shadow-lg space-y-3">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            Live Single-Column ATS Preview
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          A4 Real Selectable Text Layout
        </span>
      </div>

      {/* The Virtual ATS CV Sheet */}
      <div
        id="cv-live-sheet"
        className="bg-white text-slate-900 p-8 sm:p-10 rounded-lg shadow-sm border border-slate-200 min-h-[750px] font-sans text-left space-y-4 select-text"
      >
        {/* Header */}
        <div className="border-b border-slate-200 pb-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {fullName || "Candidate Name"}
          </h1>
          <div className="text-xs font-bold text-[#00AEEF] tracking-wide uppercase mt-0.5">
            {targetJobTitle || "PROFESSIONAL"}
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex flex-wrap gap-x-2">
            {email && <span>{email}</span>}
            {phone && <span>• {phone}</span>}
            {location && <span>• {location}</span>}
            {linkedin && <span>• {linkedin.replace(/^https?:\/\//, "")}</span>}
            {portfolio && <span>• {portfolio.replace(/^https?:\/\//, "")}</span>}
          </div>
        </div>

        {/* Professional Summary */}
        {summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
              Professional Summary
            </h2>
            <p className="text-[11px] text-slate-700 leading-relaxed mt-1.5">
              {summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {workExperiences.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
              Work Experience
            </h2>
            <div className="mt-2 space-y-3">
              {workExperiences.map(exp => (
                <div key={exp.id} className="text-[11px]">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{exp.jobTitle || "Job Title"}</span>
                    <span className="text-slate-500 font-normal">
                      {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate || "Present"}
                    </span>
                  </div>
                  <div className="text-[10.5px] font-semibold text-slate-600">
                    {exp.company} {exp.location ? `— ${exp.location}` : ""}
                  </div>
                  {exp.responsibilities && (
                    <div className="mt-1 space-y-0.5 text-slate-700">
                      {exp.responsibilities.split("\n").map((b, i) => (
                        <p key={i} className="leading-snug">
                          • {b.replace(/^[-*•]\s*/, "")}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {educations.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
              Education
            </h2>
            <div className="mt-2 space-y-2">
              {educations.map(edu => (
                <div key={edu.id} className="text-[11px]">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{edu.degree} in {edu.fieldOfStudy}</span>
                    <span className="text-slate-500 font-normal">
                      {edu.startDate} – {edu.endDate || "Completed"}
                    </span>
                  </div>
                  <div className="text-[10.5px] text-slate-600">
                    {edu.school} {edu.grade ? `(${edu.grade})` : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
              Skills & Competencies
            </h2>
            <p className="text-[11px] text-slate-700 mt-1.5 leading-relaxed">
              {skills.map(s => s.name).join("  •  ")}
            </p>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
              Certifications & Credentials
            </h2>
            <div className="mt-1.5 space-y-1 text-[11px]">
              {certifications.map(cert => (
                <div key={cert.id} className="flex justify-between text-slate-700">
                  <span>
                    <strong className="text-slate-900">{cert.name}</strong> — {cert.issuer}
                  </span>
                  {cert.issueDate && <span className="text-slate-500">{cert.issueDate}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
              Languages
            </h2>
            <p className="text-[11px] text-slate-700 mt-1.5 leading-relaxed">
              {languages.map(l => `${l.name} (${l.proficiency})`).join("  •  ")}
            </p>
          </div>
        )}
      </div>

      {/* Action Banner below preview */}
      <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="text-xs text-slate-600 dark:text-slate-400">
          Ready to download? Pay via <span className="font-bold text-[#00AEEF]">Telebirr</span> or <span className="font-bold text-purple-500">CBE</span> to receive your unlocked vector PDF.
        </div>
        <button
          type="button"
          onClick={onDownloadClick}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00AEEF] to-[#7259FF] text-white text-xs font-bold shrink-0 hover:opacity-95 shadow-sm transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          Download PDF (450 ETB)
        </button>
      </div>
    </div>
  );
}
