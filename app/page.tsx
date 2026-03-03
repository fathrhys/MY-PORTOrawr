import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/ui/Reveal";
import RolesClient from "@/components/ui/RolesClient";
import CoverAdaptive from "@/components/ui/CoverAdaptive";
import SectionHead from "@/components/ui/SectionHead";
import GrainBackground from "@/components/ui/GrainBackground";
import { CATEGORY_STYLES, LABEL, clampText } from "@/lib/projectUi";

export const metadata: Metadata = {
  title: "Home",
  description: "Portfolio Kamal: project, writeups, dan build log.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kamal Portfolio",
    description: "Portfolio Kamal: project, writeups, dan build log.",
    url: "/",
    images: [{ url: "/og.svg" }],
  },
};

function StatPill({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl bg-white/80 ring-1 ring-slate-200 px-4 py-3 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <p className="text-[11px] font-medium tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
      <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

export default async function HomePage() {
  const [latest, featuredPick, totalProjects, totalMessages] = await Promise.all([
    prisma.project.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.project.findFirst({
      where: { category: { in: ["WEB", "CTF"] } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.count(),
    prisma.message.count(),
  ]);

  const featured = featuredPick || latest[0] || null;
  const featCat = featured?.category ?? "OTHER";
  const featStyle = CATEGORY_STYLES[featCat];

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-slate-900">
      <Navbar />
      <GrainBackground />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-20 pt-6 sm:pt-10">
        <section className="pt-6">
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
            <Reveal>
              <div className="rounded-3xl bg-white/70 ring-1 ring-slate-200 p-5 sm:p-7 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                    Kamal&apos;s Portfolio
                  </span>
                  <span className="text-xs text-slate-500">
                    Projects • Writeups • Build log
                  </span>
                </div>

                <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
                  Halo, aku <span className="text-slate-950">Kamal</span>.
                </h1>

                <div className="mt-4">
                  <RolesClient />
                </div>

                <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
                  Pelajar SMK yang suka bikin project (web/app) dan ngulik
                  cybersecurity. Ini tempat aku nyimpen karya terbaik + writeup.
                </p>

                <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
                  <Link
                    href="/projects"
                    className="press w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)] hover:bg-slate-800 !text-white"
                  >
                    Explore Projects &rarr;
                  </Link>

                  <a
                    href="/cv.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="press w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
                  >
                    Download CV
                  </a>

                  <Link
                    href="/contact"
                    className="press w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-amber-200 px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-amber-300/60 hover:bg-amber-300"
                  >
                    Contact
                  </Link>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <StatPill label="PROJECTS" value={`${totalProjects}+`} hint="Total di database" />
                  <StatPill label="INBOX" value={`${totalMessages}`} hint="Message masuk" />
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    available for collab
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sky-400" />
                    building & learning
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-violet-400" />
                    CTF writeups
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.10)]">
                <div className="relative h-44 sm:h-52">
                  <CoverAdaptive url={featured?.coverUrl} tintClass={featStyle.coverTint} />
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${featStyle.chip}`}>
                      {LABEL[featCat]}
                    </span>
                    <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-900 ring-1 ring-slate-200">
                      {featured?.year ?? ""}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  {featured ? (
                    <>
                      <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                        Highlight
                      </p>
                      <h3 className="mt-1 text-lg sm:text-xl font-semibold tracking-tight text-slate-900 line-clamp-2">
                        {featured.title}
                      </h3>

                      <p className="break-anywhere text-sm leading-relaxed text-slate-600">
                        {clampText(featured.description, 220)}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {featured.techStack
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

                      <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                          href={`/projects?cat=${featured.category}`}
                          className="press rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 !text-white"
                        >
                          See category
                        </Link>

                        {featured.githubUrl ? (
                          <a
                            href={featured.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="press rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
                          >
                            GitHub
                          </a>
                        ) : null}

                        {featured.demoUrl ? (
                          <a
                            href={featured.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="press rounded-2xl bg-amber-200 px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-amber-300/60 hover:bg-amber-300"
                          >
                            Demo
                          </a>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-slate-600">
                      Tambah project dari <span className="font-semibold">/admin/projects</span>.
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mt-14">
          <Reveal>
            <SectionHead
              kicker="New stuff"
              title="Latest Projects"
              desc="Beberapa project terbaru yang aku tambahin."
              right={
                <Link href="/projects" className="u text-sm font-semibold text-slate-700 hover:text-slate-900">
                  Browse all &rarr;
                </Link>
              }
            />
          </Reveal>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latest.length === 0 ? (
              <p className="text-slate-600">
                Belum ada project. Tambah dari <span className="font-semibold">/admin/projects</span>.
              </p>
            ) : (
              latest.map((p, idx) => {
                const st = CATEGORY_STYLES[p.category];
                return (
                  <Reveal key={p.id} delay={0.05 + idx * 0.05}>
                    <div
                      className={[
                        "overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 transition",
                        "hover:-translate-y-1 hover:ring-slate-300",
                        st.cardHover ?? "",
                      ].join(" ")}
                    >
                      <Link
                        href={`/projects/${encodeURIComponent(p.slug)}`}
                        className="block relative h-36 sm:h-40"
                      >
                        <CoverAdaptive url={p.coverUrl} tintClass={st.coverTint} />
                        <div className="absolute left-4 top-4 flex items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${st.chip}`}>
                            {LABEL[p.category]}
                          </span>
                          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-900 ring-1 ring-slate-200">
                            {p.year ?? ""}
                          </span>
                        </div>
                      </Link>

                      <div className="p-5 sm:p-6">
                        <Link href={`/projects/${encodeURIComponent(p.slug)}`} className="block">
                          <h3 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 line-clamp-2">
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
                            .slice(0, 6)
                            .map((t) => (
                              <span
                                key={t}
                                className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200"
                              >
                                {t}
                              </span>
                            ))}
                        </div>

                        <div className="mt-5 flex items-center gap-4 text-sm">
                          <Link
                            href={`/projects?cat=${p.category}`}
                            className={`inline-flex items-center gap-2 font-semibold ${st.link}`}
                          >
                            <span className={`h-2 w-2 rounded-full ${st.dot}`} />
                            {LABEL[p.category]}
                          </Link>

                          {p.githubUrl ? (
                            <a
                              href={p.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="u text-slate-700 hover:text-slate-900"
                            >
                              GitHub
                            </a>
                          ) : null}

                          {p.demoUrl ? (
                            <a
                              href={p.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="u text-slate-700 hover:text-slate-900"
                            >
                              Demo
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })
            )}
          </div>
        </section>

        <section className="mt-16">
          <Reveal>
            <SectionHead
              kicker="Progress"
              title="Journey"
              desc="Ringkas, tapi keliatan kamu berkembang."
            />
          </Reveal>

          <div className="mt-7 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
            <div className="flex gap-4 min-w-full sm:min-w-[900px] snap-x snap-mandatory">
              {[
                {
                  year: "2024",
                  title: "Mulai Web",
                  desc: "HTML/CSS/JS -> mini project.",
                  c: "bg-sky-100 ring-sky-200",
                },
                {
                  year: "2025",
                  title: "Ekskul App",
                  desc: "Fullstack + deploy.",
                  c: "bg-amber-100 ring-amber-200",
                },
                {
                  year: "2026",
                  title: "Fokus CTF",
                  desc: "Forensics/crypto/web writeup.",
                  c: "bg-violet-100 ring-violet-200",
                },
                {
                  year: "Next",
                  title: "Target",
                  desc: "Magang/lomba + portfolio rapi.",
                  c: "bg-emerald-100 ring-emerald-200",
                },
              ].map((s) => (
                <div
                  key={s.year}
                  className="w-[260px] sm:w-[220px] shrink-0 snap-start rounded-3xl bg-white p-5 ring-1 ring-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                >
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-slate-900 ring-1 ${s.c}`}
                  >
                    <span className="h-2 w-2 rounded-full bg-slate-900/70" />
                    {s.year}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16">
          <Reveal>
            <SectionHead
              kicker="Now"
              title="What I'm learning"
              desc="Biar keliatan kamu aktif upgrade."
            />
          </Reveal>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            <Reveal delay={0.05}>
              <div className="rounded-3xl bg-white p-7 ring-1 ring-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Sekarang lagi belajar</h3>
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                    active
                  </span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-800">
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-sky-500" />
                    Forensics dasar (file carving, log analysis)
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-violet-500" />
                    Web Security (auth, injection, hardening)
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
                    Next.js (App Router) + Prisma
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-[0_18px_60px_rgba(15,23,42,0.22)]">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Goal 2026</h3>
                  <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold text-slate-900">
                    target
                  </span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-white">
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-300" />
                    Publish 30 writeups (CTF / lab)
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-300" />
                    Bikin 5 project web yang deploy & rapi
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-300" />
                    Ikut lomba / magang dan upgrade skill
                  </li>
                </ul>
                <div className="mt-6">
                  <Link
                    href="/projects"
                    className="press inline-flex items-center justify-center rounded-2xl bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-amber-200"
                  >
                    See my work &rarr;
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mt-16">
          <Reveal>
            <div className="rounded-3xl bg-white p-8 ring-1 ring-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Collaboration
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                    Let&apos;s build something useful.
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Kalau kamu pengen kolaborasi atau ngobrol soal project/CTF, langsung aja.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 lg:justify-end">
                  <Link
                    href="/contact"
                    className="press rounded-2xl bg-amber-200 px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-amber-300/60 hover:bg-amber-300"
                  >
                    Contact me
                  </Link>
                  <Link
                    href="/projects"
                    className="press rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 !text-white"
                  >
                    Browse Projects
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
