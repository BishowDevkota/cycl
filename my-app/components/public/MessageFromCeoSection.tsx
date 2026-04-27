import Image from "next/image";
import Link from "next/link";
import { RichTextContent } from "@/components/public/RichTextContent";
import type { MessageFromCeo } from "@/services/message-from-ceo-service";

type MessageFromCeoSectionProps = {
  messageFromCeo: MessageFromCeo | null;
  buttonLabel: string;
  buttonHref: string;
};

export function MessageFromCeoSection({
  messageFromCeo,
  buttonLabel,
  buttonHref,
}: MessageFromCeoSectionProps) {
  return (
    <section className="ceo-slide-in-right relative overflow-hidden bg-off-white px-0 py-18 md:py-25">
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-mint/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blush/70 blur-3xl" />

      <div className="relative z-10 grid min-h-80 grid-cols-1 md:min-h-120 md:grid-cols-2 md:items-stretch">
          <div className="group relative h-full overflow-hidden">
            {messageFromCeo?.imageUrl ? (
              <img
                src={messageFromCeo.imageUrl}
                alt={messageFromCeo.heading || "CEO portrait"}
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src="/ceo-placeholder.svg"
                alt="CEO portrait"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>

          <article className="flex h-full flex-col rounded-[20px] border border-[rgba(0,91,92,0.08)] bg-white px-5 py-7 md:px-8 md:py-8 lg:px-10 lg:py-10">
            <p className="text-center text-[1.05rem] font-black uppercase tracking-[0.14em] text-[#0d837f] sm:text-[1.15rem]">
            Leadership Note
          </p>

            <h2 className="mt-2 text-center text-[1.75rem] font-bold leading-tight text-teal-deep sm:text-[1.95rem] lg:text-[2.1rem]">
            {messageFromCeo?.heading || "Message From CEO"}
          </h2>

            <div className="mx-auto mt-4 h-0.75 w-20 bg-linear-to-r from-[#0d837f] to-[#a3d6c8]" />

            <div className="mt-4 flex flex-1 items-center rounded-2xl border border-[#dce8ef] bg-white px-4 py-3 md:px-5 md:py-4">
              <RichTextContent
                html={
                  messageFromCeo?.description ||
                  "First, I would like to extend my warm regards and heartfelt welcome to all stakeholders associated with this financial institution."
                }
                className="rich-text-content text-[15px] leading-7 text-slate-700 sm:text-base"
              />
            </div>

            <Link
              href={buttonHref}
              className="mt-5 inline-flex w-fit items-center justify-center self-end rounded-xl bg-[#0d837f] px-7 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors duration-300 hover:bg-[#0a6d6a]"
            >
              {buttonLabel}
            </Link>
          </article>
      </div>
    </section>
  );
}