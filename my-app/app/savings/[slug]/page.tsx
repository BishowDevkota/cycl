import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { getSavingsBySlug, savingsProducts } from "@/lib/public-content";

type SavingsDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return savingsProducts.map((product) => ({
    slug: product.slug,
  }));
}

export default async function SavingsDetailPage({ params }: SavingsDetailPageProps) {
  const { slug } = await params;
  const product = getSavingsBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <PublicPageShell
      eyebrow="Savings Details"
      title={product.name}
      description={product.fullDescription}
      actions={[
        { label: "Back to All Savings", href: "/savings" },
        { label: "Browse Loan Products", href: "/loans" },
      ]}
    >
      <section className="rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-[#d7e6ee] bg-[#f9fcfe] p-5">
            <h2 className="text-xl font-semibold text-[#123451]">Product Snapshot</h2>
            <dl className="mt-4 space-y-2 text-sm text-slate-700 sm:text-base">
              <div className="flex items-start justify-between gap-2">
                <dt className="font-medium text-[#123451]">Minimum Balance</dt>
                <dd className="text-right">{product.minimumBalance}</dd>
              </div>
              <div className="flex items-start justify-between gap-2">
                <dt className="font-medium text-[#123451]">Withdrawal Rule</dt>
                <dd className="text-right">{product.withdrawalRule}</dd>
              </div>
              <div className="flex items-start justify-between gap-2">
                <dt className="font-medium text-[#123451]">Target Audience</dt>
                <dd className="text-right">{product.targetAudience}</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-2xl border border-[#d7e6ee] bg-[linear-gradient(155deg,#f3fbfc_0%,#ffffff_65%)] p-5">
            <h2 className="text-xl font-semibold text-[#123451]">Product Benefits</h2>
            <ul className="mt-4 space-y-2">
              {product.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-sm leading-7 text-slate-700 sm:text-base">
                  <span className="mt-2 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#0d837f]" aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <article className="mt-6 overflow-x-auto rounded-2xl border border-[#d7e6ee]">
          <h3 className="border-b border-[#d7e6ee] bg-[#ecf7fa] px-4 py-3 text-base font-semibold text-[#123451]">
            Interest Slab Details
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

        <Link
          href="/contact"
          className="mt-7 inline-flex items-center rounded-full bg-[#0d837f] px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Open Savings Account Inquiry
        </Link>
      </section>
    </PublicPageShell>
  );
}
