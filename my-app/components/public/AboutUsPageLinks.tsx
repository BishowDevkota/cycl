import Link from "next/link";
import { SectionHeading } from "@/components/public/SectionHeading";

type AboutUsPageKey =
  | "introduction"
  | "chairman-message"
  | "board-of-directors"
  | "management-team";

type AboutUsPageLinksProps = {
  currentPage: AboutUsPageKey;
};

const pages: Array<{
  key: AboutUsPageKey;
  label: string;
  href: string;
  description: string;
}> = [
  {
    key: "introduction",
    label: "Introduction",
    href: "/about-us",
    description:
      "Institutional profile, mission, vision, and strategic focus areas.",
  },
  {
    key: "chairman-message",
    label: "Chairman Message",
    href: "/about-us/chairman-message",
    description:
      "Chairman perspective on governance, inclusion, and long-term growth.",
  },
  {
    key: "board-of-directors",
    label: "Board of Directors",
    href: "/about-us/board-of-directors",
    description:
      "Profiles of board members guiding policy and institutional oversight.",
  },
  {
    key: "management-team",
    label: "Management Team",
    href: "/about-us/management-team",
    description:
      "Operational leadership responsible for execution and service quality.",
  },
];

export function AboutUsPageLinks({ currentPage }: AboutUsPageLinksProps) {
  return (
    <section className="mt-8 rounded-3xl  bg-white p-6  sm:p-8">
      <SectionHeading
        eyebrow="About Us Pages"
        title="Explore All Four About Us Pages"
        description={
          <>
            Navigate between <span className="font-bold text-[18px]">Introduction</span>,{' '}
            <span className="font-bold text-[18px]">Chairman Message</span>,{' '}
            <span className="font-bold text-[18px]">Board of Directors</span>, and{' '}
            <span className="font-bold text-[18px]">Management Team</span> pages.
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pages.map((page) => {
          const isCurrent = page.key === currentPage;

          return (
            <Link
              key={page.key}
              href={page.href}
              aria-current={isCurrent ? 'page' : undefined}
              className={` shadow-[0_4px_10px_rgba(12,49,72,0.1)] p-5 transition ${
                isCurrent
                  ? 'border-[#0d837f]/40 bg-[#0d837f]'
                  : 'border-[#d7e6ee] bg-[#f9fcfe] hover:-translate-y-1 hover:border-[#0d837f]/40'
              }`}
            >
              <h3 className={`text-lg font-semibold text-[#123451] ${isCurrent ? 'text-white' : ''}`}>{page.label}</h3>
              <p className={`mt-2 text-[16px] leading-6 text-slate-600 ${isCurrent ? 'text-white' : ''}`}>{page.description}</p>
              <span
                className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${
                  isCurrent ? 'bg-white text-[#0d837f]' : 'bg-white text-[#0d837f]'
                }`}
              >
                {isCurrent ? 'Current' : 'Open'}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
