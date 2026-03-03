export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/adminAuth";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id } = await ctx.params;
  const projectId = Number(id);
  if (!Number.isFinite(projectId)) {
    return new Response(JSON.stringify({ error: "Bad id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const p = await prisma.project.findUnique({ where: { id: projectId } });
  if (!p) {
    return new Response(JSON.stringify({ error: "Project tidak ditemukan" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(p), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
