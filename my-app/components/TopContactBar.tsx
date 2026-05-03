"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { branchData } from "@/lib/branch-data";
import { useTranslations } from "next-intl";
import { HiOutlineTranslate } from "react-icons/hi";
import { MdLanguage } from "react-icons/md";

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
      { label: "Base Rate", href: "/financial-highlights/base-rate" },
    ],
  },
  {
    label: "Branches",
    href: "/branches/koshi",
    children: [
      { label: "Koshi Province", href: "/branches/koshi" },
      { label: "Madesh Province", href: "/branches/madesh" },
      { label: "Bagmati Province", href: "/branches/bagmati" },
      { label: "Gandaki Province", href: "/branches/gandaki" },
      { label: "Lumbini Province", href: "/branches/lumbini" },
      { label: "Karnali Province", href: "/branches/karnali" },
      { label: "Sudurpaschim Province", href: "/branches/sudurpaschim" },
    ]
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
  { label: "Vacancy", href: "/vacancies" },
  { label: "Notices", href: "/notices" },
];

const row = "mx-auto flex w-full max-w-screen-2xl items-center justify-between px-6 xl:px-10";

export function TopContactBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contact, setContact] = useState<PublicContactDetails | null>(null);

  const currentLocale = pathname.split("/")[1] || "en";

  const handleLanguageChange = (newLocale: string) => {
    const pathParts = pathname.split("/");
    pathParts[1] = newLocale;
    router.push(pathParts.join("/"));
  };

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
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "") || "/";
    if (normalizedHref === "/") return pathWithoutLocale === "/";
    return pathWithoutLocale === normalizedHref || pathWithoutLocale.startsWith(`${normalizedHref}/`);
  };

  const isNavItemActive = (item: NavItem) =>
    isActiveRoute(item.href) || Boolean(item.children?.some((child) => isActiveRoute(child.href)));

  return (
    <>
      {/* Top Utility Bar */}
      <div className="w-full bg-[#005d59] text-white">
        <div className={`${row} h-12`}>
          <div className="flex min-w-0 items-center gap-6 text-sm font-medium sm:text-base">
            <Link href={phoneLink} className="inline-flex min-w-0 items-center gap-2 hover:text-zinc-200">
              <span>{phoneText}</span>
            </Link>
            <Link href={emailLink} className="inline-flex min-w-0 items-center gap-2 hover:text-zinc-200">
              <span>{emailText}</span>
            </Link>
          </div>

          <div className="flex items-center gap-6 text-sm lg:text-base">
            {/* Language Switcher - Desktop */}
            <div className="hidden items-center gap-2 lg:flex border-r border-white/20 pr-6 mr-1">
              <HiOutlineTranslate className="h-5 w-5 text-white/80" />
              <button
                onClick={() => handleLanguageChange('en')}
                className={`transition-opacity ${currentLocale === 'en' ? 'font-bold underline underline-offset-4' : 'opacity-70 hover:opacity-100'}`}
              >
                EN
              </button>
              <span className="opacity-40">|</span>
              <button
                onClick={() => handleLanguageChange('ne')}
                className={`transition-opacity ${currentLocale === 'ne' ? 'font-bold underline underline-offset-4' : 'opacity-70 hover:opacity-100'}`}
              >
                नेपाली
              </button>
            </div>

            {utilityLinks.map((link, index) => (
              <div key={link.label} className="hidden items-center gap-6 lg:flex">
                <span className="h-5 w-px bg-white/40" />
                <Link href={link.href} className="hover:text-zinc-200">{link.label}</Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white shadow-[0_8px_22px_rgba(7,100,110,0.12)]">
        <div className={`${row} min-h-20`}>
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

          <div className="hidden items-center gap-x-8 xl:flex 2xl:gap-x-10 ml-10 2xl:ml-16">
            <nav className="flex items-center gap-x-8 whitespace-nowrap text-base font-semibold text-zinc-800 2xl:gap-x-10">
              {navItems.map((item) => {
                const isActive = isNavItemActive(item);
                const hasDropdown = Boolean(item.children?.length);
                return (
                  <div key={item.label} className="group relative">
                    <Link
                      href={item.href}
                      className={`relative inline-flex items-center gap-1 py-2 font-semibold transition-colors duration-200 ${
                        isActive ? "text-[#005d59]" : "text-zinc-800 hover:text-[#005d59]"
                      }`}
                    >
                      <span className="relative inline-block pb-1">
                        {item.label}
                        <span className={`absolute -bottom-1 left-0 h-1 bg-[#0d837f] transition-all duration-300 ease-out ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`} />
                      </span>
                      {hasDropdown && (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      )}
                    </Link>

                    {hasDropdown && (
                      <div className="pointer-events-none absolute left-1/2 top-full z-90 w-72 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                        <div className="overflow-hidden border border-[#d8e6ee] bg-white p-2 shadow-[0_24px_36px_rgba(6,61,73,0.2)]">
                          {item.children?.map((child) => {
                            const childIsActive = isActiveRoute(child.href);
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={`block px-4 py-3 text-base transition ${
                                  childIsActive
                                    ? "bg-[#e8f7f4] font-semibold text-[#0d837f]"
                                    : "text-slate-700 hover:bg-[#f5fafc]"
                                }`}
                              >
                                {child.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <Link
              href="/vacancies"
              className="shrink-0 rounded-lg px-5 py-2.5 text-base font-semibold text-white transition-opacity duration-200 hover:opacity-90"
              style={{ backgroundColor: "#005b5c" }}
            >
              Career
            </Link>
          </div>

          {/* Mobile Actions: Language + Menu */}
          <div className="flex items-center gap-4 xl:hidden">
            <button
              onClick={() => handleLanguageChange(currentLocale === 'en' ? 'ne' : 'en')}
              className="flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-700"
            >
              <MdLanguage className="h-4 w-4 text-[#005d59]" />
              {currentLocale === 'en' ? 'NE' : 'EN'}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-zinc-300 text-zinc-700"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-zinc-200 px-6 py-4 xl:hidden">
            <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-4 text-lg font-medium text-zinc-800">
              {navItems.map((item) => (
                <div key={item.label} className="rounded-xl border border-zinc-200/80 bg-white/75 p-3">
                  <div className="flex flex-col gap-2">
                    <Link
                      href={item.href}
                      className="inline-flex w-full items-center justify-between rounded-lg px-2 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {item.children?.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="ml-4 block rounded px-2 py-2 text-base font-medium text-zinc-700 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <Link
                href="/vacancies"
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