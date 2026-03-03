export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

function toSafeFilenameSlug(slug: string) {
  const cleaned = slug
    .trim()
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return cleaned || "writeup";
}

function normalizeLineEndings(text: string) {
  return (text || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

const UNSUPPORTED_CHAR_REPLACEMENTS: Record<string, string> = {
  "\u2705": "[OK]",
  "\u274C": "[X]",
  "\u26A0": "[!]",
  "\u{1F512}": "[LOCK]",
  "\u{1F511}": "[KEY]",
  "\u{1F525}": "[HOT]",
  "\u{1F4A1}": "[IDEA]",
  "\u{1F680}": "[ROCKET]",
  "\u{1F4CC}": "[PIN]",
  "\u{1F4A3}": "[BOOM]",
  "\u{1F4A5}": "[HIT]",
};

function canEncode(font: PDFFont, text: string) {
  try {
    font.encodeText(text);
    return true;
  } catch {
    return false;
  }
}

function sanitizeForFont(text: string, font: PDFFont) {
  let output = "";
  for (const ch of text.replace(/\t/g, "  ")) {
    if (ch === "\n" || ch === "\r") {
      output += ch;
      continue;
    }

    if (canEncode(font, ch)) {
      output += ch;
      continue;
    }

    output += UNSUPPORTED_CHAR_REPLACEMENTS[ch] ?? "?";
  }

  return output;
}

function textWidth(font: PDFFont, text: string, size: number) {
  return font.widthOfTextAtSize(text, size);
}

function splitLongWord(word: string, maxWidth: number, font: PDFFont, size: number) {
  if (textWidth(font, word, size) <= maxWidth) return [word];

  const chunks: string[] = [];
  let chunk = "";

  for (const ch of word) {
    const next = chunk + ch;
    if (textWidth(font, next, size) <= maxWidth) {
      chunk = next;
      continue;
    }

    if (chunk) chunks.push(chunk);
    chunk = ch;
  }

  if (chunk) chunks.push(chunk);
  return chunks;
}

function wrapLine(text: string, maxWidth: number, font: PDFFont, size: number) {
  const safeText = sanitizeForFont(text, font);
  const words = safeText.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const normalizedWords = words.flatMap((word) => splitLongWord(word, maxWidth, font, size));
  const lines: string[] = [];
  let current = normalizedWords[0];

  for (let i = 1; i < normalizedWords.length; i += 1) {
    const candidate = `${current} ${normalizedWords[i]}`;
    if (textWidth(font, candidate, size) <= maxWidth) {
      current = candidate;
      continue;
    }
    lines.push(current);
    current = normalizedWords[i];
  }

  lines.push(current);
  return lines;
}

function drawWrappedText(
  text: string,
  options: {
    page: PDFPage;
    setPage: (page: PDFPage) => void;
    getY: () => number;
    setY: (y: number) => void;
    maxWidth: number;
    margin: number;
    lineHeight: number;
    font: PDFFont;
    size: number;
    color: ReturnType<typeof rgb>;
    pageFactory: () => PDFPage;
  }
) {
  const {
    page,
    setPage,
    getY,
    setY,
    maxWidth,
    margin,
    lineHeight,
    font,
    size,
    color,
    pageFactory,
  } = options;
  let currentPage = page;

  const ensureSpace = () => {
    if (getY() - lineHeight >= margin) return;
    currentPage = pageFactory();
    setPage(currentPage);
    setY(currentPage.getHeight() - margin);
  };

  const lines = wrapLine(text, maxWidth, font, size);
  for (const line of lines) {
    ensureSpace();
    currentPage.drawText(line, {
      x: margin,
      y: getY(),
      size,
      font,
      color,
    });
    setY(getY() - lineHeight);
  }
}

export async function GET(_: Request, ctx: { params: Promise<{ slug: string }> }) {
  const params = await ctx.params;
  let slug = params.slug;

  try {
    slug = decodeURIComponent(params.slug);
  } catch {
    slug = params.slug;
  }

  const project = await prisma.project.findUnique({
    where: { slug },
    select: {
      slug: true,
      category: true,
      description: true,
    },
  });

  if (!project || project.category !== "CTF") {
    return new Response("Write-up tidak ditemukan.", { status: 404 });
  }

  const rawWriteup = normalizeLineEndings(project.description) || "-";

  const pdf = await PDFDocument.create();
  const bodyFont = await pdf.embedFont(StandardFonts.Helvetica);
  const pageSize: [number, number] = [595.28, 841.89];
  const margin = 48;
  const maxWidth = pageSize[0] - margin * 2;
  const lineHeight = 16;
  const bodySize = 11;

  let page = pdf.addPage(pageSize);
  let y = page.getHeight() - margin;

  const addPage = () => pdf.addPage(pageSize);

  for (const rawLine of rawWriteup.split("\n")) {
    const line = rawLine.trimEnd();
    if (!line.trim()) {
      y -= lineHeight * 0.6;
      if (y <= margin) {
        page = addPage();
        y = page.getHeight() - margin;
      }
      continue;
    }

    drawWrappedText(line, {
      page,
      setPage: (nextPage) => {
        page = nextPage;
      },
      getY: () => y,
      setY: (nextY) => {
        y = nextY;
      },
      maxWidth,
      margin,
      lineHeight,
      font: bodyFont,
      size: bodySize,
      color: rgb(0.1, 0.14, 0.19),
      pageFactory: addPage,
    });
  }

  const pdfBytes = await pdf.save();
  const filename = `${toSafeFilenameSlug(project.slug)}.pdf`;

  return new Response(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=0, s-maxage=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
