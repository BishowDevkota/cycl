import { HeroSection } from '@/components/HeroSection';
import { WelcomeSection } from '@/components/WelcomeSection';
import { CompanyStatsSection } from '@/components/CompanyStatsSection';
import { Footer } from '@/components/Footer';
import { getMessageFromCeo } from '@/services/message-from-ceo-service';
import ServicesSection from '@/components/ServicesSection';
import { getAboutCompanyInfo } from '@/services/about-company-info-service';
import NewsAndNotices from '@/components/NewsAndNotices';
import ContactHome from '@/components/ContactHome';
import { MessageFromCeoSection } from '@/components/public/MessageFromCeoSection';
import { getContactDetails } from '@/services/contact-service';

export default async function Home() {
  const aboutCompanyInfo = await getAboutCompanyInfo();
  const messageFromCeo = await getMessageFromCeo();
  const rawContactDetails = await getContactDetails();

  const contactDetails = rawContactDetails
    ? {
        phone: {
          text: rawContactDetails.phone?.text ?? "",
          link: rawContactDetails.phone?.link ?? "",
        },
        email: {
          text: rawContactDetails.email?.text ?? "",
          link: rawContactDetails.email?.link ?? "",
        },
        facebook: {
          text: rawContactDetails.facebook?.text ?? "",
          link: rawContactDetails.facebook?.link ?? "",
        },
        whatsapp: {
          text: rawContactDetails.whatsapp?.text ?? "",
          link: rawContactDetails.whatsapp?.link ?? "",
        },
        location: {
          text: rawContactDetails.location?.text ?? "",
          link: rawContactDetails.location?.link ?? "",
        },
        isActive: rawContactDetails.isActive ?? false,
      }
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <WelcomeSection aboutCompanyInfo={aboutCompanyInfo} />
      <main className="flex-1 w-full pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32">
        <MessageFromCeoSection
          messageFromCeo={messageFromCeo}
          buttonLabel="Full Message"
          buttonHref="/message-from-ceo"
        />
        <CompanyStatsSection />
        <ServicesSection />
        <NewsAndNotices />
        <ContactHome contactDetails={contactDetails} />
      </main>
      <Footer />
    </div>
  );
}