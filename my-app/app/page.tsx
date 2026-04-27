import { HeroSection } from '@/components/HeroSection';
import { WelcomeSection } from '@/components/WelcomeSection';
import { CompanyStatsSection } from '@/components/CompanyStatsSection';
import { Footer } from '@/components/Footer';
import { getMessageFromCeo } from '@/services/message-from-ceo-service';
import ServicesSection from '@/components/ServicesSection';
import { getAboutCompanyInfo } from '@/services/about-company-info-service';
import NewsAndNotices from '@/components/NewsAndNotices';




export default async function Home() {
  const aboutCompanyInfo = await getAboutCompanyInfo();
  const messageFromCeo = await getMessageFromCeo();

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <WelcomeSection aboutCompanyInfo={aboutCompanyInfo} />

      <main className="relative flex-1 w-full overflow-hidden bg-[linear-gradient(180deg,#f7fafc_0%,#ffffff_45%,#f6f8fb_100%)] pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32">
        <div className="pointer-events-none absolute -top-14 left-1/2 h-56 w-[65vw] -translate-x-1/2 rounded-full bg-[#8ec5b9]/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-6 -right-24 h-40 w-40 rounded-full bg-[#f3c98f]/25 blur-3xl" />

        <MessageFromCeoSection
          messageFromCeo={messageFromCeo}
          buttonLabel="Full Message"
          buttonHref="/message-from-ceo"
        />

        <CompanyStatsSection />
        <ServicesSection/>
        <NewsAndNotices />
        <ContactHome />
      </main>

      <Footer />
    </div>
  );
}
