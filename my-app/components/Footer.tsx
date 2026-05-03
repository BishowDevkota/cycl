'use client';

import Image from 'next/image';
import React from 'react';
import { 
  FaFacebookF, 
  FaInstagram, 
  FaYoutube, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt 
} from 'react-icons/fa';

export function Footer() {
  const usefulLinks = [
    { label: 'Nepal Rastra Bank', href: 'https://www.nrb.org.np' },
    { label: 'Reliable Nepal Life Insurance', href: 'https://reliablenepallife.com.np' },
    { label: 'Karja Suchana Kendra', href: 'https://www.karjasuchana.com.np' },
  ];

  const aboutUsLinks = [
    { label: 'About', href: 'https://cycnlbsl.org.np/about-us' },
    { label: 'News', href: 'https://cycnlbsl.org.np/news' },
    { label: 'Notices', href: 'https://cycnlbsl.org.np/notices' },
    { label: 'Contact', href: 'https://cycnlbsl.org.np/contact-us' },
  ];

  return (
    <footer className="bg-teal-deep text-off-white font-sans">
      <div className="relative mx-auto max-w-7xl px-8 py-14 lg:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Section */}
          <div className="space-y-6">
            {/* Increased Image size slightly */}
            <Image 
              src="/cyc-logo.jpg" 
              alt="CYC Nepal Logo" 
              width={220} 
              height={85} 
              className="h-auto w-auto" 
            />
          
            {/* Decreased from text-lg to text-base */}
            <p className="text-base leading-relaxed opacity-90">
              CYC Nepal Laghubitta Bittiya Sanstha previously known as CYC
              (Chartare Youth Club) is a leading Microfinance in Nepal which is
              located in Sabhagriha Chowk, Pokhara.
            </p>
          </div>

          {/* Useful Links */}
          <div>
            {/* Decreased from text-xl to text-lg */}
            <h3 className="mb-5 text-lg font-bold uppercase tracking-wider text-mint">
              Useful Links
            </h3>
            {/* Decreased from text-lg to text-base */}
            <ul className="space-y-3 text-base">
              {usefulLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-mint"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us Links */}
          <div>
            {/* Decreased from text-xl to text-lg */}
            <h3 className="mb-5 text-lg font-bold uppercase tracking-wider text-mint">
              About Us
            </h3>
            {/* Decreased from text-lg to text-base */}
            <ul className="space-y-3 text-base">
              {aboutUsLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="transition-colors hover:text-mint"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social Section */}
          <div className="space-y-6">
            <div>
              {/* Decreased from text-xl to text-lg */}
              <h3 className="mb-5 text-lg font-bold uppercase tracking-wider text-mint">
                Follow Us On
              </h3>
              <div className="flex gap-4">
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-400 transition-all hover:bg-mint hover:text-teal-deep hover:border-transparent">
                  <FaFacebookF size={16} />
                </a>
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-400 transition-all hover:bg-mint hover:text-teal-deep hover:border-transparent">
                  <FaInstagram size={16} />
                </a>
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-400 transition-all hover:bg-mint hover:text-teal-deep hover:border-transparent">
                  <FaYoutube size={16} />
                </a>
              </div>
            </div>

            {/* Decreased from text-lg to text-base */}
            <div className="space-y-3 text-base">
              <h3 className="text-lg font-bold uppercase tracking-wider text-mint">Contact Us</h3>
              <div className="flex items-start gap-3">
                <FaPhoneAlt className="mt-1 text-mint" size={14} />
                <a href="tel:+977061590894" className="hover:text-mint">+(977) 061-590894</a>
              </div>
              <div className="flex items-start gap-3">
                <FaEnvelope className="mt-1 text-mint" size={14} />
                <a href="mailto:info@cycnlbsl.org.np" className="hover:text-mint">info@cycnlbsl.org.np</a>
              </div>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-mint" size={14} />
                <span>Sabhagriha Chowk, Pokhara, Nepal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-[#00494a] pb-15 pt-4">
        <div className="mx-auto max-w-7xl px-8 text-center text-sm opacity-80">
          <p>
            2026 © CYC Nepal Laghubitta Bittiya Sanstha Ltd. All rights
            reserved. Developed By Techvion Technology
          </p>
        </div>
      </div>
    </footer>
  );
}