import { ReactNode } from "react";
import { requireAdminSession } from "@/lib/admin-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdminSession();

  return (
    <div className="min-h-screen md:flex" style={{ backgroundColor: "#F0E5D8" }}>
      <div className="md:shrink-0">
        <AdminSidebar />
      </div>

      <main className="flex-1">
        <header className="border-b border-zinc-200 bg-white px-6 py-4">
          <h1 className="text-2xl font-bold text-teal-deep">Welcome to the Admin Area</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Use the sidebar to jump directly to homepage content, vacancy tools, and other admin sections.
          </p>
        </header>

        <div className="w-full px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
