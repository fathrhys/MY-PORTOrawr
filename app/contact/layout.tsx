import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Nashwan",
  description: "Terhubung atau kolaborasi dengan Nashwan.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact - Nashwan",
    description: "Kirim pesan untuk kolaborasi atau tanya project.",
    url: "/contact",
    images: [{ url: "/og.svg" }],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
