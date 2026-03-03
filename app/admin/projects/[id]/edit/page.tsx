"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getCsrfToken, withCsrfHeaders } from "@/lib/csrfClient";
import GrainBackground from "@/components/ui/GrainBackground";

const CATS = [
  { value: "WEB", label: "Web" },
  { value: "CTF", label: "Cyber/CTF" },
  { value: "AI", label: "AI" },
  { value: "GAME", label: "Game" },
  { value: "TOOLS", label: "Tools" },
  { value: "OTHER", label: "Lainnya" },
];

function getErrorMessage(data: unknown) {
  if (data && typeof data === "object" && "error" in data) {
    const err = (data as { error?: unknown }).error;
    if (typeof err === "string") return err;
  }
  return null;
}

function getUrlValue(data: unknown) {
  if (data && typeof data === "object" && "url" in data) {
    const url = (data as { url?: unknown }).url;
    if (typeof url === "string") return url;
  }
  return "";
}

type ProjectForm = {
  category: string;
  title: string;
  slug: string;
  description: string;
  year: string;
  techStack: string;
  githubUrl: string;
  demoUrl: string;
  coverUrl: string;
};

async function uploadCover(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("csrf", getCsrfToken());

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: fd,
  });

  const data = (await res.json().catch(() => null)) as unknown;
  const err = getErrorMessage(data);
  if (!res.ok) throw new Error(err || "Gagal upload gambar");
  return getUrlValue(data);
}

// opsional: auto slugify kalau user kosongin slug
function slugify(s: string) {
  return (s || "")
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const [form, setForm] = useState<ProjectForm>({
    category: "WEB",
    title: "",
    slug: "",
    description: "",
    year: "",
    techStack: "",
    githubUrl: "",
    demoUrl: "",
    coverUrl: "",
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // preview URL aman (revoke)
  const objectUrl = useMemo(() => {
    if (!coverFile) return "";
    return URL.createObjectURL(coverFile);
  }, [coverFile]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const preview = coverFile ? objectUrl : form.coverUrl.trim();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setMsg("");

      const res = await fetch(`/api/admin/projects/${id}/get`);
      const data = (await res.json().catch(() => null)) as unknown;

      if (!res.ok) {
        setMsg(getErrorMessage(data) || "Gagal load data project");
        setLoading(false);
        return;
      }

      const payload = data && typeof data === "object" ? (data as Record<string, unknown>) : {};

      setForm({
        category: typeof payload.category === "string" ? payload.category : "WEB",
        title: typeof payload.title === "string" ? payload.title : "",
        slug: typeof payload.slug === "string" ? payload.slug : "",
        description: typeof payload.description === "string" ? payload.description : "",
        year: payload.year ? String(payload.year) : "",
        techStack: typeof payload.techStack === "string" ? payload.techStack : "",
        githubUrl: typeof payload.githubUrl === "string" ? payload.githubUrl : "",
        demoUrl: typeof payload.demoUrl === "string" ? payload.demoUrl : "",
        coverUrl: typeof payload.coverUrl === "string" ? payload.coverUrl : "",
      });

      setLoading(false);
    }

    load();
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    try {
      let finalCover = form.coverUrl.trim() || null;

      if (coverFile) {
        const up = await uploadCover(coverFile);
        finalCover = up || null;
      }

      const finalSlug = form.slug.trim() || slugify(form.title);

      const res = await fetch(`/api/admin/projects/${id}/update`, {
        method: "POST",
        headers: withCsrfHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          ...form,
          slug: finalSlug,
          year: form.year ? Number(form.year) : null,
          githubUrl: form.githubUrl.trim() || null,
          demoUrl: form.demoUrl.trim() || null,
          coverUrl: finalCover,
        }),
      });

      const data = (await res.json().catch(() => null)) as unknown;
      if (!res.ok) {
        setMsg(getErrorMessage(data) || "Gagal update project");
        setSaving(false);
        return;
      }

      router.push("/admin/projects");
    } catch (err: unknown) {
      if (err instanceof Error) setMsg(err.message);
      else setMsg("Terjadi error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-slate-900">
      <style>{`
        .field{
          width: 100%;
          border-radius: 16px;
          border: 1px solid rgba(15,23,42,0.12);
          background: rgba(255,255,255,0.75);
          padding: 12px 14px;
          font-size: 14px;
          outline: none;
        }
        .field:focus{
          border-color: rgba(15,23,42,0.25);
          box-shadow: 0 0 0 4px rgba(245,158,11,0.20);
        }
        .label{
          font-size: 12px;
          font-weight: 700;
          color: rgba(15,23,42,0.72);
        }
        .hint{
          font-size: 12px;
          color: rgba(15,23,42,0.60);
        }
      `}</style>

      <GrainBackground />

      <div className="mx-auto max-w-3xl px-6 pb-20 pt-10">
        {/* header */}
        <div className="rounded-3xl bg-white/70 ring-1 ring-slate-200 p-7 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                Admin • Edit Project
              </span>
              <span className="text-xs text-slate-500">#{id}</span>
            </div>

            <Link
              href="/admin/projects"
              className="press rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black ring-1 ring-slate-200 hover:bg-slate-50"
            >
              &larr; Back
            </Link>
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
            Edit Project
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Update detail project, cover, dan link. Description bisa pakai Markdown (README style).
          </p>
        </div>

        {/* body */}
        <div className="mt-6 rounded-3xl bg-white ring-1 ring-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          {loading ? (
            <div className="p-7">
              <p className="text-slate-600">Loading...</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="p-7 space-y-5">
              {msg ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {msg}
                </div>
              ) : null}

              {/* Category */}
              <div className="space-y-2">
                <p className="label">Category</p>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="field"
                >
                  {CATS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cover */}
              <div className="space-y-3">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="label">Cover</p>
                    <p className="hint">Isi URL atau upload. Kalau upload, akan menggantikan URL.</p>
                  </div>
                </div>

                <input
                  className="field"
                  placeholder="Cover Image URL (opsional)"
                  value={form.coverUrl}
                  onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
                />

                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                    className="block w-full text-sm text-slate-700"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  />
                </div>

                {preview ? (
                  <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="preview" className="h-52 w-full object-cover" />
                  </div>
                ) : null}
              </div>

              {/* Title + Slug */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="label">Title</p>
                  <input
                    className="field"
                    placeholder="Judul project"
                    value={form.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setForm((prev) => ({
                        ...prev,
                        title,
                        slug: prev.slug ? prev.slug : slugify(title),
                      }));
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <p className="label">Slug</p>
                  <input
                    className="field"
                    placeholder="contoh: blindspot-notesapp"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  />
                  <p className="hint">Dipakai buat URL: /projects/&lt;slug&gt;</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <p className="label">Description (Markdown)</p>
                <textarea
                  className="field"
                  style={{ minHeight: 240 }}
                  placeholder="Tulis deskripsi / writeup pakai Markdown (README style)."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Meta */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="label">Year (opsional)</p>
                  <input
                    className="field"
                    placeholder="2026"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <p className="label">Tech Stack</p>
                  <input
                    className="field"
                    placeholder="Next.js, Prisma, Tailwind"
                    value={form.techStack}
                    onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                  />
                </div>
              </div>

              {/* Links */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="label">GitHub URL (opsional)</p>
                  <input
                    className="field"
                    placeholder="https://github.com/..."
                    value={form.githubUrl}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <p className="label">Demo URL (opsional)</p>
                  <input
                    className="field"
                    placeholder="https://..."
                    value={form.demoUrl}
                    onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  disabled={saving}
                  className="press inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-70"
                  type="submit"
                >
                  {saving ? "Menyimpan..." : "Save Changes"}
                </button>

                <Link
                  href="/admin/projects"
                  className="press inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

