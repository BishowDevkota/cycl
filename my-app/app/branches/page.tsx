import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { branchDirectoryByProvince } from "@/lib/public-content";

export default function BranchesPage() {
  return (
    <PublicPageShell
      imageUrl="/banner/banner.jpg"
      eyebrow="Branch Details"
      title="Province-Wise Branch Directory"
      description="Branch listings are organized by all seven provinces, with each branch card containing contact details and map pin links."
      actions={[
        { label: "Contact Head Office", href: "/contact" },
        { label: "View News", href: "/news" },
      ]}
    >
      <section className="bg-white p-6 sm:p-8">
        {/* SectionHeading: eyebrow and title rendered in teal-deep green, no gradient, no rounded corners */}
        <SectionHeading
          eyebrow="Branch Network"
          title="All 7 Provinces"
          description="Each province block can be fed from a CMS collection and updated by admin users."
        />

        <div className="space-y-8">
          {branchDirectoryByProvince.map((provinceGroup) => (
            <article
              key={provinceGroup.id}
              id={provinceGroup.id.replace("province-", "")}
            >
              {/* Province header — flat dark teal, no gradient, no rounded corners */}
              <div className="bg-teal-deep px-5 py-3">
                <h3 className="text-lg font-semibold text-white">
                  {provinceGroup.province}
                </h3>
              </div>

              {/* Branch cards grid — flat background, no gradient, no rounded corners */}
              <div className="grid gap-4 md:grid-cols-2 bg-[#f0f8f8] px-5 py-6">
                {provinceGroup.branches.map((branch) => (
                  <div
                    key={branch.id}
                    className="border border-[#bcd7e2] bg-white p-5 shadow-sm hover:shadow-md transition"
                    /* No rounded-* class — sharp corners matching screenshot */
                  >
                    {/* Branch name in teal-deep green */}
                    <h4 className="text-base font-semibold text-teal-deep">
                      {branch.branchName}
                    </h4>

                    <p className="mt-2 text-sm text-slate-700">
                      {branch.address}
                    </p>

                    <div className="mt-4 space-y-2 text-sm">
                      <p>
                        <a
                          href={`tel:${branch.phone.replace(/\s+/g, "")}`}
                          className="text-slate-700 transition hover:text-teal-deep font-medium"
                        >
                          {branch.phone}
                        </a>
                      </p>
                      <p>
                        <a
                          href={`mailto:${branch.email}`}
                          className="text-slate-700 transition hover:text-teal-deep font-medium"
                        >
                          {branch.email}
                        </a>
                      </p>
                      <p>
                        <a
                          href={branch.mapLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex font-semibold text-teal-deep transition hover:brightness-110"
                        >
                          View Map Pin →
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