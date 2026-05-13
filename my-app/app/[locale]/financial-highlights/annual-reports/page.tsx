import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getTranslations } from "next-intl/server";

const BASE = "/financial%20highlights/Annual%20report";

/** 
 * Keep the file mapping static to ensure correct downloads, 
 * but we will pull the display labels from the JSON.
 */
const FILE_MAP = [
  "Annual report 2075:2076.pdf",
  "Annual report  2076:2077.pdf",
  "Annual report 2077:2078.pdf",
  "Annual report 2078:2079.pdf",
  "Annual report 2079:2080.pdf",
  "Annual report 2080:2081.pdf",
  "SGM Report 2078.pdf",
  "SGM REPORT 2079.pdf",
  "base rate.pdf",
];

function encodeFileName(name: string): string {
  return name.split("").map((ch) => (ch === " " ? "%20" : ch)).join("");
}

function PdfIconBanner({ label }: { label: string }) {
  return (
    <div className="w-full h-1/2 min-h-32 flex items-center justify-center bg-white">
      <img
        src={`${BASE}/pdf%20icon.jpeg`}
        alt={`${label} PDF`}
        className="h-[85%] w-auto max-h-28 object-contain select-none"
        draggable={false}
      />
    </div>
  );
}

export default async function AnnualReportsPage() {
  const t = await getTranslations("annual_reports");

  // Fetch the localized report titles from JSON
  const reportData = t.raw("documents_section.data") as Array<{ title: string }>;

  return (
    <PublicPageShell
      imageUrl="/banner/banner.jpg"
      eyebrow={t("banner.title")}
      title={t("banner.title")}
      description={t("banner.description")}
      actions={[
        { label: t("banner.btn_back"), href: "/financial-highlights" },
        { label: t("banner.btn_quarterly"), href: "/financial-highlights/quarterly-reports" },
      ]}
    >
      <section className="bg-white p-6 sm:p-8">
        <SectionHeading
          eyebrow={t("documents_section.eyebrow")}
          title={t("documents_section.title")}
          description={t("documents_section.description")}
        />

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {reportData.map((report, index) => {
            const fileName = FILE_MAP[index];
            const downloadUrl = `${BASE}/${encodeFileName(fileName)}`;

            return (
              <article
                key={fileName}
                className="flex flex-col bg-[#0d837f] shadow-md text-white overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:brightness-95"
              >
                <PdfIconBanner label={report.title} />

                <div className="flex flex-col flex-1 px-4 pt-4 pb-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                    {t("documents_section.card_format")}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-white leading-snug">
                    {report.title}
                  </h3>

                  <div className="mt-auto pt-4">
                    <a
                      href={downloadUrl}
                      download={fileName}
                      className="inline-flex items-center gap-2 bg-white px-3 py-1.5 text-xs font-semibold text-[#0d837f] transition hover:bg-[#f8fafc]"
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
                          x1="3"
                          y1="13"
                          x2="13"
                          y2="13"
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
      </section>
    </PublicPageShell>
  );
}