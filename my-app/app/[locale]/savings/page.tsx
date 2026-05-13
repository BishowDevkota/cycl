import { SavingsRatesTable } from "@/components/savings/SavingsRatesTable";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getTranslations } from "next-intl/server";

export default async function SavingsPage() {
  // Accessing the 'savings' scope from your JSON
  const t = await getTranslations("savings");

  return (
    <PublicPageShell
      imageUrl={"/banner/banner.jpg"}
      eyebrow={t("listing_section.eyebrow")} // "Saving"
      title={t("banner.title")}             // "Saving Details"
      description={t("banner.description")} // "Parent-only savings page..."
      actions={[
        { label: t("banner.btn_explore"), href: "/loans" },
        { label: t("banner.btn_contact"), href: "/contact" },
      ]}
    >
      <section className=" bg-white p-6 sm:p-8">
        <SectionHeading
          eyebrow={t("listing_section.eyebrow")}
          title={t("listing_section.title")}       // "Saving Type and Interest Rate Listing"
          description={t("listing_section.description")}
        />

        {/* Ensure SavingsRatesTable is also updated to use translations for its headers and data */}
        <SavingsRatesTable />

        <p className="mt-4 rounded-2x p-4 text-base bg-[#f7fbfd] leading-7 text-slate-600">
          {t("listing_section.footer_note")} 
        </p>
      </section>
    </PublicPageShell>
  );
}