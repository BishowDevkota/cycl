import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { quarterlyReports } from "@/lib/public-content";

export default function QuarterlyReportsPage() {
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
      <section className="bg-white sm:p-8">
        <SectionHeading
          eyebrow="Attachments"
          title="Quarterly Report Documents"
          description="Cards below represent CMS-ready entries with period, publish date, file type, and size metadata."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {quarterlyReports.map((report) => (
            <article
              key={report.id}
              className=" bg-teal-deep p-5 shadow-md rounded-lg text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
                {report.fileType}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">{report.title}</h3>
              <p className="mt-1 text-sm text-white/90">{report.period}</p>

              <dl className="mt-4 space-y-1 text-sm text-white/90">
                <div className="flex justify-between gap-2">
                  <dt>Published</dt>
                  <dd>
                    {new Date(report.publishedAt).toLocaleDateString("en-NP", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>File Size</dt>
                  <dd>{report.fileSize}</dd>
                </div>
              </dl>

              <a
                href={report.downloadUrl}
                className="mt-5 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-teal-deep transition hover:brightness-110"
              >
                Download
              </a>
            </article>
          ))}
        </div>
      </section>
    </PublicPageShell>
  );
}
