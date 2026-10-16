import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { memoryStore } from "@/lib/store";
import { deleteFileFromStorage } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const url = new URL(req.url);
  const search = url.searchParams.get("search")?.toLowerCase() || "";
  const folder = url.searchParams.get("folder") || "";

  let files = memoryStore.files;

  if (folder) {
    files = files.filter(f => f.folderType === folder);
  }
  if (search) {
    files = files.filter(f => f.name.toLowerCase().includes(search));
  }

  const totalBytes = memoryStore.files.reduce((sum, f) => sum + (f.size || 0), 0);

  return NextResponse.json({
    files,
    storageStats: {
      totalFiles: memoryStore.files.length,
      totalBytes,
      totalMb: (totalBytes / (1024 * 1024)).toFixed(2),
      googleDriveConnected: Boolean(process.env.GOOGLE_CLIENT_EMAIL && !process.env.GOOGLE_CLIENT_EMAIL.includes("service-account@project")),
    },
  });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { fileId } = await req.json();
    const success = await deleteFileFromStorage(fileId);

    if (!success) {
      return NextResponse.json({ error: "File not found or already deleted" }, { status: 404 });
    }

    memoryStore.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      action: "FILE_DELETED",
      entity: "FileRecord",
      entityId: fileId,
      performedBy: auth.user?.email || "admin@cvet.et",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, message: "File permanently deleted from storage." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
