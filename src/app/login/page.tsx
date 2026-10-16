"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Sparkles, Lock, Mail, User, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const payload = mode === "login" ? { email, password } : { email, password, name };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // If logging in as admin, redirect to admin
      if (data.user?.role === "ADMIN" && redirect === "/dashboard") {
        router.push("/admin");
      } else {
        router.push(redirect);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (role: "admin" | "user") => {
    if (role === "admin") {
      setEmail("admin@cvet.et");
      setPassword("AdminPassword2026!");
    } else {
      setEmail("jobseeker@cvet.et");
      setPassword("AdminPassword2026!");
    }
  };

  return (
    <div className="max-w-md w-full bg-white dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl backdrop-blur-md text-left">
      <div className="text-center mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00AEEF] to-[#7259FF] text-white font-extrabold flex items-center justify-center mx-auto text-xl shadow-md">
          CV
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">
          {mode === "login" ? "Sign in to CVET" : "Create your CVET account"}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Build Smarter. Get Hired Faster.
        </p>
      </div>

      {/* Quick Demo Fill Buttons */}
      <div className="mb-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
          Quick Test Credentials
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill("admin")}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200 hover:bg-[#7259FF]/10 hover:border-[#7259FF] transition-colors text-[11px]"
          >
            Fill Super Admin
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill("user")}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200 hover:bg-[#00AEEF]/10 hover:border-[#00AEEF] transition-colors text-[11px]"
          >
            Fill Job Seeker
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Abebe Kebede"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@cvet.et or your email"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00AEEF] to-[#7259FF] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all disabled:opacity-50 mt-2"
        >
          {loading ? "Authenticating..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500">
        {mode === "login" ? (
          <p>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("register")}
              className="font-bold text-[#00AEEF] hover:underline"
            >
              Sign Up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("login")}
              className="font-bold text-[#00AEEF] hover:underline"
            >
              Sign In
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6">
        <Suspense fallback={<div className="text-xs text-slate-500">Loading authentication...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
