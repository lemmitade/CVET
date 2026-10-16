import { NextRequest, NextResponse } from "next/server";
import { suggestSkillsForJob } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
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
