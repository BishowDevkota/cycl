import { LoanCategoriesTable } from "@/components/loans/LoanCategoriesTable";
import { LoanPageLinks } from "@/components/loans/LoanPageLinks";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getTranslations } from "next-intl/server";

export default async function LoanCategoriesPage() {
  const t = await getTranslations("loan-categories");

  return (
    <PublicPageShell
    imageUrl="/banner/banner.jpg"
      eyebrow={t("banner_title")}
      title={t("banner_title")}
      description={t("banner_description")}
      actions={[
        { label: t("emi_calculator_btn"), href: "/loans/emi-calculator" },
        {
          label: t("interest_calculator_btn"),
          href: "/loans/loan-interest-calculator",
        },
      ]}
    >
      <section className=" bg-white p-6 sm:p-8">
        <SectionHeading
          eyebrow={t("section_eyebrow")}
          title={t("section_title")}
          description={t("section_description")}
        />

        <LoanCategoriesTable />
      </section>

      <LoanPageLinks currentPage="categories" />
    </PublicPageShell>
  );
}
