import { NextRequest, NextResponse } from "next/server";
import { getFileStream } from "@/lib/storage";
import { getSessionUser } from "@/lib/auth";
import { memoryStore } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionUser = await getSessionUser(req);

    const fileMeta = memoryStore.files.find(f => f.id === id);
    if (!fileMeta) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Security check: Private files accessible only by owner or admin
    if (fileMeta.userId && fileMeta.userId !== "guest") {
      if (!sessionUser || (sessionUser.role !== "ADMIN" && sessionUser.userId !== fileMeta.userId)) {
        return NextResponse.json({ error: "Unauthorized file access" }, { status: 403 });
      }
    }

    const fileData = await getFileStream(id);
    if (!fileData) {
      return NextResponse.json({ error: "File content not available" }, { status: 404 });
    }

    return new NextResponse(fileData.buffer as any, {
      status: 200,
      headers: {
        "Content-Type": fileData.mimeType,
        "Content-Disposition": `inline; filename="${fileData.name}"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
