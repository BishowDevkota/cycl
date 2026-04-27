import { SavingsRatesTable } from "@/components/savings/SavingsRatesTable";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";

export default function SavingsPage() {
  return (
    <PublicPageShell
      eyebrow="Savings"
      title="Saving Details"
      description="Parent-only savings page highlighting the requested saving products and interest rates."
      actions={[
        { label: "Explore Loans", href: "/loans" },
        { label: "Contact Support", href: "/contact" },
      ]}
    >
      <section className="rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Saving"
          title="Saving Type and Interest Rate Listing"
          description="Single-page savings details as requested, with no savings subpages."
        />

        <SavingsRatesTable />

        <p className="mt-4 rounded-2xl border border-[#e1ebf2] bg-[#f7fbfd] p-4 text-sm leading-7 text-slate-600">
          This savings section remains a single parent page only, with no additional subpages.
        </p>
      </section>
    </PublicPageShell>
  );
}
