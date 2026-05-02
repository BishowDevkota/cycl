import Image from "next/image";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { chairmanMessage } from "@/lib/public-content";
const chairmanPhoto = "/images/padhmanath-Sharma-cyc-chairmain.jpg";
const messageParagraphs = chairmanMessage.message.split("\n\n").filter(Boolean);

export default function ChairmanMessagePage() {
  return (
    <PublicPageShell
    imageUrl="/banner/banner2.jpg"
      eyebrow="About Us"
      title="Chairman Message"
      description="A message from the Chairman outlining governance priorities and long-term commitment to inclusive financial growth."
      actions={[
        { label: "Introduction", href: "/about-us" },
        { label: "Board of Directors", href: "/about-us/board-of-directors" },
      ]}
    >
      <section className="rounded-3xl  bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:items-start">
          <div className="overflow-hidden rounded-2xl border border-[#e0e7ee] bg-white shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
            <div className="relative aspect-4/5 w-full">
              <Image
                src={chairmanPhoto}
                alt={`${chairmanMessage.name}, ${chairmanMessage.title}`}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <article className="flex flex-col justify-center">
            <header className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#0d837f]">
                Message From
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#123451] sm:text-3xl">
                Chairman
              </h2>
              <div className="mt-3 h-1 w-12 rounded-full bg-[#0d837f]" />
            </header>

            <div className="space-y-4 text-sm leading-7 text-slate-700 sm:text-base">
              {messageParagraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 12)}`}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-4">
              <p className="text-base font-semibold text-[#123451]">
                {chairmanMessage.name}
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                {chairmanMessage.title}
              </p>
            </div>
          </article>
        </div>
      </section>

      
    </PublicPageShell>
  );
}
