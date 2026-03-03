"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = (await res.json().catch(() => null)) as unknown;
    setLoading(false);

    if (!res.ok) {
      const err =
        data && typeof data === "object" && "error" in data && typeof (data as { error?: unknown }).error === "string"
          ? (data as { error: string }).error
          : null;
      setMsg(err || "Gagal login");
      return;
    }

    router.push("/admin/messages");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-3xl font-bold">Admin Login</h1>
        <p className="mt-3 text-zinc-300">Masukkan password admin untuk masuk dashboard.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm outline-none focus:border-zinc-600"
            placeholder="Password admin"
          />
          <button
            disabled={loading}
            className="w-full rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-70"
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>

          {msg ? <p className="text-sm text-red-400">{msg}</p> : null}
        </form>
      </div>
    </main>
  );
}
