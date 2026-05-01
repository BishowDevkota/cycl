import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getSortedNewsItems } from "@/lib/public-content";

function encodeFileName(name: string): string {
  return name
    .split("")
    .map((ch) => (ch === " " ? "%20" : ch))
    .join("");
}

function ImgBanner({ src, alt }: { src?: string; alt: string }) {
  const url = src ?? "/news%20images%20/news%201.jpeg";
  return (
    <div className="w-full h-48 flex items-center justify-center bg-white overflow-hidden">
      <img src={url} alt={alt} className="w-full h-full object-cover select-none" draggable={false} />
    </div>
  );
}

export default function NewsPage() {
  const news = getSortedNewsItems();
  return (
    <PublicPageShell
      imageUrl="/banner/banner.jpg"
      eyebrow="News"
      title="Latest News and Updates"
      description="News entries are sorted by publish date and structured for CMS-managed scheduling and publishing workflows."
      actions={[
        { label: "Browse Notices", href: "/notices" },
        { label: "News and Notices Hub", href: "/news-notices" },
      ]}
    >
      <section className="bg-white p-6 sm:p-8">
        <SectionHeading
          eyebrow="News Listing"
          title="Published News"
        />
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 mt-4">
          {news.map((item) => {
            const date = new Date(item.publishedAt).toLocaleDateString("en-NP", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            return (
              <article
                key={item.id}
                className="flex flex-col h-96 bg-teal-deep shadow-md text-white overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:brightness-75"
              >
                <ImgBanner src={item.image} alt={item.title} />
                <div className="flex flex-col flex-1 px-4 pt-4 pb-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                    {item.category}
                  </p>
                  <h3 className="mt-0.5 text-sm font-semibold text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/90">{item.summary}</p>
                  <div className="mt-auto pt-1 flex items-center justify-between">
                    <span className="text-xs text-white/80">{date}</span>
                    <a
                      href={`/news/${encodeFileName(item.id)}`}
                      className="inline-flex items-center gap-2 bg-white px-3 py-1.5 text-xs font-semibold text-teal-deep transition hover:brightness-110"
                    >
                      Read
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </PublicPageShell>
  );
}