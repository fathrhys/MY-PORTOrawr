import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/ui/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import GrainBackground from "@/components/ui/GrainBackground";
import Image from "next/image";
import { 
  SiKalilinux, SiWireshark, SiBurpsuite, SiOwasp, 
  SiDocker, SiLinux, SiNginx, SiCloudflare, 
  SiPython, SiGnubash, SiJavascript, SiTypescript, SiMysql, SiNextdotjs
} from "react-icons/si";
import { FaAws, FaBug, FaDatabase, FaServer, FaGithub, FaLinkedin } from "react-icons/fa";

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
                    Aku <span className="font-semibold text-slate-900">Nashwan</span>, pelajar SMK Telkom yang
                    suka bikin project web / deploy server dan ngulik cybersecurity dengan tipe CTF.
                    Website ini jadi tempat aku simpan{" "}
                    <span className="font-semibold text-slate-900">project</span>,{" "}
                    <span className="font-semibold text-slate-900">writeup</span>, dan catatan proses belajar
                    biar rapi, terstruktur, dan gampang dilihat.
                  </p>

                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-700">
                    Fokusku sekarang: ngebangun fondasi yang kuat di{" "}
                    <span className="font-semibold text-slate-900">web development</span> dan{" "}
                    <span className="font-semibold text-slate-900">deployment webserver</span>.
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

                  <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-6">
                    <a
                      href="https://github.com/fathrhys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="press group flex items-center gap-2.5 rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
                    >
                      <FaGithub className="h-5 w-5 text-slate-700 transition-all duration-300 group-hover:scale-110 group-hover:text-slate-950" />
                      GitHub
                    </a>
                    <a
                      href="https://www.linkedin.com/in/ahmad-fadhil-fathi-rahesya-nashwan-0294b3352/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="press group flex items-center gap-2.5 rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
                    >
                      <FaLinkedin className="h-5 w-5 text-[#0a66c2]/80 transition-all duration-300 group-hover:scale-110 group-hover:text-[#0a66c2]" />
                      LinkedIn
                    </a>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
                  <div className="p-6">
                    <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                      Snapshot
                    </p>
                    <div className="mt-5 rounded-2xl bg-slate-50 p-2.5 ring-1 ring-slate-200">
                      <div className="relative w-full aspect-square overflow-hidden rounded-xl ring-4 ring-white shadow-md">
                        <Image
                          src="/profilku.jpg"
                          alt="Foto Profil Nashwan"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      </div>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <Stat label="STATUS" value="Active" hint="Belajar & build rutin" />
                      <Stat label="FOCUS" value="Cloud Server & Web Builder" hint="Web & Cloud" />
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
            <div className="rounded-3xl bg-white p-7 sm:p-10 ring-1 ring-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <div className="mb-8">
                <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Toolkit
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                  Skill & Tools
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
                  Fondasi normalku berawal dari eksosistem Cloud Computing, dan kini berkembang ke ranah Pentest Web, Forensik Digital, dan Web Development.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {/* CYBERSECURITY */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900 border-b border-slate-100 pb-2">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    Cyber Security
                  </h3>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { name: "Kali Linux", icon: SiKalilinux, color: "text-slate-800" },
                      { name: "Burp Suite", icon: SiBurpsuite, color: "text-orange-500" },
                      { name: "Wireshark", icon: SiWireshark, color: "text-sky-600" },
                      { name: "SQLMap", icon: FaBug, color: "text-slate-600" },
                      { name: "OWASP", icon: SiOwasp, color: "text-slate-900" },
                    ].map((tool, idx) => {
                      const Icon = tool.icon;
                      return (
                        <div key={idx} className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm">
                          <Icon className={`h-5 w-5 shrink-0 ${tool.color}`} />
                          <span className="text-xs font-medium text-slate-700">{tool.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CLOUD & ADMIN */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900 border-b border-slate-100 pb-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Cloud & Server
                  </h3>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { name: "AWS", icon: FaAws, color: "text-amber-500" },
                      { name: "Docker", icon: SiDocker, color: "text-blue-500" },
                      { name: "Linux OS", icon: SiLinux, color: "text-slate-800" },
                      { name: "Nginx", icon: SiNginx, color: "text-emerald-500" },
                      { name: "Cloudflare", icon: SiCloudflare, color: "text-orange-400" },
                      { name: "Server config", icon: FaServer, color: "text-slate-600" },
                    ].map((tool, idx) => {
                      const Icon = tool.icon;
                      return (
                        <div key={idx} className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm">
                          <Icon className={`h-5 w-5 shrink-0 ${tool.color}`} />
                          <span className="text-xs font-medium text-slate-700">{tool.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PROGRAMMING & WEB */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900 border-b border-slate-100 pb-2">
                    <span className="h-2 w-2 rounded-full bg-violet-500" />
                    Programming
                  </h3>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { name: "Python", icon: SiPython, color: "text-blue-500" },
                      { name: "Bash", icon: SiGnubash, color: "text-slate-800" },
                      { name: "TypeScript", icon: SiTypescript, color: "text-blue-600" },
                      { name: "Next.js", icon: SiNextdotjs, color: "text-slate-900" },
                      { name: "MySQL", icon: SiMysql, color: "text-sky-700" },
                      { name: "Database", icon: FaDatabase, color: "text-slate-500" },
                    ].map((tool, idx) => {
                      const Icon = tool.icon;
                      return (
                        <div key={idx} className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm">
                          <Icon className={`h-5 w-5 shrink-0 ${tool.color}`} />
                          <span className="text-xs font-medium text-slate-700">{tool.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </Reveal>
        </section>


      </div>
    </main>
  );
}
