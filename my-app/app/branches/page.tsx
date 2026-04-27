import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { branchDirectoryByProvince } from "@/lib/public-content";

export default function BranchesPage() {
  return (
    <PublicPageShell
      eyebrow="Branch Details"
      title="Province-Wise Branch Directory"
      description="Branch listings are organized by all seven provinces, with each branch card containing contact details and map pin links."
      actions={[
        { label: "Contact Head Office", href: "/contact" },
        { label: "View News", href: "/news" },
      ]}
    >
      <section className="rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Branch Network"
          title="All 7 Provinces"
          description="Each province block can be fed from a CMS collection and updated by admin users."
        />

        <div className="space-y-8">
          {branchDirectoryByProvince.map((provinceGroup) => (
            <article key={provinceGroup.id} id={provinceGroup.id.replace("province-", "")}>
              <h3 className="text-xl font-semibold text-[#123451]">{provinceGroup.province}</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {provinceGroup.branches.map((branch) => (
                  <div
                    key={branch.id}
                    className="rounded-2xl border border-[#d7e6ee] bg-[#f9fcfe] p-4"
                  >
                    <h4 className="text-base font-semibold text-[#123451]">{branch.branchName}</h4>
                    <p className="mt-2 text-sm text-slate-700">{branch.address}</p>

                    <div className="mt-3 space-y-1 text-sm">
                      <p>
                        <a
                          href={`tel:${branch.phone.replace(/\s+/g, "")}`}
                          className="text-slate-700 transition hover:text-[#0d837f]"
                        >
                          {branch.phone}
                        </a>
                      </p>
                      <p>
                        <a
                          href={`mailto:${branch.email}`}
                          className="text-slate-700 transition hover:text-[#0d837f]"
                        >
                          {branch.email}
                        </a>
                      </p>
                      <p>
                        <a
                          href={branch.mapLink}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-[#0d837f] transition hover:brightness-110"
                        >
                          View Map Pin
                        </a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </PublicPageShell>
  );
}
