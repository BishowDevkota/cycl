import { ReactNode } from "react";
import { requireAdminSession } from "@/lib/admin-auth";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdminSession();

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <p className="text-sm font-medium text-zinc-900">Admin Area</p>
          <p className="text-sm text-zinc-600">Signed in as {session.email}</p>
        </div>
      </header>
      <div className="mx-auto w-full max-w-5xl px-6 py-8">{children}</div>
    </div>
  );
}
