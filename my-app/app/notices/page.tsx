import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getSortedNoticeItems } from "@/lib/public-content";

export default function NoticesPage() {
  const notices = getSortedNoticeItems();

  return (
    <PublicPageShell
    imageUrl="/banner/banner.jpg"
      eyebrow="Notices"
      title="Official Notices and Announcements"
      description="Notices are sorted by date and can be flagged as active to appear in homepage popup prompts."
      actions={[
        { label: "Browse News", href: "/news" },
        { label: "News and Notices Hub", href: "/news-notices" },
      ]}
    >
      <section className=" bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Notice Listing"
          title="Published Notices"
          description="Entries are sorted from most recent to oldest. Active notices are marked and can power the homepage popup module."
        />

        <div className="space-y-5">
          {notices.map((item) => (
            <article key={item.id} className=" bg-teal-deep p-5">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]">
                <span className="text-white">
                  {new Date(item.publishedAt).toLocaleDateString("en-NP", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span
                  className={`rounded-full px-4 py-2 text-xs ${
                    item.isActive
                      ? "bg-white text-emerald-700 font-bold"
                      : "bg-[#f0eaea] text-red-600"
                  }`}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-base leading-7 text-white sm:text-base">
                {item.shortDescription}
              </p>
              <p className="mt-3 text-sm leading-7 text-white">{item.details}</p>
            </article>
          ))}
        </div>
      </section>
    </PublicPageShell>
  );
}
