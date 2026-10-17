import { NextRequest, NextResponse } from "next/server";
import { improveSummary } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local_ip";
    const rl = checkRateLimit(`ai_summary_${ip}`, 15, 60000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Too many AI optimization requests. Please try again in ${rl.retryAfterSec} seconds.` },
        { status: 429 }
      );
    }

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
