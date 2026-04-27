import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { getLoanBySlug, loanCategories } from "@/lib/public-content";

type LoanDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function calculateSampleEmi(principal: number, annualRate: number, months: number) {
  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    return principal / months;
  }

  const growth = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * growth) / (growth - 1);
}

export async function generateStaticParams() {
  return loanCategories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function LoanDetailPage({ params }: LoanDetailPageProps) {
  const { slug } = await params;
  const loan = getLoanBySlug(slug);

  if (!loan) {
    notFound();
  }

  const samplePrincipal = 500000;
  const sampleTenure = Math.min(24, loan.tenureMonths.max);
  const sampleEmi = calculateSampleEmi(samplePrincipal, loan.annualRate, sampleTenure);

  return (
    <PublicPageShell
      eyebrow="Loan Details"
      title={loan.name}
      description={loan.fullDescription}
      actions={[
        { label: "Back to All Loans", href: "/loans" },
        { label: "Open EMI Calculator", href: "/loans#calculators" },
      ]}
    >
      <section className="rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-[#d7e6ee] bg-[#f9fcfe] p-5">
            <h2 className="text-xl font-semibold text-[#123451]">Product Snapshot</h2>
            <dl className="mt-4 space-y-2 text-sm text-slate-700 sm:text-base">
              <div className="flex items-start justify-between gap-2">
                <dt className="font-medium text-[#123451]">Principal Range</dt>
                <dd className="text-right">{loan.principalRange}</dd>
              </div>
              <div className="flex items-start justify-between gap-2">
                <dt className="font-medium text-[#123451]">Annual Interest Rate</dt>
                <dd>{loan.annualRate.toFixed(2)}%</dd>
              </div>
              <div className="flex items-start justify-between gap-2">
                <dt className="font-medium text-[#123451]">Tenure</dt>
                <dd>
                  {loan.tenureMonths.min} to {loan.tenureMonths.max} months
                </dd>
              </div>
              <div className="flex items-start justify-between gap-2">
                <dt className="font-medium text-[#123451]">Processing Fee</dt>
                <dd>{loan.processingFee}</dd>
              </div>
              <div className="flex items-start justify-between gap-2">
                <dt className="font-medium text-[#123451]">Repayment Modes</dt>
                <dd className="text-right">{loan.repaymentModes.join(", ")}</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-2xl border border-[#d7e6ee] bg-[linear-gradient(155deg,#f3fbfc_0%,#ffffff_65%)] p-5">
            <h2 className="text-xl font-semibold text-[#123451]">Sample Installment Estimate</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Estimated monthly installment for a sample principal of NPR 500,000 over {sampleTenure} months.
            </p>
            <p className="mt-4 text-2xl font-semibold text-[#0d837f]">
              {new Intl.NumberFormat("en-NP", {
                style: "currency",
                currency: "NPR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(sampleEmi)}
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500">
              Indicative Value For Demonstration
            </p>
          </article>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <article className="rounded-2xl border border-[#d7e6ee] bg-white p-5">
            <h3 className="text-lg font-semibold text-[#123451]">Key Features</h3>
            <ul className="mt-3 space-y-2">
              {loan.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm leading-7 text-slate-700">
                  <span className="mt-2 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#0d837f]" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-[#d7e6ee] bg-white p-5">
            <h3 className="text-lg font-semibold text-[#123451]">Eligibility</h3>
            <ul className="mt-3 space-y-2">
              {loan.eligibility.map((criterion) => (
                <li key={criterion} className="flex gap-3 text-sm leading-7 text-slate-700">
                  <span className="mt-2 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#f6921e]" aria-hidden="true" />
                  <span>{criterion}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-[#d7e6ee] bg-white p-5">
            <h3 className="text-lg font-semibold text-[#123451]">Required Documents</h3>
            <ul className="mt-3 space-y-2">
              {loan.requiredDocuments.map((document) => (
                <li key={document} className="flex gap-3 text-sm leading-7 text-slate-700">
                  <span className="mt-2 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#285a7c]" aria-hidden="true" />
                  <span>{document}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <Link
          href="/contact"
          className="mt-7 inline-flex items-center rounded-full bg-[#0d837f] px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Request Loan Consultation
        </Link>
      </section>
    </PublicPageShell>
  );
}
