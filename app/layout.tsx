import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Kamal Portfolio",
    template: "%s | Kamal",
  },
  description: "Portfolio dan writeups Kamal.",
  alternates: {
    canonical: "/",
  },
};

/**
 * Script kecil buat:
 * - ambil theme dari localStorage (light/dark)
 * - kalau belum ada, ikut prefers-color-scheme
 * - set class "dark" di <html>
 * NOTE: inline script supaya gak flicker pas load awal.
 */
function ThemeInitScript() {
  const code = `
(function(){
  try {
    var saved = localStorage.getItem("theme"); // "light" | "dark" | null
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var isDark = saved ? (saved === "dark") : prefersDark;

    var root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  } catch (e) {}
})();
  `.trim();

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <ThemeInitScript />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
