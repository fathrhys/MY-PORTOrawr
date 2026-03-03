import { setAdminCookie } from "@/lib/adminAuth";
import { verifyPassword } from "@/lib/password";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/request";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limiter = checkRateLimit(`admin-login:${ip}`, 5, 10 * 60 * 1000);
  if (!limiter.ok) {
    return new Response(JSON.stringify({ error: "Terlalu banyak percobaan. Coba lagi nanti." }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await req.json().catch(() => ({}));
  const password = String(body?.password || "").trim();

  if (!process.env.ADMIN_PASSWORD_HASH) {
    return new Response(JSON.stringify({ error: "ADMIN_PASSWORD_HASH belum diset" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!process.env.ADMIN_COOKIE_SECRET) {
    return new Response(JSON.stringify({ error: "ADMIN_COOKIE_SECRET belum diset" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const storedHash = process.env.ADMIN_PASSWORD_HASH_B64
    ? Buffer.from(process.env.ADMIN_PASSWORD_HASH_B64.trim(), "base64url").toString("utf8")
    : process.env.ADMIN_PASSWORD_HASH.trim().replace(/\$\$/g, "$");
  const ok = await verifyPassword(password, storedHash);
  if (!ok) {
    return new Response(JSON.stringify({ error: "Password salah" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await setAdminCookie();

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
