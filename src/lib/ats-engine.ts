import { memoryStore } from "@/lib/store";

export interface AtsIssue {
  id: string;
  category: "Contact" | "Structure" | "Experience" | "Education" | "Skills" | "Formatting" | "JobMatch";
  severity: "CRITICAL" | "WARNING" | "INFO";
  title: string;
  message: string;
  recommendation: string;
}

export interface AtsAnalysisResult {
  score: number; // 0 - 100
  readabilityScore: number;
  sectionsScore: number;
  experienceScore: number;
  skillsScore: number;
  formattingScore: number;
  jobMatchScore: number | null;
  issues: AtsIssue[];
  recommendations: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  wordCount: number;
  characterCount: number;
  detectedSections: string[];
  hasJobDescription: boolean;
  disclaimer: string;
}

const COMMON_TECH_KEYWORDS = [
  "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "PHP", "Go", "Rust", "Ruby",
  "React", "Next.js", "Angular", "Vue", "Node.js", "Express", "Django", "Spring Boot", "Laravel",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "SQL", "NoSQL", "Prisma",
  "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Linux", "Git", "GitHub", "CI/CD",
  "REST API", "GraphQL", "Microservices", "Agile", "Scrum", "DevOps", "Jira",
  "Project Management", "Data Analysis", "Machine Learning", "Financial Modeling", "Accounting",
  "Customer Service", "Sales", "Marketing", "Leadership", "Communication", "Problem Solving"
];

const ACTION_VERBS = [
  "built", "developed", "architected", "engineered", "created", "designed", "implemented",
  "spearheaded", "orchestrated", "led", "managed", "supervised", "directed", "launched",
  "accelerated", "optimized", "enhanced", "streamlined", "increased", "reduced", "delivered",
  "achieved", "analyzed", "audited", "automated", "negotiated", "resolved", "coordinated"
];

export function analyzeCvText(
  cvText: string,
  fileName: string = "uploaded_cv",
  jobDescription?: string | null
): AtsAnalysisResult {
  const issues: AtsIssue[] = [];
  const recommendations: string[] = [];

  const textLower = cvText.toLowerCase();
  const words = cvText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const characterCount = cvText.length;

  let readabilityScore = 95;
  let sectionsScore = 100;
  let experienceScore = 90;
  let skillsScore = 85;
  let formattingScore = 90;

  // 1. Text readability & software extractability
  if (wordCount < 100) {
    readabilityScore = 40;
    issues.push({
      id: "iss_readability_low_words",
      category: "Formatting",
      severity: "CRITICAL",
      title: "Extremely Low Text Content",
      message: `Only ${wordCount} words detected. The file may be an image scan, flattened graphic, or empty document.`,
      recommendation: "Use a text-based PDF or DOCX file generated from Google Docs, Word, or CVET to ensure ATS text extraction.",
    });
  } else if (wordCount > 1500) {
    formattingScore -= 15;
    issues.push({
      id: "iss_length_high",
      category: "Formatting",
      severity: "WARNING",
      title: "Resume Exceeds Recommended Length",
      message: `Your resume is approximately ${wordCount} words (likely 3+ pages). ATS and recruiters favor 1-2 focused pages.`,
      recommendation: "Condense your resume to the most relevant 5-10 years of experience and prioritize measurable accomplishments.",
    });
  }

  // Check for non-ASCII or corrupted characters
  const nonAsciiCount = (cvText.match(/[^\x00-\x7F]/g) || []).length;
  if (nonAsciiCount > cvText.length * 0.15 && nonAsciiCount > 50) {
    readabilityScore -= 20;
    issues.push({
      id: "iss_font_encoding",
      category: "Formatting",
      severity: "WARNING",
      title: "Unusual Font Encoding or Symbols",
      message: "Detected a high density of non-standard symbols or unusual font glyphs that may scramble ATS parsers.",
      recommendation: "Avoid decorative icon fonts, custom symbols, or non-standard bullet characters.",
    });
  }

  // 2. Contact Information Detection
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const hasEmail = emailRegex.test(cvText);

  // Phone regex for Ethiopian numbers (+251..., 09..., 07...) and international
  const phoneRegex = /(\+251\s?\d{2}\s?\d{3}\s?\d{4}|09\d{8}|07\d{8}|\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})/;
  const hasPhone = phoneRegex.test(cvText);

  // Location detection (Addis Ababa, Ethiopia, or standard city/country)
  const locationTerms = ["addis ababa", "ethiopia", "hawassa", "dire dawa", "adama", "bahir dar", "mekelle", "remote", "city", "country"];
  const hasLocation = locationTerms.some(term => textLower.includes(term));

  // Professional links
  const hasLinkedIn = textLower.includes("linkedin.com") || textLower.includes("linkedin");
  const hasPortfolioOrGithub = textLower.includes("github.com") || textLower.includes("portfolio") || textLower.includes("http");

  if (!hasEmail) {
    sectionsScore -= 20;
    issues.push({
      id: "iss_contact_email",
      category: "Contact",
      severity: "CRITICAL",
      title: "Missing Email Address",
      message: "No standard email address was parsed from your CV.",
      recommendation: "Place your professional email clearly in the top contact section.",
    });
  }

  if (!hasPhone) {
    sectionsScore -= 15;
    issues.push({
      id: "iss_contact_phone",
      category: "Contact",
      severity: "CRITICAL",
      title: "Missing Phone Number",
      message: "No clear phone number detected (e.g., +251 9... or international format).",
      recommendation: "Include an active phone number recruiters can call or reach via Telegram/WhatsApp.",
    });
  }

  if (!hasLocation) {
    sectionsScore -= 10;
    issues.push({
      id: "iss_contact_location",
      category: "Contact",
      severity: "WARNING",
      title: "Missing Geographic Location",
      message: "Location (e.g. Addis Ababa, Ethiopia) was not clearly recognized.",
      recommendation: "Add your city and country so recruiters can filter your application for local or remote positions.",
    });
  }

  if (!hasLinkedIn && !hasPortfolioOrGithub) {
    issues.push({
      id: "iss_contact_links",
      category: "Contact",
      severity: "INFO",
      title: "Add LinkedIn or Portfolio Link",
      message: "No professional links (LinkedIn or GitHub/Portfolio) were detected.",
      recommendation: "Adding a LinkedIn profile URL boosts credibility and recruiter click-through rates.",
    });
  }

  // 3. Standard Sections Detection
  const detectedSections: string[] = [];

  const summaryKeywords = ["summary", "profile", "professional summary", "about me", "objective", "overview"];
  const experienceKeywords = ["experience", "work experience", "employment", "work history", "professional experience"];
  const educationKeywords = ["education", "academic", "university", "degree", "bachelor", "master", "diploma"];
  const skillsKeywords = ["skills", "technical skills", "competencies", "core competencies", "technologies", "expertise"];
  const languagesKeywords = ["languages", "language proficiency"];

  if (summaryKeywords.some(k => textLower.includes(k))) detectedSections.push("Professional Summary");
  if (experienceKeywords.some(k => textLower.includes(k))) detectedSections.push("Work Experience");
  if (educationKeywords.some(k => textLower.includes(k))) detectedSections.push("Education");
  if (skillsKeywords.some(k => textLower.includes(k))) detectedSections.push("Skills");
  if (languagesKeywords.some(k => textLower.includes(k))) detectedSections.push("Languages");

  if (!detectedSections.includes("Professional Summary")) {
    sectionsScore -= 15;
    issues.push({
      id: "iss_sec_summary",
      category: "Structure",
      severity: "WARNING",
      title: "Missing Professional Summary",
      message: "A dedicated professional summary was not found.",
      recommendation: "Add a 3-sentence summary at the top outlining your target title, years of experience, and key strengths.",
    });
  }

  if (!detectedSections.includes("Work Experience")) {
    experienceScore -= 35;
    issues.push({
      id: "iss_sec_experience",
      category: "Structure",
      severity: "CRITICAL",
      title: "Missing Standard Work Experience Header",
      message: "ATS systems look for explicit headers like 'Work Experience' or 'Professional Experience'.",
      recommendation: "Use the standard heading 'Work Experience' above your past roles.",
    });
  }

  if (!detectedSections.includes("Education")) {
    sectionsScore -= 20;
    issues.push({
      id: "iss_sec_education",
      category: "Structure",
      severity: "CRITICAL",
      title: "Missing Education Section",
      message: "Could not find an Education section with your degree and university details.",
      recommendation: "Add an 'Education' section clearly stating degree title, institution, and dates.",
    });
  }

  if (!detectedSections.includes("Skills")) {
    skillsScore -= 25;
    issues.push({
      id: "iss_sec_skills",
      category: "Skills",
      severity: "CRITICAL",
      title: "Missing Dedicated Skills Section",
      message: "ATS keyword filters scan specifically under 'Skills' or 'Technical Competencies'.",
      recommendation: "Organize your hard and soft skills into an explicit bulleted 'Skills' section.",
    });
  }

  // 4. Action Verbs & Quantified Results Check
  const foundActionVerbs = ACTION_VERBS.filter(verb => textLower.includes(verb));
  if (foundActionVerbs.length < 3) {
    experienceScore -= 15;
    issues.push({
      id: "iss_action_verbs_low",
      category: "Experience",
      severity: "WARNING",
      title: "Low Action Verb Density",
      message: "Only a few strong action verbs were identified in your experience descriptions.",
      recommendation: "Begin bullet points with dynamic verbs like 'Spearheaded', 'Optimized', 'Architected', or 'Orchestrated'.",
    });
  }

  // Check for metrics/numbers in bullets (e.g., %, $, numbers, metrics)
  const numbersRegex = /\b(\d+[%$kKmM+]|\d+\+?)\b/g;
  const numberMatches = cvText.match(numbersRegex) || [];
  if (numberMatches.length < 2) {
    experienceScore -= 10;
    issues.push({
      id: "iss_metrics_missing",
      category: "Experience",
      severity: "INFO",
      title: "Add Measurable Metrics & Impact",
      message: "Few quantifiable achievements (percentages, revenue, team size, performance gains) were found.",
      recommendation: "Where possible, quantify your work: e.g. 'Improved response time by 35%' or 'Managed a team of 4'.",
    });
  }

  // 5. Date Consistency Check (e.g. 2020 - 2023 or Jan 2020)
  const yearRegex = /\b(19\d{2}|20\d{2})\b/g;
  const yearsFound = cvText.match(yearRegex) || [];
  if (yearsFound.length < 2) {
    formattingScore -= 15;
    issues.push({
      id: "iss_dates_sparse",
      category: "Formatting",
      severity: "WARNING",
      title: "Incomplete or Missing Dates",
      message: "ATS systems verify tenure using start and end dates (e.g. 2021 – Present).",
      recommendation: "Provide clear start and completion dates for both experience roles and education.",
    });
  }

  // 6. Keywords Analysis
  const foundKeywords = COMMON_TECH_KEYWORDS.filter(kw =>
    textLower.includes(kw.toLowerCase())
  );

  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];
  let jobMatchScore: number | null = null;

  if (jobDescription && jobDescription.trim().length > 20) {
    const jdLower = jobDescription.toLowerCase();
    // Extract candidate keywords from JD
    const jdWords = jobDescription
      .replace(/[^\w\s+#.]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2);

    const jdKeywordsCandidates = Array.from(new Set([
      ...COMMON_TECH_KEYWORDS.filter(kw => jdLower.includes(kw.toLowerCase())),
      ...jdWords.filter(w => [
        "leadership", "communication", "management", "architecture", "security",
        "testing", "cloud", "deployment", "database", "analytics", "compliance",
        "finance", "banking", "customer", "operations"
      ].includes(w.toLowerCase()))
    ]));

    matchedKeywords = jdKeywordsCandidates.filter(kw => textLower.includes(kw.toLowerCase()));
    missingKeywords = jdKeywordsCandidates.filter(kw => !textLower.includes(kw.toLowerCase()));

    if (jdKeywordsCandidates.length > 0) {
      jobMatchScore = Math.min(100, Math.round((matchedKeywords.length / jdKeywordsCandidates.length) * 100));
    } else {
      jobMatchScore = 75;
    }

    if (missingKeywords.length > 0) {
      issues.push({
        id: "iss_jd_missing_keywords",
        category: "JobMatch",
        severity: "WARNING",
        title: "Missing Job Description Keywords",
        message: `Your CV is missing ${missingKeywords.length} key terms mentioned in the job description: ${missingKeywords.slice(0, 5).join(", ")}${missingKeywords.length > 5 ? "..." : ""}`,
        recommendation: "Incorporate these relevant skills and tools naturally into your Summary, Experience, and Skills sections.",
      });
    }
  }

  // Calculate Weighted Overall ATS Score
  readabilityScore = Math.max(20, Math.min(100, readabilityScore));
  sectionsScore = Math.max(20, Math.min(100, sectionsScore));
  experienceScore = Math.max(20, Math.min(100, experienceScore));
  skillsScore = Math.max(20, Math.min(100, skillsScore));
  formattingScore = Math.max(20, Math.min(100, formattingScore));

  const totalScore = Math.round(
    readabilityScore * 0.15 +
    sectionsScore * 0.25 +
    experienceScore * 0.25 +
    skillsScore * 0.20 +
    formattingScore * 0.15
  );

  // Default recommendations
  recommendations.push("Ensure your name, email, and phone number are formatted cleanly at the top of your document.");
  recommendations.push("Use standard section titles: 'Professional Summary', 'Work Experience', 'Education', 'Skills'.");
  if (missingKeywords.length > 0) {
    recommendations.push(`Tailor your CV with keywords from the target role: ${missingKeywords.slice(0, 4).join(", ")}.`);
  }
  recommendations.push("Save your final CV as a single-column selectable-text PDF generated through CVET.");

  return {
    score: totalScore,
    readabilityScore,
    sectionsScore,
    experienceScore,
    skillsScore,
    formattingScore,
    jobMatchScore,
    issues,
    recommendations: Array.from(new Set(recommendations)),
    matchedKeywords: matchedKeywords.length > 0 ? matchedKeywords : foundKeywords.slice(0, 10),
    missingKeywords,
    wordCount,
    characterCount,
    detectedSections,
    hasJobDescription: Boolean(jobDescription && jobDescription.trim().length > 20),
    disclaimer: "Note: This score is CVET's proprietary ATS simulation and diagnostic assessment. While engineered around leading enterprise ATS parsing standards, it is not an absolute guarantee of passing every employer's proprietary screening software.",
  };
}
