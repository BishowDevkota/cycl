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
    <section className="mt-8 rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
      <SectionHeading
        eyebrow="About Us Pages"
        title="Explore All Four About Us Pages"
        description="Navigate between Introduction, Chairman Message, Board of Directors, and Management Team."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pages.map((page) => {
          const isCurrent = page.key === currentPage;

          return (
            <Link
              key={page.key}
              href={page.href}
              aria-current={isCurrent ? "page" : undefined}
              className={`rounded-2xl border p-5 transition ${
                isCurrent
                  ? "border-[#0d837f]/40 bg-[#eefaf8]"
                  : "border-[#d7e6ee] bg-[#f9fcfe] hover:-translate-y-0.5 hover:border-[#0d837f]/40"
              }`}
            >
              <h3 className="text-base font-semibold text-[#123451]">{page.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{page.description}</p>
              <span
                className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${
                  isCurrent
                    ? "bg-[#0d837f] text-white"
                    : "bg-white text-[#0d837f]"
                }`}
              >
                {isCurrent ? "Current" : "Open"}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
