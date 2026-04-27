import { AboutUsPageLinks } from "@/components/public/AboutUsPageLinks";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { managementTeam } from "@/lib/public-content";

export default function ManagementTeamPage() {
  return (
    <PublicPageShell
      eyebrow="About Us"
      title="Management Team"
      description="Meet the management team responsible for operations, execution quality, and client-focused delivery."
      actions={[
        { label: "Introduction", href: "/about-us" },
        { label: "Chairman Message", href: "/about-us/chairman-message" },
      ]}
    >
      <section className="rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Management Team"
          title="Operational Leadership"
          description="Leadership team driving daily operations, service standards, and institutional performance."
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

      <AboutUsPageLinks currentPage="management-team" />
    </PublicPageShell>
  );
}
