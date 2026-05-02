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
  const ceoName = "Dolendra Prasad Sharma";
  const ceoDesignation = "Chief Executive Officer";
  

  return (
    <section className="relative overflow-hidden bg-[#f8fafc] px-4 py-6 md:px-6 md:py-8">

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-2xl border-0 bg-white shadow-2xl">
          <div className="grid lg:grid-cols-5">

            {/* Left Column: Image & Dark Blue Label */}
            <div className="relative lg:col-span-2">
              <div className="aspect-4/5 w-full overflow-hidden bg-slate-100 lg:h-full">
                {messageFromCeo?.imageUrl ? (
                  <img
                    src={messageFromCeo.imageUrl}
                    alt={ceoName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-200 text-slate-400">
                    Portrait Placeholder
                  </div>
                )}
              </div>

              {/* CEO Name Label */}
              <div className="absolute bottom-0 w-full bg-[#0a2d52] py-7 text-center text-white">
                <h3 className="font-serif text-2xl font-bold tracking-tight">
                  {ceoName}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest opacity-80">
                  {ceoDesignation}
                </p>
              </div>
            </div>

            {/* Right Column: Message Content */}
            <article className="flex flex-col justify-center p-6 md:p-8 lg:col-span-3 lg:p-10">

              {/* Header — no icon button */}
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0a2d52]/50">
                  Message From
                </p>
                <h2 className="font-serif text-4xl font-black text-[#0a2d52] md:text-5xl">
                  THE CEO
                </h2>
                <div className="mt-3 h-1.5 w-14 bg-[#6ba47d]" />
              </div>

              {/* Rich Text Body */}
              <div className="rich-text-container">
                <RichTextContent
                  html={
                    messageFromCeo?.description ||
                    "<p>Thank you for your continued hard work and dedication. We are building something meaningful together.</p>"
                  }
                  className="text-[15px] leading-relaxed text-slate-700 md:text-[16.5px]"
                />
              </div>

              {/* Signature */}
              <div className="mt-8">
                <div className="h-px w-32 bg-slate-200" />
                <p className="mt-4 text-sm font-serif italic text-slate-400">
                  {ceoName}
                </p>
                
                {/* Button */}
                <div className="mt-8">
                  <Link
                    href={buttonHref}
                    className="inline-block rounded-lg bg-[#6ba47d] px-6 py-3 font-semibold text-white transition hover:bg-[#5a9469]"
                  >
                    {buttonLabel}
                  </Link>
                </div>
              </div>
            </article>

          </div>
        </div>
      </div>
    </section>
  );
}