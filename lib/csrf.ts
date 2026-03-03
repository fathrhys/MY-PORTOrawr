import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";

export const CSRF_COOKIE = "csrf_token";

function safeEqual(a: string, b: string) {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function getCsrfCookie() {
  const jar = await cookies();
  return jar.get(CSRF_COOKIE)?.value || "";
}

export async function validateCsrfToken(token: string | null | undefined) {
  const cookie = await getCsrfCookie();
  return safeEqual(token || "", cookie);
}

export async function requireCsrf(req: Request, bodyToken?: string | null) {
  const headerToken = req.headers.get("x-csrf-token");
  const token = headerToken || bodyToken || "";
  return validateCsrfToken(token);
}
