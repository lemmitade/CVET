"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
}

interface CertificationsSectionProps {
  certifications: CertificationEntry[];
  onChange: (items: CertificationEntry[]) => void;
}

export function CertificationsSection({
  certifications,
  onChange,
}: CertificationsSectionProps) {
  const addCert = () => {
    onChange([
      ...certifications,
      {
        id: `cert_${Date.now()}`,
        name: "",
        issuer: "",
        issueDate: "",
        credentialUrl: "",
      },
    ]);
  };

  const removeCert = (id: string) => {
    onChange(certifications.filter(c => c.id !== id));
  };

  const updateCert = (id: string, field: keyof CertificationEntry, value: string) => {
    onChange(
      certifications.map(c => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Certifications & Licenses
        </h2>
        <button
          type="button"
          onClick={addCert}
          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Certification
        </button>
      </div>

      <div className="space-y-3">
        {certifications.map((cert, index) => (
          <div
            key={cert.id}
            className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Certification #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeCert(cert.id)}
                className="p-1 rounded text-slate-400 hover:text-red-500"
                title="Remove certification"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                  Certification Name *
                </label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={e => updateCert(cert.id, "name", e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={e => updateCert(cert.id, "issuer", e.target.value)}
                  placeholder="e.g. Amazon Web Services"
                  className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                  Issue Date (Year or YYYY-MM)
                </label>
                <input
                  type="text"
                  value={cert.issueDate || ""}
                  onChange={e => updateCert(cert.id, "issueDate", e.target.value)}
                  placeholder="e.g. 2024"
                  className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                  Credential URL (Optional)
                </label>
                <input
                  type="url"
                  value={cert.credentialUrl || ""}
                  onChange={e => updateCert(cert.id, "credentialUrl", e.target.value)}
                  placeholder="https://..."
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
