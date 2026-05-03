"use client";

import Image from "next/image";
import Link from "next/link";
import type { AboutCompanyInfo } from "@/services/about-company-info-service";
import { RichTextContent } from "@/components/public/RichTextContent";
import { useLocale, useTranslations } from "next-intl";

type WelcomeSectionProps = {
  aboutCompanyInfo: AboutCompanyInfo | null;
};

export function WelcomeSection({ aboutCompanyInfo }: WelcomeSectionProps) {
  const hasCmsContent = Boolean(aboutCompanyInfo?.heading || aboutCompanyInfo?.description);
  const locale = useLocale();
  const t = useTranslations('Home');

  const localizedHeading =
    locale === "ne"
      ? aboutCompanyInfo?.["heading-ne"] || aboutCompanyInfo?.heading || aboutCompanyInfo?.["heading-en"] || ""
      : aboutCompanyInfo?.["heading-en"] || aboutCompanyInfo?.heading || aboutCompanyInfo?.["heading-ne"] || "";

  const localizedDescription =
    locale === "ne"
      ? aboutCompanyInfo?.["description-ne"] || aboutCompanyInfo?.description || aboutCompanyInfo?.["description-en"] || ""
      : aboutCompanyInfo?.["description-en"] || aboutCompanyInfo?.description || aboutCompanyInfo?.["description-ne"] || "";

  return (
    <section className="w-full bg-[#efefef] pb-10 sm:pb-14 lg:pb-16">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-10 px-4 sm:px-6 lg:grid-cols-[1.06fr_0.94fr] lg:gap-12 lg:px-8">
        {/* Left Side: Visual Elements */}
        <div className="relative min-h-[430px] sm:min-h-[520px]">
          <div className="absolute left-0 top-0 h-[270px] w-[360px] overflow-hidden sm:h-[323px] sm:w-[430px] lg:h-[390px] lg:w-[520px]">
            <div className="h-[360px] w-[360px] -translate-y-[90px] rounded-full bg-[#007A8E] sm:h-[430px] sm:w-[430px] sm:-translate-y-[108px] lg:h-[520px] lg:w-[520px] lg:-translate-y-[130px]" />
          </div>

          <div className="relative z-10 px-6 pt-6 sm:px-10 sm:pt-8 lg:px-12 lg:pt-10">
            <div className="flex">
              <h2 className="max-w-[20ch] text-[1.2rem] font-semibold leading-[1.14] tracking-[0.01em] text-white sm:text-[2rem] lg:text-[2.2rem]">
                <p>{localizedHeading || t('welcome_title')}</p>
              </h2>
            </div>

            <div
              className="relative mt-5 h-[240px] w-full max-w-[520px] overflow-hidden border-[5px] border-[#d6ab33] bg-white/8 shadow-[0_10px_30px_rgba(0,0,0,0.12)] sm:mt-6 sm:h-[320px] lg:mt-7 lg:h-[395px]"
              aria-label="About company image"
            >
              <Image
                src={aboutCompanyInfo?.imageUrl || "/welcome-certificate.png"}
                alt={aboutCompanyInfo?.heading || "About company image"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 520px, 520px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-[8px] border border-white/60 bg-white/6" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Right Side: Content */}
        <article className="max-w-[650px] pt-8 text-[#2e3f54] sm:pt-10 lg:pt-12">
          {hasCmsContent ? (
            <>
              <RichTextContent
                html={localizedDescription || (t('welcome_text1') + '<br><br>' + t('welcome_text2'))}
                className="rich-text-content text-[17px] leading-[1.75] text-[#32455e] sm:text-[18px]"
              />
            </>
          ) : (
            <>
              {/* Render welcome_text1 */}
              <p className="text-[17px] leading-[1.7] text-[#32455e] sm:text-[18px] text-justify font-medium">
                {t('welcome_text1')}
              </p>
              <br/>

              {/* Render welcome_text2 with margin top */}
              <p 
                className="mt-6 text-[17px] leading-[1.7] text-[#3a4d64] sm:text-[18px] text-justify"
                dangerouslySetInnerHTML={{ __html: t.raw('welcome_text2') }}
              />
            </>
          )}

          <Link
            href="/about-us"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-[#007A8E] px-7 py-3 text-base font-semibold text-white shadow-[0_8px_22px_rgba(0,122,142,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#006a7b]"
          >
            {t("read_more")}
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
    </section>
  );
}