"use client";

import { useState } from "react";
import { withCsrfHeaders } from "@/lib/csrfClient";

export default function DeleteProjectButton({ id }: { id: number }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function onDelete() {
    if (!confirm("Yakin ingin hapus project ini?")) return;
    setLoading(true);
    setMsg("");

    const res = await fetch(`/api/admin/projects/${id}/delete`, {
      method: "POST",
      headers: withCsrfHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({}),
    });

    const data = (await res.json().catch(() => null)) as unknown;
    if (!res.ok) {
      const err =
        data && typeof data === "object" && "error" in data && typeof (data as { error?: unknown }).error === "string"
          ? (data as { error: string }).error
          : null;
      setMsg(err || "Gagal menghapus");
      setLoading(false);
      return;
    }

    window.location.reload();
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={onDelete}
        disabled={loading}
        className="press rounded-2xl bg-red-500/90 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-70"
      >
        {loading ? "Deleting..." : "Delete"}
      </button>
      {msg ? <span className="text-xs text-red-500">{msg}</span> : null}
    </div>
  );
}
