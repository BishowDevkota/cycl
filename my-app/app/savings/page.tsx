import { SavingsRatesTable } from "@/components/savings/SavingsRatesTable";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";

export default function SavingsPage() {
  return (
    <PublicPageShell
    imageUrl={"/banner/banner.jpg"}
      eyebrow="Savings"
      title="Saving Details"
      description="Parent-only savings page highlighting the requested saving products and interest rates."
      actions={[
        { label: "Explore Loans", href: "/loans" },
        { label: "Contact Support", href: "/contact" },
      ]}
    >
      <section className="rounded-3xl bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.1)] sm:p-8">
        <SectionHeading
          eyebrow="Saving"
          title="Saving Type and Interest Rate Listing"
          description="Single-page savings details as requested, with no savings subpages."
        />

        <SavingsRatesTable />

        <p className="mt-4 rounded-2x shadow-[0_14px_28px_rgba(12,49,72,0.08)] p-4 text-base bg-[#f7fbfd] leading-7 text-slate-600">
          This savings section remains a single parent page only, with no additional subpages.
        </p>
      </section>
    </PublicPageShell>
  );
}
