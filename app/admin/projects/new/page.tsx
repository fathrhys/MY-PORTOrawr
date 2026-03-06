"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getCsrfToken, withCsrfHeaders } from "@/lib/csrfClient";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const CATS = [
  { value: "WEB", label: "Web" },
  { value: "CTF", label: "CTF" },
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

export default function NewProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [techStack, setTechStack] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [category, setCategory] = useState("WEB");

  const [coverUrl, setCoverUrl] = useState(""); // URL manual
  const [coverFile, setCoverFile] = useState<File | null>(null); // upload file

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      let finalCover = coverUrl.trim() || null;

      // kalau user pilih file, upload file menang dulu
      if (coverFile) {
        const up = await uploadCover(coverFile);
        finalCover = up || null;
      }

      const res = await fetch("/api/admin/projects/create", {
        method: "POST",
        headers: withCsrfHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          title,
          slug,
          description,
          year: year ? Number(year) : null,
          techStack,
          githubUrl: githubUrl || null,
          demoUrl: demoUrl || null,
          category,
          coverUrl: finalCover,
        }),
      });

      const data = (await res.json().catch(() => null)) as unknown;

      if (!res.ok) {
        setMsg(getErrorMessage(data) || "Gagal membuat project");
        setLoading(false);
        return;
      }

      router.push("/admin/projects");
    } catch (err: unknown) {
      if (err instanceof Error) setMsg(err.message);
      else setMsg("Terjadi error");
    } finally {
      setLoading(false);
    }
  }

  const preview = coverFile ? URL.createObjectURL(coverFile) : coverUrl.trim();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-3xl font-bold">New Project</h1>
        <p className="mt-2 text-sm text-zinc-300">
          TechStack isi pakai koma, contoh: <span className="text-zinc-100">Next.js, Tailwind, MySQL</span>
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm"
          >
            {CATS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Cover URL */}
          <input
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm"
            placeholder="Cover Image URL (opsional)"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
          />

          {/* Upload file */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 px-4 py-3">
            <p className="text-xs text-zinc-300">Atau upload gambar (opsional). Jika upload dipilih, ini akan dipakai.</p>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
              className="mt-2 block w-full text-sm text-zinc-200"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            />
          </div>

          {preview ? (
            <div className="overflow-hidden rounded-2xl border border-zinc-800">
              <Image
                src={preview}
                alt="preview"
                width={800}
                height={320}
                unoptimized
                className="h-44 w-full object-cover"
              />
            </div>
          ) : null}

          <input
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm"
            placeholder="Slug (contoh: ekskul-app)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-zinc-100">Description (Markdown)</span>
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-700"
              >
                {previewMode ? "Edit" : "Preview"}
              </button>
            </div>
            {previewMode ? (
              <div className="md field min-h-[128px] w-full rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 font-sans text-sm text-zinc-200">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                    hr: () => <hr />,
                  }}
                >
                  {description || "*Belum ada deskripsi*"}
                </ReactMarkdown>
              </div>
            ) : (
              <textarea
                className="h-32 w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-100"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            )}
          </div>
          <input
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm"
            placeholder="Year (opsional)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm"
            placeholder="Tech Stack (pisahkan koma)"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm"
            placeholder="GitHub URL (opsional)"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm"
            placeholder="Demo URL (opsional)"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-70"
          >
            {loading ? "Menyimpan..." : "Create"}
          </button>

          {msg ? <p className="text-sm text-red-400">{msg}</p> : null}
        </form>
      </div>
    </main>
  );
}
