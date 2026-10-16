import { NextRequest, NextResponse } from "next/server";
import { improveSummary } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentSummary, targetJobTitle, yearsOfExperience, skills } = body;

    const result = await improveSummary({
      currentSummary: currentSummary || "",
      targetJobTitle: targetJobTitle || "",
      yearsOfExperience: Number(yearsOfExperience) || 0,
      skills: Array.isArray(skills) ? skills : [],
    });

    return NextResponse.json({
      success: true,
      improvedSummary: result.text,
      source: result.source,
      note: result.error,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to optimize summary" }, { status: 500 });
  }
}
