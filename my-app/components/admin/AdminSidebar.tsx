"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FiBarChart2,
  FiBell,
  FiBriefcase,
  FiGrid,
  FiHome,
  FiImage,
  FiInfo,
  FiPhone,
  FiServer,
  FiUser,
} from "react-icons/fi";

const overviewLinks = [
  { href: "/admin", label: "Dashboard", icon: FiGrid },
  { href: "/admin/home", label: "Home", icon: FiHome },
  { href: "/admin/vacancies", label: "Vacancies", icon: FiBriefcase },
];

const contentLinks = [
  { href: "/admin/home/hero", label: "Hero Section", icon: FiImage },
  { href: "/admin/home/contact", label: "Contact Details", icon: FiPhone },
  { href: "/admin/home/about-company-info", label: "About Company Info", icon: FiInfo },
  { href: "/admin/home/message-from-ceo", label: "Message From CEO", icon: FiUser },
  { href: "/admin/home/company-stats", label: "Company Stats", icon: FiBarChart2 },
  { href: "/admin/home/notices", label: "Home Notices", icon: FiBell },
  { href: "/admin/home/services", label: "Services Cards", icon: FiServer },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const palette = {
    deep: "#005B5C",
    teal: "#007A8E",
    mint: "#A8D8B9",
    sand: "#F0E5D8",
    off: "#F9F9F9",
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside
      style={{ background: palette.deep }}
      className="w-full shrink-0 text-white md:sticky md:top-0 md:min-h-screen md:w-80"
    >
      <div className="flex h-full max-h-screen flex-col overflow-y-auto">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
          <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white/10">
            <Image src="/cyc-logo.jpg" alt="logo" fill style={{ objectFit: "cover" }} />
          </div>
          <div>
            <p className="text-sm font-semibold">Admin</p>
            <p className="text-xs opacity-80">Andrew Bennet</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-6 px-3 py-6">
          <div>
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              Overview
            </p>
            <div className="mt-2 flex flex-col gap-1">
              {overviewLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={`${href}-${label}`}
                  href={href}
                  className={`group flex items-center gap-3 border-l-4 px-4 py-2 text-sm transition ${
                    isActive(href)
                      ? "border-[#f5ad4a] bg-white/15 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                      : "border-transparent text-white/90 hover:border-[#bcd7e2] hover:bg-white/10"
                  }`}
                >
                  <span className="text-lg text-white/95">
                    <Icon />
                  </span>
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              Homepage Content
            </p>
            <div className="mt-2 flex flex-col gap-1">
              {contentLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`group flex items-center gap-3 border-l-4 px-4 py-2 text-sm transition ${
                    isActive(href)
                      ? "border-[#f5ad4a] bg-white/15 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                      : "border-transparent text-white/90 hover:border-[#bcd7e2] hover:bg-white/10"
                  }`}
                >
                  <span className="text-lg text-white/95">
                    <Icon />
                  </span>
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="mt-auto border-t border-white/10 px-6 py-4 text-xs opacity-90">
          <p>© {new Date().getFullYear()} Cycl</p>
        </div>
      </div>
    </aside>
  );
}

