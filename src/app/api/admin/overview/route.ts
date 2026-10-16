import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { memoryStore } from "@/lib/store";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const totalUsers = memoryStore.users.length;
  const totalCvs = memoryStore.cvs.length;
  const totalScans = memoryStore.atsScans.length;
  const totalPayments = memoryStore.payments.length;

  const approvedPayments = memoryStore.payments.filter(p => p.status === "APPROVED");
  const pendingPayments = memoryStore.payments.filter(p => p.status === "PENDING" || p.status === "VERIFYING");
  const totalRevenueEtb = approvedPayments.reduce((acc, curr) => acc + (curr.amountEtb || 0), 0);

  const recentPayments = memoryStore.payments.slice(0, 5);
  const recentScans = memoryStore.atsScans.slice(0, 5);
  const recentLogs = memoryStore.auditLogs.slice(0, 8);

  return NextResponse.json({
    metrics: {
      totalUsers,
      totalCvs,
      totalScans,
      totalPayments,
      pendingCount: pendingPayments.length,
      totalRevenueEtb,
    },
    recentPayments,
    recentScans,
    recentLogs,
  });
}
