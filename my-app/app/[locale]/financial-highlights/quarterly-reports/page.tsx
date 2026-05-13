"use client";

import { useState } from "react";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { useTranslations } from "next-intl";

const BASE = "/financial%20highlights/Quaterly%20report";

type FileExt = "pdf" | "jpg";

/**
 * We keep the technical path metadata here, 
 * but we'll sync it with the translated display data.
 */
const YEAR_METADATA = [
  { yearKey: "2082/83", folder: "2082-83", files: ["1st quarter 2082-83.pdf", "2nd quarter 2082-83.pdf"], exts: ["pdf", "pdf"] },
  { yearKey: "2081/82", folder: "2081-82", files: ["1st quarter 2081-82 .pdf", "2nd quarter 2081-82.pdf", "3rd quarter 2081-82.pdf", "4th quarter 2081-82.pdf"], exts: ["pdf", "pdf", "pdf", "pdf"] },
  { yearKey: "2080/81", folder: "2080-81/2080-81", files: ["1st quarter 2080-81.pdf", "2nd quarter 2080-81.pdf", "3rd quarter 2080-81.jpg", "4th quarter 2080-81.pdf"], exts: ["pdf", "pdf", "jpg", "pdf"] },
];

function encodeFileName(name: string): string {
  return name.split("").map((ch) => (ch === " " ? "%20" : ch)).join("");
}

function PdfIconBanner({ label, ext }: { label: string; ext: string }) {
  return (
    <div className="w-full h-1/2 min-h-32 flex items-center justify-center bg-white">
      <img
        src={BASE + "/pdf%20icon.jpeg"}
        alt={`${label} ${ext.toUpperCase()}`}
        className="h-[85%] w-auto max-h-28 object-contain select-none"
        draggable={false}
      />
    </div>
  );
}

export default function QuarterlyReportsPage() {
  const t = useTranslations("quarterly_reports");
  
  // Pull localized years and report titles from JSON
  const localizedYears = t.raw("documents_section.fiscal_years") as Array<{
    year: string;
    reports: Array<{ title: string }>;
  }>;

  const [activeIndex, setActiveIndex] = useState(0);

  const currentYearData = localizedYears[activeIndex];
  const currentMeta = YEAR_METADATA[activeIndex];

  return (
    <PublicPageShell
      imageUrl="/banner/banner.jpg"
      title={t("banner.title")}
      description={t("banner.description")}
      actions={[
        { label: t("banner.btn_back"), href: "/financial-highlights" },
        { label: t("banner.btn_annual"), href: "/financial-highlights/annual-reports" },
      ]}
    >
      <section className="bg-white p-6 sm:p-8">
        <SectionHeading
          eyebrow={t("documents_section.eyebrow")}
          title={t("documents_section.title")}
          description={t("documents_section.description")}
        />

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Year sidebar */}
          <aside className="w-full md:w-36 shrink-0 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {localizedYears.map((item, index) => (
              <button
                key={item.year}
                onClick={() => setActiveIndex(index)}
                className={`whitespace-nowrap px-4 py-3 text-sm font-medium text-left transition-colors duration-150 ${
                  activeIndex === index
                    ? "bg-[#0d837f] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {item.year}
              </button>
            ))}
          </aside>

          {/* Cards grid */}
          <div className="flex-1 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {currentYearData.reports.map((report, idx) => {
              const fileName = currentMeta.files[idx];
              const extension = currentMeta.exts[idx];
              const downloadUrl = `${BASE}/${encodeFileName(currentMeta.folder)}/${encodeFileName(fileName)}`;

              return (
                <article
                  key={fileName}
                  className="flex flex-col bg-[#0d837f] shadow-md text-white overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:brightness-95"
                >
                  <PdfIconBanner label={report.title} ext={extension} />

                  <div className="flex flex-col flex-1 px-4 pt-4 pb-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                      {extension === "pdf" ? t("documents_section.card_format") : extension}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-white leading-snug">
                      {report.title}
                    </h3>

                    <div className="mt-auto pt-4">
                      <a
                        href={downloadUrl}
                        download={`${report.title}.${extension}`}
                        className="inline-flex items-center gap-2 bg-white px-3 py-1.5 text-xs font-semibold text-[#0d837f] transition hover:bg-gray-100"
                      >
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 shrink-0"
                        >
                          <path
                            d="M8 2v8M5 7l3 3 3-3"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <line
                            x1="3" y1="13" x2="13" y2="13"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </svg>
                        {t("documents_section.btn_download")}
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}