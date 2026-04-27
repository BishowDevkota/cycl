"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type ContactItem = {
  text: string;
  link: string;
};

type PublicContactDetails = {
  phone: ContactItem;
  email: ContactItem;
  facebook: ContactItem;
  whatsapp: ContactItem;
  location: ContactItem;
  isActive: boolean;
};

type NavChildItem = {
  label: string;
  href: string;
};

type NavItem = {
  label: string;
  href: string;
  children?: NavChildItem[];
};

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about-us",
    children: [
      { label: "Company Profile", href: "/about-us#profile" },
      { label: "Chairman Message", href: "/about-us#chairman" },
      { label: "Board of Directors", href: "/about-us#board" },
      { label: "Management Team", href: "/about-us#management" },
    ],
  },
  {
    label: "Loans",
    href: "/loans",
    children: [
      { label: "All Loan Products", href: "/loans" },
      { label: "Micro Enterprise Loan", href: "/loans/micro-enterprise-loan" },
      { label: "Agriculture Loan", href: "/loans/agriculture-loan" },
      { label: "Group Business Loan", href: "/loans/group-business-loan" },
    ],
  },
  {
    label: "Savings",
    href: "/savings",
    children: [
      { label: "All Savings Products", href: "/savings" },
      { label: "Regular Savings", href: "/savings/regular-savings" },
      { label: "Fixed Deposit", href: "/savings/fixed-deposit" },
      { label: "Recurring Savings", href: "/savings/recurring-savings" },
    ],
  },
  {
    label: "Financial Highlights",
    href: "/financial-highlights",
    children: [
      { label: "Highlights Overview", href: "/financial-highlights" },
      { label: "Annual Reports", href: "/financial-highlights/annual-reports" },
      { label: "Quarterly Reports", href: "/financial-highlights/quarterly-reports" },
    ],
  },
  {
    label: "Branches",
    href: "/branches",
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
    label: "News & Notices",
    href: "/news-notices",
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
        const response = await fetch("/api/home/contact", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as PublicContactDetails | null;
        if (isMounted) {
          setContact(data);
        }
      } catch {
        if (isMounted) {
          setContact(null);
        }
      }
    };

    void fetchContact();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const phoneText = contact?.phone.text?.trim() || "+977-1-1234567";
  const phoneLink = contact?.phone.link?.trim() || "tel:+97711234567";
  const emailText = contact?.email.text?.trim() || "info@cycnepal.com";
  const emailLink = contact?.email.link?.trim() || "mailto:info@cycnepal.com";
  const facebookText = contact?.facebook.text?.trim() || "Facebook";
  const facebookLink = contact?.facebook.link?.trim() || "#";
  const whatsappText = contact?.whatsapp.text?.trim() || "WhatsApp";
  const whatsappLink = contact?.whatsapp.link?.trim() || "#";
  const normalizePath = (href: string) => href.split("#")[0];

  const isActiveRoute = (href: string) => {
    const normalizedHref = normalizePath(href);

    if (normalizedHref === "/") {
      return pathname === "/";
    }

    return (
      pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`)
    );
  };

  const isNavItemActive = (item: NavItem) => {
    return (
      isActiveRoute(item.href) ||
      Boolean(item.children?.some((child) => isActiveRoute(child.href)))
    );
  };

  return (
    <>
      <div className="relative w-full pt-12">
      <div className="absolute inset-x-0 top-0 z-20 w-full bg-[#005d59] text-white">
        <div className="mx-auto flex h-12 w-full max-w-[1420px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-3 text-[11px] font-medium sm:gap-6 sm:text-sm lg:text-base">
            <Link
              href={phoneLink}
              className="inline-flex min-w-0 items-center gap-2 transition-colors hover:text-zinc-200"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.62a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6.27 6.27l1.28-1.28a2 2 0 0 1 2.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className="max-w-[34vw] truncate sm:max-w-none">{phoneText}</span>
            </Link>

            <Link
              href={emailLink}
              className="inline-flex min-w-0 items-center gap-2 transition-colors hover:text-zinc-200"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <span className="max-w-[34vw] truncate sm:max-w-none">{emailText}</span>
            </Link>
          </div>

          <div className="hidden items-center gap-4 text-sm lg:flex lg:text-base">
            {utilityLinks.map((link, index) => (
              <div key={link.label} className="flex items-center gap-4">
                {index > 0 && <span className="h-5 w-px bg-white/40" aria-hidden="true" />}
                <Link href={link.href} className="transition-colors hover:text-zinc-200">
                  {link.label}
                </Link>
              </div>
            ))}

            <span className="h-5 w-px bg-white/40" aria-hidden="true" />

            <div className="flex items-center gap-4 text-white">
              <Link
                href={facebookLink}
                aria-label={facebookText}
                title={facebookText}
                className="transition-colors hover:text-zinc-200"
                target="_blank"
                rel="noreferrer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.93v-8.43H7.08v-3.5h3.05V9.41c0-3.01 1.78-4.69 4.51-4.69 1.31 0 2.68.24 2.68.24v2.95h-1.52c-1.5 0-1.96.93-1.96 1.89v2.27h3.33l-.53 3.5h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
                </svg>
              </Link>
              <Link
                href={whatsappLink}
                aria-label={whatsappText}
                title={whatsappText}
                className="transition-colors hover:text-zinc-200"
                target="_blank"
                rel="noreferrer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.78-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
                  <path d="M12.04 2C6.5 2 2 6.5 2 12.04c0 1.93.55 3.79 1.58 5.39L2 22l4.7-1.54a10.02 10.02 0 0 0 5.34 1.55h.01c5.54 0 10.04-4.5 10.04-10.04A10.03 10.03 0 0 0 12.04 2zm0 18.28h-.01a8.24 8.24 0 0 1-4.2-1.15l-.3-.18-2.79.91.91-2.72-.2-.31a8.24 8.24 0 1 1 6.59 3.45z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      </div>

      <div className="sticky top-0 z-70 w-full border-b border-zinc-200/80 bg-white shadow-[0_8px_22px_rgba(7,100,110,0.12)]">
        <div className="mx-auto flex min-h-[88px] w-full max-w-[1420px] items-center justify-between gap-3 px-4 sm:min-h-[94px] sm:px-6 lg:px-10">
          <Link href="/" className="flex min-w-0 flex-shrink-0 items-center">
            <Image
              src="/cyc-logo.jpg"
              alt="Cyc Nepal Laghubitta Bittiya Sanstha Ltd."
              width={1024}
              height={250}
              priority
              className="h-9 w-auto max-w-[62vw] sm:h-11 sm:max-w-[60vw] lg:h-[56px] lg:max-w-[46vw] xl:h-[64px] xl:max-w-[38vw]"
            />
          </Link>

          <nav className="hidden flex-1 items-center justify-between px-4 text-[15px] font-semibold text-zinc-800 xl:flex 2xl:px-8 2xl:text-[16px]">
            {navItems.map((item) => {
              const isActive = isNavItemActive(item);
              const hasDropdown = Boolean(item.children?.length);

              return (
                <div key={item.label} className="group relative">
                  <Link
                    href={item.href}
                    className={`relative inline-flex items-center gap-1 py-1 font-semibold transition-colors duration-200 ${
                      isActive ? "text-[#005d59]" : "text-zinc-800 hover:text-[#005d59]"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="relative inline-block pb-1">
                      {item.label}
                      <span
                        className={`absolute -bottom-1 left-0 h-1 rounded-full bg-[#0d837f] transition-all duration-300 ease-out ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </span>
                    {hasDropdown && (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    )}
                  </Link>

                  {hasDropdown && (
                    <div className="pointer-events-none absolute left-1/2 top-full z-[90] w-72 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                      <div className="overflow-hidden rounded-2xl border border-[#d8e6ee] bg-white p-2 shadow-[0_24px_36px_rgba(6,61,73,0.2)]">
                        {item.children?.map((child) => {
                          const isChildActive = isActiveRoute(child.href);

                          return (
                            <Link
                              key={`${item.label}-${child.href}`}
                              href={child.href}
                              className={`block rounded-xl px-3 py-2 text-sm transition ${
                                isChildActive
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

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full border border-zinc-300 text-zinc-700 transition-colors hover:text-[#005d59] sm:h-12 sm:w-12"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>

            <Link
              href="#"
              className="hidden rounded-xl bg-gradient-to-r from-[#047886] to-[#0e8c9f] px-6 py-3 text-base font-semibold text-white shadow-[0_8px_18px_rgba(7,100,110,0.28)] transition hover:brightness-105 sm:inline-block"
            >
              Apply Now
            </Link>

            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
              className="grid h-10 w-10 place-items-center rounded-lg border border-zinc-300 text-zinc-700 xl:hidden"
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12h16" />
                  <path d="M4 6h16" />
                  <path d="M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-zinc-200 px-4 py-4 xl:hidden">
            <div className="mx-auto flex w-full max-w-[1420px] flex-col gap-4 text-base font-medium text-zinc-800">
              {navItems.map((item) => {
                const isActive = isNavItemActive(item);

                return (
                  <div
                    key={`mobile-${item.label}`}
                    className="rounded-xl border border-zinc-200/80 bg-white/75 p-2"
                  >
                    <Link
                      href={item.href}
                      className={`inline-flex w-full items-center justify-between rounded-lg px-2 py-2 ${
                        isActive ? "text-[#005d59]" : ""
                      }`}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{item.label}</span>
                      {item.children?.length ? (
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      ) : null}
                    </Link>

                    {item.children?.length ? (
                      <div className="mt-1 border-t border-zinc-200/80 pt-2">
                        {item.children.map((child) => {
                          const isChildActive = isActiveRoute(child.href);

                          return (
                            <Link
                              key={`mobile-child-${item.label}-${child.href}`}
                              href={child.href}
                              className={`block rounded-lg px-2 py-1.5 text-sm ${
                                isChildActive
                                  ? "font-semibold text-[#0d837f]"
                                  : "text-zinc-700"
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}

              <Link
                href="#"
                className="inline-flex justify-center rounded-xl bg-gradient-to-r from-[#047886] to-[#0e8c9f] px-5 py-3 font-semibold text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Apply Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
