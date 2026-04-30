import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";

const BASE = "/financial%20highlights/Annual%20report";

/**
 * Every PDF in /public/financial highlights/Annual report/
 * `label`  — display name shown on the card (exact filename, no extension)
 * `file`   — exact filename on disk (used to build the download URL)
 */
const REPORTS = [
  {
    label: "Annual report 2075/2076",
    file: "Annual report 2075:2076.pdf",
  },
  {
    label: "Annual report 2076/2077",
    file: "Annual report  2076:2077.pdf", // double space as on disk
  },
  {
    label: "Annual report 2077/2078",
    file: "Annual report 2077:2078.pdf",
  },
  {
    label: "Annual report 2078/2079",
    file: "Annual report 2078:2079.pdf",
  },
  {
    label: "Annual report 2079/2080",
    file: "Annual report 2079:2080.pdf",
  },
  {
    label: "Annual report 2080/2081",
    file: "Annual report 2080:2081.pdf",
  },
  {
    label: "SGM Report 2078",
    file: "SGM Report 2078.pdf",
  },
  {
    label: "SGM REPORT 2079",
    file: "SGM REPORT 2079.pdf",
  },
  {
    label: "base rate",
    file: "base rate.pdf",
  },
] as const;

/** Encode a filename for use in a URL (spaces → %20, preserves colons) */
function encodeFileName(name: string): string {
  return name.split("").map((ch) => (ch === " " ? "%20" : ch)).join("");
}

/** Full-width icon banner — occupies exactly the top half of the card */
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

export default function AnnualReportsPage() {
  return (
    <PublicPageShell
      imageUrl="/banner/banner.jpg"
      eyebrow="Financial Highlights"
      title="Annual Reports"
      description="Browse annual disclosures and downloadable report attachments in a card-based grid layout."
      actions={[
        { label: "Back to Highlights", href: "/financial-highlights" },
        { label: "View Quarterly Reports", href: "/financial-highlights/quarterly-reports" },
      ]}
    >
      <section className="bg-white p-6 sm:p-8">
        <SectionHeading
          eyebrow="Attachments"
          title="Annual Report Documents"
          description="Attachment cards are structured for CMS-managed files and metadata."
        />

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {REPORTS.map(({ label, file }) => {
            const downloadUrl = `${BASE}/${encodeFileName(file)}`;

            return (
              <article
                key={file}
                className="flex flex-col bg-teal-deep shadow-md text-white overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:brightness-75"
              >
                {/* ── Top half: PDF icon ── */}
                <PdfIconBanner label={label} />

                {/* ── Bottom half: metadata + download button ── */}
                <div className="flex flex-col flex-1 px-4 pt-4 pb-4">
                  <p className="text-xs font-bold uppercase tracking-[ 0.2em] text-white/70">
                    PDF
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-white leading-snug">
                    {label}
                  </h3>

                  <div className="mt-auto pt-4">
                    <a
                      href={downloadUrl}
                      download={label + ".pdf"}
                      className="inline-flex items-center gap-2 bg-white px-3 py-1.5 text-xs font-semibold text-teal-deep transition hover:brightness-110"
                    >
                      {/* Small download icon inside the button */}
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
                      Download
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