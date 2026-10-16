import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { memoryStore } from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser(req);
    if (!sessionUser) {
      return NextResponse.json({ user: null });
    }

    const user = memoryStore.users.find(u => u.id === sessionUser.userId);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ user: null, error: err.message }, { status: 500 });
  }
}
