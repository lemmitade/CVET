import prisma from "@/lib/prisma";
import { DEFAULT_ATS_RULES, DEFAULT_AI_PROMPTS, DEFAULT_PRICING_PLANS, DEFAULT_WEBSITE_SETTINGS, DEFAULT_PAYMENT_ACCOUNTS } from "@/lib/default-data";
import { hashPassword } from "@/lib/auth";

// In-memory / file fallback state when Neon DB connection is offline
interface MemoryState {
  users: Array<{ id: string; email: string; passwordHash: string; name: string; phone?: string; role: "USER" | "ADMIN"; status: "ACTIVE" | "SUSPENDED"; createdAt: Date }>;
  cvs: Array<any>;
  atsScans: Array<any>;
  payments: Array<any>;
  files: Array<any>;
  settings: Record<string, any>;
  atsRules: Array<any>;
  aiPrompts: Array<any>;
  pricingPlans: Array<any>;
  auditLogs: Array<any>;
}

declare global {
  // eslint-disable-next-line no-var
  var memoryStateGlobal: MemoryState | undefined;
}

function initMemoryState(): MemoryState {
  if (globalThis.memoryStateGlobal) {
    return globalThis.memoryStateGlobal;
  }

  const state: MemoryState = {
    users: [
      {
        id: "usr_admin_default",
        email: process.env.INITIAL_ADMIN_EMAIL || "admin@cvet.et",
        passwordHash: "$2a$10$rCvhG9uHwV3l93B0s4wzQe8aTzDq6Z6vY57Yl0pYI1W.vU/kY6fCe", // AdminPassword2026!
        name: "CVET System Admin",
        phone: "+251911234567",
        role: "ADMIN",
        status: "ACTIVE",
        createdAt: new Date(),
      },
      {
        id: "usr_demo_user",
        email: "jobseeker@cvet.et",
        passwordHash: "$2a$10$rCvhG9uHwV3l93B0s4wzQe8aTzDq6Z6vY57Yl0pYI1W.vU/kY6fCe",
        name: "Abebe Kebede",
        phone: "+251922334455",
        role: "USER",
        status: "ACTIVE",
        createdAt: new Date(),
      },
    ],
    cvs: [
      {
        id: "cv_demo_sample",
        userId: "usr_demo_user",
        title: "Senior Full Stack Software Engineer CV",
        targetJobTitle: "Senior Software Engineer",
        yearsOfExperience: 5,
        fullName: "Abebe Kebede",
        email: "abebe.kebede@gmail.com",
        phone: "+251 911 234 567",
        location: "Addis Ababa, Ethiopia",
        linkedin: "https://linkedin.com/in/abebekebede",
        portfolio: "https://abebekebede.dev",
        summary: "Results-driven Software Engineer with 5+ years of experience building scalable fintech and enterprise web applications. Proficient in Next.js, Node.js, TypeScript, PostgreSQL, and cloud deployments. Proven track record leading agile developer squads and optimizing high-load transactional systems.",
        jobDescription: "Looking for a Senior Software Engineer with strong TypeScript, React/Next.js, Node.js, REST APIs, and database experience.",
        templateCode: "standard_ats",
        isPurchased: true,
        workExperiences: [
          {
            id: "exp_1",
            company: "Ethio Telecom Digital Financial Services",
            jobTitle: "Senior Full Stack Developer",
            location: "Addis Ababa, Ethiopia",
            startDate: "2022-03",
            endDate: "",
            isCurrent: true,
            responsibilities: "Spearheaded the integration of digital payment gateways serving over 2M+ active subscribers.\nArchitected responsive merchant dashboards using Next.js and Tailwind CSS, decreasing load times by 42%.\nMentored 6 junior engineers on code reviews, automated unit testing, and CI/CD pipelines.",
            order: 0,
          },
          {
            id: "exp_2",
            company: "iCog Labs / Fintech Hub",
            jobTitle: "Software Developer",
            location: "Addis Ababa, Ethiopia",
            startDate: "2019-09",
            endDate: "2022-02",
            isCurrent: false,
            responsibilities: "Engineered high-throughput REST APIs using Node.js and PostgreSQL handling 500+ requests/sec.\nImplemented OAuth2 authentication, role-based access control, and audit logging for security compliance.\nCollaborated with UI/UX designers to translate Figma specifications into responsive web components.",
            order: 1,
          },
        ],
        educations: [
          {
            id: "edu_1",
            school: "Addis Ababa University (AAiT)",
            degree: "Bachelor of Science",
            fieldOfStudy: "Computer Engineering",
            startDate: "2015-09",
            endDate: "2019-07",
            grade: "3.85 GPA - Very Great Distinction",
            order: 0,
          },
        ],
        skills: [
          { id: "sk_1", name: "TypeScript", category: "Technical", order: 0 },
          { id: "sk_2", name: "Next.js & React", category: "Technical", order: 1 },
          { id: "sk_3", name: "Node.js & Express", category: "Technical", order: 2 },
          { id: "sk_4", name: "PostgreSQL & Prisma", category: "Technical", order: 3 },
          { id: "sk_5", name: "REST APIs & GraphQL", category: "Technical", order: 4 },
          { id: "sk_6", name: "Docker & AWS", category: "Tools", order: 5 },
          { id: "sk_7", name: "Agile Leadership", category: "Soft", order: 6 },
        ],
        certifications: [
          { id: "cert_1", name: "AWS Certified Solutions Architect - Associate", issuer: "Amazon Web Services", issueDate: "2023", credentialUrl: "https://aws.amazon.com", order: 0 },
        ],
        languages: [
          { id: "lang_1", name: "Amharic", proficiency: "Native", order: 0 },
          { id: "lang_2", name: "English", proficiency: "Fluent / Professional", order: 1 },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    atsScans: [
      {
        id: "scan_demo_1",
        userId: "usr_demo_user",
        fileName: "Abebe_Kebede_Resume_2026.pdf",
        fileSize: 184520,
        fileMimeType: "application/pdf",
        score: 92,
        readabilityScore: 98,
        sectionsScore: 100,
        experienceScore: 90,
        skillsScore: 95,
        formattingScore: 88,
        jobMatchScore: 89,
        jobDescription: "Senior Software Engineer with TypeScript and React experience",
        matchedKeywords: ["TypeScript", "Next.js", "React", "Node.js", "PostgreSQL", "REST APIs", "CI/CD"],
        missingKeywords: ["Kubernetes", "Redis", "Kafka"],
        issues: [
          { id: "iss_1", severity: "INFO", title: "Clean Single-Column Layout", message: "Your CV uses an ATS-compliant single column layout. Perfect for automated parsers." },
          { id: "iss_2", severity: "WARNING", title: "Missing Specific Tool Keywords", message: "The job description mentions 'Redis' and 'Kafka' which are not explicitly highlighted in your skills." },
        ],
        recommendations: [
          "Add 1-2 bullet points mentioning distributed caching or message queues if you have hands-on experience.",
          "Keep your email and phone format consistent across all applications.",
        ],
        createdAt: new Date(),
      },
    ],
    payments: [
      {
        id: "pay_demo_1",
        userId: "usr_demo_user",
        cvId: "cv_demo_sample",
        planName: "Pro ATS & Career Pack",
        amountEtb: 450,
        paymentMethod: "Telebirr",
        transactionRef: "TB-2026-984321",
        screenshotUrl: "/sample-payment-slip.png",
        status: "APPROVED",
        decisionNotes: "Verified transaction TB-2026-984321 with Telebirr statement. Download unlocked.",
        verifiedBy: "admin@cvet.et",
        verifiedAt: new Date(),
        createdAt: new Date(Date.now() - 3600000 * 24),
        updatedAt: new Date(),
      },
      {
        id: "pay_demo_2",
        userId: "usr_demo_user",
        cvId: "cv_demo_sample",
        planName: "Standard CV Pass",
        amountEtb: 250,
        paymentMethod: "CBE",
        transactionRef: "CBE-FT261058291",
        screenshotUrl: "/sample-payment-slip.png",
        status: "PENDING",
        decisionNotes: "Under verification queue. Awaiting admin review.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    files: [],
    settings: {
      ...DEFAULT_WEBSITE_SETTINGS,
      paymentAccounts: JSON.stringify(DEFAULT_PAYMENT_ACCOUNTS),
    },
    atsRules: DEFAULT_ATS_RULES.map((r, i) => ({ id: `rule_${i + 1}`, ...r })),
    aiPrompts: DEFAULT_AI_PROMPTS.map((p, i) => ({ id: `prompt_${i + 1}`, ...p })),
    pricingPlans: DEFAULT_PRICING_PLANS,
    auditLogs: [
      {
        id: "log_1",
        action: "PAYMENT_APPROVED",
        entity: "Payment",
        entityId: "pay_demo_1",
        details: JSON.stringify({ amountEtb: 450, method: "Telebirr", transactionRef: "TB-2026-984321" }),
        performedBy: "admin@cvet.et",
        createdAt: new Date(),
      },
    ],
  };

  globalThis.memoryStateGlobal = state;
  return state;
}

export const memoryStore = initMemoryState();

// Helper to check if database is online
export async function isDatabaseConnected(): Promise<boolean> {
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.STORAGE_URL ||
    process.env.STORAGE_DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    "";

  if (!dbUrl || dbUrl.includes("placeholder") || dbUrl.includes("ep-cool-mountain")) {
    return false;
  }
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
