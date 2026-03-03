export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/adminAuth";
import { requireCsrf } from "@/lib/csrf";
import { ProjectCategory } from "@prisma/client";

const ALLOWED = new Set(Object.values(ProjectCategory));

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
    return new Response(JSON.stringify({ error: "Bad id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await req.json().catch(() => ({}));
  const title = String(body?.title || "").trim();
  const slug = String(body?.slug || "").trim();
  const description = String(body?.description || "").trim();
  const techStack = String(body?.techStack || "").trim();

  const yearRaw = body?.year;
  const yearNum = typeof yearRaw === "number" ? yearRaw : Number(yearRaw);
  const year = Number.isFinite(yearNum) ? yearNum : null;
  const githubUrl = body?.githubUrl ? String(body.githubUrl) : null;
  const demoUrl = body?.demoUrl ? String(body.demoUrl) : null;

  const coverUrl = body?.coverUrl ? String(body.coverUrl).trim() : null;

  const raw = String(body?.category || ProjectCategory.WEB).toUpperCase();
  const category: ProjectCategory = ALLOWED.has(raw as ProjectCategory)
    ? (raw as ProjectCategory)
    : ProjectCategory.OTHER;

  if (!title || !slug || !description || !techStack) {
    return new Response(JSON.stringify({ error: "Field wajib belum lengkap" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await prisma.project.update({
      where: { id: projectId },
      data: {
        title,
        slug,
        description,
        year,
        techStack,
        githubUrl,
        demoUrl,
        category,
        coverUrl,
      },
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Slug harus unik (jangan sama)" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
