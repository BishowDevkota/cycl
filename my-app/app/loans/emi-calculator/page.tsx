import { LoanCalculators } from "@/components/loans/LoanCalculators";
import { LoanPageLinks } from "@/components/loans/LoanPageLinks";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";

export default function EmiCalculatorPage() {
  return (
    <PublicPageShell
    imageUrl="/banner/banner.jpg"
      eyebrow="Loans"
      title="EMI Calculator"
      description="Second loan subpage for monthly installment estimation based on principal, rate, and tenure."
      actions={[
        { label: "Loan Categories", href: "/loans/loan-categories" },
        {
          label: "Loan Interest Calculator",
          href: "/loans/loan-interest-calculator",
        },
      ]}
    >
      <section className="bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="EMI Calculator"
          title="Monthly Installment Estimation"
          description="Use this calculator to understand monthly obligations before selecting a loan product."
        />

        <LoanCalculators mode="emi" />
      </section>

      <LoanPageLinks currentPage="emi-calculator" />
    </PublicPageShell>
  );
}
