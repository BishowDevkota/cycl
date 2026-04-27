import { AboutUsPageLinks } from "@/components/public/AboutUsPageLinks";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { boardOfDirectors } from "@/lib/public-content";

export default function BoardOfDirectorsPage() {
  return (
    <PublicPageShell
      eyebrow="About Us"
      title="Board of Directors"
      description="Meet the board members guiding governance, policy discipline, and long-term strategic direction."
      actions={[
        { label: "Introduction", href: "/about-us" },
        { label: "Management Team", href: "/about-us/management-team" },
      ]}
    >
      <section className="rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Board of Directors"
          title="Governance Leadership"
          description="The board provides policy oversight, institutional stewardship, and strategic guidance."
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

      <AboutUsPageLinks currentPage="board-of-directors" />
    </PublicPageShell>
  );
}
