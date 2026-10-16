"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  LayoutDashboard,
  CreditCard,
  SearchCheck,
  Sparkles,
  DollarSign,
  FolderOpen,
  Settings,
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  AlertTriangle,
  RefreshCw,
  Save,
  RotateCcw,
  Sliders,
  ExternalLink,
  Trash2,
  Search,
  FileText,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "payments" | "ats" | "ai" | "pricing" | "files" | "users" | "website" | "audit"
  >("overview");

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // Overview metrics
  const [metrics, setMetrics] = useState<any>({
    totalUsers: 0,
    totalCvs: 0,
    totalScans: 0,
    totalPayments: 0,
    pendingCount: 0,
    totalRevenueEtb: 0,
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  // Payments
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  // ATS Rules & Settings
  const [atsRules, setAtsRules] = useState<any[]>([]);
  const [maxFileSizeBytes, setMaxFileSizeBytes] = useState<number>(1048576);
  const [allowedFormats, setAllowedFormats] = useState<string>("PDF, DOCX");

  // AI Settings
  const [selectedAiModel, setSelectedAiModel] = useState<string>("gpt-4o-mini");
  const [aiPrompts, setAiPrompts] = useState<any[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [testPromptResult, setTestPromptResult] = useState<string | null>(null);

  // Pricing & Accounts
  const [plans, setPlans] = useState<any[]>([]);
  const [paymentAccounts, setPaymentAccounts] = useState<any[]>([]);

  // Files
  const [files, setFiles] = useState<any[]>([]);
  const [storageStats, setStorageStats] = useState<any>({});
  const [fileSearch, setFileSearch] = useState("");

  // Users
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");

  // Website Settings
  const [websiteSettings, setWebsiteSettings] = useState<any>({});

  // Status message banner
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (!data?.user || data.user.role !== "ADMIN") {
          router.push("/login?redirect=/admin");
        } else {
          setCurrentUser(data.user);
          loadAllAdminData();
        }
      })
      .catch(() => {
        router.push("/login?redirect=/admin");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const loadAllAdminData = async () => {
    try {
      // 1. Overview
      const ovRes = await fetch("/api/admin/overview");
      const ovData = await ovRes.json();
      if (ovData?.metrics) setMetrics(ovData.metrics);
      if (ovData?.recentLogs) setRecentLogs(ovData.recentLogs);

      // 2. Payments
      const payRes = await fetch("/api/admin/payments");
      const payData = await payRes.json();
      if (payData?.payments) setPayments(payData.payments);

      // 3. ATS settings
      const atsRes = await fetch("/api/admin/ats-settings");
      const atsData = await atsRes.json();
      if (atsData?.rules) setAtsRules(atsData.rules);
      if (atsData?.settings?.maxFileSizeBytes) setMaxFileSizeBytes(atsData.settings.maxFileSizeBytes);

      // 4. AI settings
      const aiRes = await fetch("/api/admin/ai-settings");
      const aiData = await aiRes.json();
      if (aiData?.prompts) setAiPrompts(aiData.prompts);
      if (aiData?.selectedModel) setSelectedAiModel(aiData.selectedModel);
      if (aiData?.availableModels) setAvailableModels(aiData.availableModels);

      // 5. Pricing
      const prRes = await fetch("/api/admin/pricing");
      const prData = await prRes.json();
      if (prData?.plans) setPlans(prData.plans);
      if (prData?.paymentAccounts) setPaymentAccounts(prData.paymentAccounts);

      // 6. Files
      const filesRes = await fetch("/api/admin/files");
      const filesData = await filesRes.json();
      if (filesData?.files) setFiles(filesData.files);
      if (filesData?.storageStats) setStorageStats(filesData.storageStats);

      // 7. Users
      const usrRes = await fetch("/api/admin/users");
      const usrData = await usrRes.json();
      if (usrData?.users) setUsers(usrData.users);

      // 8. Website settings
      const stRes = await fetch("/api/admin/settings");
      const stData = await stRes.json();
      if (stData?.settings) setWebsiteSettings(stData.settings);
    } catch (err) {
      console.error("Admin load error:", err);
    }
  };

  // Payment Actions
  const handleUpdatePaymentStatus = async (
    paymentId: string,
    status: "APPROVED" | "REJECTED" | "MANUAL_REVIEW" | "VERIFYING",
    notes?: string
  ) => {
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, status, decisionNotes: notes }),
      });
      const data = await res.json();
      if (res.ok) {
        showStatus(`Payment ${status.toLowerCase()} successfully!`);
        loadAllAdminData();
      }
    } catch {
      alert("Failed to update payment status");
    }
  };

  // ATS Save
  const handleSaveAtsRules = async () => {
    const totalWeight = atsRules
      .filter(r => r.enabled)
      .reduce((sum, r) => sum + (parseInt(r.weight) || 0), 0);

    try {
      const res = await fetch("/api/admin/ats-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules: atsRules, maxFileSizeBytes, allowedFormats }),
      });
      if (res.ok) {
        showStatus(`ATS rules saved (Active weights total: ${totalWeight}%).`);
      }
    } catch {
      alert("Failed to save ATS rules");
    }
  };

  // AI Save
  const handleSaveAiSettings = async () => {
    try {
      const res = await fetch("/api/admin/ai-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedModel: selectedAiModel, prompts: aiPrompts }),
      });
      if (res.ok) {
        showStatus("AI model & prompts updated in database (no redeployment required).");
      }
    } catch {
      alert("Failed to save AI configuration");
    }
  };

  // Pricing Save
  const handleSavePricing = async () => {
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plans, paymentAccounts }),
      });
      if (res.ok) {
        showStatus("Pricing and Ethiopian recipient account details updated.");
      }
    } catch {
      alert("Failed to save pricing");
    }
  };

  // Website Settings Save
  const handleSaveWebsiteSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: websiteSettings }),
      });
      if (res.ok) {
        showStatus("Website copy and configurations saved.");
      }
    } catch {
      alert("Failed to save website settings");
    }
  };

  // File Delete
  const handleDeleteFile = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this file from storage?")) return;
    try {
      const res = await fetch("/api/admin/files", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });
      if (res.ok) {
        setFiles(files.filter(f => f.id !== fileId));
        showStatus("File permanently deleted from Google Drive / storage.");
      }
    } catch {
      alert("Failed to delete file");
    }
  };

  // User status update
  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: newStatus }),
      });
      if (res.ok) {
        setUsers(users.map(u => (u.id === userId ? { ...u, status: newStatus } : u)));
        showStatus(`User ${newStatus.toLowerCase()} successfully.`);
      }
    } catch {
      alert("Failed to update user");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#7259FF] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Authenticating administrator portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-slate-900 dark:text-slate-100">
      <Navbar />

      {/* Admin Top Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#070b14]/80 backdrop-blur-md px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7259FF]/10 text-[#7259FF] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
                CVET Executive Control Center
              </h1>
              <p className="text-xs text-slate-500">
                Logged in as <span className="font-semibold">{currentUser?.email}</span> (Super Admin)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAllAdminData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Data
            </button>
            <Link
              href="/builder"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#00AEEF] to-[#7259FF] text-white text-xs font-bold shadow-xs hover:opacity-95"
            >
              Go to CV Builder
            </Link>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 text-center text-xs text-emerald-600 dark:text-emerald-400 font-bold">
          ✓ {statusMessage}
        </div>
      )}

      {/* Admin Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-3 shadow-xs space-y-1">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            {
              id: "payments",
              label: "Payments & Verification",
              icon: CreditCard,
              badge: metrics.pendingCount > 0 ? metrics.pendingCount : null,
            },
            { id: "ats", label: "ATS Rules & Weights", icon: Sliders },
            { id: "ai", label: "AI Engine & Prompts", icon: Sparkles },
            { id: "pricing", label: "Pricing & Bank Accounts", icon: DollarSign },
            { id: "files", label: "Google Drive & Files", icon: FolderOpen },
            { id: "users", label: "User Management", icon: Users },
            { id: "website", label: "Website Settings", icon: Settings },
            { id: "audit", label: "Audit Logs", icon: Clock },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? "bg-[#7259FF] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-900">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* MAIN ADMIN WORKSPACE */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  {
                    title: "Total Revenue",
                    value: `${metrics.totalRevenueEtb} ETB`,
                    sub: "Approved Ethiopian Birr",
                    color: "text-[#00AEEF]",
                  },
                  {
                    title: "Pending Approvals",
                    value: metrics.pendingCount,
                    sub: "Receipts awaiting audit",
                    color: "text-amber-500",
                  },
                  {
                    title: "Total Users",
                    value: metrics.totalUsers,
                    sub: "Registered candidate profiles",
                    color: "text-slate-900 dark:text-white",
                  },
                  {
                    title: "CVs Generated",
                    value: metrics.totalCvs,
                    sub: "1-Page continuous builds",
                    color: "text-[#7259FF]",
                  },
                  {
                    title: "ATS Scans Run",
                    value: metrics.totalScans,
                    sub: "Uploaded PDF / DOCX scans",
                    color: "text-emerald-500",
                  },
                  {
                    title: "Payment Records",
                    value: metrics.totalPayments,
                    sub: "Telebirr, CBE, Awash",
                    color: "text-slate-900 dark:text-white",
                  },
                ].map((kpi, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {kpi.title}
                    </span>
                    <div className={`text-2xl font-extrabold mt-1 ${kpi.color}`}>
                      {kpi.value}
                    </div>
                    <span className="text-[10.5px] text-slate-500 mt-1 block">
                      {kpi.sub}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Recent Audit Trail
                </h3>
                <div className="space-y-2">
                  {recentLogs.map((log, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white mr-2">
                          {log.action}
                        </span>
                        <span className="text-slate-500">by {log.performedBy}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PAYMENTS & VERIFICATION */}
          {activeTab === "payments" && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Manual Payment Verification
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Review candidate screenshots and bank references. Duplicate transaction references are blocked automatically.
                  </p>
                </div>
                <div className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {metrics.pendingCount} Pending Verification
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <tr>
                      <th className="py-3 px-3 font-semibold">User / CV</th>
                      <th className="py-3 px-3 font-semibold">Method</th>
                      <th className="py-3 px-3 font-semibold">Amount</th>
                      <th className="py-3 px-3 font-semibold">Transaction Reference</th>
                      <th className="py-3 px-3 font-semibold">Screenshot</th>
                      <th className="py-3 px-3 font-semibold">Status</th>
                      <th className="py-3 px-3 font-semibold text-right">Decision Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {payments.map(pay => (
                      <tr key={pay.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 dark:text-white">{pay.planName}</div>
                          <div className="text-[10px] text-slate-400">User: {pay.userId}</div>
                        </td>
                        <td className="py-3 px-3 font-semibold">{pay.paymentMethod}</td>
                        <td className="py-3 px-3 font-extrabold text-[#00AEEF]">{pay.amountEtb} ETB</td>
                        <td className="py-3 px-3 font-mono font-bold">{pay.transactionRef}</td>
                        <td className="py-3 px-3">
                          {pay.screenshotUrl ? (
                            <button
                              type="button"
                              onClick={() => setSelectedScreenshot(pay.screenshotUrl)}
                              className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-[#00AEEF] hover:underline flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> View Slip
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">None attached</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              pay.status === "APPROVED"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : pay.status === "PENDING"
                                ? "bg-amber-500/10 text-amber-500"
                                : pay.status === "REJECTED"
                                ? "bg-red-500/10 text-red-500"
                                : "bg-blue-500/10 text-blue-500"
                            }`}
                          >
                            {pay.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {pay.status !== "APPROVED" && (
                              <button
                                type="button"
                                onClick={() => handleUpdatePaymentStatus(pay.id, "APPROVED", "Approved by administrator audit.")}
                                className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700"
                              >
                                Approve
                              </button>
                            )}
                            {pay.status !== "REJECTED" && (
                              <button
                                type="button"
                                onClick={() => {
                                  const reason = prompt("Enter rejection reason for customer:") || "Transaction reference mismatch.";
                                  handleUpdatePaymentStatus(pay.id, "REJECTED", reason);
                                }}
                                className="px-2.5 py-1 rounded-md bg-red-600 text-white font-bold text-[11px] hover:bg-red-700"
                              >
                                Reject
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleUpdatePaymentStatus(pay.id, "MANUAL_REVIEW", "Flagged for manual banking verification.")}
                              className="px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 text-[10.5px] font-semibold text-slate-600 dark:text-slate-400"
                            >
                              Flag Review
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Screenshot Preview Modal */}
              {selectedScreenshot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl max-w-lg w-full space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-xs font-bold">Payment Slip Receipt Viewer</span>
                      <button onClick={() => setSelectedScreenshot(null)} className="text-slate-400 font-bold">
                        ✕
                      </button>
                    </div>
                    <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedScreenshot}
                        alt="Payment receipt slip"
                        className="max-w-full h-auto rounded-lg object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ATS RULES & WEIGHTS */}
          {activeTab === "ats" && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    ATS Diagnostic Checks & Weighting
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure scoring weights (must total 100%), enable/disable checks, and adjust upload limits.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveAtsRules}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00AEEF] to-[#7259FF] text-white text-xs font-bold"
                >
                  <Save className="w-4 h-4" /> Save ATS Settings
                </button>
              </div>

              {/* Upload Limit Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Maximum CV Upload Size (Bytes)
                  </label>
                  <input
                    type="number"
                    value={maxFileSizeBytes}
                    onChange={e => setMaxFileSizeBytes(parseInt(e.target.value) || 1048576)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Default: 1,048,576 bytes (1.00 MB)
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Allowed Document Extensions
                  </label>
                  <input
                    type="text"
                    value={allowedFormats}
                    onChange={e => setAllowedFormats(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Comma-separated: PDF, DOCX, DOC</p>
                </div>
              </div>

              {/* Rules List */}
              <div className="space-y-3">
                {atsRules.map((rule, idx) => (
                  <div
                    key={rule.id || idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-lg">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={e =>
                            setAtsRules(
                              atsRules.map((r, i) => (i === idx ? { ...r, enabled: e.target.checked } : r))
                            )
                          }
                          className="rounded text-[#00AEEF]"
                        />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {rule.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                          {rule.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
                        {rule.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pl-6 sm:pl-0 shrink-0">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">Weight (%)</span>
                        <input
                          type="number"
                          min={0}
                          max={50}
                          value={rule.weight}
                          onChange={e =>
                            setAtsRules(
                              atsRules.map((r, i) =>
                                i === idx ? { ...r, weight: parseInt(e.target.value) || 0 } : r
                              )
                            )
                          }
                          className="w-16 px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-bold"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">Severity</span>
                        <select
                          value={rule.severity}
                          onChange={e =>
                            setAtsRules(
                              atsRules.map((r, i) => (i === idx ? { ...r, severity: e.target.value } : r))
                            )
                          }
                          className="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                        >
                          <option value="CRITICAL">CRITICAL</option>
                          <option value="WARNING">WARNING</option>
                          <option value="INFO">INFO</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AI ENGINE & PROMPTS */}
          {activeTab === "ai" && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    OpenAI Integration & Prompt Templates
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure models and customize prompt templates in real-time without redeployment.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveAiSettings}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00AEEF] to-[#7259FF] text-white text-xs font-bold"
                >
                  <Save className="w-4 h-4" /> Save Prompts
                </button>
              </div>

              {/* Model Selector */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select Active OpenAI Model
                </label>
                <div className="flex gap-3">
                  <select
                    value={selectedAiModel}
                    onChange={e => setSelectedAiModel(e.target.value)}
                    className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    {availableModels.map(m => (
                      <option key={m} value={m}>
                        {m} (OpenAI)
                      </option>
                    ))}
                  </select>
                  <span className="text-xs text-slate-400 self-center">
                    Stored in database setting: takes effect across all AI endpoints immediately.
                  </span>
                </div>
              </div>

              {/* Editable Prompts */}
              <div className="space-y-4">
                {aiPrompts.map((prompt, idx) => (
                  <div
                    key={prompt.id || idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {prompt.name}
                      </span>
                      <span className="text-[10px] text-slate-400">{prompt.description}</span>
                    </div>
                    <textarea
                      rows={5}
                      value={prompt.promptText}
                      onChange={e =>
                        setAiPrompts(
                          aiPrompts.map((p, i) =>
                            i === idx ? { ...p, promptText: e.target.value } : p
                          )
                        )
                      }
                      className="w-full p-3 font-mono text-[11px] leading-relaxed rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PRICING & BANK ACCOUNTS */}
          {activeTab === "pricing" && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Ethiopian Birr (ETB) Pricing & Bank Accounts
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Edit prices, recipient account numbers (Telebirr, CBE, Awash), and payment instructions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSavePricing}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00AEEF] to-[#7259FF] text-white text-xs font-bold"
                >
                  <Save className="w-4 h-4" /> Save Rates & Accounts
                </button>
              </div>

              {/* Plans Editing */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Plan Prices (ETB)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {plans.map((plan, idx) => (
                    <div
                      key={plan.id || idx}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2"
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {plan.name}
                      </span>
                      <div>
                        <label className="text-[10px] text-slate-400 block">Price (ETB)</label>
                        <input
                          type="number"
                          value={plan.priceEtb}
                          onChange={e =>
                            setPlans(
                              plans.map((p, i) =>
                                i === idx ? { ...p, priceEtb: parseFloat(e.target.value) || 0 } : p
                              )
                            )
                          }
                          className="w-full px-2.5 py-1.5 text-xs font-bold rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Accounts Editing */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recipient Accounts & Instructions
                </h4>
                <div className="space-y-4">
                  {paymentAccounts.map((acc, idx) => (
                    <div
                      key={acc.id || idx}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2.5"
                    >
                      <div className="flex justify-between font-bold text-xs">
                        <span>{acc.name}</span>
                        <span className="text-[11px] text-[#00AEEF]">{acc.badge}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Account / Mobile Number</label>
                          <input
                            type="text"
                            value={acc.accountNumber}
                            onChange={e =>
                              setPaymentAccounts(
                                paymentAccounts.map((a, i) =>
                                  i === idx ? { ...a, accountNumber: e.target.value } : a
                                )
                              )
                            }
                            className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Account Holder Name</label>
                          <input
                            type="text"
                            value={acc.accountName}
                            onChange={e =>
                              setPaymentAccounts(
                                paymentAccounts.map((a, i) =>
                                  i === idx ? { ...a, accountName: e.target.value } : a
                                )
                              )
                            }
                            className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Customer Instructions</label>
                        <input
                          type="text"
                          value={acc.instructions}
                          onChange={e =>
                            setPaymentAccounts(
                              paymentAccounts.map((a, i) =>
                                i === idx ? { ...a, instructions: e.target.value } : a
                              )
                            )
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: GOOGLE DRIVE & FILES */}
          {activeTab === "files" && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Google Drive File Manager
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Encrypted file records for CV uploads, generated PDFs, and payment screenshots.
                  </p>
                </div>
                <div className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {storageStats.totalMb || "0.00"} MB Used • {storageStats.totalFiles || 0} Files
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <tr>
                      <th className="py-3 px-3 font-semibold">File Name</th>
                      <th className="py-3 px-3 font-semibold">Folder Category</th>
                      <th className="py-3 px-3 font-semibold">Size</th>
                      <th className="py-3 px-3 font-semibold">Google Drive File ID</th>
                      <th className="py-3 px-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {files.map(f => (
                      <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{f.name}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 font-semibold">
                            {f.folderType}
                          </span>
                        </td>
                        <td className="py-3 px-3">{(f.size / 1024).toFixed(1)} KB</td>
                        <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                          {f.googleDriveFileId || "Cached locally"}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteFile(f.id)}
                            className="p-1 rounded text-slate-400 hover:text-red-500"
                            title="Delete file permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {files.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No files currently uploaded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: USERS */}
          {activeTab === "users" && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    User Accounts & Security
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Search candidate profiles, view their CVs, and manage account suspension.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <tr>
                      <th className="py-3 px-3 font-semibold">User</th>
                      <th className="py-3 px-3 font-semibold">Role</th>
                      <th className="py-3 px-3 font-semibold">CVs</th>
                      <th className="py-3 px-3 font-semibold">Payments</th>
                      <th className="py-3 px-3 font-semibold">Status</th>
                      <th className="py-3 px-3 font-semibold text-right">Account Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                          <div className="text-[10px] text-slate-400">{u.email}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.role === "ADMIN" ? "bg-[#7259FF]/10 text-[#7259FF]" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold">{u.cvCount}</td>
                        <td className="py-3 px-3 font-bold">{u.paymentCount}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.status === "ACTIVE"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(u.id, u.status)}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                              u.status === "ACTIVE"
                                ? "bg-red-100 dark:bg-red-950/40 text-red-600 hover:bg-red-200"
                                : "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-200"
                            }`}
                          >
                            {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: WEBSITE SETTINGS */}
          {activeTab === "website" && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Public Website Copy & Branding
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Edit homepage hero headlines, contact information, and brand tagline.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveWebsiteSettings}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00AEEF] to-[#7259FF] text-white text-xs font-bold"
                >
                  <Save className="w-4 h-4" /> Save Website Text
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Homepage Hero Headline
                  </label>
                  <input
                    type="text"
                    value={websiteSettings.heroHeadline || ""}
                    onChange={e => setWebsiteSettings({ ...websiteSettings, heroHeadline: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Homepage Subheadline / Description
                  </label>
                  <textarea
                    rows={3}
                    value={websiteSettings.heroSubheadline || ""}
                    onChange={e => setWebsiteSettings({ ...websiteSettings, heroSubheadline: e.target.value })}
                    className="w-full p-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Support Email
                    </label>
                    <input
                      type="text"
                      value={websiteSettings.contactEmail || ""}
                      onChange={e => setWebsiteSettings({ ...websiteSettings, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Office Location
                    </label>
                    <input
                      type="text"
                      value={websiteSettings.officeAddress || ""}
                      onChange={e => setWebsiteSettings({ ...websiteSettings, officeAddress: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: AUDIT LOGS */}
          {activeTab === "audit" && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Security & Action Audit Logs
              </h3>
              <div className="space-y-2">
                {recentLogs.map((log, i) => (
                  <div
                    key={log.id || i}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-[#00AEEF]">{log.action}</span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Entity: <span className="font-semibold text-slate-700 dark:text-slate-300">{log.entity}</span> • Performed By: <span className="font-semibold text-slate-700 dark:text-slate-300">{log.performedBy}</span>
                    </div>
                    {log.details && (
                      <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded font-mono text-[10px] text-slate-600 dark:text-slate-400 overflow-x-auto">
                        {log.details}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
