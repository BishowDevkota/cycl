import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";

const sampleBaseRates = [
  { id: 1, fiscalYear: "2082/83", month: "Falgun 2082", baseRate: 16.62 },
  { id: 2, fiscalYear: "2082/83", month: "Magha 2082", baseRate: 16.59 },
  { id: 3, fiscalYear: "2082/83", month: "Posh 2082", baseRate: 16.71 },
  { id: 4, fiscalYear: "2082/83", month: "Mangsir 2082", baseRate: 16.73 },
  { id: 5, fiscalYear: "2082/83", month: "Kartik 2082", baseRate: 16.81 },
  { id: 6, fiscalYear: "2082/83", month: "Aswin 2082", baseRate: 17.30 },
  { id: 7, fiscalYear: "2082/83", month: "Bhadra 2082", baseRate: 16.35 },
  { id: 8, fiscalYear: "2082/83", month: "Sharban 2082", baseRate: 14.59 },
  { id: 9, fiscalYear: "2081/82", month: "Ashad 2082", baseRate: 15.06 },
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
                <th className="px-4 py-3 font-semibold">Fiscal Year</th>
                <th className="px-4 py-3 font-semibold">Month</th>
                <th className="px-4 py-3 font-semibold">Base Rate %</th>
              </tr>
            </thead>
            <tbody>
              {sampleBaseRates.map((row) => (
                <tr key={row.id} className="border-t border-[#e2edf2] odd:bg-white even:bg-[#f9fcfe] text-slate-700 text-base">
                  <td className="px-4 py-3">{row.fiscalYear}</td>
                  <td className="px-4 py-3">{row.month}</td>
                  <td className="px-4 py-3 font-medium text-[#123451]">{row.baseRate.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PublicPageShell>
  );
}
