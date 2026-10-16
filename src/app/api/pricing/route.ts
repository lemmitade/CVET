import { NextResponse } from "next/server";
import { memoryStore } from "@/lib/store";
import { DEFAULT_PAYMENT_ACCOUNTS } from "@/lib/default-data";

export async function GET() {
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
