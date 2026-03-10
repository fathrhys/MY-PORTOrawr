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
    default: "Nashwan Portfolio",
    template: "%s | Nashwan",
  },
  description: "Portfolio dan writeups Nashwan.",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <LoadingScreen />
          {children}
        </Providers>
      </body>
    </html>
  );
}
