import Link from "next/link";
import { SectionHeading } from "@/components/public/SectionHeading";

type LoanPageKey =
  | "overview"
  | "loan-categories"
  | "emi-calculator"
  | "loan-interest-calculator";

type LoanPageLinksProps = {
  currentPage: LoanPageKey;
};

const pages: Array<{
  key: LoanPageKey;
  label: string;
  href: string;
  description: string;
}> = [
  {
    key: "overview",
    label: "Loans Overview",
    href: "/loans",
    description: "Parent page with loan highlights and quick navigation.",
  },
  {
    key: "loan-categories",
    label: "Loan Categories",
    href: "/loans/loan-categories",
    description: "Loan type listing with interest rates.",
  },
  {
    key: "emi-calculator",
    label: "EMI Calculator",
    href: "/loans/emi-calculator",
    description: "Estimate monthly EMI and total payment.",
  },
  {
    key: "loan-interest-calculator",
    label: "Loan Interest Calculator",
    href: "/loans/loan-interest-calculator",
    description: "Estimate total interest and total payable amount.",
  },
];

export function LoanPageLinks({ currentPage }: LoanPageLinksProps) {
  return (
    <section className="mt-8 rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
      <SectionHeading
        eyebrow="Loan Pages"
        title="Loan Details and Tools"
        description="Navigate between loan categories, EMI calculator, and loan interest calculator pages."
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
