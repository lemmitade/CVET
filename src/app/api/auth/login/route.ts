import { NextRequest, NextResponse } from "next/server";
import { memoryStore, persistStore, isDatabaseConnected } from "@/lib/store";
import { comparePassword, signToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local_ip";
    const rl = checkRateLimit(`login_${ip}`, 10, 60000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Please try again in ${rl.retryAfterSec} seconds.` },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = memoryStore.users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      try {
        if (await isDatabaseConnected()) {
          const dbUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
          if (dbUser) {
            user = {
              id: dbUser.id,
              email: dbUser.email,
              passwordHash: dbUser.passwordHash,
              name: dbUser.name,
              phone: dbUser.phone || undefined,
              role: dbUser.role as "USER" | "ADMIN",
              status: dbUser.status as "ACTIVE" | "SUSPENDED",
              createdAt: dbUser.createdAt,
            };
            memoryStore.users.push(user);
            persistStore();
          }
        }
      } catch (dbErr) {
        console.warn("DB login lookup error:", dbErr);
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.status === "SUSPENDED") {
      return NextResponse.json({ error: "Your account has been suspended. Please contact support@cvet.et." }, { status: 403 });
    }

    // Check password
    let isValid = false;
    // Check initial hardcoded admin password helper or bcrypt compare
    if (cleanEmail === "admin@cvet.et" && password === (process.env.INITIAL_ADMIN_PASSWORD || "AdminPassword2026!")) {
      isValid = true;
    } else {
      isValid = await comparePassword(password, user.passwordHash);
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });

    response.cookies.set("cvet_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Login failed" }, { status: 500 });
  }
}
