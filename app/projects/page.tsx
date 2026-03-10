import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllProjects } from "@/lib/markdown";
import Navbar from "@/components/Navbar";
import GrainBackground from "@/components/ui/GrainBackground";
import ProjectsClient from "./ProjectsClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Projects",
  description: "Kumpulan project dan writeup yang pernah dikerjakan.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects - Nashwan",
    description: "Kumpulan project dan writeup yang pernah dikerjakan.",
    url: "/projects",
    images: [{ url: "/og.svg" }],
  },
};

export default function ProjectsPage() {
  const allProjects = getAllProjects();

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-slate-900">
      <Navbar />
      <GrainBackground />
      <Suspense fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-slate-500">Loading projects...</p>
        </div>
      }>
        <ProjectsClient allProjects={allProjects} />
      </Suspense>
    </main>
  );
}
