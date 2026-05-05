"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useParams, useRouter } from "next/navigation";
import { VacancyLanguageProvider, useVacancyLanguage } from "./VacancyLanguageContext";

type UserInfo = {
  fullName?: string;
  email?: string;
};

function VacancyShellContent({ children }: { children: ReactNode }) {
  const { language, setLanguage } = useVacancyLanguage();
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const locale = (params.locale as string) || "en";
  const [user, setUser] = useState<UserInfo | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (!response.ok) {
          if (isMounted) setUser(null);
          return;
        }

        const data = await response.json();
        if (isMounted) setUser(data.user || null);
      } catch {
        if (isMounted) setUser(null);
      }
    };

    void fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const menuItems = useMemo(
    () => [
      { label: "Dashboard", href: `/${locale}/dashboard`, icon: "🏠" },
      { label: "Vacancies", href: `/${locale}/vacancies`, icon: "💼" },
      { label: "My Applications", href: `/${locale}/dashboard/applications`, icon: "📋" },
      { label: "Apply Form", href: `/${locale}/vacancies`, icon: "📝" },
      { label: "Notices", href: `/${locale}/notices`, icon: "📢" },
    ],
    [locale]
  );

  const isActive = (href: string) => {
    if (href === `/${locale}/vacancies`) {
      return pathname === `/${locale}/vacancies` || pathname.startsWith(`/${locale}/vacancies/`);
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push(`/${locale}/login`);
    }
  };

  const userName = user?.fullName || "Candidate";
  const userEmail = user?.email || "Guest access";

  return (
    <div className="min-h-screen bg-[#edf3f6] text-slate-800">
      <div className="flex min-h-screen">
        <aside className="hidden w-72.5 shrink-0 flex-col border-r border-[#d5e2ea] bg-white lg:flex">
          <div className="border-b border-[#d5e2ea] bg-[#f8fbfd] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#0d837f] text-lg font-bold text-white shadow-sm">
                C
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Candidate Dashboard</p>
                <p className="text-xs text-slate-400">Vacancy portal</p>
              </div>
            </div>
          </div>

          <div className="border-b border-[#d5e2ea] px-5 py-6 text-center">
            <div className="mx-auto mb-4 grid h-28 w-28 place-items-center rounded-full border-4 border-[#dbe8ee] bg-[#f4f7fa] text-[#8a8f98] shadow-inner">
              <div className="text-center text-sm font-semibold uppercase leading-tight">
                No
                <br />
                Photo
              </div>
            </div>
            <p className="text-lg font-semibold text-[#0d837f]">{userName}</p>
            <p className="mt-1 text-sm text-slate-500">{userEmail}</p>
            <p className="mt-2 text-sm font-medium text-slate-600">Roles: Candidate</p>
          </div>

          <nav className="flex-1 px-4 py-5">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-[#0d837f] text-white shadow-sm"
                        : "text-slate-700 hover:bg-[#eef7f6] hover:text-[#0d837f]"
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-[#d5e2ea] p-4">
            <div className="grid grid-cols-3 overflow-hidden rounded-md text-sm font-semibold">
              <button
                type="button"
                onClick={() => router.push(`/${locale}/dashboard/profile`)}
                className="bg-[#5da1d1] px-3 py-3 text-white transition hover:bg-[#4f90c3]"
              >
                Profile
              </button>
              <button
                type="button"
                onClick={() => router.push(`/${locale}/dashboard/change-password`)}
                className="bg-[#4f90c3] px-3 py-3 text-white transition hover:bg-[#447fb0]"
              >
                Change Password
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-[#f4a11c] px-3 py-3 text-white transition hover:bg-[#df8f10]"
              >
                Log off
              </button>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <div
              className="h-full w-72.5 bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#d5e2ea] bg-[#f8fbfd] px-4 py-4">
                <span className="font-semibold text-slate-700">Candidate Dashboard</span>
                <button type="button" onClick={() => setSidebarOpen(false)} className="text-2xl leading-none text-slate-500">
                  ×
                </button>
              </div>
              <div className="border-b border-[#d5e2ea] px-4 py-5 text-center">
                <div className="mx-auto mb-3 grid h-24 w-24 place-items-center rounded-full border-4 border-[#dbe8ee] bg-[#f4f7fa] text-sm font-semibold uppercase text-[#8a8f98]">
                  No
                  <br />
                  Photo
                </div>
                <p className="font-semibold text-[#0d837f]">{userName}</p>
                <p className="text-sm text-slate-500">{userEmail}</p>
              </div>
              <nav className="px-3 py-4">
                <div className="space-y-2">
                  {menuItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold transition ${
                          active
                            ? "bg-[#0d837f] text-white"
                            : "text-slate-700 hover:bg-[#eef7f6] hover:text-[#0d837f]"
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-[#0b8b43] bg-[#10a34d] text-white shadow-[0_4px_14px_rgba(0,0,0,0.08)]">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="grid h-10 w-10 place-items-center rounded-md bg-white/15 text-xl font-semibold transition hover:bg-white/25 lg:hidden"
                >
                  ☰
                </button>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-white/90">Candidate Section</p>
                  <p className="text-xs text-white/80">Online application system</p>
                </div>
              </div>

              <div className="relative flex items-center gap-3">
                <div className="flex items-center gap-2 border-r border-white/20 pr-3 mr-3">
                  <button
                    onClick={() => setLanguage("en")}
                    className={`transition-all font-semibold text-sm ${
                      language === "en"
                        ? "text-white underline underline-offset-2"
                        : "text-white/60 hover:text-white/90"
                    }`}
                  >
                    EN
                  </button>
                  <span className="text-white/40">|</span>
                  <button
                    onClick={() => setLanguage("ne")}
                    className={`transition-all font-semibold text-sm ${
                      language === "ne"
                        ? "text-white underline underline-offset-2"
                        : "text-white/60 hover:text-white/90"
                    }`}
                  >
                    नेपाली
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((value) => !value)}
                  className="flex items-center gap-3 rounded-full bg-white/15 px-3 py-2 text-sm font-semibold transition hover:bg-white/25"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#10a34d]">👤</span>
                  <span className="hidden sm:block">{userName}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((value) => !value)}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-lg transition hover:bg-white/25"
                >
                  ⚙
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-3 w-56 overflow-hidden rounded-lg border border-[#d5e2ea] bg-white text-slate-700 shadow-xl">
                    <div className="border-b border-[#e5edf2] px-4 py-3">
                      <p className="font-semibold text-slate-800">{userName}</p>
                      <p className="text-xs text-slate-500">{userEmail}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push(`/${locale}/dashboard/profile`)}
                      className="block w-full px-4 py-3 text-left text-sm font-medium hover:bg-[#f3f9fb]"
                    >
                      Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push(`/${locale}/dashboard/change-password`)}
                      className="block w-full px-4 py-3 text-left text-sm font-medium hover:bg-[#f3f9fb]"
                    >
                      Change Password
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full px-4 py-3 text-left text-sm font-medium text-[#d97706] hover:bg-[#fff6e8]"
                    >
                      Log off
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-x-auto px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-425">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function VacancyShell({ children }: { children: ReactNode }) {
  return (
    <VacancyLanguageProvider>
      <VacancyShellContent>{children}</VacancyShellContent>
    </VacancyLanguageProvider>
  );
}