export type ProjectCategory = "WEB" | "CTF" | "AI" | "GAME" | "TOOLS" | "OTHER";

export const LABEL: Record<ProjectCategory, string> = {
  WEB: "Web",
  CTF: "Cyber/CTF",
  AI: "AI",
  GAME: "Game",
  TOOLS: "Tools",
  OTHER: "Other",
};

export const CATS: { key: ProjectCategory; title: string; desc: string }[] = [
  { key: "WEB", title: "Web Apps", desc: "Next.js, Laravel, Flask - rapi, cepat, responsive." },
  { key: "CTF", title: "Cyber / CTF", desc: "Writeup, forensics, crypto, dan catatan belajar." },
  { key: "AI", title: "AI", desc: "Eksperimen AI/ML kecil-kecilan dan tools bantu belajar." },
  { key: "GAME", title: "Game", desc: "Project game yang pernah aku bikin / eksperimen." },
  { key: "TOOLS", title: "Tools", desc: "Script, automation, utilitas yang berguna." },
  { key: "OTHER", title: "Lainnya", desc: "Macam-macam project random yang tetap berguna." },
];

export const CATEGORY_STYLES: Record<
  ProjectCategory,
  { chip: string; dot: string; coverTint: string; cardHover?: string; link: string }
> = {
  WEB: {
    chip: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
    dot: "bg-sky-500",
    coverTint: "from-sky-500/15 via-transparent to-transparent",
    cardHover: "hover:shadow-[0_12px_30px_rgba(2,132,199,0.10)]",
    link: "text-sky-700 hover:text-sky-900",
  },
  CTF: {
    chip: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
    dot: "bg-violet-500",
    coverTint: "from-violet-500/15 via-transparent to-transparent",
    cardHover: "hover:shadow-[0_12px_30px_rgba(109,40,217,0.10)]",
    link: "text-violet-700 hover:text-violet-900",
  },
  AI: {
    chip: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
    coverTint: "from-emerald-500/15 via-transparent to-transparent",
    cardHover: "hover:shadow-[0_12px_30px_rgba(16,185,129,0.10)]",
    link: "text-emerald-700 hover:text-emerald-900",
  },
  GAME: {
    chip: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    dot: "bg-rose-500",
    coverTint: "from-rose-500/15 via-transparent to-transparent",
    cardHover: "hover:shadow-[0_12px_30px_rgba(244,63,94,0.10)]",
    link: "text-rose-700 hover:text-rose-900",
  },
  TOOLS: {
    chip: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
    dot: "bg-amber-500",
    coverTint: "from-amber-500/15 via-transparent to-transparent",
    cardHover: "hover:shadow-[0_12px_30px_rgba(245,158,11,0.10)]",
    link: "text-amber-800 hover:text-amber-950",
  },
  OTHER: {
    chip: "bg-slate-50 text-slate-700 ring-1 ring-slate-200",
    dot: "bg-slate-500",
    coverTint: "from-slate-500/12 via-transparent to-transparent",
    cardHover: "hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]",
    link: "text-slate-700 hover:text-slate-900",
  },
};

export function stripMarkdown(input: string) {
  let s = input || "";
  s = s.replace(/```[\s\S]*?```/g, " ");
  s = s.replace(/`([^`]+)`/g, "$1");
  s = s.replace(/^#{1,6}\s+/gm, "");
  s = s.replace(/^>\s?/gm, "");
  s = s.replace(/^\s*([-*+]|(\d+\.))\s+/gm, "");
  s = s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  s = s.replace(/(\*\*|__)(.*?)\1/g, "$2");
  s = s.replace(/(\*|_)(.*?)\1/g, "$2");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

export function clampText(s: string, max = 220) {
  const t = stripMarkdown(s);
  if (t.length <= max) return t;
  return t.slice(0, max).trim() + "...";
}
