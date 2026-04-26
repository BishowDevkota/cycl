import { HeroSection } from '@/components/HeroSection';
import { WelcomeSection } from '@/components/WelcomeSection';
import { CompanyStatsSection } from '@/components/CompanyStatsSection';
import Image from 'next/image';
import Link from 'next/link';
import { getMessageFromCeo } from '@/lib/message-from-ceo-service';

export default async function Home() {
  const messageFromCeo = await getMessageFromCeo();

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <WelcomeSection />

      <main className="relative flex-1 w-full overflow-hidden bg-[linear-gradient(180deg,#f7fafc_0%,#ffffff_45%,#f6f8fb_100%)] py-12 sm:py-16 lg:py-20">
        <div className="pointer-events-none absolute -top-14 left-1/2 h-56 w-[65vw] -translate-x-1/2 rounded-full bg-[#8ec5b9]/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-6 right-[-6rem] h-40 w-40 rounded-full bg-[#f3c98f]/25 blur-3xl" />

        <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <article className="animate-section-fade-up [animation-delay:140ms] relative overflow-hidden rounded-[28px] border border-[#f2d8b7]/70 bg-[linear-gradient(155deg,#fff9f1_0%,#fffdf8_42%,#f7efe4_100%)] p-6 shadow-[0_18px_44px_rgba(122,79,26,0.12)] ring-1 ring-white/80 sm:p-8 lg:p-10">
            <h2 className="text-3xl font-semibold leading-tight text-[#112742] sm:text-4xl lg:text-[2.3rem]">
              {messageFromCeo?.heading || 'Message From CEO'}
            </h2>

            <div className="mt-5 h-[3px] w-24 rounded-full bg-gradient-to-r from-[#f6921e] to-[#f8b866]" />

            <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-[1.4fr_1fr] md:items-start md:gap-7">
              <div className="relative rounded-2xl border border-white/80 bg-white/70 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <span className="pointer-events-none absolute -left-2 -top-5 text-[64px] leading-none text-[#e0bb8f]" aria-hidden="true">
                  &ldquo;
                </span>
                <p className="relative whitespace-pre-line text-base leading-8 text-slate-700 sm:text-[17px]">
                  {messageFromCeo?.description || 'First, I would like to extend my warm regards and heartfelt welcome to all stakeholders associated with this financial institution.'}
                </p>
              </div>

              <div className="relative mx-auto w-full max-w-[220px] sm:max-w-[230px]">
                <div className="pointer-events-none absolute -inset-2 rounded-[26px] bg-gradient-to-br from-[#ffe6c6] to-[#b8d8d0] opacity-70 blur-[18px]" />
                <div className="relative aspect-[7/9] overflow-hidden rounded-[22px] border border-white/80 bg-white shadow-[0_16px_34px_rgba(17,39,66,0.14)]">
                  {messageFromCeo?.imageUrl ? (
                    <img
                      src={messageFromCeo.imageUrl}
                      alt={messageFromCeo.heading || 'CEO portrait'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src="/ceo-placeholder.svg"
                      alt="CEO portrait"
                      fill
                      sizes="(max-width: 768px) 210px, 230px"
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
            </div>

            <Link
              href="#"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full border border-[#112742]/10 bg-[#112742] px-7 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0d837f] hover:shadow-[0_14px_26px_rgba(13,131,127,0.28)]"
            >
              Full Message
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </article>
        </div>

        <CompanyStatsSection />
      </main>
    </div>
  );
}
