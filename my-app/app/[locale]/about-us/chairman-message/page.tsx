import Image from "next/image";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { chairmanMessage } from "@/lib/public-content";
import { getTranslations } from "next-intl/server";
const chairmanPhoto = "/images/padhmanath-Sharma-cyc-chairmain.jpg";
// const messageParagraphs = chairmanMessage.message.split("\n\n").filter(Boolean);

export default async function ChairmanMessagePage() {
  const t = await getTranslations("chairman-message");

  // 1. Create the array by explicitly referencing the key-value pairs from your JSON
  // We use a filter to ensure we don't include empty strings if a translation is missing
  const localizedParagraphs = [
    t("text_para_1"),
    t("text_para_2"),
    t("text_para_3"),
    t("text_para_4"),
    t("text_para_5"),
    t("text_para_6"),
  ].filter(Boolean);

  // 2. Fallback logic: If the translation array is empty, split the static content
  // Otherwise, use the localized version
  const finalMessageParagraphs = localizedParagraphs.length > 0 
    ? localizedParagraphs 
    : chairmanMessage.message.split("\n\n").filter(Boolean);

  return (
    <PublicPageShell
      imageUrl="/banner/banner2.jpg"
      eyebrow="About Us"
      title={t("banner_title")}
      description={t("banner_description")}
      actions={[
        { label: t("introduction_btn"), href: "/about-us" },
        { label: t("board_of_directors_btn"), href: "/about-us/board-of-directors" },
      ]}
    >
      <section className="rounded-3xl bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:items-start">
          <div className="overflow-hidden rounded-2xl border border-[#e0e7ee] bg-white shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
            <div className="relative aspect-4/5 w-full">
              <Image
                src={chairmanPhoto}
                alt={`${t("signature_name") || chairmanMessage.name}, ${t("signature_designation") || chairmanMessage.title}`}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <article className="flex flex-col justify-center">
            <header className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#0d837f]">
                {t("message_label")}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#123451] sm:text-3xl">
                {t("message_title")}
              </h2>
              <div className="mt-3 h-1 w-12 rounded-full bg-[#0d837f]" />
            </header>

            <div className="space-y-4 text-sm leading-7 text-slate-700 sm:text-base">
              {/* Map through the final array of paragraphs */}
              {finalMessageParagraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 12)}`}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-4">
              <p className="text-base font-semibold text-[#123451]">
                {t("signature_name") || chairmanMessage.name}
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                {t("signature_designation") || chairmanMessage.title}
              </p>
            </div>
          </article>
        </div>
      </section>
    </PublicPageShell>
  );
}
