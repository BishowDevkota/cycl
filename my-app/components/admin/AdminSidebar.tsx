"use client";

import Link from "next/link";
import Image from "next/image";
import { FiHome, FiGrid, FiBriefcase } from "react-icons/fi";

export default function AdminSidebar() {
  const palette = {
    deep: "#005B5C",
    teal: "#007A8E",
    mint: "#A8D8B9",
    sand: "#F0E5D8",
    off: "#F9F9F9",
  };

  return (
    <aside
      style={{ background: palette.deep }}
      className="w-64 shrink-0 min-h-screen text-white"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
          <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white/10">
            <Image src="/cyc-logo.jpg" alt="logo" fill style={{ objectFit: "cover" }} />
          </div>
          <div>
            <p className="text-sm font-semibold">Admin</p>
            <p className="text-xs opacity-80">Andrew Bennet</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-2 py-6">
          <Link
            href="/admin"
            className="group flex items-center gap-3 rounded-md px-4 py-2 text-sm hover:bg-white/10"
          >
            <span className="text-lg text-white/95">
              <FiGrid />
            </span>
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/home"
            className="group flex items-center gap-3 rounded-md px-4 py-2 text-sm hover:bg-white/10"
          >
            <span className="text-lg text-white/95">
              <FiHome />
            </span>
            <span>Home</span>
          </Link>

          <Link href={`/admin/vacancies/${}`} className="group flex items-center gap-3 rounded-md px-4 py-2 text-sm hover:bg-white/10">
            <span className="text-lg text-white/95">
              <FiBriefcase />
            </span>
            <span>Vacancies</span>
          </Link>
        </nav>

        <div className="mt-auto border-t border-white/10 px-6 py-4 text-xs opacity-90">
          <p>© {new Date().getFullYear()} Cycl</p>
        </div>
      </div>
    </aside>
  );
}

