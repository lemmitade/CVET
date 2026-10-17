import { NextRequest, NextResponse } from "next/server";
import { suggestSkillsForJob } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local_ip";
    const rl = checkRateLimit(`ai_skills_${ip}`, 20, 60000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Too many AI skill suggestion requests. Please try again in ${rl.retryAfterSec} seconds.` },
        { status: 429 }
      );
    }

    const { targetJobTitle } = await req.json();

    if (!targetJobTitle || !targetJobTitle.trim()) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }

    const suggestions = await suggestSkillsForJob(targetJobTitle.trim());

    return NextResponse.json({
      success: true,
      skills: suggestions,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to suggest skills" }, { status: 500 });
  }
}
