import Link from "next/link";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getSortedNewsItems, getSortedNoticeItems } from "@/lib/public-content";
import Image from "next/image";

export default function NewsNoticesPage() {
  const latestNews = getSortedNewsItems().slice(0, 4);
  const latestNotices = getSortedNoticeItems().slice(0, 4);

  return (
    <PublicPageShell
    imageUrl={"/banner/banner.jpg"}
      eyebrow="News and Notices"
      title="Information Center"
      description="This section centralizes public communications, with separate CMS-managed pipelines for News and Notices."
      actions={[
        { label: "Open News", href: "/news" },
        { label: "Open Notices", href: "/notices" },
      ]}
    >
      <section className="bg-white sm:p-8">
        <SectionHeading
          eyebrow="Separate Streams"
          title="News and Notices"
          description="Both streams are independently managed and date-sorted, while active notices can be reused as homepage popups."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="bg-teal-deep text-white p-5">
            <div className="flex flex-col items-center">
              <Image src="/newsandnotices/news.jpg" alt="News Icon" width={40} height={40} />
            <h3 className="text-2xl font-semibold text-white ">Latest News</h3>
            </div>
            <div className="mt-4 space-y-3">
              {latestNews.map((item) => (
                <div key={item.id} className=" rounded-sm transform hover:-translate-y-1 duration-200 ease-out bg-off-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0d837f]">
                    {new Date(item.publishedAt).toLocaleDateString("en-NP", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="mt-1 text-base font-semibold text-[#123451]">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.summary}</p>
                </div>
              ))}
            </div>
            <div className="w-full">
            <Link
              href="/news"
              className="mt-5 inline-flex items-center rounded bg-white px-4 py-2 text-base font-bold text-teal-deep transition hover:brightness-110"
              >
              View All News
            </Link>
                </div>
              
          </article>

          <article className="bg-teal-deep text-white p-5">
            <div className="flex flex-col items-center">
              <Image src="/newsandnotices/notices.png" alt="Notices Icon" width={40} height={40} />
            <h3 className="text-2xl font-semibold text-white text-center">Latest Notices</h3>
            </div>
            <div className="mt-4 space-y-3">
              {latestNotices.map((item) => (
                <div key={item.id} className="rounded-sm border border-[#dfeaf0] bg-off-white p-3  transform hover:-translate-y-1 duration-200 ease-out">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0d837f]">
                    {new Date(item.publishedAt).toLocaleDateString("en-NP", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="mt-1 text-base font-semibold text-[#123451]">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.shortDescription}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end w-full">

            <Link
              href="/notices"
              className="mt-5 inline-flex items-center bg-white px-4 py-2 text-base font-bold text-teal-deep rounded-sm transition hover:brightness-110"
              >
              View All Notices
            </Link>
              </div>
          </article>
        </div>
      </section>
    </PublicPageShell>
  );
}
