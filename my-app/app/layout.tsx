import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TopContactBar } from "@/components/TopContactBar";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TopContactBar />
        {children}
      </body>
    </html>
  );
}
