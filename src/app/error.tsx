"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-8 shadow-xl text-center space-y-6">
        <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Something Went Wrong
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {error.message || "An unexpected error occurred while processing your request."}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00AEEF] to-[#7259FF] text-white text-xs font-bold shadow-sm hover:opacity-95 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
