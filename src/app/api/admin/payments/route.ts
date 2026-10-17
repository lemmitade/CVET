import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { memoryStore, persistStore } from "@/lib/store";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  return NextResponse.json({ payments: memoryStore.payments });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { paymentId, status, decisionNotes } = await req.json();

    const paymentIndex = memoryStore.payments.findIndex(p => p.id === paymentId);
    if (paymentIndex === -1) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    const previousStatus = memoryStore.payments[paymentIndex].status;
    memoryStore.payments[paymentIndex].status = status;
    memoryStore.payments[paymentIndex].decisionNotes = decisionNotes || memoryStore.payments[paymentIndex].decisionNotes;
    memoryStore.payments[paymentIndex].verifiedBy = auth.user?.email || "admin";
    memoryStore.payments[paymentIndex].verifiedAt = new Date();
    memoryStore.payments[paymentIndex].updatedAt = new Date();

    // If approved, mark associated CV as purchased so user can download PDF
    const cvId = memoryStore.payments[paymentIndex].cvId;
    if (status === "APPROVED" && cvId) {
      const cvIndex = memoryStore.cvs.findIndex(c => c.id === cvId);
      if (cvIndex !== -1) {
        memoryStore.cvs[cvIndex].isPurchased = true;
      }
    }

    // Add Audit Log Entry
    memoryStore.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      userId: auth.user?.userId || null,
      action: `PAYMENT_${status}`,
      entity: "Payment",
      entityId: paymentId,
      details: JSON.stringify({
        fromStatus: previousStatus,
        toStatus: status,
        decisionNotes,
        transactionRef: memoryStore.payments[paymentIndex].transactionRef,
      }),
      performedBy: auth.user?.email || "admin@cvet.et",
      createdAt: new Date(),
    });

    persistStore();

    return NextResponse.json({
      success: true,
      payment: memoryStore.payments[paymentIndex],
      message: `Payment status updated to ${status}.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
