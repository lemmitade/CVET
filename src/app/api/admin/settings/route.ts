import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { memoryStore } from "@/lib/store";
import { DEFAULT_WEBSITE_SETTINGS } from "@/lib/default-data";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  return NextResponse.json({
    settings: {
      ...DEFAULT_WEBSITE_SETTINGS,
      ...memoryStore.settings,
    },
  });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { settings, resetDefaults } = await req.json();

    if (resetDefaults) {
      memoryStore.settings = { ...DEFAULT_WEBSITE_SETTINGS };
      return NextResponse.json({
        success: true,
        settings: memoryStore.settings,
        message: "Website settings restored to defaults.",
      });
    }

    if (settings && typeof settings === "object") {
      memoryStore.settings = {
        ...memoryStore.settings,
        ...settings,
      };

      memoryStore.auditLogs.unshift({
        id: `audit_${Date.now()}`,
        action: "WEBSITE_SETTINGS_UPDATED",
        entity: "AppSetting",
        details: JSON.stringify(settings),
        performedBy: auth.user?.email || "admin@cvet.et",
        createdAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        settings: memoryStore.settings,
        message: "Website settings saved successfully.",
      });
    }

    return NextResponse.json({ error: "Invalid settings object" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
