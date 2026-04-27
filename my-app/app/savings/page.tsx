import Link from "next/link";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { savingsProducts } from "@/lib/public-content";

export default function SavingsPage() {
  return (
    <PublicPageShell
      eyebrow="Savings"
      title="Savings Products and Interest Structures"
      description="Savings categories are rendered dynamically and mirror the Loans module layout for consistent user experience and easy CMS integration."
      actions={[
        { label: "Explore Loan Products", href: "/loans" },
        { label: "Contact Support", href: "/contact" },
      ]}
    >
      <section className="rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Savings Categories"
          title="Choose the Product That Matches Your Savings Goal"
          description="Each category below has its own detail page with product rules, benefits, and interest slabs."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {savingsProducts.map((product) => (
            <article
              key={product.slug}
              className="rounded-2xl border border-[#d7e6ee] bg-[#f9fcfe] p-5"
            >
              <h3 className="text-lg font-semibold text-[#123451]">{product.name}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{product.shortDescription}</p>

              <dl className="mt-4 space-y-2 text-sm text-slate-700">
                <div className="flex items-center justify-between gap-2">
                  <dt className="font-medium">Minimum Balance</dt>
                  <dd>{product.minimumBalance}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="font-medium">Target Segment</dt>
                  <dd className="text-right">{product.targetAudience}</dd>
                </div>
              </dl>

              <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
                {product.benefits.slice(0, 2).map((benefit) => (
                  <li key={benefit} className="flex gap-2">
                    <span className="mt-2 inline-flex h-2 w-2 shrink-0 rounded-full bg-[#0d837f]" aria-hidden="true" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/savings/${product.slug}`}
                className="mt-5 inline-flex items-center rounded-full bg-[#0d837f] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
              >
                View Product Details
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Interest Rate Tables"
          title="Current Savings Interest Slabs"
          description="Each table reflects product-specific rates, compounding style, and slab-based progression."
        />

        <div className="space-y-6">
          {savingsProducts.map((product) => (
            <article key={`${product.slug}-rates`} className="overflow-x-auto rounded-2xl border border-[#d7e6ee]">
              <h3 className="border-b border-[#d7e6ee] bg-[#ecf7fa] px-4 py-3 text-base font-semibold text-[#123451]">
                {product.name}
              </h3>
              <table className="min-w-full text-sm">
                <thead className="bg-[#f7fbfd] text-left text-[#123451]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Balance / Tenure Slab</th>
                    <th className="px-4 py-3 font-semibold">Interest Rate</th>
                    <th className="px-4 py-3 font-semibold">Compounding</th>
                  </tr>
                </thead>
                <tbody>
                  {product.rateSlabs.map((slab) => (
                    <tr key={slab.id} className="border-t border-[#e2edf2] bg-white text-slate-700">
                      <td className="px-4 py-3">{slab.balanceRange}</td>
                      <td className="px-4 py-3">{slab.interestRate.toFixed(2)}%</td>
                      <td className="px-4 py-3">{slab.compounding}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          ))}
        </div>
      </section>
    </PublicPageShell>
  );
}
