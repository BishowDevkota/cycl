import { ReactNode } from "react";
import { requireAdminSession } from "@/lib/admin-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdminSession();

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white flex justify-center   items-center py-4">
       
        <h1 className="text-2xl font-bold text-teal-deep">Welcome to Admin Area</h1>
      </header>

      <div className="flex w-full">
        <AdminSidebar />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-6xl px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
