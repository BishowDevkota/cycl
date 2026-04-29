"use client";

import Link from "next/link";
import { RichTextContent } from "@/components/public/RichTextContent";
import type { MessageFromCeo } from "@/services/message-from-ceo-service";
import { useEffect, useRef, useState } from "react";

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-transparent px-4 pb-6 pt-2 md:px-6 md:pb-8 md:pt-2">
      <div className="mx-auto max-w-6xl" ref={sectionRef}>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="grid lg:grid-cols-5">
            {/* Left Column: Image & Dark Blue Label */}
            <div
              className={`relative lg:col-span-2 transition-all duration-1000 ease-out
                ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-24"}`}
            >
              <div className="aspect-4/5 w-full overflow-hidden bg-slate-100 lg:h-full group">
                {messageFromCeo?.imageUrl ? (
                  <img
                    src={messageFromCeo.imageUrl}
                    alt={ceoName}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-200 text-slate-400">
                    Portrait Placeholder
                  </div>
                )}
              </div>
              {/* CEO Name Label */}
              <div className="absolute bottom-0 w-full bg-[#0a2d52] py-7 text-center text-white">
                <h3 className="font-sans text-2xl font-bold tracking-tight transition-colors duration-300 hover:text-[#6ba47d]">
                  {ceoName}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest opacity-80 transition-colors duration-300 hover:text-[#8ec5b9]">
                  {ceoDesignation}
                </p>
              </div>
            </div>

            {/* Right Column: Message Content */}
            <article
              className={`flex flex-col justify-center p-6 md:p-8 lg:col-span-3 lg:p-10
                transition-all duration-1000 ease-out delay-300
                ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-24"}`}
            >
              {/* Header */}
              <div className="mb-6">
                <p className="font-sans text-xs font-black uppercase tracking-[0.2em] text-[#0a2d52]/50 transition-colors duration-300 hover:text-[#6ba47d]">
                  Message From
                </p>
                <h2 className="font-sans text-4xl font-black text-[#0a2d52] md:text-5xl transition-colors duration-300 hover:text-[#4a8460]">
                  THE CEO
                </h2>
                <div className="mt-3 h-1.5 w-14 bg-[#6ba47d]" />
              </div>

              {/* Rich Text Body */}
              <div className="rich-text-container group rounded-lg p-3 transition-all duration-300 hover:bg-[#f0f7f2]">
                <RichTextContent
                  html={
                    messageFromCeo?.description ||
                    "<p>Thank you for your continued hard work and dedication. We are building something meaningful together.</p>"
                  }
                  className="text-justify font-sans text-[15px] font-medium leading-relaxed text-slate-700 transition-colors duration-300 group-hover:text-[#2d6a4f] md:text-[16.5px]"
                />
              </div>

              {/* Signature */}
              <div className="mt-8">
                <div className="h-px w-32 bg-slate-200" />
                <p className="mt-4 font-sans text-sm italic text-slate-400 transition-colors duration-300 hover:text-[#6ba47d]">
                  {ceoName}
                </p>

                {/* Button */}
                <div className="mt-8">
                  <Link
                    href={buttonHref}
                    className="inline-block rounded-xl bg-[#6ba47d] px-6 py-3 font-sans font-semibold text-white
                      transition-all duration-300 ease-out
                      hover:bg-[#4a8460] hover:scale-105"
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