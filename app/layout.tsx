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

import { Providers } from "@/components/Providers";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#fbfaf7] text-slate-900 dark:bg-[#0b0f17] dark:text-slate-200 transition-colors duration-300`}>
        <Providers attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LoadingScreen />
          {children}
        </Providers>
      </body>
    </html>
  );
}
