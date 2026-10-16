import { NextRequest, NextResponse } from "next/server";
import { memoryStore } from "@/lib/store";
import { getSessionUser } from "@/lib/auth";
import { uploadFileToStorage } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const cvId = (formData.get("cvId") as string) || "";
    const planName = (formData.get("planName") as string) || "Standard CV Pass";
    const amountEtb = parseFloat((formData.get("amountEtb") as string) || "250");
    const paymentMethod = (formData.get("paymentMethod") as string) || "Telebirr";
    const transactionRef = (formData.get("transactionRef") as string || "").trim();
    const screenshot = formData.get("screenshot") as File | null;

    if (!transactionRef) {
      return NextResponse.json(
        { error: "Transaction reference / slip number is required." },
        { status: 400 }
      );
    }

    // 1. Prevent duplicate transaction references
    const normalizedRef = transactionRef.toUpperCase().replace(/\s+/g, "");
    const existingPayment = memoryStore.payments.find(
      p => p.transactionRef.toUpperCase().replace(/\s+/g, "") === normalizedRef
    );

    if (existingPayment) {
      return NextResponse.json(
        {
          error: `Transaction reference '${transactionRef}' has already been submitted (Status: ${existingPayment.status}). Duplicate transaction claims are rejected for security.`,
        },
        { status: 409 }
      );
    }

    const sessionUser = await getSessionUser(req);
    let screenshotUrl: string | null = null;
    let screenshotFileId: string | null = null;

    if (screenshot) {
      // Validate screenshot size (max 5 MB)
      if (screenshot.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Payment screenshot exceeds 5 MB limit." },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await screenshot.arrayBuffer());
      const fileRecord = await uploadFileToStorage({
        buffer,
        fileName: screenshot.name,
        mimeType: screenshot.type || "image/png",
        folderType: "PAYMENT_SCREENSHOTS",
        userId: sessionUser?.userId || null,
      });

      screenshotFileId = fileRecord.id;
      // Data URL or authenticated preview path
      screenshotUrl = `/api/files/${fileRecord.id}`;
    }

    const newPayment = {
      id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: sessionUser?.userId || "guest",
      cvId: cvId || null,
      planName,
      amountEtb: isNaN(amountEtb) ? 250 : amountEtb,
      paymentMethod,
      transactionRef,
      screenshotUrl,
      screenshotFileId,
      status: "PENDING" as const, // Always marked Pending until actually verified by Admin
      decisionNotes: "Payment submitted by customer. Awaiting admin review.",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryStore.payments.unshift(newPayment);

    // Record in Audit Log
    memoryStore.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      userId: sessionUser?.userId || null,
      action: "PAYMENT_SUBMITTED",
      entity: "Payment",
      entityId: newPayment.id,
      details: JSON.stringify({
        amountEtb: newPayment.amountEtb,
        method: paymentMethod,
        ref: transactionRef,
        cvId,
      }),
      performedBy: sessionUser?.email || "Guest Customer",
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      payment: newPayment,
      message: "Payment receipt submitted successfully! Your payment is currently PENDING verification. Our team will verify the transaction reference with bank records promptly.",
    });
  } catch (err: any) {
    console.error("Payment submission error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to submit payment." },
      { status: 500 }
    );
  }
}
