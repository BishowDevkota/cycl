"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type ContactItem = { text: string; link: string; };
type PublicContactDetails = {
  phone: ContactItem; email: ContactItem; facebook: ContactItem;
  whatsapp: ContactItem; location: ContactItem; isActive: boolean;
};
type NavChildItem = { label: string; href: string; };
type NavItem = { label: string; href: string; children?: NavChildItem[]; };

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us", href: "/about-us",
    children: [
      { label: "Introduction", href: "/about-us" },
      { label: "Chairman Message", href: "/about-us/chairman-message" },
      { label: "Board of Directors", href: "/about-us/board-of-directors" },
      { label: "Management Team", href: "/about-us/management-team" },
    ],
  },
  {
    label: "Loans", href: "/loans",
    children: [
      { label: "Loan Categories", href: "/loans/loan-categories" },
      { label: "EMI Calculator", href: "/loans/emi-calculator" },
      { label: "Loan Interest Calculator", href: "/loans/loan-interest-calculator" },
    ],
  },
  { label: "Savings", href: "/savings" },
  {
    label: "Financial Highlights", href: "/financial-highlights",
    children: [
      { label: "Highlights Overview", href: "/financial-highlights" },
      { label: "Annual Reports", href: "/financial-highlights/annual-reports" },
      { label: "Quarterly Reports", href: "/financial-highlights/quarterly-reports" },
    ],
  },
  {
    label: "Branches", href: "/branches",
    children: [
      { label: "All Branches", href: "/branches" },
      { label: "Koshi Province", href: "/branches#koshi" },
      { label: "Madhesh Province", href: "/branches#madhesh" },
      { label: "Bagmati Province", href: "/branches#bagmati" },
      { label: "Gandaki Province", href: "/branches#gandaki" },
      { label: "Lumbini Province", href: "/branches#lumbini" },
      { label: "Karnali Province", href: "/branches#karnali" },
      { label: "Sudurpashchim Province", href: "/branches#sudurpashchim" },
    ],
  },
  {
    label: "News & Notices", href: "/news-notices",
    children: [
      { label: "Information Center", href: "/news-notices" },
      { label: "News", href: "/news" },
      { label: "Notices", href: "/notices" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

const utilityLinks = [
  { label: "Vacancy", href: "#" },
  { label: "Notices", href: "#" },
];

export function TopContactBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contact, setContact] = useState<PublicContactDetails | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchContact = async () => {
      try {
        const response = await fetch("/api/home/contact", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as PublicContactDetails | null;
        if (isMounted) setContact(data);
      } catch {
        if (isMounted) setContact(null);
      }
    };
    void fetchContact();
    return () => { isMounted = false; };
  }, []);

  const phoneText = contact?.phone.text?.trim() || "+977-1-1234567";
  const phoneLink = contact?.phone.link?.trim() || "tel:+97711234567";
  const emailText = contact?.email.text?.trim() || "info@cycnepal.com";
  const emailLink = contact?.email.link?.trim() || "mailto:info@cycnepal.com";

  const normalizePath = (href: string) => href.split("#")[0];
  const isActiveRoute = (href: string) => {
    const normalizedHref = normalizePath(href);
    if (normalizedHref === "/") return pathname === "/";
    return pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`);
  };
  const isNavItemActive = (item: NavItem) =>
    isActiveRoute(item.href) || Boolean(item.children?.some((child) => isActiveRoute(child.href)));

  return (
    <>
      {/* Top Utility Bar — scrolls away with the page */}
      <div className="w-full bg-[#005d59] text-white">
        <div className="mx-auto flex h-12 w-full max-w-350 items-center justify-between px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-6 text-sm font-medium sm:text-base">
            <Link href={phoneLink} className="inline-flex min-w-0 items-center gap-2 hover:text-zinc-200">
              <span>{phoneText}</span>
            </Link>
            <Link href={emailLink} className="inline-flex min-w-0 items-center gap-2 hover:text-zinc-200">
              <span>{emailText}</span>
            </Link>
          </div>
          <div className="hidden items-center gap-6 text-sm lg:flex lg:text-base">
            {utilityLinks.map((link, index) => (
              <div key={link.label} className="flex items-center gap-6">
                {index > 0 && <span className="h-5 w-px bg-white/40" />}
                <Link href={link.href} className="hover:text-zinc-200">{link.label}</Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navbar — sticky to viewport top at all times */}
      <div className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white shadow-[0_8px_22px_rgba(7,100,110,0.12)]">
        <div className="mx-auto flex min-h-20 w-full max-w-350 items-center justify-between px-4 md:px-6">

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/cyc-logo.jpg"
              alt="Logo"
              width={400}
              height={150}
              priority
              className="h-10 w-auto lg:h-14"
            />
          </Link>

          {/* Navigation Links + Career Button — explicit left margin separates from logo */}
          <div className="hidden items-center gap-x-8 xl:flex 2xl:gap-x-10 ml-14 2xl:ml-20">
            <nav className="flex items-center gap-x-8 whitespace-nowrap text-base font-semibold text-zinc-800 2xl:gap-x-10">
              {navItems.map((item) => {
                const isActive = isNavItemActive(item);
                const hasDropdown = Boolean(item.children?.length);
                return (
                  <div key={item.label} className="group relative">
                    <Link
                      href={item.href}
                      className={`relative inline-flex items-center gap-1 py-2 font-semibold transition-colors duration-200 ${isActive ? "text-[#005d59]" : "text-zinc-800 hover:text-[#005d59]"}`}
                    >
                      <span className="relative inline-block pb-1">
                        {item.label}
                        <span className={`absolute -bottom-1 left-0 h-1 rounded-full bg-[#0d837f] transition-all duration-300 ease-out ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                      </span>
                      {hasDropdown && (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      )}
                    </Link>

                    {/* Dropdown Menu */}
                    {hasDropdown && (
                      <div className="pointer-events-none absolute left-1/2 top-full z-90 w-72 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                        <div className="overflow-hidden rounded-2xl border border-[#d8e6ee] bg-white p-2 shadow-[0_24px_36px_rgba(6,61,73,0.2)]">
                          {item.children?.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`block rounded-xl px-4 py-3 text-base transition ${isActiveRoute(child.href) ? "bg-[#e8f7f4] font-semibold text-[#0d837f]" : "text-slate-700 hover:bg-[#f5fafc]"}`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Career Button */}
            <Link
              href="/career"
              className="shrink-0 rounded-lg px-5 py-2.5 text-base font-semibold text-white transition-opacity duration-200 hover:opacity-90"
              style={{ backgroundColor: "#005b5c" }}
            >
              Career
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center xl:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-zinc-300 text-zinc-700"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-zinc-200 px-4 py-4 xl:hidden md:px-6">
            <div className="mx-auto flex w-full max-w-350 flex-col gap-4 text-lg font-medium text-zinc-800">
              {navItems.map((item) => (
                <div key={item.label} className="rounded-xl border border-zinc-200/80 bg-white/75 p-3">
                  <Link
                    href={item.href}
                    className="inline-flex w-full items-center justify-between rounded-lg px-2 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}

              {/* Career Button — Mobile */}
              <Link
                href="/career"
                className="rounded-xl px-4 py-3 text-base font-semibold text-white text-center transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#005b5c" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Career
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}