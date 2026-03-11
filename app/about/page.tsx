import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/ui/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import GrainBackground from "@/components/ui/GrainBackground";
import { Cloud, Server, Shield, Database, Terminal, Search, Globe, Code } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Profil singkat, skill, dan cara kerja Nashwan.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About - Nashwan",
    description: "Profil singkat, skill, dan cara kerja Nashwan.",
    url: "/about",
    images: [{ url: "/og.svg" }],
  },
};

function Stat({
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

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
      {children}
    </span>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf7] text-slate-900">
      <Navbar />
      <GrainBackground />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        {/* HERO */}
        <section className="pt-6">
          <Reveal>
            <div className="rounded-3xl bg-white/70 ring-1 ring-slate-200 p-7 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                  About
                </span>
                <span className="text-xs text-slate-500">Profil • Fokus belajar • Cara kerja</span>
              </div>

              <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:items-start">
                {/* LEFT */}
                <div>
                  <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                    Tentang aku
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-700">
                    Aku <span className="font-semibold text-slate-900">Kamal</span>, pelajar SMK yang
                    suka bikin project web/app dan ngulik cybersecurity (CTF).
                    Website ini jadi tempat aku simpan{" "}
                    <span className="font-semibold text-slate-900">project</span>,{" "}
                    <span className="font-semibold text-slate-900">writeup</span>, dan catatan proses belajar
                    biar rapi, terstruktur, dan gampang dilihat.
                  </p>

                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-700">
                    Fokusku sekarang: ngebangun fondasi yang kuat di{" "}
                    <span className="font-semibold text-slate-900">web development</span> dan{" "}
                    <span className="font-semibold text-slate-900">web security</span>.
                    Aku suka gaya kerja yang jelas: target kecil tapi konsisten, dokumentasi rapih,
                    dan hasil yang bisa dipakai orang lain.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Pill>Next.js (App Router)</Pill>
                    <Pill>Prisma</Pill>
                    <Pill>Tailwind UI</Pill>
                    <Pill>Linux basics</Pill>
                    <Pill>CTF (web/forensic)</Pill>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/projects"
                      className="press inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 !text-white"
                    >
                      Lihat Projects &rarr;
                    </Link>
                    <Link
                      href="/contact"
                      className="press inline-flex items-center justify-center rounded-2xl bg-amber-200 px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-amber-300/60 hover:bg-amber-300"
                    >
                      Hubungi aku
                    </Link>
                    <a
                      href="/cv.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="press inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
                    >
                      Download CV
                    </a>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
                  <div className="p-6">
                    <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                      Snapshot
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                      Ringkasan cepat: apa yang lagi aku kerjain & cara aku belajar.
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <Stat label="STATUS" value="Active" hint="Belajar & build rutin" />
                      <Stat label="FOCUS" value="Web + CTF" hint="Dev + security" />
                    </div>

                    <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        Values
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-slate-700">
                        <li className="flex gap-2">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                          Dokumentasi rapi (biar gampang dipelajari lagi)
                        </li>
                        <li className="flex gap-2">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                          Clean UI dan UX yang jelas
                        </li>
                        <li className="flex gap-2">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                          Security mindset sejak awal
                        </li>
                      </ul>
                    </div>

                    <div className="mt-5">
                      <Link href="/projects" className="u text-sm font-semibold text-slate-700 hover:text-slate-900">
                        Browse semua project &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* SKILLS */}
        <section className="mt-14">
          <Reveal>
            <div className="rounded-3xl bg-white p-8 ring-1 ring-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                <div className="md:w-1/3">
                  <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Toolkit
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                    Skill & Tools
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    Fondasi normalku berawal dari eksosistem Cloud Computing, dan kini berkembang ke ranah peretasan sistem (Cybersecurity) & Forensik Digital. Berikut tools favorit yang biasa menemaniku.
                  </p>
                </div>

                <div className="md:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { name: "AWS / Cloud", icon: Cloud, color: "text-amber-500" },
                    { name: "Linux / OS", icon: Terminal, color: "text-slate-700" },
                    { name: "Burp Suite", icon: Shield, color: "text-orange-500" },
                    { name: "Wireshark", icon: Search, color: "text-sky-500" },
                    { name: "SQLMap", icon: Database, color: "text-rose-500" },
                    { name: "Kali Linux", icon: Server, color: "text-blue-500" },
                    { name: "Web Security", icon: Globe, color: "text-emerald-500" },
                    { name: "Development", icon: Code, color: "text-violet-500" },
                  ].map((tool, idx) => {
                    const Icon = tool.icon;
                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-md"
                      >
                        <Icon strokeWidth={1.5} className={`h-8 w-8 ${tool.color} mb-3`} />
                        <span className="text-xs font-semibold text-slate-700 text-center">
                          {tool.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>
        </section>


      </div>
    </main>
  );
}
