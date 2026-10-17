"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Download,
  CheckCircle2,
  AlertCircle,
  Copy,
} from "lucide-react";
import { PersonalInfoSection, PersonalInfoData } from "@/components/builder/sections/personal-info";
import { WorkExperienceSection, WorkExperienceEntry } from "@/components/builder/sections/work-experience";
import { EducationSection, EducationEntry } from "@/components/builder/sections/education";
import { SkillsSection, SkillEntry } from "@/components/builder/sections/skills";
import { CertificationsSection, CertificationEntry } from "@/components/builder/sections/certifications";
import { LanguagesSection, LanguageEntry } from "@/components/builder/sections/languages";
import { CvPreview } from "@/components/builder/sections/cv-preview";

export default function CvBuilderPage() {
  const [cvId, setCvId] = useState<string>("");

  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>({
    fullName: "Abebe Kebede",
    email: "abebe.kebede@gmail.com",
    phone: "+251 911 234 567",
    location: "Addis Ababa, Ethiopia",
    linkedin: "https://linkedin.com/in/abebekebede",
    portfolio: "https://abebekebede.dev",
    targetJobTitle: "Senior Software Engineer",
    yearsOfExperience: 5,
    summary:
      "Results-driven Software Engineer with 5+ years of experience building scalable fintech and enterprise web applications across Ethiopia and East Africa. Proficient in Next.js, Node.js, TypeScript, PostgreSQL, and cloud deployments. Proven track record leading agile developer squads and optimizing high-load transactional systems.",
  });

  const [jobDescription, setJobDescription] = useState("");

  const [workExperiences, setWorkExperiences] = useState<WorkExperienceEntry[]>([
    {
      id: "exp_1",
      company: "Ethio Telecom Digital Financial Services",
      jobTitle: "Senior Full Stack Developer",
      location: "Addis Ababa, Ethiopia",
      startDate: "2022-03",
      endDate: "",
      isCurrent: true,
      responsibilities:
        "Spearheaded the integration of digital payment gateways serving over 2M+ active subscribers.\nArchitected responsive merchant dashboards using Next.js and Tailwind CSS, decreasing load times by 42%.\nMentored 6 junior engineers on code reviews, automated unit testing, and CI/CD pipelines.",
    },
    {
      id: "exp_2",
      company: "iCog Labs / Fintech Hub",
      jobTitle: "Software Developer",
      location: "Addis Ababa, Ethiopia",
      startDate: "2019-09",
      endDate: "2022-02",
      isCurrent: false,
      responsibilities:
        "Engineered high-throughput REST APIs using Node.js and PostgreSQL handling 500+ requests/sec.\nImplemented OAuth2 authentication, role-based access control, and audit logging for security compliance.\nCollaborated with UI/UX designers to translate Figma specifications into responsive web components.",
    },
  ]);

  const [educations, setEducations] = useState<EducationEntry[]>([
    {
      id: "edu_1",
      school: "Addis Ababa University (AAiT)",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Engineering",
      startDate: "2015-09",
      endDate: "2019-07",
      grade: "3.85 GPA - Very Great Distinction",
    },
  ]);

  const [skills, setSkills] = useState<SkillEntry[]>([
    { id: "sk_1", name: "TypeScript", category: "Technical" },
    { id: "sk_2", name: "Next.js & React", category: "Technical" },
    { id: "sk_3", name: "Node.js & Express", category: "Technical" },
    { id: "sk_4", name: "PostgreSQL & Prisma", category: "Technical" },
    { id: "sk_5", name: "REST APIs & GraphQL", category: "Technical" },
    { id: "sk_6", name: "Docker & AWS", category: "Tools" },
    { id: "sk_7", name: "Agile Leadership", category: "Soft" },
  ]);

  const [certifications, setCertifications] = useState<CertificationEntry[]>([
    {
      id: "cert_1",
      name: "AWS Certified Solutions Architect - Associate",
      issuer: "Amazon Web Services",
      issueDate: "2023",
      credentialUrl: "https://aws.amazon.com",
    },
  ]);

  const [languages, setLanguages] = useState<LanguageEntry[]>([
    { id: "lang_1", name: "Amharic", proficiency: "Native / Mother Tongue" },
    { id: "lang_2", name: "English", proficiency: "Fluent / Professional" },
  ]);

  // UI state
  const [activeTabMobile, setActiveTabMobile] = useState<"edit" | "preview">("edit");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiNote, setAiNote] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Payment Modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan] = useState<{ name: string; priceEtb: number }>({
    name: "Pro ATS & Career Pack",
    priceEtb: 450,
  });
  const [selectedMethod, setSelectedMethod] = useState("Telebirr");
  const [transactionRef, setTransactionRef] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Gemini AI actions
  const handleAiImproveSummary = async () => {
    setAiLoading(true);
    setAiNote(null);
    try {
      const res = await fetch("/api/ai/improve-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentSummary: personalInfo.summary,
          targetJobTitle: personalInfo.targetJobTitle,
          yearsOfExperience: personalInfo.yearsOfExperience,
          skills: skills.map(s => s.name),
        }),
      });
      const data = await res.json();
      if (data?.improvedSummary) {
        setPersonalInfo(prev => ({ ...prev, summary: data.improvedSummary }));
        if (data.note) setAiNote(data.note);
      } else if (data?.error) {
        setAiNote(data.error);
      }
    } catch {
      setAiNote("Could not reach AI service. Please verify your connection.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiRewriteBullet = async (expId: string) => {
    const exp = workExperiences.find(e => e.id === expId);
    if (!exp || !exp.responsibilities) return;

    setAiLoading(true);
    setAiNote(null);
    try {
      const firstLine = exp.responsibilities.split("\n")[0] || exp.responsibilities;
      const res = await fetch("/api/ai/rewrite-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bulletPoint: firstLine,
          jobTitle: exp.jobTitle || personalInfo.targetJobTitle,
        }),
      });
      const data = await res.json();
      if (data?.rewrittenBullet) {
        const remaining = exp.responsibilities.split("\n").slice(1).join("\n");
        const updated = remaining ? `${data.rewrittenBullet}\n${remaining}` : data.rewrittenBullet;
        setWorkExperiences(
          workExperiences.map(e => (e.id === expId ? { ...e, responsibilities: updated } : e))
        );
      } else if (data?.error) {
        setAiNote(data.error);
      }
    } catch {
      setAiNote("AI rewrite bullet service unavailable.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiSuggestSkills = async () => {
    setAiLoading(true);
    setAiNote(null);
    try {
      const res = await fetch("/api/ai/suggest-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetJobTitle: personalInfo.targetJobTitle }),
      });
      const data = await res.json();
      if (data?.skills && Array.isArray(data.skills)) {
        const existingNames = new Set(skills.map(s => s.name.toLowerCase()));
        const newItems = data.skills
          .filter((s: string) => !existingNames.has(s.toLowerCase()))
          .map((name: string, i: number) => ({
            id: `sk_sug_${Date.now()}_${i}`,
            name,
            category: "Technical",
          }));
        setSkills(prev => [...prev, ...newItems]);
      }
    } catch {
      setAiNote("AI skill suggestions unavailable.");
    } finally {
      setAiLoading(false);
    }
  };

  // Save CV
  const handleSaveCv = async () => {
    setSaveStatus("Saving...");
    try {
      const payload = {
        id: cvId || undefined,
        fullName: personalInfo.fullName,
        email: personalInfo.email,
        phone: personalInfo.phone,
        location: personalInfo.location,
        linkedin: personalInfo.linkedin,
        portfolio: personalInfo.portfolio,
        targetJobTitle: personalInfo.targetJobTitle,
        yearsOfExperience: personalInfo.yearsOfExperience,
        summary: personalInfo.summary,
        jobDescription,
        workExperiences,
        educations,
        skills,
        certifications,
        languages,
      };

      const res = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data?.cv?.id) {
        setCvId(data.cv.id);
        setSaveStatus("Saved to Cloud!");
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch {
      setSaveStatus("Save failed");
    }
  };

  const handleDownloadClick = () => {
    setPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) {
      setPaymentError("Please enter your transaction reference number.");
      return;
    }

    setPaymentSubmitting(true);
    setPaymentError(null);
    setPaymentSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("cvId", cvId || "cv_active");
      formData.append("planName", selectedPlan.name);
      formData.append("amountEtb", String(selectedPlan.priceEtb));
      formData.append("paymentMethod", selectedMethod);
      formData.append("transactionRef", transactionRef.trim());
      if (screenshotFile) {
        formData.append("screenshot", screenshotFile);
      }

      const res = await fetch("/api/payments/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit payment.");
      }

      setPaymentSuccessMessage(data.message);
    } catch (err: any) {
      setPaymentError(err.message || "Payment submission failed.");
    } finally {
      setPaymentSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Navbar />

      {/* Builder Sub-header */}
      <div className="sticky top-16 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#090d16]/90 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              One-Page ATS CV Builder
            </h1>
            <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              100% ATS Compliant Layout
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Tab Switcher */}
            <div className="flex lg:hidden rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-100 dark:bg-slate-800">
              <button
                onClick={() => setActiveTabMobile("edit")}
                className={`px-3 py-1 rounded-md text-xs font-bold ${
                  activeTabMobile === "edit"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500"
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setActiveTabMobile("preview")}
                className={`px-3 py-1 rounded-md text-xs font-bold ${
                  activeTabMobile === "preview"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500"
                }`}
              >
                Preview
              </button>
            </div>

            <button
              onClick={handleSaveCv}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {saveStatus || "Save"}
            </button>

            <button
              onClick={handleDownloadClick}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#00AEEF] to-[#7259FF] text-white text-xs font-bold shadow-sm hover:opacity-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {aiNote && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center text-xs text-amber-700 dark:text-amber-300 font-medium">
          {aiNote}
        </div>
      )}

      {/* Main Builder Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: MODULAR 1-PAGE FORM */}
          <div
            className={`lg:col-span-6 space-y-6 ${
              activeTabMobile === "preview" ? "hidden lg:block" : "block"
            }`}
          >
            {/* 1. Personal & Contact Information + Professional Summary */}
            <PersonalInfoSection
              data={personalInfo}
              onChange={setPersonalInfo}
              onAiImproveSummary={handleAiImproveSummary}
              aiLoading={aiLoading}
            />

            {/* 2. Work Experience with Gemini Action Verb Rewriting */}
            <WorkExperienceSection
              workExperiences={workExperiences}
              onChange={setWorkExperiences}
              onAiRewriteBullet={handleAiRewriteBullet}
              aiLoading={aiLoading}
            />

            {/* 3. Education & Qualifications */}
            <EducationSection
              educations={educations}
              onChange={setEducations}
            />

            {/* 4. Skills & Proficiencies with Gemini AI Suggestions */}
            <SkillsSection
              skills={skills}
              onChange={setSkills}
              onAiSuggestSkills={handleAiSuggestSkills}
              aiLoading={aiLoading}
            />

            {/* 5. Certifications & Licenses */}
            <CertificationsSection
              certifications={certifications}
              onChange={setCertifications}
            />

            {/* 6. Languages */}
            <LanguagesSection
              languages={languages}
              onChange={setLanguages}
            />

            {/* 7. Optional Target Job Description for Tailoring */}
            <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/30 p-4 space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300">
                Optional: Target Job Description (For instant ATS alignment)
              </label>
              <textarea
                rows={3}
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the job advertisement here to cross-reference keywords with your CV."
                className="w-full p-2.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: LIVE ATS PREVIEW */}
          <div
            className={`lg:col-span-6 sticky top-28 ${
              activeTabMobile === "edit" ? "hidden lg:block" : "block"
            }`}
          >
            <CvPreview
              personalInfo={personalInfo}
              workExperiences={workExperiences}
              educations={educations}
              skills={skills}
              certifications={certifications}
              languages={languages}
              onDownloadClick={handleDownloadClick}
            />
          </div>
        </div>
      </main>

      {/* PAYMENT & RECEIPT UPLOAD MODAL */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0c121e] rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#00AEEF]/10 flex items-center justify-center text-[#00AEEF] font-bold">
                  ETB
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Unlock ATS PDF Download
                  </h3>
                  <p className="text-xs text-slate-500">Manual verification via Ethiopian Mobile Banking</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {paymentSuccessMessage ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Payment Submitted Successfully!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                  {paymentSuccessMessage}
                </p>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    Status: <span className="text-amber-500 font-bold">PENDING VERIFICATION</span>
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Once an admin verifies your reference code, the selectable-text vector PDF will be unlocked.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentModalOpen(false);
                    setPaymentSuccessMessage(null);
                  }}
                  className="px-6 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="space-y-4 mt-4">
                {paymentError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{paymentError}</span>
                  </div>
                )}

                {/* Plan card summary */}
                <div className="p-3.5 rounded-xl border border-[#00AEEF]/30 bg-[#00AEEF]/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {selectedPlan.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Standard ATS Compliant Vector PDF
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-extrabold text-[#00AEEF]">
                      {selectedPlan.priceEtb} ETB
                    </div>
                    <div className="text-[10px] text-slate-400">One-time payment</div>
                  </div>
                </div>

                {/* Method selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    1. Select Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "Telebirr", name: "Telebirr", num: "0911 23 45 67" },
                      { id: "CBE", name: "CBE", num: "1000 4829 3847 1" },
                      { id: "Awash", name: "Awash", num: "0132 0987 6543 21" },
                    ].map(m => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setSelectedMethod(m.id)}
                        className={`p-2.5 rounded-lg border text-xs font-bold text-center transition-all ${
                          selectedMethod === m.id
                            ? "border-[#00AEEF] bg-[#00AEEF]/10 text-[#00AEEF]"
                            : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <div>{m.name}</div>
                        <div className="text-[10px] font-normal opacity-70 mt-0.5">{m.num}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2 Transfer Instructions */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs space-y-1 text-slate-700 dark:text-slate-300">
                  <div className="font-bold text-amber-700 dark:text-amber-400">
                    2. Payment Instructions:
                  </div>
                  <p>
                    Transfer exactly <strong>{selectedPlan.priceEtb} ETB</strong> via <strong>{selectedMethod}</strong>.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Recipient Name: <strong>CVET Digital Technologies</strong>
                  </p>
                </div>

                {/* Step 3: Transaction Ref */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    3. Transaction Reference / Slip Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionRef}
                    onChange={e => setTransactionRef(e.target.value)}
                    placeholder="e.g. TB-2026-984321 or CBE-FT26..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <p className="text-[10.5px] text-slate-400 mt-1">
                    Enter the exact reference code from your SMS or banking app.
                  </p>
                </div>

                {/* Step 4: Screenshot Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    4. Attach Payment Screenshot (Receipt)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setScreenshotFile(e.target.files[0]);
                      }
                    }}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#00AEEF]/10 file:text-[#00AEEF] hover:file:bg-[#00AEEF]/20 cursor-pointer"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={paymentSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00AEEF] to-[#7259FF] text-white font-bold text-sm shadow-md hover:opacity-95 transition-all disabled:opacity-50"
                  >
                    {paymentSubmitting ? "Submitting Payment..." : `Submit Verification (${selectedPlan.priceEtb} ETB)`}
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-2">
                    Payments are audited against bank records before unlocking the PDF download.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
