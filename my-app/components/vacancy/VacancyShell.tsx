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
      { label: "ड्यासबोर्ड", href: `/${locale}/dashboard`, icon: "🏠" },
      { label: "रिक्तिहरू", href: `/${locale}/vacancies`, icon: "💼" },
      { label: "मेरो आवेदनहरू", href: `/${locale}/dashboard/applications`, icon: "📋" },
      { label: "आवेदन फाराम", href: `/${locale}/vacancies`, icon: "📝" },
      { label: "सूचनाहरू", href: `/${locale}/notices`, icon: "📢" },
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

  const hasUser = Boolean(user);
  const userName = user?.fullName || "उम्मेदवार";
  const userEmail = user?.email || "अतिथि पहुँच";

  return (
    <div className="min-h-screen bg-[#edf3f6] text-slate-800">
      <div className="flex min-h-screen">
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-[#0b8b43] bg-[#10a34d] text-white shadow-[0_4px_14px_rgba(0,0,0,0.08)]">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-white/90">उम्मेदवार खण्ड</p>
                  <p className="text-xs text-white/80">अनलाइन आवेदन प्रणाली</p>
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
                {hasUser ? (
                  <>
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
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => router.push(`/${locale}/login`)}
                    className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold transition hover:bg-white/25"
                  >
                    लगइन गर्नुहोस्
                  </button>
                )}

                {profileMenuOpen && hasUser && (
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
                      प्रोफाइल
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push(`/${locale}/dashboard/change-password`)}
                      className="block w-full px-4 py-3 text-left text-sm font-medium hover:bg-[#f3f9fb]"
                    >
                      पासवर्ड परिवर्तन
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full px-4 py-3 text-left text-sm font-medium text-[#d97706] hover:bg-[#fff6e8]"
                    >
                      लगआउट
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