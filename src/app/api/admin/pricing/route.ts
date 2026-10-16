import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { memoryStore } from "@/lib/store";
import { DEFAULT_PAYMENT_ACCOUNTS, DEFAULT_PRICING_PLANS } from "@/lib/default-data";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  let paymentAccounts = DEFAULT_PAYMENT_ACCOUNTS;
  if (memoryStore.settings?.paymentAccounts) {
    try {
      paymentAccounts = JSON.parse(memoryStore.settings.paymentAccounts);
    } catch {}
  }

  return NextResponse.json({
    plans: memoryStore.pricingPlans,
    paymentAccounts,
  });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { plans, paymentAccounts, resetDefaults } = await req.json();

    if (resetDefaults) {
      memoryStore.pricingPlans = DEFAULT_PRICING_PLANS;
      memoryStore.settings.paymentAccounts = JSON.stringify(DEFAULT_PAYMENT_ACCOUNTS);
      return NextResponse.json({
        success: true,
        plans: memoryStore.pricingPlans,
        paymentAccounts: DEFAULT_PAYMENT_ACCOUNTS,
        message: "Pricing and payment account details reset to defaults.",
      });
    }

    if (Array.isArray(plans)) {
      memoryStore.pricingPlans = plans;
    }

    if (Array.isArray(paymentAccounts)) {
      memoryStore.settings.paymentAccounts = JSON.stringify(paymentAccounts);
    }

    memoryStore.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      action: "PRICING_UPDATED",
      entity: "PricingPlan",
      details: JSON.stringify({ plansCount: memoryStore.pricingPlans.length, paymentAccountsCount: paymentAccounts?.length }),
      performedBy: auth.user?.email || "admin@cvet.et",
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      plans: memoryStore.pricingPlans,
      paymentAccounts: JSON.parse(memoryStore.settings.paymentAccounts),
      message: "Pricing and Ethiopian recipient account details updated.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
