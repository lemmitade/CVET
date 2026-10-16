import { NextRequest, NextResponse } from "next/server";
import { rewriteBulletPoint } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
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
