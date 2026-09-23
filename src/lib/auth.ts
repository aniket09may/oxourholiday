import "server-only";

import { cookies } from "next/headers";
import { SESSION_COOKIE, UserRole, verifySessionToken } from "@/lib/session";

export async function getSession() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function authorize(allowedRoles: readonly UserRole[]) {
  const session = await getSession();

  if (!session || !allowedRoles.includes(session.role)) {
    return null;
  }

  return session;
}
