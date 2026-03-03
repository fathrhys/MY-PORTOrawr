import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProjectCategory } from "@prisma/client";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/ui/Reveal";
import CoverAdaptive from "@/components/ui/CoverAdaptive";
import SectionHead from "@/components/ui/SectionHead";
import GrainBackground from "@/components/ui/GrainBackground";
import { CATEGORY_STYLES, CATS, LABEL, clampText } from "@/lib/projectUi";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Projects",
  description: "Kumpulan project dan writeup yang pernah dikerjakan.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects - Kamal",
    description: "Kumpulan project dan writeup yang pernah dikerjakan.",
    url: "/projects",
    images: [{ url: "/og.svg" }],
  },
};

function FilterPill({ active, href, label }: { active: boolean; href: string; label: string }) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition ring-1",
        active
          ? "bg-slate-900 text-white ring-slate-900 !text-white"
          : "bg-white text-slate-900 ring-slate-200 hover:bg-slate-50 !text-black",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams?: Promise<{ cat?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const raw = String(sp.cat || "").toUpperCase();
  const isValid = (Object.values(ProjectCategory) as string[]).includes(raw);
  const activeCat: ProjectCategory | "ALL" = isValid ? (raw as ProjectCategory) : "ALL";

  const where = activeCat === "ALL" ? undefined : { category: activeCat };
  const [projects, heroPick] = await Promise.all([
    prisma.project.findMany({ where, orderBy: { createdAt: "desc" } }),
    prisma.project.findFirst({ where, orderBy: { createdAt: "desc" } }),
  ]);

  const pick = heroPick || projects[0] || null;
  const pickCat = pick?.category ?? "OTHER";
  const pickStyle = CATEGORY_STYLES[pickCat];

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-slate-900">
      <Navbar />
      <GrainBackground />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        <section className="pt-6">
          <Reveal>
            <div className="rounded-3xl bg-white/70 ring-1 ring-slate-200 p-7 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                    Projects Index
                  </span>
                  <span className="text-xs text-slate-500">Filter by category • Browse all work</span>
                </div>

                <Link
                  href="/"
                  className="press rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  &larr; Back to Home
                </Link>
              </div>

              <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
                <div>
                  <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Projects</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                    Kumpulan project dan writeup yang pernah aku kerjakan. Pilih kategori biar rapi, atau lihat semuanya.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <FilterPill active={activeCat === "ALL"} href="/projects" label="All" />
                    {CATS.map((c) => (
                      <FilterPill
                        key={c.key}
                        active={activeCat === c.key}
                        href={`/projects?cat=${c.key}`}
                        label={LABEL[c.key]}
                      />
                    ))}
                  </div>
                </div>

                <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
                  <div className="relative h-40">
                  <CoverAdaptive url={pick?.coverUrl} tintClass={pickStyle.coverTint} />
                    <div className="absolute left-5 top-5 flex items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${pickStyle.chip}`}>
                        {LABEL[pickCat]}
                      </span>
                      <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-900 ring-1 ring-slate-200">
                        {pick?.year ?? ""}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-[11px] font-semibold tracking-wider text-slate-700 uppercase">
                      Latest highlight
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-lg font-semibold tracking-tight text-slate-900">
                      {pick?.title ?? "Belum ada project"}
                    </h3>

                    <p className="mt-2 break-anywhere text-sm text-slate-600">
                      {pick ? clampText(pick.description, 140) : "Tambah project dari /admin/projects."}
                    </p>

                    {pick ? (
                      <div className="mt-4">
                        <Link
                          href={`/projects/${encodeURIComponent(pick.slug)}`}
                          className="press inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 !text-white"
                        >
                          Open highlight &rarr;
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="mt-14">
          <Reveal>
            <SectionHead
              kicker="Library"
              title={activeCat === "ALL" ? "All Projects" : `Category: ${LABEL[activeCat]}`}
              desc={
                activeCat === "ALL"
                  ? "Semua project disusun dari yang terbaru."
                  : `Semua project di kategori ${LABEL[activeCat]}.`
              }
              right={<span className="text-sm font-semibold text-slate-700">{projects.length} items</span>}
            />
          </Reveal>

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.length === 0 ? (
              <p className="text-slate-600">
                Belum ada project di kategori ini. Tambah dari <span className="font-semibold">/admin/projects</span>.
              </p>
            ) : (
              projects.map((p, idx) => {
                const st = CATEGORY_STYLES[p.category];
                const isWide = idx === 0;
                const isCtf = p.category === "CTF";
                const writeupDownloadUrl = `/api/projects/${encodeURIComponent(p.slug)}/writeup`;
                return (
                  <Reveal key={p.id} delay={0.03 + idx * 0.03}>
                    <article
                      className={[
                        "group relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 transition",
                        "hover:-translate-y-1 hover:ring-slate-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]",
                        st.cardHover ?? "",
                        isWide ? "md:col-span-2" : "",
                      ].join(" ")}
                    >
                      <Link
                        href={`/projects/${encodeURIComponent(p.slug)}`}
                        className={[
                          "relative block overflow-hidden",
                          "rounded-t-3xl",
                          isWide ? "h-52 sm:h-60 md:h-72" : "h-44 sm:h-48",
                        ].join(" ")}
                      >
                        <CoverAdaptive url={p.coverUrl} tintClass={st.coverTint} />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </Link>

                      <div className="p-5 sm:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                            <span className={`h-2 w-2 rounded-full ${st.dot}`} />
                            {LABEL[p.category]}
                          </span>
                          {p.year ? (
                            <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                              {p.year}
                            </span>
                          ) : null}
                        </div>

                        <Link href={`/projects/${encodeURIComponent(p.slug)}`} className="block">
                          <h3 className="mt-3 text-lg sm:text-xl font-semibold tracking-tight text-slate-900 hover:underline">
                            {p.title}
                          </h3>
                        </Link>

                        <p className="mt-2 line-clamp-3 break-anywhere text-sm leading-relaxed text-slate-600">
                          {clampText(p.description, 220)}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {p.techStack
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean)
                            .slice(0, 8)
                            .map((t) => (
                              <span
                                key={t}
                                className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200"
                              >
                                {t}
                              </span>
                            ))}
                        </div>

                        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
                          {p.githubUrl ? (
                            <a
                              href={p.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="u font-semibold text-slate-700 hover:text-slate-900"
                            >
                              GitHub
                            </a>
                          ) : null}
                          {isCtf ? (
                            <>
                              <Link
                                href={`/projects/${encodeURIComponent(p.slug)}`}
                                className={`u font-semibold ${st.link}`}
                              >
                                Lihat Write-up
                              </Link>
                              <a
                                href={writeupDownloadUrl}
                                download
                                className="u font-semibold text-slate-700 hover:text-slate-900"
                              >
                                Download .pdf
                              </a>
                            </>
                          ) : p.demoUrl ? (
                            <a
                              href={p.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="u font-semibold text-slate-700 hover:text-slate-900"
                            >
                              Demo
                            </a>
                          ) : null}

                          {!isCtf ? (
                            <Link
                              href={`/projects/${encodeURIComponent(p.slug)}`}
                              className={`ml-auto inline-flex items-center gap-2 text-sm font-semibold ${st.link}`}
                            >
                              Open detail &rarr;
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })
            )}
          </div>
        </section>

        <section className="mt-16">
          <Reveal>
            <div className="rounded-3xl bg-white p-8 ring-1 ring-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Next</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                    Mau lihat writeups atau kontak?
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Kalau mau kolaborasi atau tanya-tanya project, langsung aja.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="press rounded-2xl bg-amber-200 px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-amber-300/60 hover:bg-amber-300"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/"
                    className="press rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 !text-white"
                  >
                    Back Home
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </main>
  );
}
