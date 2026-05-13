import { LoanCategoriesTable } from "@/components/loans/LoanCategoriesTable";
import { LoanPageLinks } from "@/components/loans/LoanPageLinks";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getTranslations } from "next-intl/server";

export default async function LoansPage() {
  // Accessing the 'loans' scope
  const t = await getTranslations("loans");

  return (
    <PublicPageShell
      imageUrl="/banner/banner.jpg"
      // Updated keys based on the new nested JSON structure
      title={t("banner.title")}
      description={t("banner.description")}
      actions={[
        { label: t("banner.btn_categories"), href: "/loans/loan-categories" },
        { label: t("banner.btn_emi"), href: "/loans/emi-calculator" },
      ]}
    >
      <section className="rounded-3xl bg-white p-6 sm:p-8">
        <SectionHeading
          eyebrow={t("listing_section.eyebrow")}
          title={t("listing_section.title")}
          description={t("listing_section.description")}
        />

        {/* Ensure LoanCategoriesTable is updated to pull its data from t.raw("table.data") */}
        <LoanCategoriesTable />

        <p className="mt-4 bg-[#f7fbfd] p-4 text-md leading-7 text-slate-600">
          {t("listing_section.footer_note")}
        </p>
      </section>

      <LoanPageLinks currentPage="overview" />
    </PublicPageShell>
  );
}