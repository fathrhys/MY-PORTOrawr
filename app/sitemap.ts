import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const items: MetadataRoute.Sitemap = [
    { url: new URL("/", base).toString(), lastModified: now },
    { url: new URL("/about", base).toString(), lastModified: now },
    { url: new URL("/projects", base).toString(), lastModified: now },
    { url: new URL("/contact", base).toString(), lastModified: now },
  ];

  try {
    const { prisma } = await import("@/lib/prisma");
    const projects = await prisma.project.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });

    for (const p of projects) {
      items.push({
        url: new URL(`/projects/${encodeURIComponent(p.slug)}`, base).toString(),
        lastModified: p.updatedAt,
      });
    }
  } catch {
    // noop: fallback to static routes if DB unavailable
  }

  return items;
}
