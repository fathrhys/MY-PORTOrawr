import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { isAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";
import GrainBackground from "@/components/ui/GrainBackground";

export const runtime = "nodejs";

export default async function AdminProjectsPage() {
  if (!(await isAdmin())) redirect("/admin");

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-slate-900">
      <Navbar />
      <GrainBackground />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        {/* Header card */}
        <section className="pt-6">
          <div className="rounded-3xl bg-white/70 ring-1 ring-slate-200 p-7 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                  Admin • Projects
                </span>
                <span className="text-xs text-slate-500">
                  Kelola project yang tampil di /projects
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  className="press rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black ring-1 ring-slate-200 hover:bg-slate-50"
                  href="/admin/messages"
                >
                  Messages
                </Link>
                <Link
                  className="press rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 !text-white"
                  href="/admin/projects/new"
                >
                  + New Project
                </Link>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                  Projects
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  Tambah/edit project dari sini. Halaman publik otomatis ngambil dari database.
                </p>
              </div>
              <div className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                {projects.length} items
              </div>
            </div>
          </div>
        </section>

        {/* List */}
        <section className="mt-10 space-y-4">
          {projects.length === 0 ? (
            <div className="rounded-3xl bg-white ring-1 ring-slate-200 p-7 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <p className="text-slate-700">
                Belum ada project. Klik{" "}
                <span className="font-semibold">+ New Project</span>.
              </p>
            </div>
          ) : (
            projects.map((p) => (
              <article
                key={p.id}
                className="rounded-3xl bg-white ring-1 ring-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.06)]"
              >
                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-20 overflow-hidden rounded-2xl ring-1 ring-slate-200 bg-slate-50">
                        {p.coverUrl ? (
                          <Image
                            src={p.coverUrl}
                            alt="cover"
                            width={160}
                            height={112}
                            unoptimized
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-r from-slate-50 via-slate-100 to-amber-50" />
                        )}
                      </div>

                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          {p.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          slug: <span className="font-semibold text-slate-700">{p.slug}</span> • cat:{" "}
                          <span className="font-semibold text-slate-700">{p.category}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        className="press rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
                        href={`/admin/projects/${p.id}/edit`}
                      >
                        Edit
                      </Link>

                      <DeleteProjectButton id={p.id} />
                    </div>
                  </div>

                  {p.description ? (
                    <p className="mt-4 text-sm text-slate-600 whitespace-pre-wrap">
                      {p.description.length > 260 ? p.description.slice(0, 260) + "..." : p.description}
                    </p>
                  ) : null}

                  {p.techStack ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.techStack
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                        .slice(0, 12)
                        .map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200"
                          >
                            {t}
                          </span>
                        ))}
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      <Link
                        className="u font-semibold text-slate-700 hover:text-slate-900"
                        href={`/projects/${encodeURIComponent(p.slug)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open public &rarr;
                      </Link>

                    {p.githubUrl ? (
                      <a
                        className="u font-semibold text-slate-700 hover:text-slate-900"
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub &rarr;
                      </a>
                    ) : null}

                    {p.demoUrl ? (
                      <a
                        className="u font-semibold text-slate-700 hover:text-slate-900"
                        href={p.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Demo &rarr;
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
