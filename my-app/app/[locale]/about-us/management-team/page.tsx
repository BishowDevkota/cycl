import Image from "next/image";
import { AboutUsPageLinks } from "@/components/public/AboutUsPageLinks";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

export default function ManagementTeamPage() {
  const managementProfiles = [
    {
      name: "Dolindra Prasad Sharma",
      role: "Chief Executive Officer",
      image: "/managementTeam/dolindra-pd-sharma.jpg",
      phone: "9851227052",
      email: "companysecretary@cycnlbsl.org.np",
      address: "Kathmandu-29, Anamnagar",
    },
    {
      name: "Baburam Kunwar",
      role: "Deputy Chief Executive Officer",
      image: "/managementTeam/Baburam-Kunwar-Manager-HO.jpg",
      phone: "9857646316",
      email: "dceo@cycnlbsl.org.np",
      address: "Isma 01, Gulmi",
    },
    {
      name: "Sangita Paudel",
      role: "Training Department Head",
      image: "/managementTeam/Sangita-Sharma-Paudel.jpg",
      phone: "9857646220",
      email: "training.cycnlbsl@gmail.com",
      address: "Ba na pa -03, Baglung",
    },
  ];

  const top = managementProfiles.find((m) => /chief|ceo/i.test(m.role)) || managementProfiles[0];
  const others = managementProfiles.filter((m) => m !== top);

  return (
    <PublicPageShell
      imageUrl="/banner/banner.jpg"
      eyebrow="About Us"
      title="Management Team"
      description="Meet the management team responsible for operations, execution quality, and client-focused delivery."
      actions={[
        { label: "Introduction", href: "/about-us" },
        { label: "Chairman Message", href: "/about-us/chairman-message" },
      ]}
    >
      <section className="bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Management Team"
          title="Operational Leadership"
          description="Leadership team driving daily operations, service standards, and institutional performance."
        />

        <div className="flex flex-col items-center gap-20">
          {/* Top leader centered */}
          <div className="w-full flex justify-center">
            <div className="w-full max-w-sm">
              <article
                className="group relative overflow-hidden bg-white shadow-[0_16px_34px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(15,23,42,0.12)] focus-within:-translate-y-1 focus-within:shadow-[0_22px_46px_rgba(15,23,42,0.12)] focus-within:ring-1 focus-within:ring-[#0d837f] focus-within:ring-offset-2"
                tabIndex={0}
                aria-label={`${top.name}, ${top.role}`}
              >
                <div className="relative aspect-3/4 w-full overflow-hidden">
                  <Image
                    src={top.image}
                    alt={`${top.name} portrait`}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 768px) 45vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-focus-within:scale-105 group-hover:brightness-90"
                  />
                </div>

                <div className="relative z-10 p-4 text-center group-hover:opacity-0 group-focus-within:opacity-0">
                  <h3 className="text-xl font-bold text-slate-800">{top.name}</h3>
                  <p className="text-base text-bold text-slate-500">{top.role}</p>
                </div>

                <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-slate-900/80 via-slate-900/60 to-transparent p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-auto gap-2">
                  <p className="text-lg font-bold uppercase tracking-[0.2em] text-white">Contact</p>
                  <div className="mt-2 flex flex-col items-start gap-2 text-left">
                    <div className="flex items-center gap-2 text-base font-semibold">
                      <FiPhone className="w-5 h-5 text-white" />
                      <span>{top.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <FiMail className="w-5 h-5 text-white" />
                      <span>{top.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <FiMapPin className="w-4 h-4 text-white/80" />
                      <span>{top.address}</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>

          {/* Two profiles below */}
          <div className="grid gap-10 sm:grid-cols-2 w-full">
            {others.map((member) => (
              <div key={member.email} className="flex justify-center">
                <div className="w-full max-w-sm">
                  <article
                    className="group relative overflow-hidden bg-white shadow-[0_16px_34px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(15,23,42,0.12)] focus-within:-translate-y-1 focus-within:shadow-[0_22px_46px_rgba(15,23,42,0.12)] focus-within:ring-1 focus-within:ring-[#0d837f] focus-within:ring-offset-2 min-w-sm"
                    tabIndex={0}
                    aria-label={`${member.name}, ${member.role}`}
                  >
                    <div className="relative aspect-4/5 w-full overflow-hidden">
                      <Image
                        src={member.image}
                        alt={`${member.name} portrait`}
                        fill
                        sizes="(min-width: 1024px) 22vw, (min-width: 768px) 45vw, 100vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-focus-within:scale-105 group-hover:brightness-90"
                      />
                    </div>

                    <div className="relative z-10 p-4 text-center group-hover:opacity-0 group-focus-within:opacity-0">
                      <h3 className="text-xl font-bold text-slate-800">{member.name}</h3>
                      <p className="text-base text-bold text-slate-500">{member.role}</p>
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-slate-900/80 via-slate-900/60 to-transparent p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-auto gap-2">
                      <p className="text-lg font-bold uppercase tracking-[0.2em] text-white">Contact</p>
                      <div className="mt-2 flex flex-col items-start gap-2 text-left">
                        <div className="flex items-center gap-2 text-base font-semibold">
                          <FiPhone className="w-5 h-5 text-white" />
                          <span>{member.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-base">
                          <FiMail className="w-5 h-5 text-white" />
                          <span>{member.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <FiMapPin className="w-4 h-4 text-white/80" />
                          <span>{member.address}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AboutUsPageLinks currentPage="management-team" />
    </PublicPageShell>
  );
}
