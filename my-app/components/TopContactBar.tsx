"use client";

import Link from "next/link";
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

type NavItem = {
  label: string;
  href: string;
  hasDropdown?: boolean;
  isActive?: boolean;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/", isActive: true },
  { label: "About Us", href: "#", hasDropdown: true },
  { label: "Loans", href: "#", hasDropdown: true },
  { label: "Savings", href: "#", hasDropdown: true },
  { label: "Reports", href: "#", hasDropdown: true },
  { label: "Branches", href: "#" },
  { label: "News & Notices", href: "#", hasDropdown: true },
  { label: "Contact", href: "#" },
];

const utilityLinks = [
  { label: "Vacancy", href: "#" },
  { label: "Notices", href: "#" },
];

export function TopContactBar() {
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

  return (
    <header className="w-full">
      <div className="w-full bg-[#005d59] text-white">
        <div className="mx-auto flex h-12 w-full max-w-[1420px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-4 text-xs font-medium sm:gap-8 sm:text-sm lg:text-[17px]">
            <Link
              href={phoneLink}
              className="inline-flex items-center gap-2 transition-colors hover:text-zinc-200"
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
              <span>{phoneText}</span>
            </Link>

            <Link
              href={emailLink}
              className="inline-flex items-center gap-2 transition-colors hover:text-zinc-200"
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
              <span>{emailText}</span>
            </Link>
          </div>

          <div className="hidden items-center gap-4 text-sm lg:flex lg:text-[17px]">
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
              <Link href="#" aria-label="Twitter" className="transition-colors hover:text-zinc-200">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 4.57a9.2 9.2 0 0 1-2.63.72A4.58 4.58 0 0 0 22.4 2.8a9.12 9.12 0 0 1-2.9 1.1 4.56 4.56 0 0 0-7.76 4.16A12.94 12.94 0 0 1 2.35 3.7a4.56 4.56 0 0 0 1.41 6.09A4.52 4.52 0 0 1 1.7 9.3v.06a4.56 4.56 0 0 0 3.65 4.46c-.36.1-.74.16-1.13.16-.28 0-.55-.03-.81-.08a4.56 4.56 0 0 0 4.26 3.16A9.15 9.15 0 0 1 1 19a12.9 12.9 0 0 0 6.97 2.04c8.36 0 12.94-6.93 12.94-12.94 0-.2 0-.39-.01-.58A9.28 9.28 0 0 0 23 4.57z" />
                </svg>
              </Link>
              <Link href="#" aria-label="LinkedIn" className="transition-colors hover:text-zinc-200">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.83v1.71h.06c.53-1.01 1.84-2.08 3.79-2.08C20.41 8.63 21 11.05 21 14.2V21h-4v-5.9c0-1.41-.03-3.23-1.97-3.23-1.98 0-2.28 1.54-2.28 3.13V21H9z" />
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

      <div className="w-full bg-white shadow-[0_1px_0_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex min-h-[94px] w-full max-w-[1420px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <svg className="h-12 w-12 sm:h-14 sm:w-14" viewBox="0 0 64 64" fill="none">
              <path
                d="M31.6 58c-1.5-11.4-7.8-21.1-18.4-28.8 3.8-1.4 7.1-1.6 10-.4C31.2 32 34 41.9 31.6 58z"
                fill="#187c4f"
              />
              <path
                d="M35.1 52.2c5.8-8.3 14.1-13.2 24.9-14.9-2.4 3.3-5.1 5.7-8.2 7.1-8.1 3.8-13.9 6.2-16.7 7.8z"
                fill="#1f9d61"
              />
              <path
                d="M15.3 25.8C16.9 14.4 22.6 7.2 32.2 4c.2 4.1-.4 7.3-1.8 9.8-4.1 7.5-9.1 11.6-15.1 12z"
                fill="#4caf73"
              />
              <path
                d="M37.5 26.3c1.4-8.9 6.7-15.5 16-19.8.1 3.3-.5 6-2 8.3-4.1 6.1-8.8 10-14 11.5z"
                fill="#6fbe84"
              />
            </svg>

            <div className="leading-tight">
              <p className="text-2xl font-extrabold tracking-tight text-[#005b67] sm:text-4xl">
                CYC NEPAL
              </p>
              <p className="text-[9px] font-semibold tracking-[0.12em] text-[#3d4f5f] sm:text-[10px]">
                LAGHUBITTA BITIYA SANSTHA LTD.
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-[18px] font-medium text-zinc-800 xl:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`relative inline-flex items-center gap-1 transition-colors hover:text-[#005d59] ${
                  item.isActive ? "text-[#005d59]" : ""
                }`}
              >
                <span>{item.label}</span>
                {item.hasDropdown && (
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
                {item.isActive && (
                  <span className="absolute -bottom-[28px] left-0 right-0 mx-auto h-1 w-8 rounded-full bg-[#0d837f]" />
                )}
              </Link>
            ))}
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
              {navItems.map((item) => (
                <Link
                  key={`mobile-${item.label}`}
                  href={item.href}
                  className={`inline-flex items-center justify-between rounded-lg px-2 py-2 hover:bg-zinc-50 ${
                    item.isActive ? "text-[#005d59]" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
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
              ))}

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
    </header>
  );
}
