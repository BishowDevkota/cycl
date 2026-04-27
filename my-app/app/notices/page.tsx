import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getSortedNoticeItems } from "@/lib/public-content";

export default function NoticesPage() {
  const notices = getSortedNoticeItems();

  return (
    <PublicPageShell
      eyebrow="Notices"
      title="Official Notices and Announcements"
      description="Notices are sorted by date and can be flagged as active to appear in homepage popup prompts."
      actions={[
        { label: "Browse News", href: "/news" },
        { label: "News and Notices Hub", href: "/news-notices" },
      ]}
    >
      <section className="rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Notice Listing"
          title="Published Notices"
          description="Entries are sorted from most recent to oldest. Active notices are marked and can power the homepage popup module."
        />

        <div className="space-y-5">
          {notices.map((item) => (
            <article key={item.id} className="rounded-2xl border border-[#d7e6ee] bg-[#f9fcfe] p-5">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]">
                <span className="text-[#0d837f]">
                  {new Date(item.publishedAt).toLocaleDateString("en-NP", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-[10px] ${
                    item.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <h2 className="mt-3 text-xl font-semibold text-[#123451]">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">
                {item.shortDescription}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.details}</p>
            </article>
          ))}
        </div>
      </section>
    </PublicPageShell>
  );
}
