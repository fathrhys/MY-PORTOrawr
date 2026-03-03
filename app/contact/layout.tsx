import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Kirim pesan untuk kolaborasi atau tanya project.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact - Kamal",
    description: "Kirim pesan untuk kolaborasi atau tanya project.",
    url: "/contact",
    images: [{ url: "/og.svg" }],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
