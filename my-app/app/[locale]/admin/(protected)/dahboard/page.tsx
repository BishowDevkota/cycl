"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminDahboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold text-zinc-900">Admin Dahboard</h1>
      <p className="mt-3 text-zinc-600">
        This page is protected. Any route under /admin/* requires authentication.
      </p>

      <button
        type="button"
        onClick={logout}
        disabled={loading}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Signing out..." : "Sign out"}
      </button>
    </main>
  );
}
