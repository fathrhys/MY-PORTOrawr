import Link from "next/link";
import type { Metadata } from "next";
import { getAllProjects } from "@/lib/markdown";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/ui/Reveal";
import RolesClient from "@/components/ui/RolesClient";
import CoverAdaptive from "@/components/ui/CoverAdaptive";
import SectionHead from "@/components/ui/SectionHead";
import GrainBackground from "@/components/ui/GrainBackground";
import { CATEGORY_STYLES, LABEL, clampText } from "@/lib/projectUi";
import { CERTIFICATES } from "@/lib/certificates";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Home",
  description: "Portfolio Nashwan: project, writeups, dan build log.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Nashwan Portfolio",
    description: "Portfolio Nashwan: project, writeups, dan build log.",
    url: "/",
    images: [{ url: "/og.svg" }],
  },
};

export const dynamic = "force-static";

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
  const allProjects = getAllProjects();
  const latest = allProjects.slice(0, 3);
  const featuredPick = allProjects.find(p => p.category === "WEB" || p.category === "CTF");
  const totalProjects = allProjects.length;
  const totalMessages = 0; // Contact API changed to email

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
                    Nashwan&apos;s Portfolio
                  </span>
                  <span className="text-xs text-slate-500">
                    Projects • Writeups • Build log
                  </span>
                </div>

                <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
                  Halo, aku <span className="text-slate-950">Ahmad Fadhil Fathi R. N.</span>
                </h1>

                <div className="mt-4">
                  <RolesClient />
                </div>

                <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
                  Pelajar SMK Telkom yang suka bikin project (web / deploy webserver) dan ngulik
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
                  <Reveal key={p.slug} delay={0.05 + idx * 0.05}>
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
          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal delay={0.05}>
              <div className="flex h-full flex-col justify-between rounded-3xl bg-slate-900 p-7 sm:p-8 text-white shadow-[0_18px_60px_rgba(15,23,42,0.22)]">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                    Profile
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    About Me
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">
                    Pelajari lebih lanjut tentang latar belakangku, tools yang biasa kugunakan, dan workflow *development* yang aku terapkan.
                  </p>
                </div>
                <div className="mt-8">
                  <Link
                    href="/about"
                    className="press inline-flex items-center justify-center rounded-2xl bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-amber-200"
                  >
                    Get to know me &rarr;
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="flex h-full flex-col justify-between rounded-3xl bg-white p-7 sm:p-8 ring-1 ring-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Connect
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                    Let&apos;s Talk
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Tertarik berkolaborasi ngerjain *project*, nanya seputar tulisan, atau sekadar *sharing*? Langsung kontak aku aja.
                  </p>
                </div>
                <div className="mt-8">
                  <Link
                    href="/contact"
                    className="press inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 !text-white"
                  >
                    Send a message &rarr;
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mt-14">
          <Reveal>
            <SectionHead
              kicker="Credentials"
              title="Latest Certificates"
              desc="Sertifikasi kompetensi dan penghargaan terbaru."
              right={
                <Link href="/certificates" className="u text-sm font-semibold text-slate-700 hover:text-slate-900">
                  Browse all &rarr;
                </Link>
              }
            />
          </Reveal>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CERTIFICATES.slice(0, 3).map((cert, idx) => (
              <Reveal key={cert.id} delay={0.05 + idx * 0.05}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:ring-slate-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
                  {cert.image ? (
                    <Link href="/certificates" className="block relative h-40 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                      <img
                        src={cert.image}
                        alt={`Sertifikat ${cert.title}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                  ) : cert.fileUrl?.toLowerCase().endsWith(".pdf") ? (
                    <Link href="/certificates" className="block relative flex h-40 w-full items-center justify-center overflow-hidden bg-slate-50 border-b border-slate-100 transition-colors group-hover:bg-slate-100">
                      <div className="flex flex-col items-center justify-center text-slate-400 transition-all duration-500 group-hover:scale-110 group-hover:text-amber-500">
                        <FileText strokeWidth={1.5} className="mb-3 h-10 w-10" />
                        <span className="text-[10px] font-semibold tracking-wider text-slate-500">PDF DOCUMENT</span>
                      </div>
                    </Link>
                  ) : null}
                  <div className="flex flex-col flex-1 p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-800 ring-1 ring-amber-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {cert.issuer}
                      </span>
                      <span className="rounded-full bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-700 ring-1 ring-slate-200">
                        {cert.date}
                      </span>
                    </div>

                    <Link href="/certificates" className="block mt-3">
                      <h3 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 group-hover:underline">
                        {cert.title}
                      </h3>
                    </Link>

                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                      {cert.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
