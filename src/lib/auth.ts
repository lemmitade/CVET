import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "cvet_default_jwt_secret_change_in_production_2026";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser(req?: NextRequest): Promise<TokenPayload | null> {
  let token: string | undefined;

  // 1. Try from authorization header
  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  // 2. Try from cookies if header not present
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get("cvet_token")?.value;
    } catch {
      // Cookies not accessible in some edge runtimes
    }
  }

  if (!token) return null;
  return verifyToken(token);
}

export async function requireAdmin(req?: NextRequest): Promise<{ authorized: boolean; user: TokenPayload | null; error?: string }> {
  const user = await getSessionUser(req);
  if (!user) {
    return { authorized: false, user: null, error: "Authentication required" };
  }
  if (user.role !== "ADMIN") {
    return { authorized: false, user, error: "Administrator privileges required" };
  }
  return { authorized: true, user };
}
