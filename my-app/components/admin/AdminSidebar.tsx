"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import {
  FiBarChart2, FiBell, FiBriefcase, FiChevronRight,
  FiGrid, FiHome, FiImage, FiInfo, FiPhone, FiServer, FiUser,
} from "react-icons/fi";

const overviewLinks = [
  { href: "/admin", label: "Dashboard", icon: FiGrid },
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
  const [expanded, setExpanded] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const isHomeActive =
    isActive("/admin/home") || contentLinks.some(({ href }) => isActive(href));

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setExpanded(false), 100);
  };

  return (
    <aside
      style={{ background: "#005B5C" }}
      className="w-full shrink-0 text-white md:sticky md:top-0 md:min-h-screen md:w-72"
    >
      <div className="flex h-full max-h-screen flex-col overflow-y-auto">
        {/* Logo */}
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
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50 mb-2">
              Overview
            </p>

            <div className="flex flex-col gap-1">
              {/* Home row + inline submenu */}
              <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <Link
                  href="/admin/home"
                  className={`flex items-center gap-3 border-l-4 px-4 py-2 text-sm font-semibold transition ${
                    isHomeActive || expanded
                      ? "border-[#f5ad4a] bg-white/15 text-white"
                      : "border-transparent text-white/90 hover:border-[#bcd7e2] hover:bg-white/10"
                  }`}
                >
                  <FiHome className="text-lg text-white/95 shrink-0" />
                  <span>Home</span>
                  <FiChevronRight
                    className={`ml-auto text-white/40 transition-transform duration-200 ${
                      expanded ? "rotate-90" : ""
                    }`}
                  />
                </Link>

                {/* Inline submenu */}
                <div
                  className="overflow-hidden transition-all duration-200 ease-in-out"
                  style={{ maxHeight: expanded ? `${contentLinks.length * 40}px` : "0px" }}
                >
                  <div className="mt-1 flex flex-col gap-0.5 border-l-4 border-[#f5ad4a]">
                    {contentLinks.map(({ href, label, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-3 pl-10 pr-4 py-2 text-xs font-semibold transition ${
                          isActive(href)
                            ? "bg-white/15 text-white"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <Icon className="shrink-0 opacity-80" size={13} />
                        <span>{label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dashboard & Vacancies */}
              {overviewLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 border-l-4 px-4 py-2 text-sm font-semibold transition ${
                    isActive(href)
                      ? "border-[#f5ad4a] bg-white/15 text-white"
                      : "border-transparent text-white/90 hover:border-[#bcd7e2] hover:bg-white/10"
                  }`}
                >
                  <Icon className="text-lg text-white/95" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="mt-auto border-t border-white/10 px-6 py-4 text-xs opacity-60">
          <p>© {new Date().getFullYear()} Cycl</p>
        </div>
      </div>
    </aside>
  );
}