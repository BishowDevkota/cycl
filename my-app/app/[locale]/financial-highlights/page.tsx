import Link from "next/link";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { baseRateRows } from "@/lib/public-content";

export default function FinancialHighlightsPage() {
  return (
    <PublicPageShell
    imageUrl="/banner/banner.jpg"
      eyebrow="Financial Highlights"
      title="Reports, Disclosures, and Base Rate Overview"
      description="Financial highlights are organized into annual and quarterly report pages with downloadable attachment cards. The base rate table below is structured for admin-managed updates."
      actions={[
        { label: "Annual Reports", href: "/financial-highlights/annual-reports" },
        { label: "Quarterly Reports", href: "/financial-highlights/quarterly-reports" },
      ]}
    >
      <section className=" bg-white p-6 sm:p-8">
        <SectionHeading
          eyebrow="Report Collections"
          title="Annual and Quarterly Report Library"
          description="Select a report category below to browse period-wise documents in a grid attachment layout."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Link
            href="/financial-highlights/annual-reports"
            className=" bg-teal-deep p-5 transition hover:-translate-y-0.5 hover:border-[#bcd7e2]"
          >
            <h3 className="text-xl font-semibold text-white">Annual Reports</h3>
            <p className="mt-2 text-sm leading-7 text-white/90">
              Audited annual reports, governance statements, and financial disclosures.
            </p>
            <span className="mt-4 inline-flex text-base underline font-semibold text-white">
              Open Annual Reports
            </span>
          </Link>

          <Link
            href="/financial-highlights/quarterly-reports"
            className=" bg-teal-deep p-5 transition hover:-translate-y-0.5 hover:border-[#bcd7e2]"
          >
            <h3 className="text-xl font-semibold text-white">Quarterly Reports</h3>
            <p className="mt-2 text-sm leading-7 text-white/90">
              Periodic portfolio, compliance, and performance summaries.
            </p>
            <span className="mt-4 inline-flex text-base font-semibold text-white underline">
              Open Quarterly Reports
            </span>
          </Link>
        </div>
      </section>

      <section className="mt-8  bg-white p-6 sm:p-8">
        <SectionHeading
          eyebrow="Base Rate Table"
          title="Recent Base Rate History"
          description="This table can be controlled from CMS to publish updated rates by effective date."
        />

        <div className="overflow-x-auto">
          <table className="min-w-full overflow-hidden   text-sm">
            <thead className="bg-teal-deep text-left text-white text-xl">
              <tr>
                <th className="px-4 py-3 font-semibold">Effective Date</th>
                <th className="px-4 py-3 font-semibold">Base Rate</th>
                <th className="px-4 py-3 font-semibold">Spread Rate</th>
                <th className="px-4 py-3 font-semibold">Final Lending Rate</th>
              </tr>
            </thead>
            <tbody>
              {baseRateRows.map((row) => (
                <tr key={row.id} className="border-t border-[#e2edf2]  odd:bg-white even:bg-[#f9fcfe] text-slate-700 text-base">
                  <td className="px-4 py-3">
                    {new Date(row.effectiveDate).toLocaleDateString("en-NP", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">{row.baseRate.toFixed(2)}%</td>
                  <td className="px-4 py-3">{row.spreadRate.toFixed(2)}%</td>
                  <td className="px-4 py-3 font-medium text-[#123451]">{row.finalRate.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PublicPageShell>
  );
}
