import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";

const sampleBaseRates = [
  { id: 1, effectiveDate: new Date().toISOString(), baseRate: 5.25, spreadRate: 0.75, finalRate: 6.00 },
  { id: 2, effectiveDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(), baseRate: 5.00, spreadRate: 0.75, finalRate: 5.75 },
];

export default function BaseRatePage() {
  return (
    <PublicPageShell
      imageUrl="/banner/banner.jpg"
      eyebrow="Financial Highlights"
      title="Base Rate"
      description="Current base rate and historical entries. Rates are maintained by admins and published here for transparency."
      actions={[
        { label: "Back to Highlights", href: "/financial-highlights" },
        { label: "View Annual Reports", href: "/financial-highlights/annual-reports" },
        { label: "View Quarterly Reports", href: "/financial-highlights/quarterly-reports" },
      ]}
    >
      <section className="bg-white p-6 sm:p-8">
        <SectionHeading
          eyebrow="Base Rate"
          title="Recent Base Rate History"
          description="This table lists base rates, spread and final lending rates by effective date."
        />

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-teal-deep text-left text-white text-xl">
              <tr>
                <th className="px-4 py-3 font-semibold">Effective Date</th>
                <th className="px-4 py-3 font-semibold">Base Rate</th>
                <th className="px-4 py-3 font-semibold">Spread Rate</th>
                <th className="px-4 py-3 font-semibold">Final Lending Rate</th>
              </tr>
            </thead>
            <tbody>
              {sampleBaseRates.map((row) => (
                <tr key={row.id} className="border-t border-[#e2edf2] odd:bg-white even:bg-[#f9fcfe] text-slate-700 text-base">
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
