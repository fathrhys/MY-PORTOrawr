export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/adminAuth";
import { requireCsrf } from "@/lib/csrf";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!(await requireCsrf(req))) {
    return new Response(JSON.stringify({ error: "CSRF invalid" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id } = await ctx.params;
  const projectId = Number(id);

  if (!Number.isFinite(projectId)) {
    return new Response(JSON.stringify({ error: "Bad Request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  await prisma.project.delete({ where: { id: projectId } });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
