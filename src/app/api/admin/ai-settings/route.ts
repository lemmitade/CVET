import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { memoryStore } from "@/lib/store";
import { DEFAULT_AI_PROMPTS } from "@/lib/default-data";
import { improveSummary, rewriteBulletPoint } from "@/lib/ai";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const selectedModel = memoryStore.settings?.aiModelDefault || "gpt-4o-mini";
  const hasApiKey = Boolean(process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes("placeholder"));

  return NextResponse.json({
    selectedModel,
    prompts: memoryStore.aiPrompts,
    hasApiKey,
    availableModels: ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo", "o3-mini"],
  });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { selectedModel, prompts, resetDefaults } = await req.json();

    if (resetDefaults) {
      memoryStore.aiPrompts = DEFAULT_AI_PROMPTS.map((p, i) => ({ id: `prompt_${i + 1}`, ...p }));
      memoryStore.settings.aiModelDefault = "gpt-4o-mini";
      return NextResponse.json({
        success: true,
        prompts: memoryStore.aiPrompts,
        selectedModel: "gpt-4o-mini",
        message: "AI prompts restored to factory defaults.",
      });
    }

    if (selectedModel) {
      memoryStore.settings.aiModelDefault = selectedModel;
    }

    if (Array.isArray(prompts)) {
      memoryStore.aiPrompts = prompts;
    }

    memoryStore.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      action: "AI_SETTINGS_UPDATED",
      entity: "AiPrompt",
      details: JSON.stringify({ model: selectedModel, promptsCount: memoryStore.aiPrompts.length }),
      performedBy: auth.user?.email || "admin@cvet.et",
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      selectedModel: memoryStore.settings.aiModelDefault,
      prompts: memoryStore.aiPrompts,
      message: "AI configuration saved successfully without requiring redeployment.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Endpoint to test an AI prompt live
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { promptType, testInput } = await req.json();

    if (promptType === "IMPROVE_SUMMARY") {
      const result = await improveSummary({
        currentSummary: testInput || "I am a web developer with 4 years experience creating websites and applications.",
        targetJobTitle: "Lead Frontend Engineer",
        yearsOfExperience: 4,
        skills: ["React", "TypeScript", "Tailwind CSS"],
      });
      return NextResponse.json({ success: true, result });
    } else {
      const result = await rewriteBulletPoint({
        bulletPoint: testInput || "Responsible for developing code and fixing bugs for customers.",
        jobTitle: "Software Engineer",
      });
      return NextResponse.json({ success: true, result });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
