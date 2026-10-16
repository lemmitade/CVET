import { NextResponse } from "next/server";
import { memoryStore } from "@/lib/store";
import { DEFAULT_WEBSITE_SETTINGS } from "@/lib/default-data";

export async function GET() {
  return NextResponse.json({
    settings: {
      ...DEFAULT_WEBSITE_SETTINGS,
      ...memoryStore.settings,
    },
  });
}
