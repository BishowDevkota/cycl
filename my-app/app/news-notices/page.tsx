import Link from "next/link";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getSortedNewsItems, getSortedNoticeItems } from "@/lib/public-content";

export default function NewsNoticesPage() {
  const latestNews = getSortedNewsItems().slice(0, 4);
  const latestNotices = getSortedNoticeItems().slice(0, 4);

  return (
    <PublicPageShell
      eyebrow="News and Notices"
      title="Information Center"
      description="This section centralizes public communications, with separate CMS-managed pipelines for News and Notices."
      actions={[
        { label: "Open News", href: "/news" },
        { label: "Open Notices", href: "/notices" },
      ]}
    >
      <section className="rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Separate Streams"
          title="News and Notices"
          description="Both streams are independently managed and date-sorted, while active notices can be reused as homepage popups."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-[#d7e6ee] bg-[#f9fcfe] p-5">
            <h3 className="text-lg font-semibold text-[#123451]">Latest News</h3>
            <div className="mt-4 space-y-3">
              {latestNews.map((item) => (
                <div key={item.id} className="rounded-xl border border-[#dfeaf0] bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0d837f]">
                    {new Date(item.publishedAt).toLocaleDateString("en-NP", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#123451]">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.summary}</p>
                </div>
              ))}
            </div>
            <Link
              href="/news"
              className="mt-5 inline-flex items-center rounded-full bg-[#0d837f] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            >
              View All News
            </Link>
          </article>

          <article className="rounded-2xl border border-[#d7e6ee] bg-[#f9fcfe] p-5">
            <h3 className="text-lg font-semibold text-[#123451]">Latest Notices</h3>
            <div className="mt-4 space-y-3">
              {latestNotices.map((item) => (
                <div key={item.id} className="rounded-xl border border-[#dfeaf0] bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0d837f]">
                    {new Date(item.publishedAt).toLocaleDateString("en-NP", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#123451]">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.shortDescription}</p>
                </div>
              ))}
            </div>
            <Link
              href="/notices"
              className="mt-5 inline-flex items-center rounded-full bg-[#0d837f] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            >
              View All Notices
            </Link>
          </article>
        </div>
      </section>
    </PublicPageShell>
  );
}
