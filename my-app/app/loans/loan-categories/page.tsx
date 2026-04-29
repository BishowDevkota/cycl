import { LoanCategoriesTable } from "@/components/loans/LoanCategoriesTable";
import { LoanPageLinks } from "@/components/loans/LoanPageLinks";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";

export default function LoanCategoriesPage() {
  return (
    <PublicPageShell
    imageUrl="/banner/banner.jpg"
      eyebrow="Loans"
      title="Loan Categories"
      description="Detailed listing of loan categories and annual interest rates for public reference."
      actions={[
        { label: "EMI Calculator", href: "/loans/emi-calculator" },
        {
          label: "Loan Interest Calculator",
          href: "/loans/loan-interest-calculator",
        },
      ]}
    >
      <section className="rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Loan Categories"
          title="Loan Category Interest Matrix"
          description="First loan subpage showing the complete requested category and interest-rate listing."
        />

        <LoanCategoriesTable />
      </section>

      <LoanPageLinks currentPage="loan-categories" />
    </PublicPageShell>
  );
}
