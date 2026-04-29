import { Footer } from "@/components/Footer";
import Link from "next/link";
import type { ReactNode } from "react";

type ActionLink = {
  label: string;
  href: string;
};

type PublicPageShellProps = {
  eyebrow?: string;
  imageUrl: string;
  title: string;
  description: string;
  children: ReactNode;
  actions?: ActionLink[];
};

export function PublicPageShell({
  imageUrl = "/banner/banner.jpg",
  title,
  description,
  actions = [],
  children,
}: PublicPageShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
     <header 
  className="relative overflow-hidden border-b border-[#d6e6ed] text-black bg-cover bg-center bg-no-repeat  " 
  style={{ backgroundImage: `url(${imageUrl})`}}
>
  {/* 1. Background Overlay: This ensures text is readable over the image icons */}
  <div className="absolute inset-0 bg-[#123451]/60 backdrop-blur-[1px]" aria-hidden="true" />

  {/* Existing Decorative Blur Circles */}
  <div
    className="pointer-events-none absolute -left-28 top-0 h-72 w-72 rounded-full bg-[#f5ad4a]/20 blur-3xl"
    aria-hidden="true"
  />
  <div
    className="pointer-events-none absolute -bottom-14 -right-14 h-56 w-56 rounded-full bg-white/20 blur-3xl"
    aria-hidden="true"
  />

  {/* Content Container: Added 'relative z-10' to stay above the background/overlay */}
  <div className="relative  z-10 mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
 
    <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-5xl lg:text-[3rem]">
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
            className="inline-flex items-center bg-[#016163] px-5 py-2.5 text-lg font-semibold rounded-sm text-white transition hover:-translate-y-0.5  hover:bg-[#0d837f]"
          >
            {action.label}
          </Link>
        ))}
      </div>
    )}
  </div>
</header>

      <main className="flex-1 py-6 sm:py-8 lg:py-10">
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
