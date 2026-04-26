import { HeroSection } from '@/components/HeroSection';
import Image from 'next/image';
import Link from 'next/link';
import { getAboutCompanyInfo } from '@/lib/about-company-info-service';
import { getMessageFromCeo } from '@/lib/message-from-ceo-service';

export default async function Home() {
  const aboutCompanyInfo = await getAboutCompanyInfo();
  const messageFromCeo = await getMessageFromCeo();

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      <main className="flex-1 w-full bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <article className="bg-[#F9F9F9] p-6 sm:p-8 lg:p-10">
            <h2 className="text-3xl font-semibold leading-tight text-[#1f3359] sm:text-4xl">
              {aboutCompanyInfo?.heading || 'The CYC Nepal Laghubitta Bittiya Sanstha Ltd.'}
            </h2>

            <div className="mt-5 h-1 w-32 rounded-full bg-[#f6921e]" />

            <p className="mt-6 whitespace-pre-line text-base leading-8 text-[#2f2f2f] sm:text-[17px]">
              {aboutCompanyInfo?.description || 'The CYC Nepal Laghubitta Bittiya Sanstha Ltd. is a leading microfinance in Nepal.'}
            </p>

            <Link
              href="#"
              className="mt-8 inline-flex items-center justify-center rounded-sm bg-[#1f3359] px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-[#152749]"
            >
              Read More
            </Link>
          </article>

          <article className="bg-[#F0E5D8] p-6 sm:p-8 lg:p-10">
            <h2 className="text-3xl font-semibold leading-tight text-[#1f3359] sm:text-4xl">
              {messageFromCeo?.heading || 'Message From CEO'}
            </h2>

            <div className="mt-5 h-1 w-32 rounded-full bg-[#f6921e]" />

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[1.6fr_1fr] md:items-start">
              <div>
                <p className="whitespace-pre-line text-base leading-8 text-[#2f2f2f] sm:text-[17px]">
                  {messageFromCeo?.description || 'First, I would like to extend my warm regards and heartfelt welcome to all stakeholders associated with this financial institution.'}
                </p>
              </div>

              <div className="relative mx-auto h-[320px] w-full max-w-[260px] overflow-hidden bg-white/70">
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
                    sizes="(max-width: 768px) 240px, 260px"
                    className="object-cover"
                  />
                )}
              </div>
            </div>

            <Link
              href="#"
              className="mt-8 inline-flex items-center justify-center rounded-sm bg-[#1f3359] px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-[#152749]"
            >
              Read More
            </Link>
          </article>
        </div>
      </main>
    </div>
  );
}
