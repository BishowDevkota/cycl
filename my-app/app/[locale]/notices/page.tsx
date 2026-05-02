import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getSortedNoticeItems } from "@/lib/public-content";

function resolveNoticeImage(id: string) {
  switch (id) {
    case "notice-1":
      return "/Notice-img/notice-1.jpg";
    case "notice-2":
      return "/Notice-img/Notice-2.jpg";
    case "notice-3":
      return "/Notice-img/Notice-3.jpg";
    default:
      return "/Notice-img/notice-1.jpg";
  }
}

function BulletinBanner({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex h-48 w-full items-center justify-center overflow-hidden bg-white">
      <img src={src} alt={alt} className="h-full w-full select-none object-cover" draggable={false} />
    </div>
  );
}

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
      <section className="bg-white p-6 sm:p-8">
        <SectionHeading
          eyebrow="Notice Listing"
          title="Published Notices"
          description="Entries are sorted from most recent to oldest. Active notices are marked and can power the homepage popup module."
        />

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 mt-4">
          {notices.map((item) => (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden bg-teal-deep text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:brightness-75"
            >
              <BulletinBanner
                src={resolveNoticeImage(item.id)}
                alt={item.title}
              />

              <div className="flex flex-1 flex-col px-4 pt-4 pb-4">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-widest">
                  <span className="text-white/80">
                    {new Date(item.publishedAt).toLocaleDateString("en-NP", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-bold ${
                      item.isActive
                        ? "bg-white text-emerald-700"
                        : "bg-[#f0eaea] text-red-600"
                    }`}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <h2 className="mt-3 text-sm font-semibold leading-snug text-white">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm text-white/90">
                  {item.shortDescription}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/85">
                  {item.details}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PublicPageShell>
  );
}
