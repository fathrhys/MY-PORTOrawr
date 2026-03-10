import Navbar from "@/components/Navbar";
import GrainBackground from "@/components/ui/GrainBackground";
import Reveal from "@/components/ui/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import { CERTIFICATES } from "@/lib/certificates";
import { Metadata } from "next";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
    title: "Certificates - Nashwan",
    description: "Daftar sertifikasi dan kredensial yang telah saya peroleh.",
    alternates: {
        canonical: "/certificates",
    },
    openGraph: {
        title: "Certificates - Nashwan",
        description: "Daftar sertifikasi dan kredensial yang telah saya peroleh.",
        url: "/certificates",
        images: [{ url: "/og.svg" }],
    },
};

export default function CertificatesPage() {
    return (
        <main className="min-h-screen bg-[#fbfaf7] text-slate-900">
            <Navbar />
            <GrainBackground />

            <div className="mx-auto max-w-6xl px-6 pb-20 pt-10">
                <section className="pt-6">
                    <Reveal>
                        <SectionHead
                            kicker="Credentials"
                            title="Certificates"
                            desc="Kumpulan sertifikasi kompetensi dan penghargaan yang pernah aku peroleh."
                            right={
                                <span className="text-sm font-semibold text-slate-700">
                                    {CERTIFICATES.length} items
                                </span>
                            }
                        />
                    </Reveal>

                    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {CERTIFICATES.map((cert, idx) => (
                            <Reveal key={cert.id} delay={0.05 + idx * 0.05}>
                                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:ring-slate-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
                                    {cert.image ? (
                                        <div className="relative h-48 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={cert.image}
                                                alt={`Sertifikat ${cert.title}`}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    ) : cert.fileUrl?.toLowerCase().endsWith(".pdf") ? (
                                        <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-slate-50 border-b border-slate-100 transition-colors group-hover:bg-slate-100">
                                            <div className="flex flex-col items-center justify-center text-slate-400 transition-all duration-500 group-hover:scale-110 group-hover:text-amber-500">
                                                <FileText strokeWidth={1.5} className="mb-3 h-12 w-12" />
                                                <span className="text-xs font-semibold tracking-wider text-slate-500">PDF DOCUMENT</span>
                                            </div>
                                        </div>
                                    ) : null}
                                    <div className="flex flex-col flex-1 p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
                                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                                {cert.issuer}
                                            </span>
                                            <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                                                {cert.date}
                                            </span>
                                        </div>

                                        <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-900">
                                            {cert.title}
                                        </h3>

                                        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                                            {cert.description}
                                        </p>

                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {cert.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full bg-slate-50 px-2.5 py-1 text-xs text-slate-700 ring-1 ring-slate-200"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {(cert.credentialUrl || cert.credentialId || cert.fileUrl) && (
                                            <div className="mt-6 border-t border-slate-100 pt-5">
                                                {cert.credentialId && (
                                                    <p className="text-xs text-slate-500 mb-3">
                                                        ID: <span className="font-mono text-slate-700">{cert.credentialId}</span>
                                                    </p>
                                                )}
                                                {cert.credentialUrl && (
                                                    <a
                                                        href={cert.credentialUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="press inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 !text-white mb-2"
                                                    >
                                                        Verify Credential &rarr;
                                                    </a>
                                                )}
                                                {cert.fileUrl && (
                                                    <a
                                                        href={cert.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="press inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-200 px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-amber-300/60 transition hover:bg-amber-300"
                                                    >
                                                        Lihat File Sertifikat &rarr;
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Reveal>
                        ))}

                        {CERTIFICATES.length === 0 && (
                            <div className="col-span-full py-12 text-center">
                                <p className="text-slate-500">Belum ada data sertifikat.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
