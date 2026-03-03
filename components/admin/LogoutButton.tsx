"use client";

import { useState } from "react";
import { withCsrfHeaders } from "@/lib/csrfClient";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    await fetch("/api/admin/logout", {
      method: "POST",
      headers: withCsrfHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({}),
    });
    window.location.href = "/admin";
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-70"
    >
      {loading ? "Logout..." : "Logout"}
    </button>
  );
}
