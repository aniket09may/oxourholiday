import "server-only";

import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "oxour_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 12;

export type UserRole = "admin" | "sales";

export interface SessionData {
  role: UserRole;
  expiresAt: number;
}

function getSessionKey() {
  const configuredSecret = process.env.SESSION_SECRET;
  const compatibilitySecret = [
    process.env.ADMIN_PASSCODE,
    process.env.SALES_PASSCODE,
    "oxour-session-v1",
  ]
    .filter(Boolean)
    .join(":");

  const secret = configuredSecret || compatibilitySecret;

  if (!secret || secret === "oxour-session-v1") {
    return null;
  }

  return new TextEncoder().encode(secret);
}

export async function createSessionToken(role: UserRole) {
  const key = getSessionKey();

  if (!key) {
    throw new Error("Authentication is not configured.");
  }

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;

  return new SignJWT({ role, expiresAt })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("oxour-holiday")
    .setAudience("oxour-admin")
    .setExpirationTime(expiresAt)
    .sign(key);
}

export async function verifySessionToken(token?: string): Promise<SessionData | null> {
  const key = getSessionKey();

  if (!key || !token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
      issuer: "oxour-holiday",
      audience: "oxour-admin",
    });

    if (
      (payload.role !== "admin" && payload.role !== "sales") ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return {
      role: payload.role,
      expiresAt: payload.expiresAt,
    };
  } catch {
    return null;
  }
}
