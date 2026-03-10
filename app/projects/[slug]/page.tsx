import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects } from "@/lib/markdown";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/ui/Reveal";
import CoverAdaptive from "@/components/ui/CoverAdaptive";
import GrainBackground from "@/components/ui/GrainBackground";
import { CATEGORY_STYLES, LABEL, clampText } from "@/lib/projectUi";
import { getSiteUrl } from "@/lib/site";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const p = await params;
  let slug = p.slug;
  try {
    slug = decodeURIComponent(p.slug);
  } catch {
    slug = p.slug;
  }
  let project = null;
  try {
    project = getProjectBySlug(slug);
  } catch {
    return {
      title: "Projects",
      alternates: { canonical: "/projects" },
    };
  }

  if (!project) {
    return {
      title: "Project Not Found",
      alternates: { canonical: "/projects" },
    };
  }

  return {
    title: project.title,
    description: clampText(project.description, 160),
    alternates: {
      canonical: `/projects/${encodeURIComponent(project.slug)}`,
    },
    openGraph: {
      title: project.title,
      description: clampText(project.description, 160),
      url: new URL(`/projects/${encodeURIComponent(project.slug)}`, getSiteUrl()),
      type: "article",
      images: project.coverUrl
        ? [
          {
            url: project.coverUrl.startsWith("http")
              ? project.coverUrl
              : new URL(project.coverUrl, getSiteUrl()).toString(),
          },
        ]
        : [{ url: new URL("/og.svg", getSiteUrl()).toString() }],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await params;
  let slug = p.slug;
  try {
    slug = decodeURIComponent(p.slug);
  } catch {
    slug = p.slug;
  }

  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const allProjects = getAllProjects();
  const relatedProjects = allProjects
    .filter((p) => p.category === project.category && p.slug !== project.slug)
    .slice(0, 3);

  const st = CATEGORY_STYLES[project.category];
  const isCtf = project.category === "CTF";
  const writeupDownloadUrl = `/api/projects/${encodeURIComponent(project.slug)}/writeup`;

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-slate-900 dark:bg-[#0b0f17] dark:text-slate-200">
      <Navbar />
      <GrainBackground />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        <section className="pt-6">
          <Reveal>
            <div className="rounded-3xl bg-white/70 ring-1 ring-slate-200 p-7 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:bg-white/5 dark:ring-white/10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                    <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                    Project Detail
                  </span>
                  <span className="text-xs text-slate-500">Read - Tech stack - Links</span>
                </div>

                <Link
                  href={`/projects?cat=${project.category}`}
                  className="press rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/10"
                >
                  &larr; Back to {LABEL[project.category]}
                </Link>
              </div>

              <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:items-start">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${st.chip}`}>
                      {LABEL[project.category]}
                    </span>
                    {project.year ? (
                      <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-900 ring-1 ring-slate-200">
                        {project.year}
                      </span>
                    ) : null}
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                      /projects/{project.slug}
                    </span>
                  </div>

                  <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
                    {project.title}
                  </h1>

                  {isCtf ? (
                    <p className="mt-2 text-sm text-slate-600">
                      Write-up bisa dibaca langsung di halaman ini atau diunduh sebagai file PDF.
                    </p>
                  ) : null}

                  <div className="prose prose-slate dark:prose-invert mt-6 max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                        hr: () => <hr />,
                      }}
                    >
                      {project.content}
                    </ReactMarkdown>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.techStack
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200"
                        >
                          {t}
                        </span>
                      ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="press inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 !text-white"
                      >
                        GitHub &rarr;
                      </a>
                    ) : null}

                    {isCtf ? (
                      <a
                        href={writeupDownloadUrl}
                        download
                        className="press inline-flex items-center justify-center rounded-2xl bg-amber-200 px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-amber-300/60 hover:bg-amber-300"
                      >
                        Download Write-up (.pdf) &darr;
                      </a>
                    ) : project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="press inline-flex items-center justify-center rounded-2xl bg-amber-200 px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-amber-300/60 hover:bg-amber-300"
                      >
                        Demo &rarr;
                      </a>
                    ) : null}

                    <Link
                      href="/projects"
                      className="press inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/10"
                    >
                      All Projects
                    </Link>
                  </div>
                </div>

                <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:bg-white/5 dark:ring-white/10">
                  <div className="relative h-64">
                    <CoverAdaptive url={project.coverUrl} tintClass={st.coverTint} />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Category</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{LABEL[project.category]}</p>
                    <p className="mt-2 text-sm text-slate-600">
                      Kamu bisa browse kategori ini untuk lihat yang sejenis.
                    </p>
                    <div className="mt-4">
                      <Link href={`/projects?cat=${project.category}`} className={`u text-sm font-semibold ${st.link}`}>
                        Browse {LABEL[project.category]} &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {relatedProjects.length ? (
          <section className="mt-14">
            <Reveal>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-slate-700 uppercase">More</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                    Related in {LABEL[project.category]}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Beberapa project lain di kategori yang sama.
                  </p>
                </div>
                <Link href={`/projects?cat=${project.category}`} className={`u text-sm font-semibold ${st.link}`}>
                  See all &rarr;
                </Link>
              </div>
            </Reveal>

            <div className="mt-7 grid gap-4 lg:grid-cols-3">
              {relatedProjects.map((r, idx) => (
                <Reveal key={r.slug} delay={0.03 + idx * 0.05}>
                  <Link
                    href={`/projects/${encodeURIComponent(r.slug)}`}
                    className="group overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:ring-slate-300 dark:bg-white/5 dark:ring-white/10 dark:hover:ring-white/20"
                  >
                    <div className="relative h-40">
                      <CoverAdaptive url={r.coverUrl} tintClass={st.coverTint} />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:underline">
                        {r.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 break-anywhere text-sm text-slate-600">
                        {clampText(r.description, 240)}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
