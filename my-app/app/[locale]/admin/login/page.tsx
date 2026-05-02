import { redirect } from "next/navigation";
import AdminLoginForm from "./AdminLoginForm";
import { getAdminSessionFromRequestCookies } from "@/lib/admin-auth";

export default async function AdminLoginPage() {
  const session = await getAdminSessionFromRequestCookies();

  if (session) {
    redirect("/admin/dahboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-10">
      <AdminLoginForm />
    </main>
  );
}
