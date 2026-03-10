import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

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
    const { getAllProjects } = await import("@/lib/markdown");
    const projects = getAllProjects();

    for (const p of projects) {
      items.push({
        url: new URL(`/projects/${encodeURIComponent(p.slug)}`, base).toString(),
        lastModified: p.updatedAt,
      });
    }
  } catch {
    // noop: fallback to static routes if markdown unavailable
  }

  return items;
}
