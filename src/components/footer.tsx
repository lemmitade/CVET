import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#060910] text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00AEEF] to-[#7259FF] flex items-center justify-center text-white font-bold text-base shadow-sm">
                CV
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                CVET
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              The AI-powered ATS CV Builder & Checker purpose-built for job seekers in Ethiopia and globally.
            </p>
            <div className="text-xs font-semibold text-[#00AEEF]">
              Build Smarter. Get Hired Faster.
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/builder" className="hover:text-[#00AEEF] transition-colors">
                  One-Page CV Builder
                </Link>
              </li>
              <li>
                <Link href="/ats-checker" className="hover:text-[#00AEEF] transition-colors">
                  ATS Score Checker
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-[#00AEEF] transition-colors">
                  Pricing (ETB)
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-[#00AEEF] transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Ethiopian Payment & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Payments & Trust
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Telebirr Instant Transfer</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span>Commercial Bank of Ethiopia (CBE)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Awash Bank Mobile</span>
              </li>
              <li>
                <span className="text-xs text-slate-500">Manual review & fraud prevention verification</span>
              </li>
            </ul>
          </div>

          {/* Legal & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Security & Privacy
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your personal data and uploaded resumes are securely encrypted and stored with Google Drive cloud backup. We never sell your personal information.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#00AEEF] transition-colors"
              >
                Sign In / Admin Portal →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 CVET Ethiopia. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Ethiopian talent worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
