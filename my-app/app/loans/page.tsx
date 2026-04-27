import { LoanCategoriesTable } from "@/components/loans/LoanCategoriesTable";
import { LoanPageLinks } from "@/components/loans/LoanPageLinks";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";

export default function LoansPage() {
  return (
    <PublicPageShell
      eyebrow="Loans"
      title="Loan Details"
      description="Explore loan category details and move to dedicated calculators for EMI and total interest estimation."
      actions={[
        { label: "Loan Categories", href: "/loans/loan-categories" },
        { label: "EMI Calculator", href: "/loans/emi-calculator" },
      ]}
    >
      <section className="rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Loan"
          title="Loan Type and Interest Rate Listing"
          description="Professional rate listing based on your requested loan categories and percentages."
        />

        <LoanCategoriesTable />

        <p className="mt-4 rounded-2xl border border-[#e1ebf2] bg-[#f7fbfd] p-4 text-sm leading-7 text-slate-600">
          Continue to the loan subpages for dedicated EMI and Loan Interest calculators.
        </p>
      </section>

      <LoanPageLinks currentPage="overview" />
    </PublicPageShell>
  );
}
