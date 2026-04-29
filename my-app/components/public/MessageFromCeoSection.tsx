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
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(entry.target); // stop after first trigger
      }
    },
    { threshold: 0.15 }
  );

  if (sectionRef.current) observer.observe(sectionRef.current);

  return () => observer.disconnect();
}, []);

  return (
    <section className="overflow-hidden bg-transparent px-4 pb-6 pt-2 md:px-6 md:pb-8 md:pt-2">
      <div className="mx-auto max-w-6xl" ref={sectionRef}>
        <div className="flex flex-col lg:flex-row">

          {/* Left Panel — slides in from extreme left */}
          <div
            style={{
              transition: "transform 2.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 2.4s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: visible ? "translateX(0)" : "translateX(-10vw)",
              opacity: visible ? 1 : 0,
            }}
            className="relative lg:w-2/5 border border-slate-200 rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none overflow-hidden bg-white"
          >
            <div className="aspect-4/5 w-full lg:h-full group overflow-hidden bg-slate-100">
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

          {/* Right Panel — slides in from extreme right */}
          <article
            style={{
              transition: "transform 2.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, opacity 2.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
              transform: visible ? "translateX(0)" : "translateX(10vw)",
              opacity: visible ? 1 : 0,
            }}
            className="flex flex-col justify-center lg:w-3/5 bg-white p-6 md:p-8 lg:p-10"
          >
            {/* Header */}
            <div className="mb-6">
              <p className="font-sans text-xs font-black uppercase tracking-[0.2em] text-[#0a2d52]/50">
                Message From
              </p>
              <h2 className="font-sans text-4xl font-black text-[#0a2d52] md:text-5xl">
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
                className="text-start font-sans text-[15px] font-medium leading-relaxed text-slate-700 md:text-[16.5px]"
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
    </section>
  );
}