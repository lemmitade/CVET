import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { memoryStore } from "@/lib/store";
import { DEFAULT_ATS_RULES } from "@/lib/default-data";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const maxFileSizeBytes = parseInt(memoryStore.settings?.atsMaxFileSizeBytes || "1048576");
  const allowedFormats = memoryStore.settings?.atsAllowedFormats || "PDF, DOCX";

  return NextResponse.json({
    rules: memoryStore.atsRules,
    settings: {
      maxFileSizeBytes,
      allowedFormats,
    },
  });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { rules, maxFileSizeBytes, allowedFormats, resetToDefaults } = await req.json();

    if (resetToDefaults) {
      memoryStore.atsRules = DEFAULT_ATS_RULES.map((r, i) => ({ id: `rule_${i + 1}`, ...r }));
      memoryStore.settings.atsMaxFileSizeBytes = "1048576";
      memoryStore.settings.atsAllowedFormats = "PDF, DOCX";

      return NextResponse.json({
        success: true,
        rules: memoryStore.atsRules,
        message: "ATS rules and thresholds restored to defaults.",
      });
    }

    if (Array.isArray(rules)) {
      // Validate weights total when applicable
      const totalWeight = rules
        .filter(r => r.enabled)
        .reduce((sum, r) => sum + (parseInt(r.weight) || 0), 0);

      memoryStore.atsRules = rules;

      if (maxFileSizeBytes) {
        memoryStore.settings.atsMaxFileSizeBytes = String(maxFileSizeBytes);
      }
      if (allowedFormats) {
        memoryStore.settings.atsAllowedFormats = allowedFormats;
      }

      memoryStore.auditLogs.unshift({
        id: `audit_${Date.now()}`,
        action: "ATS_SETTINGS_UPDATED",
        entity: "AtsRule",
        details: JSON.stringify({ activeRulesCount: rules.filter(r => r.enabled).length, totalWeight }),
        performedBy: auth.user?.email || "admin@cvet.et",
        createdAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        rules: memoryStore.atsRules,
        totalWeight,
        message: "ATS rules and weight configuration successfully saved.",
      });
    }

    return NextResponse.json({ error: "Invalid rules format" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
