import Link from "next/link";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { baseRateRows } from "@/lib/public-content";

export default function FinancialHighlightsPage() {
  return (
    <PublicPageShell
      eyebrow="Financial Highlights"
      title="Reports, Disclosures, and Base Rate Overview"
      description="Financial highlights are organized into annual and quarterly report pages with downloadable attachment cards. The base rate table below is structured for admin-managed updates."
      actions={[
        { label: "Annual Reports", href: "/financial-highlights/annual-reports" },
        { label: "Quarterly Reports", href: "/financial-highlights/quarterly-reports" },
      ]}
    >
      <section className="rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Report Collections"
          title="Annual and Quarterly Report Library"
          description="Select a report category below to browse period-wise documents in a grid attachment layout."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Link
            href="/financial-highlights/annual-reports"
            className="rounded-2xl border border-[#d7e6ee] bg-[#f9fcfe] p-5 transition hover:-translate-y-0.5 hover:border-[#bcd7e2]"
          >
            <h3 className="text-lg font-semibold text-[#123451]">Annual Reports</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Audited annual reports, governance statements, and financial disclosures.
            </p>
            <span className="mt-4 inline-flex text-sm font-semibold text-[#0d837f]">
              Open Annual Reports
            </span>
          </Link>

          <Link
            href="/financial-highlights/quarterly-reports"
            className="rounded-2xl border border-[#d7e6ee] bg-[#f9fcfe] p-5 transition hover:-translate-y-0.5 hover:border-[#bcd7e2]"
          >
            <h3 className="text-lg font-semibold text-[#123451]">Quarterly Reports</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Periodic portfolio, compliance, and performance summaries.
            </p>
            <span className="mt-4 inline-flex text-sm font-semibold text-[#0d837f]">
              Open Quarterly Reports
            </span>
          </Link>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Base Rate Table"
          title="Recent Base Rate History"
          description="This table can be controlled from CMS to publish updated rates by effective date."
        />

        <div className="overflow-x-auto">
          <table className="min-w-full overflow-hidden rounded-2xl border border-[#d7e6ee] text-sm">
            <thead className="bg-[#ecf7fa] text-left text-[#123451]">
              <tr>
                <th className="px-4 py-3 font-semibold">Effective Date</th>
                <th className="px-4 py-3 font-semibold">Base Rate</th>
                <th className="px-4 py-3 font-semibold">Spread Rate</th>
                <th className="px-4 py-3 font-semibold">Final Lending Rate</th>
              </tr>
            </thead>
            <tbody>
              {baseRateRows.map((row) => (
                <tr key={row.id} className="border-t border-[#e2edf2] bg-white text-slate-700">
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
