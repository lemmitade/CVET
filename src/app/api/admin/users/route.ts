import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { memoryStore } from "@/lib/store";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const url = new URL(req.url);
  const search = url.searchParams.get("search")?.toLowerCase() || "";

  let users = memoryStore.users.map(u => {
    const userCvs = memoryStore.cvs.filter(c => c.userId === u.id);
    const userScans = memoryStore.atsScans.filter(s => s.userId === u.id);
    const userPayments = memoryStore.payments.filter(p => p.userId === u.id);

    return {
      id: u.id,
      email: u.email,
      name: u.name,
      phone: u.phone,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt,
      cvCount: userCvs.length,
      scanCount: userScans.length,
      paymentCount: userPayments.length,
      cvs: userCvs.map(c => ({ id: c.id, title: c.title, isPurchased: c.isPurchased, createdAt: c.createdAt })),
      payments: userPayments,
    };
  });

  if (search) {
    users = users.filter(u => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search));
  }

  return NextResponse.json({ users });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { userId, status, role } = await req.json();

    const userIndex = memoryStore.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (status) {
      memoryStore.users[userIndex].status = status;
    }
    if (role) {
      memoryStore.users[userIndex].role = role;
    }

    memoryStore.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      action: `USER_STATUS_${status || role}`,
      entity: "User",
      entityId: userId,
      details: JSON.stringify({ email: memoryStore.users[userIndex].email, status, role }),
      performedBy: auth.user?.email || "admin@cvet.et",
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      user: memoryStore.users[userIndex],
      message: "User status updated successfully.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
