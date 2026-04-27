import { AboutUsPageLinks } from "@/components/public/AboutUsPageLinks";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { chairmanMessage } from "@/lib/public-content";

const leadershipCommitments = [
  "Strengthen transparent governance at every operational level.",
  "Expand quality financial services to underserved communities.",
  "Advance digital service delivery for faster, safer client access.",
  "Maintain responsible lending standards and social impact focus.",
];

export default function ChairmanMessagePage() {
  return (
    <PublicPageShell
      eyebrow="About Us"
      title="Chairman Message"
      description="A message from the Chairman outlining governance priorities and long-term commitment to inclusive financial growth."
      actions={[
        { label: "Introduction", href: "/about-us" },
        { label: "Board of Directors", href: "/about-us/board-of-directors" },
      ]}
    >
      <section className="rounded-3xl border border-[#d9e8ef] bg-[linear-gradient(165deg,#fef9f2_0%,#ffffff_62%,#f8f3ea_100%)] p-6 shadow-[0_18px_38px_rgba(108,77,25,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Chairman Message"
          title={chairmanMessage.name}
          description={chairmanMessage.title}
        />

        <blockquote className="rounded-2xl border border-[#f0dfc6] bg-white/85 p-5 text-sm leading-7 text-slate-700 sm:text-base">
          {chairmanMessage.message}
        </blockquote>

        <article className="mt-6 rounded-2xl border border-[#f0dfc6] bg-white p-5">
          <h3 className="text-lg font-semibold text-[#123451]">Leadership Commitments</h3>
          <ul className="mt-3 space-y-2">
            {leadershipCommitments.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-7 text-slate-700 sm:text-base">
                <span className="mt-2 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#f6921e]" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <AboutUsPageLinks currentPage="chairman-message" />
    </PublicPageShell>
  );
}
