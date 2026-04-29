'use client';

export function Footer() {
  const usefulLinks = [
    {
      label: 'Nepal Rastra Bank',
      href: 'https://www.nrb.org.np',
    },
    {
      label: 'Reliable Nepal Life Insurance',
      href: 'https://reliablenepallife.com.np',
    },
    {
      label: 'Karja Suchana Kendra',
      href: 'https://www.karjasuchana.com.np',
    },
  ];

  const aboutUsLinks = [
    { label: 'About', href: 'https://cycnlbsl.org.np/about-us' },
    { label: 'News', href: 'https://cycnlbsl.org.np/news' },
    { label: 'Notices', href: 'https://cycnlbsl.org.np/notices' },
    { label: 'Contact', href: 'https://cycnlbsl.org.np/contact-us' },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#005b5c] text-gray-100">
      <div className="pointer-events-none absolute -left-24 top-8 h-56 w-56 rounded-full bg-[#f6921e]/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-6 -right-14 h-44 w-44 rounded-full bg-[#72b4a8]/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div>
            <h3 className="mb-4 border-b border-[#f6921e]/70 pb-3 text-base font-bold tracking-wide text-white">
              About CYC Nepal
            </h3>
            <p className="text-base font-medium leading-7 text-start text-gray-100/95">
              CYC Nepal Laghubitta Bittiya Sanstha previously known as CYC
              (Chartare Youth Club) is a leading Microfinance in Nepal which is
              located in Sabhagriha Chowk,Pokhara.
            </p>
          </div>

          <div>
            <h3 className="mb-4 border-b border-[#f6921e]/70 pb-3 text-base font-bold tracking-wide text-white">
              Useful Links
            </h3>
            <ul className="space-y-2 text-base leading-7">
              {usefulLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex font-semibold text-gray-100 transition-colors hover:text-[#f6921e]"
                  >
                    <span className="border-b border-transparent bg-linear-to-r from-[#f6921e] to-[#f8b866] bg-size-[0%_2px] bg-bottom-left bg-no-repeat pb-0.5 transition-all duration-300 group-hover:bg-size-[100%_2px]">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 border-b border-[#f6921e]/70 pb-3 text-base font-bold tracking-wide text-white">
              About Us
            </h3>
            <ul className="space-y-2 text-base leading-7">
              {aboutUsLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex font-semibold text-gray-100 transition-colors hover:text-[#f6921e]"
                  >
                    <span className="border-b border-transparent bg-linear-to-r from-[#f6921e] to-[#f8b866] bg-size-[0%_2px] bg-bottom-left bg-no-repeat pb-0.5 transition-all duration-300 group-hover:bg-size-[100%_2px]">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 border-b border-[#f6921e]/70 pb-3 text-base font-bold tracking-wide text-white">
              Contact Us
            </h3>
            <div className="space-y-2 text-base font-semibold leading-7 text-gray-100/95">
              <p>
                <a
                  href="https://maps.google.com/?q=Sabhagriha+Chowk+Pokhara"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#f6921e]"
                >
                  Sabhagriha Chowk,Pokhara
                </a>
              </p>
              <p>
                <a
                  href="tel:+977061590894"
                  className="transition-colors hover:text-[#f6921e]"
                >
                  +(977) 061-590894, 590895
                </a>
              </p>
              <p>
                <a
                  href="mailto:info@cycnlbsl.org.np"
                  className="transition-colors hover:text-[#f6921e]"
                >
                  info@cycnlbsl.org.np
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#f6921e]/50 bg-[#00494a] pt-4 pb-15">
        <div className="mx-auto max-w-7xl px-6 text-center sm:px-8 lg:px-10">
          <p className="text-sm font-semibold leading-6 text-gray-100">
            2026 © CYC Nepal Laghubitta Bittiya Sanstha Ltd. All rights
            reserved. Developed By Techvion Technology
          </p>
        </div>
      </div>
    </footer>
  );
}
