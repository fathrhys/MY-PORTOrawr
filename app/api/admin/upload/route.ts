export const runtime = "nodejs";

import { isAdmin } from "@/lib/adminAuth";
import { requireCsrf } from "@/lib/csrf";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function safeExt(name: string) {
  const ext = path.extname(name || "").toLowerCase();
  const ok = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);
  return ok.has(ext) ? ext : "";
}

function sniffImageExt(buf: Buffer) {
  if (buf.length < 12) return "";
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return ".png";
  }
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return ".jpg";
  }
  if (buf.slice(0, 6).toString("ascii") === "GIF87a" || buf.slice(0, 6).toString("ascii") === "GIF89a") {
    return ".gif";
  }
  if (buf.slice(0, 4).toString("ascii") === "RIFF" && buf.slice(8, 12).toString("ascii") === "WEBP") {
    return ".webp";
  }
  return "";
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const form = await req.formData().catch(() => null);
  if (!form) {
    return new Response(JSON.stringify({ error: "FormData tidak valid" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const csrf = form.get("csrf");
  if (!(await requireCsrf(req, typeof csrf === "string" ? csrf : null))) {
    return new Response(JSON.stringify({ error: "CSRF invalid" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ error: "File tidak ditemukan (field: file)" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!file.type.startsWith("image/")) {
    return new Response(JSON.stringify({ error: "File harus berupa image" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const ext = safeExt(file.name);
  if (!ext) {
    return new Response(JSON.stringify({ error: "Format gambar harus png/jpg/jpeg/webp/gif" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // limit biar aman (3MB)
  const MAX = 3 * 1024 * 1024;
  if (file.size > MAX) {
    return new Response(JSON.stringify({ error: "File terlalu besar (max 3MB)" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const buf = Buffer.from(await file.arrayBuffer());
  const sniffed = sniffImageExt(buf);
  if (!sniffed) {
    return new Response(JSON.stringify({ error: "File bukan gambar yang valid" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (sniffed !== ext && !(sniffed === ".jpg" && ext === ".jpeg")) {
    return new Response(JSON.stringify({ error: "Ekstensi file tidak cocok dengan isi file" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const filename = `cover_${Date.now()}_${randomBytes(8).toString("hex")}${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  await writeFile(filepath, buf);

  return new Response(JSON.stringify({ url: `/uploads/${filename}` }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
