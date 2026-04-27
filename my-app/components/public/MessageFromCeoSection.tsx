import Image from "next/image";
import { RichTextContent } from "@/components/public/RichTextContent";
import type { MessageFromCeo } from "@/services/message-from-ceo-service";

type MessageFromCeoSectionProps = {
  messageFromCeo: MessageFromCeo | null;  
  buttonLabel: string;
  buttonHref: string;
};

export function MessageFromCeoSection({
  messageFromCeo,
}: MessageFromCeoSectionProps) {
  // Hardcoded values to ensure the UI looks correct regardless of API gaps
  const ceoName = "Dolendra Prasad Sharma";
  const ceoDesignation = "Chief Executive Officer";

  return (
    <section className="relative overflow-hidden px-4 py-16 md:px-6 lg:py-24">
      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full b " />
      
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-2xl border bg-white shadow-2xl">
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
              
              {/* CEO Name Label (The Dark Blue Bar) */}
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
            <article className="flex flex-col justify-center p-8 md:p-12 lg:col-span-3 lg:p-16">
              
              {/* Header with Circular Icon */}
              <div className="mb-8 flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#6ba47d]/15 text-[#4a7c59]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V21H14.017ZM6.017 21L6.017 18C6.017 16.8954 6.91243 16 8.017 16H11.017C11.5693 16 12.017 15.5523 12.017 15V9C12.017 8.44772 11.5693 8 11.017 8H7.017C6.46472 8 6.017 8.44772 6.017 9V11C6.017 11.5523 5.56929 12 5.017 12H4.017V21H6.017Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0a2d52]/50">
                    Message From
                  </p>
                  <h2 className="font-serif text-4xl font-black text-[#0a2d52] md:text-5xl">
                    THE CEO
                  </h2>
                  <div className="mt-3 h-1.5 w-14 bg-[#6ba47d]" />
                </div>
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

              {/* Signature Area (Hardcoded logic to avoid TS errors) */}
              <div className="mt-12">
                <div className="h-px w-32 bg-slate-200" />
                <p className="mt-4 text-sm font-serif italic text-slate-400">
                  {ceoName}
                </p>
              </div>
            </article>

          </div>
        </div>
      </div>
    </section>
  );
}