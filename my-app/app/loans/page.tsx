import Link from "next/link";
import { LoanCalculators } from "@/components/loans/LoanCalculators";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { loanCategories, loanInterestRates } from "@/lib/public-content";

export default function LoansPage() {
  return (
    <PublicPageShell
      eyebrow="Loans"
      title="Loan Products, Calculators, and Dynamic Interest Rates"
      description="Loan products and their detail pages are driven by structured content blocks. Interest rates and product descriptions can be managed through CMS collections in production."
      actions={[
        { label: "Compare Savings Products", href: "/savings" },
        { label: "Visit Branch Network", href: "/branches" },
      ]}
    >
      <section className="rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Loan Categories"
          title="Choose the Right Loan for Your Needs"
          description="Each category below links to its own detail page with eligibility, required documents, repayment options, and feature highlights."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {loanCategories.map((category) => (
            <article
              key={category.slug}
              className="rounded-2xl border border-[#d7e6ee] bg-[#f9fcfe] p-5"
            >
              <h3 className="text-lg font-semibold text-[#123451]">{category.name}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{category.shortDescription}</p>

              <dl className="mt-4 space-y-2 text-sm text-slate-700">
                <div className="flex items-center justify-between gap-2">
                  <dt className="font-medium">Principal Range</dt>
                  <dd>{category.principalRange}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="font-medium">Annual Rate</dt>
                  <dd>{category.annualRate.toFixed(2)}%</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="font-medium">Tenure</dt>
                  <dd>
                    {category.tenureMonths.min} to {category.tenureMonths.max} months
                  </dd>
                </div>
              </dl>

              <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
                {category.features.slice(0, 2).map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="mt-2 inline-flex h-2 w-2 shrink-0 rounded-full bg-[#0d837f]" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/loans/${category.slug}`}
                className="mt-5 inline-flex items-center rounded-full bg-[#0d837f] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
              >
                View Loan Details
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="calculators" className="mt-8 rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Calculators"
          title="EMI and Total Interest Estimation"
          description="These tools help clients quickly estimate repayment responsibilities for informed decisions."
        />
        <LoanCalculators />
      </section>

      <section className="mt-8 rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Interest Rate Table"
          title="Current Lending Rates"
          description="Sample data below represents a CMS-updatable rate matrix for loan products."
        />

        <div className="overflow-x-auto">
          <table className="min-w-full overflow-hidden rounded-2xl border border-[#d7e6ee] text-sm">
            <thead className="bg-[#ecf7fa] text-left text-[#123451]">
              <tr>
                <th className="px-4 py-3 font-semibold">Loan Type</th>
                <th className="px-4 py-3 font-semibold">Annual Rate</th>
                <th className="px-4 py-3 font-semibold">Tenure</th>
                <th className="px-4 py-3 font-semibold">Processing Fee</th>
                <th className="px-4 py-3 font-semibold">Effective Date</th>
              </tr>
            </thead>
            <tbody>
              {loanInterestRates.map((rate) => (
                <tr key={rate.id} className="border-t border-[#e2edf2] bg-white text-slate-700">
                  <td className="px-4 py-3 font-medium text-[#123451]">{rate.loanType}</td>
                  <td className="px-4 py-3">{rate.annualRate.toFixed(2)}%</td>
                  <td className="px-4 py-3">{rate.tenure}</td>
                  <td className="px-4 py-3">{rate.processingFee}</td>
                  <td className="px-4 py-3">
                    {new Date(rate.effectiveFrom).toLocaleDateString("en-NP", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PublicPageShell>
  );
}
