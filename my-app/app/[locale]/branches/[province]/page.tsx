import { notFound } from "next/navigation";
import Link from "next/link";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { branchData } from "@/lib/branch-data";

interface Props {
  params: Promise<{ province: string }>;
}

export function generateStaticParams() {
  return branchData.map((province) => ({ province: province.id }));
}

export default async function ProvincePage({ params }: Props) {
  const { province: provinceId } = await params;
  const group = branchData.find((p) => p.id === provinceId);
  if (!group) return notFound();

  return (
    <PublicPageShell
      imageUrl="/banner/banner.jpg"
      eyebrow={group.province}
      title={group.province}
      description={`Contact details and branch list for ${group.province}.`}
    >
      <section className="bg-white p-6 sm:p-8">
        <SectionHeading eyebrow={group.province} title={group.province} description={`${group.branches.length} branches`} />

        <div className="flex gap-8 items-start">
          <aside className="sticky top-24 w-52 shrink-0 flex flex-col gap-2 h-fit z-40">
            {branchData.map(function (province) {
              const isActive = province.id === group.id;
              return (
                <Link
                  key={province.id}
                  href={`/branches/${province.id}`}
                  className={
                    isActive
                      ? "w-full px-4 py-3 text-sm font-medium text-left bg-green-800 text-white whitespace-nowrap"
                      : "w-full px-4 py-3 text-sm font-medium text-left bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-150 whitespace-nowrap"
                  }
                >
                  {province.province}
                  <span className="opacity-75"> [{province.branches.length}]</span>
                </Link>
              );
            })}
          </aside>

          <div className="flex-1 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {group.branches.map((branch) => (
              <article key={branch.id} className="flex flex-col overflow-hidden border border-gray-200 bg-white text-slate-700 shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-32 w-full items-center justify-center overflow-hidden border-b border-gray-200 bg-white">
                  <img src="/images/cyc-logo-introduction.png" alt="CYC Logo" className="h-24 w-auto object-contain" />
                </div>

                <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
                  <h3 className="text-sm font-bold leading-snug text-teal-deep">{branch.branchName}</h3>
                  <p className="mt-0.5 text-xs italic text-slate-500">{branch.manager}</p>

                  <div className="mt-3 flex-1 space-y-2 text-xs">
                    {branch.address && (
                      <div className="flex gap-2">
                        <span className="min-w-fit font-semibold text-teal-deep">Address:</span>
                        <span className="text-slate-600">{branch.address}</span>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <span className="min-w-fit font-semibold text-teal-deep">Phone:</span>
                      <a href={`tel:${branch.phone}`} className="font-medium text-slate-600 transition hover:text-teal-deep">{branch.phone}</a>
                    </div>
                    <div className="flex gap-2">
                      <span className="min-w-fit font-semibold text-teal-deep">Email:</span>
                      <a href={`mailto:${branch.email}`} className="truncate text-slate-600 transition hover:text-teal-deep">{branch.email}</a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
