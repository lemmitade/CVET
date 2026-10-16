import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CVET — AI ATS CV Builder & Checker for Ethiopia",
  description:
    "Build Smarter. Get Hired Faster. Create ATS-optimized CVs, check your ATS compatibility score, match job descriptions, and download professional PDFs.",
  keywords: [
    "CVET",
    "Ethiopia CV Builder",
    "ATS Resume Checker Ethiopia",
    "AI CV Maker",
    "Telebirr CV payment",
    "CBE CV download",
    "ATS resume optimization",
  ],
  authors: [{ name: "CVET Ethiopia" }],
  openGraph: {
    title: "CVET — AI ATS CV Builder & Checker",
    description: "Build Smarter. Get Hired Faster.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans antialiased selection:bg-[#00AEEF]/20 selection:text-[#00AEEF]">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
