"use client";

import Navbar from "@/components/Navbar";
import Reveal from "@/components/ui/Reveal";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import GrainBackground from "@/components/ui/GrainBackground";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");

    const res = await fetch("https://formspree.io/f/mbdzkbea", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message: content }),
    });

    if (!res.ok) {
      setStatus("err");
      toast.error("Gagal mengirim pesan. Pastikan ID Formspree sudah diisi di kode.");
      return;
    }

    setStatus("ok");
    toast.success("Terkirim! Pesan kamu akan masuk ke email.");
    setName("");
    setEmail("");
    setContent("");
  }

  const isLoading = status === "loading";

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-slate-900">
      <Navbar />
      <GrainBackground />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        {/* header */}
        <section className="pt-6">
          <Reveal>
            <div className="rounded-3xl bg-white/70 ring-1 ring-slate-200 p-7 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                    Contact
                  </span>
                  <span className="text-xs text-slate-500">Send a message • Collaboration & questions</span>
                </div>

                <Link
                  href="/"
                  className="press rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  &larr; Back to Home
                </Link>
              </div>

              <div className="mt-5 grid gap-6 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
                {/* left: form */}
                <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Kontak</h1>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
                    Kirim pesan lewat form ini. Nanti akan langsung diteruskan ke email pribadiku.
                  </p>

                  <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Nama</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-2 w-full rounded-2xl bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200 outline-none transition focus:ring-2 focus:ring-slate-900/40"
                        placeholder="Nama kamu"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700">Email</label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-2 w-full rounded-2xl bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200 outline-none transition focus:ring-2 focus:ring-slate-900/40"
                        placeholder="email@contoh.com"
                        type="email"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700">Pesan</label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="mt-2 h-32 w-full resize-none rounded-2xl bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200 outline-none transition focus:ring-2 focus:ring-slate-900/40"
                        placeholder="Tulis pesan kamu..."
                        required
                      />
                      <p className="mt-2 text-xs text-slate-500">
                        Tips: jelasin singkat konteks + apa yang kamu butuhin (collab / tanya project / minta review).
                      </p>
                    </div>

                    <button
                      disabled={isLoading}
                      className="press w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)] hover:bg-slate-800 disabled:opacity-70"
                    >
                      {isLoading ? "Mengirim..." : "Kirim pesan ->"}
                    </button>
                  </form>
                </div>

                {/* right: info card */}
                <div className="space-y-4">
                  <Reveal delay={0.06}>
                    <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
                      <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">What I can help with</p>
                      <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                        Collab, feedback, & questions
                      </h2>
                      <ul className="mt-4 space-y-2 text-sm text-slate-700">
                        <li className="flex gap-2">
                          <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-400" />
                          Review portfolio / project structure (Next.js + Prisma)
                        </li>
                        <li className="flex gap-2">
                          <span className="mt-1.5 h-2 w-2 rounded-full bg-sky-500" />
                          Diskusi ide project & roadmap belajar
                        </li>
                        <li className="flex gap-2">
                          <span className="mt-1.5 h-2 w-2 rounded-full bg-violet-500" />
                          CTF writeups: web, forensics, crypto (sharing & learning)
                        </li>
                      </ul>

                      <div className="mt-5 text-sm text-slate-600">
                        Kalau kamu mau cepat, tulis subject di awal pesan, contoh:{" "}
                        <span className="font-semibold text-slate-900">[Collab]</span> atau{" "}
                        <span className="font-semibold text-slate-900">[Question]</span>.
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={0.1}>
                    <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-[0_18px_60px_rgba(15,23,42,0.22)]">
                      <p className="text-xs font-semibold tracking-wider text-white/70 uppercase">Quick links</p>
                      <h2 className="mt-2 text-xl font-semibold tracking-tight">See my work</h2>
                      <p className="mt-2 text-sm text-white/80">
                        Kalau mau lihat contoh project & writeup, langsung cek halaman Projects.
                      </p>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                          href="/projects"
                          className="press inline-flex items-center justify-center rounded-2xl bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-amber-200"
                        >
                          Browse Projects &rarr;
                        </Link>
                        <a
                          href="/cv.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="press inline-flex items-center justify-center rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/15"
                        >
                          Download CV
                        </a>
                      </div>
                      <p className="mt-4 text-xs text-white/60">
                        Prefer chat? Kamu bisa tulis email kamu, aku bales via email.
                      </p>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </Reveal>
        </section>


      </div>
    </main>
  );
}
