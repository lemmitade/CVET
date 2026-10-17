import { NextRequest, NextResponse } from "next/server";
import { memoryStore, persistStore, isDatabaseConnected } from "@/lib/store";
import { hashPassword, signToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local_ip";
    const rl = checkRateLimit(`register_${ip}`, 5, 60000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Too many registration attempts. Please try again in ${rl.retryAfterSec} seconds.` },
        { status: 429 }
      );
    }

    const { email, password, name, phone } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = memoryStore.users.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email: cleanEmail,
      name: name.trim(),
      phone: phone?.trim() || "",
      passwordHash,
      role: "USER" as const,
      status: "ACTIVE" as const,
      createdAt: new Date(),
    };

    memoryStore.users.push(newUser);
    persistStore();

    try {
      if (await isDatabaseConnected()) {
        await prisma.user.create({
          data: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            phone: newUser.phone || null,
            passwordHash: newUser.passwordHash,
            role: "USER",
            status: "ACTIVE",
          },
        });
      }
    } catch (dbErr) {
      console.warn("Could not write user to database, persisted to local store:", dbErr);
    }

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      token,
    });

    response.cookies.set("cvet_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Registration failed" }, { status: 500 });
  }
}
