export interface DefaultAtsRule {
  code: string;
  title: string;
  category: "Contact" | "Structure" | "Experience" | "Education" | "Skills" | "Formatting";
  weight: number;
  enabled: boolean;
  severity: "CRITICAL" | "WARNING" | "INFO";
  description: string;
  recommendationTemplate: string;
}

export const DEFAULT_ATS_RULES: DefaultAtsRule[] = [
  {
    code: "RULE_CONTACT_EMAIL",
    title: "Professional Email Address",
    category: "Contact",
    weight: 10,
    enabled: true,
    severity: "CRITICAL",
    description: "Detects if a valid professional email address is present in the header.",
    recommendationTemplate: "Include an active, professional email address at the top of your CV.",
  },
  {
    code: "RULE_CONTACT_PHONE",
    title: "Valid Phone Number",
    category: "Contact",
    weight: 10,
    enabled: true,
    severity: "CRITICAL",
    description: "Ensures contact phone number (including Ethiopian +251 / 09 format) is detected.",
    recommendationTemplate: "Add a direct phone number so recruiters can reach you easily.",
  },
  {
    code: "RULE_CONTACT_LOCATION",
    title: "Location / City & Country",
    category: "Contact",
    weight: 5,
    enabled: true,
    severity: "WARNING",
    description: "Checks for geographic location (e.g., Addis Ababa, Ethiopia).",
    recommendationTemplate: "Add your city and country (e.g. Addis Ababa, Ethiopia) to pass location filters.",
  },
  {
    code: "RULE_SECTION_SUMMARY",
    title: "Professional Summary Section",
    category: "Structure",
    weight: 10,
    enabled: true,
    severity: "WARNING",
    description: "Validates presence of a compelling 3-4 sentence professional summary.",
    recommendationTemplate: "Include a targeted Professional Summary highlighting your experience and top skills.",
  },
  {
    code: "RULE_SECTION_EXPERIENCE",
    title: "Standard Experience Section",
    category: "Experience",
    weight: 25,
    enabled: true,
    severity: "CRITICAL",
    description: "Checks for standard 'Work Experience' or 'Employment History' section header.",
    recommendationTemplate: "Use standard headings like 'Work Experience' or 'Professional Experience'.",
  },
  {
    code: "RULE_ACTION_VERBS",
    title: "Action-Oriented Bullet Points",
    category: "Experience",
    weight: 10,
    enabled: true,
    severity: "WARNING",
    description: "Scans experience bullets for strong action verbs (e.g. Led, Developed, Optimized, Managed).",
    recommendationTemplate: "Start each bullet point with a strong action verb and quantify results where possible.",
  },
  {
    code: "RULE_SECTION_EDUCATION",
    title: "Education Section & Degree",
    category: "Education",
    weight: 15,
    enabled: true,
    severity: "CRITICAL",
    description: "Verifies standard 'Education' header with degree, institution, and completion date.",
    recommendationTemplate: "Ensure your Education section clearly lists your degree, university/college, and graduation year.",
  },
  {
    code: "RULE_SECTION_SKILLS",
    title: "Dedicated Skills Section",
    category: "Skills",
    weight: 15,
    enabled: true,
    severity: "CRITICAL",
    description: "Checks for a dedicated skills section with high-value domain keywords.",
    recommendationTemplate: "Create a distinct 'Skills' section listing relevant technical, tool, and soft skills.",
  },
  {
    code: "RULE_FORMAT_SINGLE_COLUMN",
    title: "Single Column ATS Format",
    category: "Formatting",
    weight: 10,
    enabled: true,
    severity: "WARNING",
    description: "Flags complex multi-column tables, graphics, or text frames that confuse ATS scanners.",
    recommendationTemplate: "Keep your layout single-column with standard margins for 100% parser compatibility.",
  },
];

export const DEFAULT_AI_PROMPTS = [
  {
    name: "IMPROVE_SUMMARY",
    description: "Enhance professional summary for clarity, ATS keywords, and executive impact.",
    promptText: `You are an expert Ethiopian and international ATS resume coach. Rewrite and improve the following candidate summary.
Target Role: {targetJobTitle}
Years of Experience: {yearsOfExperience}
Core Skills: {skills}
Original Summary: {currentSummary}

Rules:
- Keep the length between 3 and 4 powerful sentences.
- Never invent unearned degrees, credentials, or fake past employer names.
- Highlight demonstrable value, domain expertise, and ATS-friendly phrasing.
- Return ONLY the improved summary text, nothing else.`,
    model: "gpt-4o-mini",
    temperature: 0.6,
    maxTokens: 300,
    isDefault: true,
  },
  {
    name: "REWRITE_BULLET",
    description: "Rewrite a work experience bullet point with strong action verbs and impact.",
    promptText: `You are an elite ATS resume writer. Rewrite the following work experience bullet point.
Job Title: {jobTitle}
Original Bullet: {bulletPoint}

Rules:
- Start with a punchy past-tense action verb (e.g., Architected, Spearheaded, Accelerated, Streamlined).
- Keep factual integrity: do not fabricate specific false dollar figures or fake metrics if none were present.
- Make the tone concise, professional, and clear.
- Return ONLY the rewritten bullet point string.`,
    model: "gpt-4o-mini",
    temperature: 0.5,
    maxTokens: 150,
    isDefault: true,
  },
  {
    name: "ATS_JOB_MATCH",
    description: "Analyze CV text against a Job Description and identify matched and missing keywords.",
    promptText: `You are an AI ATS parsing engine. Compare the candidate CV text with the job description.
CV Text:
{cvText}

Job Description:
{jobDescription}

Output a strictly valid JSON object with the following schema:
{
  "jobMatchScore": <integer 0 to 100>,
  "matchedKeywords": [<string>, ...],
  "missingKeywords": [<string>, ...],
  "criticalMissingSkills": [<string>, ...],
  "tailoringAdvice": [<string>, ...]
}`,
    model: "gpt-4o-mini",
    temperature: 0.2,
    maxTokens: 800,
    isDefault: true,
  },
];

export const DEFAULT_PRICING_PLANS = [
  {
    id: "plan-standard",
    name: "Standard CV Pass",
    description: "Perfect for active job seekers looking for an ATS-cleared CV.",
    priceEtb: 250,
    features: [
      "Selectable text ATS-Optimized PDF Download",
      "Comprehensive ATS Compatibility Report",
      "Unlimited edits for 48 hours",
      "Ethiopian Mobile Banking Support (Telebirr/CBE)",
      "Standard CV Template",
    ],
    isPopular: false,
  },
  {
    id: "plan-pro",
    name: "Pro ATS & Career Pack",
    description: "Most popular choice for Ethiopian graduates & professionals.",
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
    id: "plan-executive",
    name: "Executive & International Pack",
    description: "For senior professionals targeting NGOs, Embassies & Remote roles.",
    priceEtb: 750,
    features: [
      "Everything in Pro ATS Pack",
      "3 Tailored CV Versions for Different Job Roles",
      "Cover Letter ATS Template",
      "Instant 15-Minute Payment Verification",
      "Lifetime PDF Re-download Guarantee",
    ],
    isPopular: false,
  },
];

export const DEFAULT_PAYMENT_ACCOUNTS = [
  {
    id: "telebirr",
    name: "Telebirr",
    accountNumber: "0911 23 45 67",
    accountName: "CVET Digital Technologies",
    instructions: "Send the exact plan amount via Telebirr 'Send Money'. Take a screenshot of the transaction confirmation slip and upload it below.",
    badge: "Instant Verification",
    color: "#00AEEF",
  },
  {
    id: "cbe",
    name: "Commercial Bank of Ethiopia (CBE)",
    accountNumber: "1000 4829 3847 1",
    accountName: "CVET Software Solutions",
    instructions: "Transfer using CBE Birr or CBE Mobile Banking. Enter your full name in the transaction remarks. Upload the receipt screenshot.",
    badge: "Most Used",
    color: "#800080",
  },
  {
    id: "awash",
    name: "Awash Bank",
    accountNumber: "0132 0987 6543 21",
    accountName: "CVET Software Solutions",
    instructions: "Transfer through Awash Mobile Banking or ATM. Save the confirmation receipt screenshot and attach below.",
    badge: "Available",
    color: "#0055A5",
  },
];

export const DEFAULT_WEBSITE_SETTINGS = {
  heroHeadline: "Build a CV That Gets Read.",
  heroSubheadline: "Engineered specifically for the Ethiopian job market. Create ATS-compliant CVs, test your ATS score in seconds, match job postings, and get noticed by top employers.",
  brandTagline: "Build Smarter. Get Hired Faster.",
  contactEmail: "support@cvet.et",
  contactPhone: "+251 911 234 567",
  officeAddress: "Bole Medhanialem, Edna Mall Area, Addis Ababa, Ethiopia",
  atsMaxFileSizeBytes: "1048576", // 1 MB
  aiModelDefault: "gpt-4o-mini",
};
