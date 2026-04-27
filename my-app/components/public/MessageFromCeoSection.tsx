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
    <section className="ceo-slide-in-right relative overflow-hidden bg-off-white px-4 py-18 md:px-6 md:py-18">
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-mint/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blush/70 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-300">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-mid">
            Leadership
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.15] text-teal-deep">
            {messageFromCeo?.heading || "Message From CEO"}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            A message from our leadership highlighting our vision, commitment, and the path ahead for our members.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-[20px] border border-[rgba(0,91,92,0.08)] bg-white">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="group relative min-h-80 overflow-hidden sm:min-h-90 lg:min-h-105">
              {messageFromCeo?.imageUrl ? (
                <img
                  src={messageFromCeo.imageUrl}
                  alt={messageFromCeo.heading || "CEO portrait"}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <Image
                  src="/ceo-placeholder.svg"
                  alt="CEO portrait"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              )}
            </div>

            <article className="flex min-h-80 flex-col p-6 sm:min-h-90 lg:min-h-105 lg:p-8">
              <div className="text-center">
                <p className="text-[1rem] font-black uppercase tracking-[0.14em] text-teal-mid sm:text-[1.05rem]">
                  Leadership Note
                </p>

                <div className="mx-auto mt-4 h-0.75 w-20 bg-mint" />
              </div>

              <div className="mt-6 flex flex-1 items-center justify-center">
                <div className="w-full rounded-2xl border border-[#dce8ef] bg-[#f7fbfd] px-4 py-4 md:px-5 md:py-5">
                  <RichTextContent
                    html={
                      messageFromCeo?.description ||
                      "First, I would like to extend my warm regards and heartfelt welcome to all stakeholders associated with this financial institution."
                    }
                    className="rich-text-content text-[15px] leading-7 text-slate-700 sm:text-base"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Link
                  href={buttonHref}
                  className="inline-flex items-center rounded-full border border-[#f6921e]/40 bg-blush px-5 py-2.5 text-sm font-semibold text-teal-deep transition hover:border-[#f6921e] hover:bg-[#f8b866]"
                >
                  {buttonLabel}
                </Link>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}