import Image from "next/image";
import Link from "next/link";

import {
  FiImage,
  FiPhone,
  FiInfo,
  FiUser,
  FiBarChart2,
  FiBell,
  FiServer,
} from "react-icons/fi";

const palette = {
  deep: "#005B5C",
  teal: "#007A8E",
  mint: "#A8D8B9",
  sand: "#F0E5D8",
  off: "#F9F9F9",
};

function Card({ href, title, desc, icon: Icon, accent }: any) {
  return (
    <div     
      className="group flex flex-col p-6 bg-white border border-zinc-100 shadow-[0_4px_14px_rgba(2,6,23,0.06)] transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(2,6,23,0.12)]"
      
    >
      <div className="flex items-center gap-4">
        <div
          className="flex h-10 w-12 items-center justify-center rounded-lg text-white bg-teal-700"
        
        >
          <Icon className="text-2xl" />
        </div>

        <div>
          <p className="text-lg font-semibold text-zinc-900">{title}</p>
          <p className="mt-1 text-sm text-zinc-600">{desc}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end">
      <Link href={href}>
        <span className=" flex items-center gap-1 text-base text-zinc-500 group-hover:text-zinc-700 transition">
          <span>Open</span> <Image className="-rotate-90" src="/images/newsAndNotices/arrow.png" alt="Arrow" width={16} height={16} />
        </span>
      </Link>
      </div>
    </div>
  );
}

export default function AdminHomePage() {
  return (
    <main>
      <header className="mb-6 bg-teal-deep">
        <div className="flex items-center justify-between rounded-2xl px-6 py-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Homepage Management
            </h1>
            <p className="mt-1 text-sm text-white/90">
              Central control panel for public homepage content.
            </p>
          </div>
         
        </div>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          href="/admin/home/hero"
          title="Hero Section"
          desc="Manage the hero carousel, slides, and CTAs."
          icon={FiImage}
          accent={palette.teal}
        />

        <Card
          href="/admin/home/contact"
          title="Contact Details"
          desc="Phone, email and social links displayed on homepage."
          icon={FiPhone}
          accent={palette.mint}
        />

        <Card
          href="/admin/home/about-company-info"
          title="About Company Info"
          desc="Heading and description for the company section."
          icon={FiInfo}
          accent={palette.deep}
        />

        <Card
          href="/admin/home/message-from-ceo"
          title="Message From CEO"
          desc="CEO message content and image."
          icon={FiUser}
          accent={palette.teal}
        />

        <Card
          href="/admin/home/company-stats"
          title="Company Stats"
          desc="Update numbers for branches, staff, deposits, and centers."
          icon={FiBarChart2}
          accent={palette.mint}
        />

        <Card
          href="/admin/home/notices"
          title="Home Notices"
          desc="Manage popup notices with text and images."
          icon={FiBell}
          accent={palette.deep}
        />

        <Card
          href="/admin/home/services"
          title="Our Services Cards"
          desc="Configure the services cards shown on homepage."
          icon={FiServer}
          accent={palette.teal}
        />
      </section>
    </main>
  );
}
