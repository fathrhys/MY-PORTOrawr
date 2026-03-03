import { cookies } from "next/headers";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { CSRF_COOKIE } from "@/lib/csrf";

const COOKIE_NAME = "admin_auth";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSecret() {
  return process.env.ADMIN_COOKIE_SECRET || "";
}

function safeEqual(a: string, b: string) {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function signToken(exp: number) {
  const secret = getSecret();
  if (!secret) return "";
  const payload = `v1.${exp}`;
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function verifyToken(token: string | undefined) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [v, expStr, sig] = parts;
  if (v !== "v1") return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const secret = getSecret();
  if (!secret) return false;
  const payload = `${v}.${expStr}`;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  return safeEqual(sig, expected);
}

export async function isAdmin() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  return verifyToken(token);
}

export async function setAdminCookie() {
  const jar = await cookies();
  const exp = Date.now() + SESSION_MAX_AGE * 1000;
  const token = signToken(exp);
  if (!token) return;

  const secure = process.env.NODE_ENV === "production";

  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  const csrf = randomBytes(32).toString("base64url");
  jar.set(CSRF_COOKIE, csrf, {
    httpOnly: false,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "0", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  jar.set(CSRF_COOKIE, "0", {
    httpOnly: false,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}
