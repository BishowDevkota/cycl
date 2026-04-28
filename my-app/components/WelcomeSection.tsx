import Image from "next/image";
import Link from "next/link";
import type { AboutCompanyInfo } from "@/services/about-company-info-service";
import { RichTextContent } from "@/components/public/RichTextContent";

type WelcomeSectionProps = {
  aboutCompanyInfo: AboutCompanyInfo | null;
};

export function WelcomeSection({ aboutCompanyInfo }: WelcomeSectionProps) {
  const hasCmsContent = Boolean(aboutCompanyInfo?.heading || aboutCompanyInfo?.description);

  return (
    <section className="w-full bg-[#efefef] pb-10 sm:pb-14 lg:pb-16">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-10 px-4 sm:px-6 lg:grid-cols-[1.06fr_0.94fr] lg:gap-12 lg:px-8">
        <div className="relative min-h-[430px] sm:min-h-[520px]">
          <div className="absolute left-0 top-0 h-[270px] w-[360px] overflow-hidden sm:h-[323px] sm:w-[430px] lg:h-[390px] lg:w-[520px]">
            <div className="h-[360px] w-[360px] -translate-y-[90px] rounded-full bg-[#007A8E] sm:h-[430px] sm:w-[430px] sm:-translate-y-[108px] lg:h-[520px] lg:w-[520px] lg:-translate-y-[130px]" />
          </div>

          <div className="relative z-10 px-6 pt-6 sm:px-10 sm:pt-8 lg:px-12 lg:pt-10">
            <div className="flex">

            <h2 className="max-w-[20ch] text-[1.2rem] font-semibold leading-[1.14] tracking-[0.01em] text-white sm:text-[2rem] lg:text-[2.2rem]">
              <p className="">{aboutCompanyInfo?.heading || "Welcome To CYC Nepal Laghubitta Bittiya Sanstha Ltd."}</p>
            </h2>
            </div>

            <div
              className="relative mt-5 h-[240px] w-full max-w-[520px] overflow-hidden border-[5px] border-[#d6ab33] bg-white/8 shadow-[0_10px_30px_rgba(0,0,0,0.12)] sm:mt-6 sm:h-[320px] lg:mt-7 lg:h-[395px]"
              aria-label="About company image"
            >
              {aboutCompanyInfo?.imageUrl ? (
                <Image
                  src={aboutCompanyInfo.imageUrl}
                  alt={aboutCompanyInfo.heading || "About company image"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 520px, 520px"
                  className="object-cover"
                  priority
                />
              ) : (
                <Image
                  src="/welcome-certificate.png"
                  alt="CYC certificate"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 520px, 520px"
                  className="object-cover"
                  priority
                />
              )}
              <div className="absolute inset-[8px] border border-white/60 bg-white/6" aria-hidden="true" />
            </div>
          </div>
        </div>

        <article className="max-w-[650px] pt-8 text-[#2e3f54] sm:pt-10 lg:pt-12">
          {hasCmsContent ? (
            <>
              <RichTextContent
                html={aboutCompanyInfo?.description || ""}
                className="rich-text-content text-[17px] leading-[1.75] text-[#32455e] sm:text-[18px]"
              />

              <Link
                href="/about-us"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-[#007A8E] px-7 py-3 text-base font-semibold text-white shadow-[0_8px_22px_rgba(0,122,142,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#006a7b]"
              >
                Read More
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
            </>
          ) : (
            <>
              <p className="text-[17px] leading-[1.7] text-[#32455e] sm:text-[18px]">
                <span className="font-semibold text-[#32455e] text-justify">
                  The CYC Nepal Laghubitta Bittiya Sanstha Ltd. is a leading Microfinance in Nepal.
                </span>{" "}
                It was registered on 11 February 2019 as a public company as a class &apos;D&apos; financial institution with the Nepal Rastra Bank under Act, 2063 and started formal microfinance operation from 15 March, 2019. CYC Nepal Laghubitta Bittiya Sanstha previously known as CYC (Chartare Youth Club) which is located in Samikshalaya Road Baglung.
              </p>

              <p className="mt-6 text-[17px] leading-[1.7] text-[#3a4d64] sm:text-[18px]">
                Currently CYC Nepal Laghubitta Bittiya Sanstha is providing microfinance services to more than 59000 deprived household from Hilly and Mountainous regions of Nepal with prime focus on low-income households, assets-less, self-employed in the informal sector to uplift their livelihood increasing involvement in economic activities and income generating activities. Besides all these financial services, it also focuses on their social development, cultural promotion, educational development, skill development &amp; many more by its fully operated 124 branch offices which are located in All over the Nepal.
              </p>

              <Link
                href="/about-us"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-[#007A8E] px-7 py-3 text-base font-semibold text-white shadow-[0_8px_22px_rgba(0,122,142,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#006a7b]"
              >
                Read More
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
            </>
          )}
        </article>
      </div>
    </section>
  );
}