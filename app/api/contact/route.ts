import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/request";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const limiter = checkRateLimit(`contact:${ip}`, 5, 30 * 60 * 1000);
    if (!limiter.ok) {
      return new Response(JSON.stringify({ error: "Terlalu banyak pesan. Coba lagi nanti." }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const content = String(body?.content || "").trim();

    if (!name || !email || !content) {
      return new Response(JSON.stringify({ error: "Data tidak lengkap" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (content.length < 10) {
      return new Response(JSON.stringify({ error: "Pesan terlalu singkat" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await prisma.message.create({
      data: { name, email, content },
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
