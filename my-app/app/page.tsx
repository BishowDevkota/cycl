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
              The CYC Nepal
              <br />
              Laghubitta Bittiya
              <br />
              Sanstha Ltd.
            </h2>

            <div className="mt-5 h-1 w-32 rounded-full bg-[#f6921e]" />

            <p className="mt-6 text-base leading-8 text-[#2f2f2f] sm:text-[17px]">
              The CYC Nepal Laghubitta Bittiya Sanstha Ltd. is a leading microfinance in
              Nepal. It was registered on 11 February 2019 as a public company as a
              class &lsquo;D&rsquo; financial institution with Nepal Rastra Bank under Act,
              2063 and started formal microfinance operation from 15 March, 2019. CYC
              Nepal Laghubitta Bittiya Sanstha was previously known as CYC (Chartare
              Youth Club), located at Samikshalaya Road, Baglung.
            </p>

            <p className="mt-4 text-base leading-8 text-[#2f2f2f] sm:text-[17px]">
              Currently, CYC Nepal Laghubitta Bittiya Sanstha is providing microfinance
              services to more than 59,000 deprived households from hilly and mountainous
              regions of Nepal, with prime focus on low-income households, asset-less,
              and self-employed people in the informal sector. Besides financial
              services, it also focuses on social development, cultural promotion,
              educational development, and skill development through its 124 fully
              operated branch offices located all over Nepal.
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
