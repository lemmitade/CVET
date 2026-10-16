import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { memoryStore } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cv = memoryStore.cvs.find(c => c.id === id);

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    return NextResponse.json({ cv });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionUser = await getSessionUser(req);

    const index = memoryStore.cvs.findIndex(c => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    const cv = memoryStore.cvs[index];
    if (sessionUser && sessionUser.role !== "ADMIN" && cv.userId !== sessionUser.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    memoryStore.cvs.splice(index, 1);
    return NextResponse.json({ success: true, message: "CV deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
