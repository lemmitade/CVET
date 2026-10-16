"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Sparkles,
  SearchCheck,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Zap,
  Lock,
  Download,
  Building2,
  FileCheck,
  HelpCircle,
  Smartphone,
  ChevronDown,
} from "lucide-react";

export default function HomePage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [paymentAccounts, setPaymentAccounts] = useState<any[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    fetch("/api/pricing")
      .then(res => res.json())
      .then(data => {
        if (data?.plans) setPlans(data.plans);
        if (data?.paymentAccounts) setPaymentAccounts(data.paymentAccounts);
      })
      .catch(() => {});
  }, []);

  const faqs = [
    {
      q: "What is an ATS (Applicant Tracking System)?",
      a: "An ATS is software used by employers, NGOs, embassies, and recruitment agencies (such as Ethiojobs, Dereja, and international platforms) to automatically filter, scan, and rank resumes before a human recruiter ever sees them. Unformatted columns, tables, graphics, and missing keywords cause over 75% of resumes to be discarded automatically.",
    },
    {
      q: "Why is CVET built specifically for the Ethiopian market?",
      a: "CVET supports Ethiopian phone numbers, local academic grading standards (e.g., Distinction, CGPA out of 4.0), and integrates local mobile banking payments (Telebirr, CBE, Awash Bank) in Ethiopian Birr (ETB), avoiding credit card restrictions.",
    },
    {
      q: "How does the manual payment verification work?",
      a: "After building and previewing your CV, choose your preferred payment option (Telebirr, CBE, or Awash). Transfer the exact plan amount in ETB and upload a screenshot of your transaction receipt. Our verification team confirms the reference number against bank statements and unlocks your downloadable ATS PDF promptly.",
    },
    {
      q: "Does CVET guarantee I will pass every employer's ATS?",
      a: "CVET is engineered strictly to match leading ATS compliance algorithms (single-column layout, standard headers, text extractability, keyword alignment). While our score is our proprietary diagnostic simulation and not a 100% legal guarantee for any external company's private rules, following CVET's guidelines drastically elevates your odds of landing interview callbacks.",
    },
    {
      q: "Are the generated PDFs true selectable text?",
      a: "Yes! CVET generates genuine vector PDF documents with selectable, copy-pasteable text—never rasterized image screenshots. This ensures automated parsers can read every single character without distortion.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32">
          {/* Subtle glowing radial background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#00AEEF]/15 to-[#7259FF]/15 blur-3xl pointer-events-none rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-[#00AEEF] animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-slate-800 dark:text-slate-200 uppercase">
                Build Smarter. Get Hired Faster.
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.12]">
              Build a CV That <span className="gradient-text">Gets Read.</span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Create ATS-optimized CVs, check your ATS compatibility score in seconds, match job descriptions, and download professional PDFs with local Ethiopian Birr (ETB) payment.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/builder"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#00AEEF] to-[#7259FF] text-white font-bold text-base shadow-lg shadow-[#00AEEF]/20 hover:shadow-[#00AEEF]/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Create My CV
              </Link>

              <Link
                href="/ats-checker"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white font-bold text-base hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <SearchCheck className="w-5 h-5 text-[#00AEEF]" />
                Check My ATS Score
              </Link>
            </div>

            {/* Quick Proof Badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                100% Single-Column ATS Standards
              </div>
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#00AEEF]" />
                Telebirr & CBE Payment (ETB)
              </div>
              <div className="flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[#7259FF]" />
                Selectable Vector PDF Output
              </div>
            </div>

            {/* INTERACTIVE VISUAL CV PREVIEW & SAMPLE ATS SCORE */}
            <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 shadow-2xl backdrop-blur-xl p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Simulated CV Document Snippet */}
                <div className="lg:col-span-7 text-left bg-white dark:bg-[#0c121e] rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm font-sans space-y-4">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="text-xl font-bold text-slate-900 dark:text-white">
                      Abebe Kebede
                    </div>
                    <div className="text-xs font-semibold text-[#00AEEF] tracking-wide uppercase mt-0.5">
                      Senior Software Engineer
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap gap-x-3">
                      <span>abebe.kebede@gmail.com</span>
                      <span>+251 911 234 567</span>
                      <span>Addis Ababa, Ethiopia</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">
                      Professional Summary
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      Results-driven Software Engineer with 5+ years building scalable fintech and enterprise applications across Ethiopia and East Africa. Proficient in Next.js, Node.js, and PostgreSQL.
                    </p>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">
                      Work Experience
                    </div>
                    <div className="mt-1 space-y-2">
                      <div>
                        <div className="flex justify-between text-[11px] font-bold text-slate-800 dark:text-slate-200">
                          <span>Ethio Telecom Digital Financial Services</span>
                          <span className="text-slate-400 font-normal">2022 – Present</span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                          Senior Full Stack Developer
                        </p>
                        <p className="text-[10.5px] text-slate-600 dark:text-slate-300 mt-1">
                          • Spearheaded payment gateway integration serving over 2M+ active mobile subscribers with 99.98% uptime.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sample ATS Score Breakdown Widget */}
                <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/80 rounded-xl p-5 border border-slate-200 dark:border-slate-800 text-left space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                        Live Simulation
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        ATS Readiness Score
                      </h3>
                    </div>
                    <div className="w-14 h-14 rounded-full border-4 border-emerald-500 flex items-center justify-center font-extrabold text-xl text-emerald-600 dark:text-emerald-400 shadow-sm">
                      94
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        <span>Readability & Parsability</span>
                        <span className="font-bold text-emerald-500">98%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full w-[98%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        <span>Standard ATS Headings</span>
                        <span className="font-bold text-emerald-500">100%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full w-[100%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        <span>Action Verbs & Impact</span>
                        <span className="font-bold text-[#00AEEF]">90%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#00AEEF] h-full rounded-full w-[90%]" />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-lg text-xs text-emerald-800 dark:text-emerald-300">
                    ✓ Clean single-column layout. High chance of passing automated HR screeners.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xs uppercase font-bold tracking-widest text-[#00AEEF]">
              Simple & Fast
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              How CVET Works
            </h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              From blank page to ATS-cleared resume in four straightforward steps.
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
              {[
                {
                  step: "01",
                  title: "Enter Your Details",
                  desc: "Complete your experience, education, and skills on our intuitive 1-page continuous builder without multi-step confusion.",
                },
                {
                  step: "02",
                  title: "AI Enhances & Verifies",
                  desc: "Click AI buttons to rewrite bullet points with strong action verbs and tailor your summary. Real facts only—no fake claims.",
                },
                {
                  step: "03",
                  title: "Live Preview & ETB Payment",
                  desc: "Inspect your crisp ATS layout live. Pay with Telebirr or CBE and upload your receipt screenshot for verification.",
                },
                {
                  step: "04",
                  title: "Download Real Vector PDF",
                  desc: "Once verified, download your selectable-text PDF formatted to pass any corporate, NGO, or international ATS screen.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 relative group hover:border-[#00AEEF]/50 transition-colors"
                >
                  <span className="text-3xl font-extrabold text-slate-300 dark:text-slate-700 group-hover:text-[#00AEEF] transition-colors">
                    {item.step}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-3">
                    {item.title}
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 mt-2">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-20 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xs uppercase font-bold tracking-widest text-[#7259FF]">
              Affordable Ethiopian Pricing
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              Transparent ETB Rates for Everyone
            </h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              No foreign currency cards needed. Pay securely in Ethiopian Birr via Telebirr or CBE.
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
              {(plans.length > 0 ? plans : [
                {
                  id: "plan-1",
                  name: "Standard CV Pass",
                  description: "Ideal for active job applicants needing a clean ATS-ready CV.",
                  priceEtb: 250,
                  features: [
                    "Selectable text ATS-Optimized PDF Download",
                    "ATS Compatibility Report & Diagnostics",
                    "Unlimited edits for 48 hours",
                    "Telebirr & CBE Payment Verification",
                  ],
                  isPopular: false,
                },
                {
                  id: "plan-2",
                  name: "Pro ATS & Career Pack",
                  description: "Our top recommendation for university grads & professionals.",
                  priceEtb: 450,
                  features: [
                    "Selectable text ATS-Optimized PDF Download",
                    "Full ATS Score & Section Diagnostics",
                    "AI Bullet Point & Summary Enhancers",
                    "Job Description Keyword Matcher",
                    "Google Drive Cloud Backup",
                    "Priority Payment Verification",
                  ],
                  isPopular: true,
                },
                {
                  id: "plan-3",
                  name: "Executive & International Pack",
                  description: "Designed for senior roles targeting international NGOs & embassies.",
                  priceEtb: 750,
                  features: [
                    "Everything in Pro ATS Pack",
                    "3 Tailored Versions for Different Job Roles",
                    "Cover Letter Template",
                    "Fast 15-Minute Payment Verification",
                    "Lifetime Re-download Access",
                  ],
                  isPopular: false,
                },
              ]).map((plan, i) => (
                <div
                  key={plan.id || i}
                  className={`rounded-2xl border p-7 flex flex-col justify-between relative transition-all ${
                    plan.isPopular
                      ? "border-[#00AEEF] bg-white dark:bg-slate-900 shadow-xl shadow-[#00AEEF]/10 scale-105 z-10"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60"
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#00AEEF] to-[#7259FF] text-white text-[11px] font-bold tracking-wide uppercase shadow-sm">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                      {plan.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px]">
                      {plan.description}
                    </p>

                    <div className="mt-5 pb-5 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                          {plan.priceEtb}
                        </span>
                        <span className="text-base font-bold text-[#00AEEF]">
                          ETB
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">one-time payment</span>
                    </div>

                    <ul className="mt-6 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                      {(plan.features || []).map((feat: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#00AEEF] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <Link
                      href="/builder"
                      className={`w-full py-3 rounded-xl font-bold text-sm text-center block transition-all ${
                        plan.isPopular
                          ? "bg-gradient-to-r from-[#00AEEF] to-[#7259FF] text-white shadow-md hover:opacity-95"
                          : "border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      Start Building CV
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Method Badges */}
            <div className="mt-12 max-w-2xl mx-auto p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 text-center space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Supported Ethiopian Mobile Banking
              </span>
              <div className="flex items-center justify-center gap-6 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00AEEF]"></span>
                  Telebirr
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                  CBE Birr / Mobile
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  Awash Bank
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQS SECTION */}
        <section className="py-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] transition-colors">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-xs uppercase font-bold tracking-widest text-[#00AEEF]">
                Got Questions?
              </h2>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-center justify-between font-bold text-slate-900 dark:text-white text-base"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/60 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
