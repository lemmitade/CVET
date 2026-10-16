"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Sparkles,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Download,
  Eye,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  UploadCloud,
  FileCheck,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

interface WorkExpItem {
  id: string;
  company: string;
  jobTitle: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  responsibilities: string;
}

interface EduItem {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade: string;
}

interface SkillItem {
  id: string;
  name: string;
  category: string;
}

interface CertItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
}

interface LangItem {
  id: string;
  name: string;
  proficiency: string;
}

export default function CvBuilderPage() {
  // Form State - Compact 1-Page Continuous Layout
  const [cvId, setCvId] = useState<string>("");
  const [fullName, setFullName] = useState("Abebe Kebede");
  const [email, setEmail] = useState("abebe.kebede@gmail.com");
  const [phone, setPhone] = useState("+251 911 234 567");
  const [location, setLocation] = useState("Addis Ababa, Ethiopia");
  const [linkedin, setLinkedin] = useState("https://linkedin.com/in/abebekebede");
  const [portfolio, setPortfolio] = useState("https://abebekebede.dev");
  const [targetJobTitle, setTargetJobTitle] = useState("Senior Software Engineer");
  const [yearsOfExperience, setYearsOfExperience] = useState(5);
  const [summary, setSummary] = useState(
    "Results-driven Software Engineer with 5+ years of experience building scalable fintech and enterprise web applications across Ethiopia and East Africa. Proficient in Next.js, Node.js, TypeScript, PostgreSQL, and cloud deployments. Proven track record leading agile developer squads and optimizing high-load transactional systems."
  );
  const [jobDescription, setJobDescription] = useState("");

  const [workExperiences, setWorkExperiences] = useState<WorkExpItem[]>([
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

  const [educations, setEducations] = useState<EduItem[]>([
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

  const [skills, setSkills] = useState<SkillItem[]>([
    { id: "sk_1", name: "TypeScript", category: "Technical" },
    { id: "sk_2", name: "Next.js & React", category: "Technical" },
    { id: "sk_3", name: "Node.js & Express", category: "Technical" },
    { id: "sk_4", name: "PostgreSQL & Prisma", category: "Technical" },
    { id: "sk_5", name: "REST APIs & GraphQL", category: "Technical" },
    { id: "sk_6", name: "Docker & AWS", category: "Tools" },
    { id: "sk_7", name: "Agile Leadership", category: "Soft" },
  ]);

  const [newSkillName, setNewSkillName] = useState("");

  const [certifications, setCertifications] = useState<CertItem[]>([
    {
      id: "cert_1",
      name: "AWS Certified Solutions Architect - Associate",
      issuer: "Amazon Web Services",
      issueDate: "2023",
    },
  ]);

  const [languages, setLanguages] = useState<LangItem[]>([
    { id: "lang_1", name: "Amharic", proficiency: "Native" },
    { id: "lang_2", name: "English", proficiency: "Fluent / Professional" },
  ]);

  // UI state
  const [activeTabMobile, setActiveTabMobile] = useState<"edit" | "preview">("edit");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiNote, setAiNote] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Payment Modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; priceEtb: number }>({
    name: "Pro ATS & Career Pack",
    priceEtb: 450,
  });
  const [selectedMethod, setSelectedMethod] = useState("Telebirr");
  const [transactionRef, setTransactionRef] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Work experience helpers
  const addWorkExperience = () => {
    setWorkExperiences([
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
    setWorkExperiences(workExperiences.filter(e => e.id !== id));
  };

  const moveWorkExperience = (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= workExperiences.length) return;
    const items = [...workExperiences];
    const [moved] = items.splice(index, 1);
    items.splice(newIdx, 0, moved);
    setWorkExperiences(items);
  };

  // Education helpers
  const addEducation = () => {
    setEducations([
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
    setEducations(educations.filter(e => e.id !== id));
  };

  const moveEducation = (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= educations.length) return;
    const items = [...educations];
    const [moved] = items.splice(index, 1);
    items.splice(newIdx, 0, moved);
    setEducations(items);
  };

  // Skill helpers
  const addSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills([...skills, { id: `sk_${Date.now()}`, name: newSkillName.trim(), category: "Technical" }]);
    setNewSkillName("");
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  // AI Buttons
  const handleAiImproveSummary = async () => {
    setAiLoading(true);
    setAiNote(null);
    try {
      const res = await fetch("/api/ai/improve-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentSummary: summary,
          targetJobTitle,
          yearsOfExperience,
          skills: skills.map(s => s.name),
        }),
      });
      const data = await res.json();
      if (data?.improvedSummary) {
        setSummary(data.improvedSummary);
        if (data.note) setAiNote(data.note);
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
          jobTitle: exp.jobTitle || targetJobTitle,
        }),
      });
      const data = await res.json();
      if (data?.rewrittenBullet) {
        const remaining = exp.responsibilities.split("\n").slice(1).join("\n");
        const updated = remaining ? `${data.rewrittenBullet}\n${remaining}` : data.rewrittenBullet;
        setWorkExperiences(
          workExperiences.map(e => (e.id === expId ? { ...e, responsibilities: updated } : e))
        );
      }
    } catch {
      setAiNote("AI rewrite bullet service unavailable.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiSuggestSkills = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/suggest-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetJobTitle }),
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
        setSkills([...skills, ...newItems]);
      }
    } catch {
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
        fullName,
        email,
        phone,
        location,
        linkedin,
        portfolio,
        targetJobTitle,
        yearsOfExperience,
        summary,
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

  // Trigger Download
  const handleDownloadClick = () => {
    // Open payment modal if not already unlocked
    setPaymentModalOpen(true);
  };

  // Submit manual payment screenshot & ref
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
          {/* LEFT COLUMN: CONTINUOUS 1-PAGE FORM */}
          <div
            className={`lg:col-span-6 space-y-6 ${
              activeTabMobile === "preview" ? "hidden lg:block" : "block"
            }`}
          >
            {/* 1. Personal & Contact Information */}
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
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
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
                    value={targetJobTitle}
                    onChange={e => setTargetJobTitle(e.target.value)}
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
                    value={email}
                    onChange={e => setEmail(e.target.value)}
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
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
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
                    value={location}
                    onChange={e => setLocation(e.target.value)}
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
                    value={yearsOfExperience}
                    onChange={e => setYearsOfExperience(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00AEEF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={e => setLinkedin(e.target.value)}
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
                    value={portfolio}
                    onChange={e => setPortfolio(e.target.value)}
                    placeholder="https://yourportfolio.dev"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00AEEF]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Professional Summary with AI Button */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Professional Summary
                </h2>
                <button
                  type="button"
                  onClick={handleAiImproveSummary}
                  disabled={aiLoading}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-[#00AEEF]/10 to-[#7259FF]/10 hover:from-[#00AEEF]/20 hover:to-[#7259FF]/20 border border-[#00AEEF]/30 text-xs font-bold text-[#00AEEF] transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00AEEF]" />
                  {aiLoading ? "Improving..." : "AI Improve Summary"}
                </button>
              </div>

              <textarea
                rows={4}
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="Highlight 3-4 sentences outlining your target role, years of experience, and primary strengths."
                className="w-full p-3 text-xs leading-relaxed rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00AEEF]"
              />
              <p className="text-[11px] text-slate-400 italic">
                Tip: CVET's AI preserves your truthful qualifications without fabricating fake metrics or unearned positions.
              </p>
            </div>

            {/* 3. Work Experience with Reordering and AI Bullet Rewrite */}
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
                          onChange={e =>
                            setWorkExperiences(
                              workExperiences.map(item =>
                                item.id === exp.id ? { ...item, company: e.target.value } : item
                              )
                            )
                          }
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
                          onChange={e =>
                            setWorkExperiences(
                              workExperiences.map(item =>
                                item.id === exp.id ? { ...item, jobTitle: e.target.value } : item
                              )
                            )
                          }
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
                          onChange={e =>
                            setWorkExperiences(
                              workExperiences.map(item =>
                                item.id === exp.id ? { ...item, startDate: e.target.value } : item
                              )
                            )
                          }
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
                              onChange={e =>
                                setWorkExperiences(
                                  workExperiences.map(item =>
                                    item.id === exp.id
                                      ? { ...item, isCurrent: e.target.checked, endDate: e.target.checked ? "" : item.endDate }
                                      : item
                                  )
                                )
                              }
                              className="rounded text-[#00AEEF]"
                            />
                            <span>Present</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          disabled={exp.isCurrent}
                          value={exp.isCurrent ? "Present" : exp.endDate}
                          onChange={e =>
                            setWorkExperiences(
                              workExperiences.map(item =>
                                item.id === exp.id ? { ...item, endDate: e.target.value } : item
                              )
                            )
                          }
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
                          onClick={() => handleAiRewriteBullet(exp.id)}
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
                        onChange={e =>
                          setWorkExperiences(
                            workExperiences.map(item =>
                              item.id === exp.id ? { ...item, responsibilities: e.target.value } : item
                            )
                          )
                        }
                        placeholder="• Spearheaded the deployment of...\n• Optimized response latency by 35%...\n• Mentored 4 junior engineers on..."
                        className="w-full p-2.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white leading-relaxed font-mono text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Education & Qualifications */}
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
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveEducation(index, "down")}
                          disabled={index === educations.length - 1}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeEducation(edu.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-500"
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
                          onChange={e =>
                            setEducations(
                              educations.map(item =>
                                item.id === edu.id ? { ...item, school: e.target.value } : item
                              )
                            )
                          }
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
                          onChange={e =>
                            setEducations(
                              educations.map(item =>
                                item.id === edu.id ? { ...item, degree: e.target.value } : item
                              )
                            )
                          }
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
                          onChange={e =>
                            setEducations(
                              educations.map(item =>
                                item.id === edu.id ? { ...item, fieldOfStudy: e.target.value } : item
                              )
                            )
                          }
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
                          onChange={e =>
                            setEducations(
                              educations.map(item =>
                                item.id === edu.id ? { ...item, endDate: e.target.value } : item
                              )
                            )
                          }
                          placeholder="e.g. 2019"
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
                          onChange={e =>
                            setEducations(
                              educations.map(item =>
                                item.id === edu.id ? { ...item, grade: e.target.value } : item
                              )
                            )
                          }
                          placeholder="e.g. 3.85 GPA - Distinction"
                          className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Skills & Competencies */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Skills & Keywords
                </h2>
                <button
                  type="button"
                  onClick={handleAiSuggestSkills}
                  disabled={aiLoading}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#00AEEF] hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Suggest Skills
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
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  Add
                </button>
              </div>

              {/* Chips */}
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
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Optional Target Job Description for Tailoring */}
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
              </div>

              {/* Action Banner below preview */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Ready to download? Pay via <span className="font-bold text-[#00AEEF]">Telebirr</span> or <span className="font-bold text-purple-500">CBE</span> to receive your unlocked vector PDF.
                </div>
                <button
                  type="button"
                  onClick={handleDownloadClick}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00AEEF] to-[#7259FF] text-white text-xs font-bold shrink-0 hover:opacity-95"
                >
                  Download PDF (450 ETB)
                </button>
              </div>
            </div>
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
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                  {paymentSuccessMessage}
                </p>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-left space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reference:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{transactionRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-bold text-amber-500">PENDING ADMIN VERIFICATION</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold"
                >
                  Close & View in Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="mt-4 space-y-4 text-left">
                {paymentError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-medium">
                    {paymentError}
                  </div>
                )}

                {/* Plan Selection */}
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-400">Selected Plan</span>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{selectedPlan.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-[#00AEEF]">{selectedPlan.priceEtb} ETB</div>
                    <span className="text-[10px] text-slate-400">One-time fee</span>
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
