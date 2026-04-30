"use client";

import { useState } from "react";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";

const BASE = "/financial%20highlights/Quaterly%20report";

type FileExt = "pdf" | "jpg";

interface QuarterFile {
  label: string;
  file: string;
  ext: FileExt;
}

interface YearGroup {
  year: string;
  folder: string;
  reports: QuarterFile[];
}

const YEARS: YearGroup[] = [
  {
    year: "2082/83",
    folder: "2082-83",
    reports: [
      { label: "Financial Report 1st Quarter 2082/83", file: "1st quarter 2082-83.pdf", ext: "pdf" },
      { label: "Financial Report 2nd Quarter 2082/83", file: "2nd quarter 2082-83.pdf", ext: "pdf" },
    ],
  },
  {
    year: "2081/82",
    folder: "2081-82",
    reports: [
      { label: "Financial Report 1st Quarter 2081/82", file: "1st quarter 2081-82 .pdf", ext: "pdf" },
      { label: "Financial Report 2nd Quarter 2081/82", file: "2nd quarter 2081-82.pdf", ext: "pdf" },
      { label: "Financial Report 3rd Quarter 2081/82", file: "3rd quarter 2081-82.pdf", ext: "pdf" },
      { label: "Financial Report 4th Quarter 2081/82", file: "4th quarter 2081-82.pdf", ext: "pdf" },
    ],
  },
  {
    year: "2080/81",
    folder: "2080-81",
    reports: [
      { label: "Financial Report 1st Quarter 2080/81", file: "1st quarter 2080-81.pdf", ext: "pdf" },
      { label: "Financial Report 2nd Quarter 2080/81", file: "2nd quarter 2080-81.pdf", ext: "pdf" },
      { label: "Financial Report 3rd Quarter 2080/81", file: "3rd quarter 2080-82.jpg", ext: "jpg" },
      { label: "Financial Report 4th Quarter 2080/81", file: "4th quarter 2080-81.pdf", ext: "pdf" },
    ],
  },
];

function encodeFileName(name: string): string {
  return name
    .split("")
    .map((ch) => (ch === " " ? "%20" : ch))
    .join("");
}

function PdfIconBanner({ label, ext }: { label: string; ext: FileExt }) {
  return (
    <div className="w-full h-1/2 min-h-32 flex items-center justify-center bg-white">
      <img
        src={BASE + "/pdf%20icon.jpeg"}
        alt={label + " " + ext.toUpperCase()}
        className="h-[85%] w-auto max-h-28 object-contain select-none"
        draggable={false}
      />
    </div>
  );
}

export default function QuarterlyReportsPage() {
  const [selectedYear, setSelectedYear] = useState<string>(YEARS[0].year);

  const activeGroup = YEARS.find((y) => y.year === selectedYear) ?? YEARS[0];

  return (
    <PublicPageShell
      imageUrl="/banner/banner.jpg"
      eyebrow="Financial Highlights"
      title="Quarterly Reports"
      description="Access quarter-wise reports, portfolio summaries, and compliance documents."
      actions={[
        { label: "Back to Highlights", href: "/financial-highlights" },
        { label: "View Annual Reports", href: "/financial-highlights/annual-reports" },
      ]}
    >
      <section className="bg-white p-6 sm:p-8">
        <SectionHeading
          eyebrow="Attachments"
          title="Quarterly Report Documents"
          description="Cards below represent quarter-wise downloadable reports grouped by fiscal year."
        />

        <div className="flex gap-8 items-start">
          {/* Year sidebar */}
          <aside className="w-36 shrink-0 flex flex-col gap-2">
            {YEARS.map(function (item) {
              const isActive = selectedYear === item.year;
              return (
                <button
                  key={item.year}
                  onClick={function () { setSelectedYear(item.year); }}
                  className={
                    isActive
                      ? "w-full px-4 py-3 text-sm font-medium text-left bg-green-800 text-white"
                      : "w-full px-4 py-3 text-sm font-medium text-left bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-150"
                  }
                >
                  {item.year}
                </button>
              );
            })}
          </aside>

          {/* Cards grid */}
          <div className="flex-1 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {activeGroup.reports.map(function (report) {
              const downloadUrl =
                BASE +
                "/" +
                encodeFileName(activeGroup.folder) +
                "/" +
                encodeFileName(report.file);

              const downloadName = report.label + "." + report.ext;

              return (
                <article
                  key={report.file}
                  className="flex flex-col bg-teal-deep shadow-md text-white overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:brightness-75"
                >
                  <PdfIconBanner label={report.label} ext={report.ext} />

                  <div className="flex flex-col flex-1 px-4 pt-4 pb-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                      {report.ext}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-white leading-snug">
                      {report.label}
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
        </div>
      </section>
    </PublicPageShell>
  );
}