import OpenAI from "openai";
import { memoryStore } from "@/lib/store";

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey.includes("sk-placeholder")) {
    return null;
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

export function getActiveAiModel(): string {
  return memoryStore.settings?.aiModelDefault || process.env.OPENAI_MODEL || "gpt-4o-mini";
}

export async function improveSummary(params: {
  currentSummary: string;
  targetJobTitle: string;
  yearsOfExperience: number;
  skills: string[];
}): Promise<{ text: string; source: "openai" | "fallback"; error?: string }> {
  const openai = getOpenAIClient();
  const model = getActiveAiModel();

  if (!openai) {
    // Transparently inform that OpenAI key is not configured and return rule-enhanced version
    return {
      text: generateEnhancedSummaryRuleBased(params),
      source: "fallback",
      error: "OpenAI API key is not configured in settings. A rule-based enhancement has been applied. Set OPENAI_API_KEY to unlock advanced generative rewriting.",
    };
  }

  try {
    const promptTemplate = memoryStore.aiPrompts?.find(p => p.name === "IMPROVE_SUMMARY")?.promptText ||
      `Rewrite this professional summary for a {targetJobTitle} with {yearsOfExperience} years of experience and skills: {skills}. Original: {currentSummary}`;

    const populatedPrompt = promptTemplate
      .replace("{targetJobTitle}", params.targetJobTitle || "Professional")
      .replace("{yearsOfExperience}", String(params.yearsOfExperience || 3))
      .replace("{skills}", params.skills.join(", ") || "Industry skills")
      .replace("{currentSummary}", params.currentSummary || "");

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "You are an expert ATS resume writer. Optimize the summary. Never invent fake credentials or employers. Output only the improved summary text.",
        },
        { role: "user", content: populatedPrompt },
      ],
      temperature: 0.6,
      max_tokens: 350,
    });

    const result = completion.choices[0]?.message?.content?.trim();
    if (!result) {
      throw new Error("Empty response from AI model");
    }

    return { text: result, source: "openai" };
  } catch (err: any) {
    return {
      text: generateEnhancedSummaryRuleBased(params),
      source: "fallback",
      error: `OpenAI API call failed (${err.message || "Network/Auth Error"}). Applied rule-based enhancement.`,
    };
  }
}

export async function rewriteBulletPoint(params: {
  bulletPoint: string;
  jobTitle?: string;
}): Promise<{ text: string; source: "openai" | "fallback"; error?: string }> {
  const openai = getOpenAIClient();
  const model = getActiveAiModel();

  if (!openai) {
    return {
      text: rewriteBulletRuleBased(params.bulletPoint),
      source: "fallback",
      error: "OpenAI API key not configured. Applied action-verb optimization.",
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "You are an ATS resume optimization assistant. Transform work experience bullet points to begin with dynamic action verbs and clear business impact. Do not invent false metrics.",
        },
        {
          role: "user",
          content: `Job Title: ${params.jobTitle || "Professional"}\nOriginal Bullet: "${params.bulletPoint}"\nRewrite as a single concise, punchy ATS-compliant bullet point. Return ONLY the rewritten text.`,
        },
      ],
      temperature: 0.5,
      max_tokens: 150,
    });

    const result = completion.choices[0]?.message?.content?.trim();
    return { text: result || params.bulletPoint, source: "openai" };
  } catch (err: any) {
    return {
      text: rewriteBulletRuleBased(params.bulletPoint),
      source: "fallback",
      error: `OpenAI API error: ${err.message}. Applied action-verb rule fallback.`,
    };
  }
}

export async function suggestSkillsForJob(targetJobTitle: string): Promise<string[]> {
  const commonMap: Record<string, string[]> = {
    software: ["TypeScript", "React", "Node.js", "Next.js", "PostgreSQL", "Git", "REST APIs", "Docker", "Problem Solving"],
    developer: ["JavaScript", "Python", "React", "Node.js", "SQL", "Git", "Agile", "API Integration", "Unit Testing"],
    accountant: ["Financial Reporting", "IFRS Compliance", "Tax Preparation", "QuickBooks", "Excel Modeling", "Auditing", "Cost Accounting"],
    bank: ["Credit Analysis", "Risk Assessment", "Customer Due Diligence (KYC)", "Financial Analysis", "Branch Operations", "AML Compliance"],
    marketing: ["Digital Marketing", "SEO / SEM", "Content Strategy", "Social Media Management", "Google Analytics", "Campaign Optimization"],
    project: ["Agile & Scrum", "Project Planning", "Stakeholder Management", "Budgeting", "Risk Mitigation", "Jira", "Cross-functional Leadership"],
  };

  const lower = targetJobTitle.toLowerCase();
  for (const [key, skills] of Object.entries(commonMap)) {
    if (lower.includes(key)) {
      return skills;
    }
  }

  return ["Project Planning", "Communication", "Data Analysis", "Critical Thinking", "Team Collaboration", "Problem Solving", "Time Management"];
}

// Rule-based fallbacks that preserve candidate truth while improving syntax
function generateEnhancedSummaryRuleBased(params: {
  currentSummary: string;
  targetJobTitle: string;
  yearsOfExperience: number;
  skills: string[];
}): string {
  if (params.currentSummary && params.currentSummary.length > 30) {
    return params.currentSummary.trim();
  }

  const skillsStr = params.skills.slice(0, 4).join(", ") || "core technical and operational competencies";
  const title = params.targetJobTitle || "Experienced Professional";
  const years = params.yearsOfExperience > 0 ? `${params.yearsOfExperience}+ years of demonstrable experience` : "proven hands-on expertise";

  return `Results-driven ${title} with ${years} in delivering measurable organizational impact. Adept at leveraging ${skillsStr} to optimize workflows, solve complex business challenges, and drive project excellence. Committed to continuous improvement and cross-functional team success.`;
}

function rewriteBulletRuleBased(bullet: string): string {
  const trimmed = bullet.trim().replace(/^[-*•]\s*/, "");
  if (!trimmed) return "";

  const actionStarters = ["Spearheaded", "Architected", "Engineered", "Optimized", "Executed", "Directed"];
  const firstWord = trimmed.split(/\s+/)[0].toLowerCase();

  const weakStarters = ["responsible", "worked", "helped", "assisted", "did", "was", "handled"];
  if (weakStarters.includes(firstWord) || trimmed.toLowerCase().startsWith("responsible for")) {
    const cleanRemainder = trimmed.replace(/^(responsible for|worked on|helped to|assisted with|handled)\s+/i, "");
    const chosenVerb = actionStarters[Math.floor(Math.random() * actionStarters.length)];
    return `${chosenVerb} the execution of ${cleanRemainder}, ensuring high quality and measurable delivery.`;
  }

  return trimmed;
}
