"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  FileText,
  SearchCheck,
  CreditCard,
  User,
  Download,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"cvs" | "scans" | "payments" | "account">("cvs");

  const [cvs, setCvs] = useState<any[]>([]);
  const [scans, setScans] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (!data?.user) {
          router.push("/login?redirect=/dashboard");
        } else {
          setUser(data.user);
          loadDashboardData();
        }
      })
      .catch(() => {
        router.push("/login?redirect=/dashboard");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const loadDashboardData = async () => {
    try {
      const [cvsRes, pricingRes] = await Promise.all([
        fetch("/api/cv"),
        fetch("/api/pricing"),
      ]);
      const cvsData = await cvsRes.json();
      if (cvsData?.cvs) setCvs(cvsData.cvs);

      // Fetch payment history (can query user's specific records)
      const payRes = await fetch("/api/admin/payments");
      const payData = await payRes.json();
      if (payData?.payments) {
        setPayments(payData.payments);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    }
  };

  const handleDeleteCv = async (id: string) => {
    if (!confirm("Are you sure you want to delete this CV?")) return;
    try {
      const res = await fetch(`/api/cv/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCvs(cvs.filter(c => c.id !== id));
      }
    } catch (err) {
      alert("Failed to delete CV");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            Pending Verification
          </span>
        );
      case "VERIFYING":
      case "MANUAL_REVIEW":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Clock className="w-3 h-3" />
            Under Manual Review
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return <span className="text-xs text-slate-500">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#00AEEF] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading your CVET dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* User Welcome Banner */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#00AEEF]">
              Welcome Back
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {user?.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {user?.email} • Account Status: <span className="text-emerald-500 font-semibold">Active</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/builder"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00AEEF] to-[#7259FF] text-white text-xs font-bold shadow-sm hover:opacity-95"
            >
              <Plus className="w-4 h-4" />
              New ATS CV
            </Link>

            <Link
              href="/ats-checker"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <SearchCheck className="w-4 h-4 text-[#00AEEF]" />
              Scan a CV
            </Link>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 gap-2">
          {[
            { id: "cvs", label: "Saved CVs", icon: FileText, count: cvs.length },
            { id: "payments", label: "Payment History", icon: CreditCard, count: payments.length },
            { id: "account", label: "Account Profile", icon: User },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
                  isActive
                    ? "border-[#00AEEF] text-[#00AEEF]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: SAVED CVS */}
        {activeTab === "cvs" && (
          <div className="space-y-4">
            {cvs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {cvs.map(cv => (
                  <div
                    key={cv.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs flex flex-col justify-between hover:border-[#00AEEF]/50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#00AEEF] px-2 py-0.5 rounded bg-[#00AEEF]/10">
                          Single-Column ATS
                        </span>
                        {cv.isPurchased ? (
                          <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Unlocked
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-amber-500">
                            Verification Required
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                        {cv.title || "Professional CV"}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Target: {cv.targetJobTitle || "General"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                        {cv.summary || "No summary provided."}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <Link
                        href={`/builder?id=${cv.id}`}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#00AEEF]"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit in Builder
                      </Link>

                      <div className="flex items-center gap-2">
                        <a
                          href={`/api/cv/${cv.id}/download`}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00AEEF]/10 text-[#00AEEF] text-xs font-bold hover:bg-[#00AEEF]/20"
                        >
                          <Download className="w-3.5 h-3.5" />
                          PDF
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteCv(cv.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center bg-white/40 dark:bg-slate-900/20">
                <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Saved Resumes Yet
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                  Start building your first ATS-compliant resume with our continuous 1-page editor and AI writer.
                </p>
                <Link
                  href="/builder"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00AEEF] to-[#7259FF] text-white text-xs font-bold shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Create Your CV Now
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PAYMENT HISTORY */}
        {activeTab === "payments" && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Payment Verification Records
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                All manual payments (Telebirr, CBE, Awash) submitted for CV unlock.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Plan</th>
                    <th className="py-3 px-4 font-semibold">Amount (ETB)</th>
                    <th className="py-3 px-4 font-semibold">Method</th>
                    <th className="py-3 px-4 font-semibold">Transaction Reference</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Admin Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {payments.map(pay => (
                    <tr key={pay.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {pay.planName}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-[#00AEEF]">
                        {pay.amountEtb} ETB
                      </td>
                      <td className="py-3 px-4">{pay.paymentMethod}</td>
                      <td className="py-3 px-4 font-mono font-semibold">{pay.transactionRef}</td>
                      <td className="py-3 px-4">{getStatusBadge(pay.status)}</td>
                      <td className="py-3 px-4 text-slate-500 text-[11px] max-w-xs">
                        {pay.decisionNotes || "Pending review"}
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No payment submissions recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ACCOUNT PROFILE */}
        {activeTab === "account" && (
          <div className="max-w-xl mx-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Account Profile
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  disabled
                  value={user?.name || ""}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white opacity-80"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white opacity-80"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Account Role</label>
                <div className="inline-block px-2.5 py-1 rounded bg-[#00AEEF]/10 text-[#00AEEF] text-xs font-bold uppercase">
                  {user?.role}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
