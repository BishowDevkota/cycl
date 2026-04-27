import Image from "next/image";
import { AboutUsPageLinks } from "@/components/public/AboutUsPageLinks";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { RichTextContent } from "@/components/public/RichTextContent";
import { getAboutCompanyInfo } from "@/services/about-company-info-service";
import { aboutCompanyProfile } from "@/lib/public-content";

export default async function AboutUsPage() {
  const aboutCompanyInfo = await getAboutCompanyInfo();

  return (
    <PublicPageShell
      eyebrow="About Us"
      title="Introduction"
      description="Learn about CYC Nepal Laghubitta Bittiya Sanstha Ltd., our purpose, and our strategic direction for inclusive and responsible finance."
      actions={[
        { label: "Chairman Message", href: "/about-us/chairman-message" },
        { label: "Board of Directors", href: "/about-us/board-of-directors" },
      ]}
    >
      <section className="rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <div className={`grid gap-8 ${aboutCompanyInfo?.imageUrl ? "lg:grid-cols-[1.08fr_0.92fr] lg:items-start" : ""}`}>
          <div>
            <SectionHeading
              eyebrow="Introduction"
              title={aboutCompanyInfo?.heading || aboutCompanyProfile.heading}
              description="This section is CMS-ready and supports rich text formatting for seamless future content updates."
            />

            <RichTextContent
              html={aboutCompanyInfo?.description || aboutCompanyProfile.overview}
              className="rich-text-content rounded-2xl border border-[#dce9ef] bg-[#f7fbfd] p-5 text-sm leading-7 text-slate-700 sm:text-base"
            />

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-[#dce9ef] bg-[#f7fbfd] p-5">
                <h3 className="text-lg font-semibold text-[#123451]">Vision</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
                  {aboutCompanyProfile.vision}
                </p>
              </article>

              <article className="rounded-2xl border border-[#dce9ef] bg-[#f7fbfd] p-5">
                <h3 className="text-lg font-semibold text-[#123451]">Mission</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
                  {aboutCompanyProfile.mission}
                </p>
              </article>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <article className="rounded-2xl border border-[#dce9ef] bg-white p-5">
                <h3 className="text-lg font-semibold text-[#123451]">Goals</h3>
                <ul className="mt-3 space-y-2">
                  {aboutCompanyProfile.goals.map((goal) => (
                    <li key={goal} className="flex gap-3 text-sm leading-7 text-slate-700 sm:text-base">
                      <span
                        className="mt-2 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#0d837f]"
                        aria-hidden="true"
                      />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-2xl border border-[#dce9ef] bg-white p-5">
                <h3 className="text-lg font-semibold text-[#123451]">Objectives</h3>
                <ul className="mt-3 space-y-2">
                  {aboutCompanyProfile.objectives.map((objective) => (
                    <li
                      key={objective}
                      className="flex gap-3 text-sm leading-7 text-slate-700 sm:text-base"
                    >
                      <span
                        className="mt-2 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#f6921e]"
                        aria-hidden="true"
                      />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>

          {aboutCompanyInfo?.imageUrl ? (
            <div className="relative overflow-hidden rounded-3xl border border-[#dce9ef] bg-[#f7fbfd] shadow-[0_18px_36px_rgba(13,44,62,0.08)]">
              <Image
                src={aboutCompanyInfo.imageUrl}
                alt={aboutCompanyInfo.heading || "About company image"}
                width={1200}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
        </div>
      </section>

      <AboutUsPageLinks currentPage="introduction" />
    </PublicPageShell>
  );
}
