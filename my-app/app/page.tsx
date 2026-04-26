import { HeroSection } from '@/components/HeroSection';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      <main className="flex-1 w-full bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <article className="bg-[#F9F9F9] p-6 sm:p-8 lg:p-10">
            <h2 className="text-3xl font-semibold leading-tight text-[#1f3359] sm:text-4xl">
              Welcome to NESDO
              <br />
              Sambridha Laghubitta
              <br />
              Bittiye Sanstha Limited
            </h2>

            <div className="mt-5 h-1 w-32 rounded-full bg-[#f6921e]" />

            <p className="mt-6 text-base leading-8 text-[#2f2f2f] sm:text-[17px]">
              NESDO Sambridha Laghubitta Bittiya Sanstha Ltd is promoted by National
              Educational and Social Development Organization, NESDO Nepal. The
              institution is dedicated to inclusive micro-finance services and supports
              underprivileged families through branch networks across Nepal.
            </p>

            <p className="mt-4 text-base leading-8 text-[#2f2f2f] sm:text-[17px]">
              With a strong social foundation, NSLBSL continues to expand opportunities
              for self-reliant livelihoods through accessible financial programs in
              multiple districts.
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
              Message From CEO
            </h2>

            <div className="mt-5 h-1 w-32 rounded-full bg-[#f6921e]" />

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[1.6fr_1fr] md:items-start">
              <div>
                <p className="text-base leading-8 text-[#2f2f2f] sm:text-[17px]">
                  First, I would like to extend my warm regards and heartfelt welcome to
                  all stakeholders associated with this financial institution. The
                  historical background of this institution is closely linked to our
                  founding organization, NESDO Nepal.
                </p>

                <p className="mt-4 text-base leading-8 text-[#2f2f2f] sm:text-[17px]">
                  Guided by the vision of building a self-reliant, inclusive, and
                  prosperous Nepal, our micro-finance program has steadily expanded and
                  reached thousands of families through branches across districts.
                </p>
              </div>

              <div className="relative mx-auto h-[320px] w-full max-w-[260px] overflow-hidden bg-white/70">
                <Image
                  src="/ceo-placeholder.svg"
                  alt="CEO portrait"
                  fill
                  sizes="(max-width: 768px) 240px, 260px"
                  className="object-cover"
                />
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
