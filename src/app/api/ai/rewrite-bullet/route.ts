import { NextRequest, NextResponse } from "next/server";
import { rewriteBulletPoint } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local_ip";
    const rl = checkRateLimit(`ai_bullet_${ip}`, 20, 60000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Too many AI rewrite requests. Please try again in ${rl.retryAfterSec} seconds.` },
        { status: 429 }
      );
    }

    const { bulletPoint, jobTitle } = await req.json();

    if (!bulletPoint || !bulletPoint.trim()) {
      return NextResponse.json({ error: "Bullet point text is required" }, { status: 400 });
    }

    const result = await rewriteBulletPoint({
      bulletPoint: bulletPoint.trim(),
      jobTitle: jobTitle || "",
    });

    return NextResponse.json({
      success: true,
      rewrittenBullet: result.text,
      source: result.source,
      note: result.error,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to rewrite bullet point" }, { status: 500 });
  }
}
