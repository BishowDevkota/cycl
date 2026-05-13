import Image from "next/image";
import { AboutUsPillars } from "@/components/public/AboutUsPillars";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { RichTextContent } from "@/components/public/RichTextContent";
import { getAboutCompanyInfo } from "@/services/about-company-info-service";
import { aboutCompanyProfile } from "@/lib/public-content";
import { getTranslations } from "next-intl/server";

// const introductionHtml = `
//   <p className="text-base">The CYC Nepal Laghubitta Bittiya Sanstha Ltd. is a leading microfinance institution in Nepal. It was registered on 11 February 2019 as a public company as a class 'D' financial institution with the Nepal Rastra Bank under Act, 2063 and started formal microfinance operation from 15 March, 2019. CYC Nepal Laghubitta Bittiya Sanstha previously known as CYC (Chartare Youth Club) which is located in Samikshalaya Road, Baglung.</p>
//   <p>Currently CYC Nepal Laghubitta Bittiya Sanstha is providing microfinance services to more than 59000 deprived households from hilly and mountainous regions of Nepal with prime focus on low-income households, asset-less, self-employed in the informal sector to uplift their livelihood by increasing involvement in economic activities and income-generating activities. Besides all these financial services, it also focuses on their social development, cultural promotion, educational development, skill development and many more through its fully operated 124 branch offices which are located all over Nepal.</p>
// `;

export default async function AboutUsPage() {
  const t = await getTranslations("about-us");
const localizedGoals = t.raw("goals_list");

// Handle the logic to combine or fallback
// If both are arrays, you can spread them into one


  // 2. Select ONLY one language, don't combine them
  const finalGoals = (Array.isArray(localizedGoals) && localizedGoals.length > 0)
    ? localizedGoals
    : aboutCompanyProfile.goals;
  const introductionHtml = `<p className="text-base">${t("description_para1")}</p> </br>
  <p>${t("description_para2")}</p>`;
  const aboutCompanyInfo = await getAboutCompanyInfo();
  const introductionTitle =
    aboutCompanyInfo?.heading || "CYC Nepal Laghubitta Bittiya Sanstha Ltd.";
  const overviewHtml =  introductionHtml || aboutCompanyInfo?.description ;
  const vision =  t("vision_description") || aboutCompanyProfile?.vision;
  const mission =  t("mission_description") || aboutCompanyProfile?.mission;
  const goals = finalGoals;
  return (
    <PublicPageShell 
    imageUrl= "/banner/banner2.jpg"    
      title={`${t("banner_title")}`}
      description={`${t("banner_description")}`}
      actions={[
        { label: `${t("chairman_message_btn")}`, href: "/about-us/chairman-message" },
        { label: `${t("board_of_directors_btn")}`, href: "/about-us/board-of-directors" },
      ]}
    >
      <section className="min-h-svh py-2 flex justify-between">
        <div className="grid w-[90%] gap-4 lg:grid-cols-[3fr_2fr] lg:items-center">
          <div className="flex items-center justify-center">
            <Image
              src="/images/cyc-logo-introduction.png"
              alt="CYC Nepal Laghubitta Bittiya Sanstha logo"
              width={900}
              height={900}
              sizes="(min-width: 1024px) 45vw, 80vw"
              className="h-auto w-full max-w-105 object-contain lg:max-w-115 "
              priority
            />
          </div>

          <div>
            <SectionHeading eyebrow={`${t("introduction_label")}`} title={`${t("welcome_title")}`} />

            <RichTextContent
              html={overviewHtml}
              className="rich-text-content text-sm leading-7 text-slate-700 sm:text-base"
            />
          </div>

        </div>
      </section>

      <AboutUsPillars
        vision={vision}
        mission={mission}
        goals={goals}
      />

      
    </PublicPageShell>
  );
}
