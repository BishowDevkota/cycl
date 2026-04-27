import { LoanCalculators } from "@/components/loans/LoanCalculators";
import { LoanPageLinks } from "@/components/loans/LoanPageLinks";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";

export default function LoanInterestCalculatorPage() {
  return (
    <PublicPageShell
      eyebrow="Loans"
      title="Loan Interest Calculator"
      description="Third loan subpage for estimating total interest and total amount payable."
      actions={[
        { label: "Loan Categories", href: "/loans/loan-categories" },
        { label: "EMI Calculator", href: "/loans/emi-calculator" },
      ]}
    >
      <section className="rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Loan Interest Calculator"
          title="Simple Interest Estimation"
          description="Estimate total interest and total payable amount for planning and comparison."
        />

        <LoanCalculators mode="interest" />
      </section>

      <LoanPageLinks currentPage="loan-interest-calculator" />
    </PublicPageShell>
  );
}
