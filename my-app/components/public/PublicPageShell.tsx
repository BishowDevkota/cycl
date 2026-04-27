import { Footer } from "@/components/Footer";
import Link from "next/link";
import type { ReactNode } from "react";

type ActionLink = {
  label: string;
  href: string;
};

type PublicPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  actions?: ActionLink[];
};

export function PublicPageShell({
  eyebrow,
  title,
  description,
  actions = [],
  children,
}: PublicPageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(180deg,#f8fcff_0%,#ffffff_34%,#f4f7fb_100%)]">
      <header className="relative overflow-hidden border-b border-[#d6e6ed] bg-[linear-gradient(160deg,#005d59_0%,#0f7f7a_52%,#3a8b98_100%)] text-white">
        <div
          className="pointer-events-none absolute -left-28 top-0 h-72 w-72 rounded-full bg-[#f5ad4a]/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-14 -right-14 h-56 w-56 rounded-full bg-white/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ffe6c2]">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.8rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#ecf9f8] sm:text-lg">
            {description}
          </p>

          {actions.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {actions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="inline-flex items-center rounded-full border border-white/45 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/20"
                >
                  {action.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 py-10 sm:py-12 lg:py-14">
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
