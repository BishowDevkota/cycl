import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TopContactBar } from "@/components/TopContactBar";
import "../globals.css"; // Note the path change if moved to [locale]
import BottomMarquee from "@/components/BottomMarquee";
import GoToTopButton from "@/components/GoToTopButton";

// next-intl imports
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CYC Nepal Laghubitta Bittiya Sanstha Ltd.",
  description: "Official website for CYC Nepal Laghubitta Bittiya Sanstha Ltd.",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // App Router params are now Promises
}) {
  const { locale } = await params;

  // Validate supported locales
  const locales = ['en', 'ne'];
  if (!locales.includes(locale)) {
    notFound();
  }

  // Fetch messages for the current locale
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Pass messages to the provider so client components can use translations */}
        <NextIntlClientProvider messages={messages}>
          <TopContactBar />
          {children}
          <GoToTopButton />
          <BottomMarquee />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}