import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminMessagesPage() {
  if (!(await isAdmin())) redirect("/admin");

  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="mt-2 text-sm text-zinc-300">
              Semua pesan dari halaman /contact masuk ke sini.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900"
              href="/admin/projects"
            >
              Projects
            </Link>

            <LogoutButton />
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
              <p className="text-zinc-300">Belum ada pesan.</p>
              <p className="mt-2 text-sm text-zinc-400">
                Coba kirim pesan dari <span className="text-zinc-200">/contact</span> lalu refresh halaman ini.
              </p>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-xs text-zinc-400">
                    {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="mt-1 text-sm text-zinc-300">{m.email}</p>
                <p className="mt-4 whitespace-pre-wrap text-sm text-zinc-200">
                  {m.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
