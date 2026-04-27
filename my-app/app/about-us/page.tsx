import Image from "next/image";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { RichTextContent } from "@/components/public/RichTextContent";
import { getAboutCompanyInfo } from "@/lib/about-company-info-service";
import {
  aboutCompanyProfile,
  boardOfDirectors,
  chairmanMessage,
  managementTeam,
} from "@/lib/public-content";

export default async function AboutUsPage() {
  const aboutCompanyInfo = await getAboutCompanyInfo();

  return (
    <PublicPageShell
      eyebrow="About Us"
      title="Company Profile, Leadership, and Institutional Direction"
      description="This section outlines CYC Nepal's vision, mission, strategic priorities, and leadership profiles. Content is structured in CMS-ready blocks for easy updates from the admin dashboard."
      actions={[
        { label: "View Branch Network", href: "/branches" },
        { label: "Contact Management", href: "/contact" },
      ]}
    >
      <section id="profile" className="rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <div className={`grid gap-8 ${aboutCompanyInfo?.imageUrl ? "lg:grid-cols-[1.08fr_0.92fr] lg:items-start" : ""}`}>
          <div>
            <SectionHeading
              eyebrow="Company Profile"
              title={aboutCompanyInfo?.heading || aboutCompanyProfile.heading}
              description="Managed from the admin dashboard with rich text formatting, including bold, italic, lists, and links."
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

      <section id="chairman" className="mt-8 rounded-3xl border border-[#d9e8ef] bg-[linear-gradient(165deg,#fef9f2_0%,#ffffff_62%,#f8f3ea_100%)] p-6 shadow-[0_18px_38px_rgba(108,77,25,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Chairman Message"
          title={chairmanMessage.name}
          description={chairmanMessage.title}
        />

        <blockquote className="rounded-2xl border border-[#f0dfc6] bg-white/80 p-5 text-sm leading-7 text-slate-700 sm:text-base">
          {chairmanMessage.message}
        </blockquote>
      </section>

      <section id="board" className="mt-8 rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Board of Directors"
          title="Governance Leadership"
          description="Profile cards are driven by structured data and can be replaced with real CMS-managed photo assets and biographies."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {boardOfDirectors.map((member) => (
            <article
              key={member.id}
              className="overflow-hidden rounded-2xl border border-[#d7e6ee] bg-[#f9fcfe]"
            >
              <div
                className="h-52 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${member.photoUrl})` }}
                role="img"
                aria-label={`${member.name} portrait`}
              />
              <div className="p-4">
                <h3 className="text-base font-semibold text-[#123451]">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-[#0d837f]">{member.title}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="management" className="mt-8 rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Management Team"
          title="Operational Leadership"
          description="The management team section follows the same dynamic card model for easy admin updates to title, bio, and visuals."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {managementTeam.map((member) => (
            <article
              key={member.id}
              className="overflow-hidden rounded-2xl border border-[#d7e6ee] bg-[#f9fcfe]"
            >
              <div
                className="h-52 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${member.photoUrl})` }}
                role="img"
                aria-label={`${member.name} portrait`}
              />
              <div className="p-4">
                <h3 className="text-base font-semibold text-[#123451]">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-[#0d837f]">{member.title}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PublicPageShell>
  );
}
