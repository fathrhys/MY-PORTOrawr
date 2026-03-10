"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const items = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/certificates", label: "Certificates" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="sticky top-0 z-50">
      <div className={"mx-auto max-w-6xl px-4 sm:px-6 transition-all " + (scrolled ? "pt-3" : "pt-5")}>
        <div
          className={[
            "flex items-center justify-between rounded-2xl border px-4 py-3 backdrop-blur",
            scrolled
              ? "border-slate-200 bg-white/80 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
              : "border-slate-200 bg-white/55",
          ].join(" ")}
        >
          <Link href="/" className="text-sm font-semibold text-slate-900" onClick={() => setMobileOpen(false)}>
            Nashwan<span className="text-slate-500">.dev</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {items.map((i) => {
              const active = isActive(i.href);
              return (
                <Link
                  key={i.href}
                  href={i.href}
                  className={[
                    "rounded-xl px-3 py-2 text-xs font-semibold transition",
                    active
                      ? "bg-slate-900 text-white !text-white"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                  ].join(" ")}
                >
                  {i.label}
                </Link>
              );
            })}

            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 rounded-xl bg-amber-200 px-3 py-2 text-xs font-semibold text-slate-900 ring-1 ring-amber-300/60 hover:bg-amber-300 dark:bg-amber-400/90 dark:ring-amber-500/50"
            >
              Download CV
            </a>

            <button
              onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'k', 'metaKey': true }))}
              className="ml-2 flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200 transition hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400 dark:ring-white/10 dark:hover:bg-white/10"
            >
              <span className="flex items-center gap-1">
                <span className="text-[10px]">⌘</span>K
              </span>
            </button>

            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="ml-2 rounded-xl p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden rounded-lg p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur shadow-[0_10px_30px_rgba(15,23,42,0.10)] overflow-hidden">
            <nav className="flex flex-col p-2">
              {items.map((i) => {
                const active = isActive(i.href);
                return (
                  <Link
                    key={i.href}
                    href={i.href}
                    onClick={() => setMobileOpen(false)}
                    className={[
                      "rounded-xl px-4 py-3 text-sm font-semibold transition",
                      active
                        ? "bg-slate-900 text-white !text-white"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")}
                  >
                    {i.label}
                  </Link>
                );
              })}

              <div className="mt-2 flex flex-col gap-2">
                <a
                  href="/cv.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-xl bg-amber-200 px-4 py-3 text-sm font-semibold text-slate-900 ring-1 ring-amber-300/60 hover:bg-amber-300 text-center dark:bg-amber-400/90 dark:ring-amber-500/50"
                >
                  Download CV
                </a>

                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setTimeout(() => document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'k', 'metaKey': true })), 100);
                  }}
                  className="flex w-full items-center justify-between rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 dark:bg-white/5 dark:text-white"
                >
                  <span>Command Menu</span>
                  <span className="rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-500 dark:bg-white/10 dark:text-slate-400">⌘K</span>
                </button>

                {mounted && (
                  <button
                    onClick={() => {
                      setTheme(resolvedTheme === "dark" ? "light" : "dark");
                      setMobileOpen(false);
                    }}
                    className="flex shrink-0 items-center justify-center rounded-xl px-4 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20 transition-colors"
                    aria-label="Toggle Dark Mode"
                  >
                    {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
