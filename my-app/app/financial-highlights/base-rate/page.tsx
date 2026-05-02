import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";

const BASE = "/financial%20highlights/Base%20rate";

/** Files present in /public/financial highlights/Base rate/ */
const FILES = [
  { label: "Base Rate 1", file: "Base Rate 1.jpg" },
  { label: "Base rate 6", file: "Base rate 6.jpg" },
  { label: "Base-rate 5", file: "Base-rate 5.jpg" },
  { label: "Base_Rate_80-81", file: "Base_Rate_80-81.jpg" },
  { label: "Base_rate 7", file: "Base_rate 7.jpg" },
  { label: "Base_rate-3", file: "Base_rate-3.jpg" },
  { label: "Base_rate-Magh", file: "Base_rate-Magh.jpg" },
  { label: "Intrest-Rate", file: "Intrest-Rate.pdf" },
  { label: "Intrest-rate-chaitra", file: "Intrest-rate-chaitra.pdf" },
  { label: "base rate 8", file: "base rate 8.jpg" },
  { label: "base rate 9", file: "base rate 9.jpg" },
  { label: "base-rate 2", file: "base-rate 2.jpg" },
];

function encodeFileName(name: string): string {
  return name
    .split("")
    .map((ch) => (ch === " " ? "%20" : ch))
    .join("");
}

function MediaBanner({ label, file }: { label: string; file: string }) {
  const isPdf = file.toLowerCase().endsWith(".pdf");
  const url = isPdf
    ? `${BASE}/pdf%20icon.jpeg`
    : `${BASE}/${encodeFileName(file)}`;

  return (
    <div className="w-full h-1/2 min-h-32 flex items-center justify-center bg-white">
      <img
        src={url}
        alt={label}
        className="h-[85%] w-auto max-h-28 object-contain select-none"
        draggable={false}
      />
    </div>
  );
}

export default function BaseRatePage() {
  return (
    <PublicPageShell
      imageUrl="/banner/banner.jpg"
      eyebrow="Financial Highlights"
      title="Base Rate"
      description="Downloadable base rate schedules and published images grouped in the Base Rate folder."
      actions={[
        { label: "Back to Highlights", href: "/financial-highlights" },
        { label: "View Annual Reports", href: "/financial-highlights/annual-reports" },
        { label: "View Quarterly Reports", href: "/financial-highlights/quarterly-reports" },
      ]}
    >
      <section className="bg-white p-6 sm:p-8">
        <SectionHeading
          eyebrow="Attachments"
          title="Base Rate Documents"
          description="PDFs and image files published by the bank. Click to download or view the file."
        />

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 mt-4">
          {FILES.map(({ label, file }) => {
            const extMatch = file.match(/\.([a-zA-Z0-9]+)$/);
            const ext = extMatch ? extMatch[1].toLowerCase() : "";
            const downloadUrl = `${BASE}/${encodeFileName(file)}`;
            const downloadName = label + (ext ? `.${ext}` : "");

            return (
              <article
                key={file}
                className="flex flex-col bg-teal-deep shadow-md text-white overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:brightness-75"
              >
                <MediaBanner label={label} file={file} />

                <div className="flex flex-col flex-1 px-4 pt-4 pb-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                    {ext || "file"}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-white leading-snug">
                    {label}
                  </h3>

                  <div className="mt-auto pt-4">
                    <a
                      href={downloadUrl}
                      download={downloadName}
                      className="inline-flex items-center gap-2 bg-white px-3 py-1.5 text-xs font-semibold text-teal-deep transition hover:brightness-110"
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
