import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getSortedNewsItems } from "@/lib/public-content";

export default function NewsPage() {
  const news = getSortedNewsItems();

  return (
    <PublicPageShell
      eyebrow="News"
      title="Latest News and Updates"
      description="News entries are sorted by publish date and structured for CMS-managed scheduling and publishing workflows."
      actions={[
        { label: "Browse Notices", href: "/notices" },
        { label: "News and Notices Hub", href: "/news-notices" },
      ]}
    >
      <section className="rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="News Listing"
          title="Published News"
          description="Entries are sorted from most recent to oldest."
        />

        <div className="space-y-5">
          {news.map((item) => (
            <article key={item.id} className="rounded-2xl border border-[#d7e6ee] bg-[#f9fcfe] p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0d837f]">
                <span>{item.category}</span>
                <span className="text-slate-400">|</span>
                <span>
                  {new Date(item.publishedAt).toLocaleDateString("en-NP", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <h2 className="mt-3 text-xl font-semibold text-[#123451]">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">{item.summary}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.details}</p>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                By {item.author}
              </p>
            </article>
          ))}
        </div>
      </section>
    </PublicPageShell>
  );
}
