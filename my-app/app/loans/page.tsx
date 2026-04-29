import { LoanCategoriesTable } from "@/components/loans/LoanCategoriesTable";
import { LoanPageLinks } from "@/components/loans/LoanPageLinks";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";

export default function LoansPage() {
  return (
    <PublicPageShell
      imageUrl="/banner/banner.jpg"
      title="Loans"
      description="Explore loan category details and move to dedicated calculators for EMI and total interest estimation."
      actions={[
        { label: "Loan Categories", href: "/loans/loan-categories" },
        { label: "EMI Calculator", href: "/loans/emi-calculator" },
      ]}
    >
      <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_14px_50px_rgba(12,49,72,0.1)]">
        <SectionHeading
          title="Loan Type and Interest Rate Listing"
          description="Professional rate listing based on your requested loan categories and percentages."
        />

        <LoanCategoriesTable />

        <p className="mt-4 rounded-2xl  bg-[#f7fbfd] p-4 text-md leading-7 text-slate-600 shadow-[0px_4px_10px_rgba(12,49,72,0.1)] border border-[#e3edf3]">
          Continue to the loan subpages for dedicated EMI and Loan Interest calculators.
        </p>
      </section>

      <LoanPageLinks currentPage="overview" />
    </PublicPageShell>
  );
}
