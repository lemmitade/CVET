"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  FileText,
  SearchCheck,
  CreditCard,
  Sun,
  Moon,
  Menu,
  X,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  LogOut,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/builder", label: "CV Builder", icon: FileText },
    { href: "/ats-checker", label: "ATS Checker", icon: SearchCheck },
    { href: "/#pricing", label: "Pricing (ETB)", icon: CreditCard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#090d16]/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00AEEF] to-[#7259FF] flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
            CV
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              CVET
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-full bg-[#00AEEF]/10 text-[#00AEEF] border border-[#00AEEF]/20">
                AI ATS
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-100 dark:bg-slate-800/80 text-[#00AEEF] font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <Icon className="w-4 h-4 text-[#00AEEF]" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <User className="w-4 h-4 text-[#00AEEF]" />
                <span>{user.name.split(" ")[0]}</span>
              </Link>

              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7259FF]/10 text-[#7259FF] border border-[#7259FF]/30 text-xs font-semibold hover:bg-[#7259FF]/20 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/builder"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00AEEF] to-[#7259FF] text-white text-sm font-semibold shadow-sm hover:shadow-[#00AEEF]/20 hover:opacity-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Build CV
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d16] px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Icon className="w-4 h-4 text-[#00AEEF]" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-medium"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#00AEEF]" />
                    {user.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#7259FF]/10 text-[#7259FF] text-sm font-medium"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-500 font-medium"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/builder"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-[#00AEEF] to-[#7259FF] text-white"
                >
                  Build CV
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
