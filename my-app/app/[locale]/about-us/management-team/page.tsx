import Image from "next/image";
import { AboutUsPageLinks } from "@/components/public/AboutUsPageLinks";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { getTranslations } from "next-intl/server";

type ManagementMember = {
  nameKey: string;
  roleKey: string;
  image: string;
  phone: string;
  email: string;
  address: string;
};

const managementProfiles: ManagementMember[] = [
  {
    nameKey: "dolindra_sharma",
    roleKey: "ceo",
    image: "/managementTeam/dolindra-pd-sharma.jpg",
    phone: "9851227052",
    email: "companysecretary@cycnlbsl.org.np",
    address: "Kathmandu-29, Anamnagar",
  },
  {
    nameKey: "baburam_kunwar",
    roleKey: "dceo",
    image: "/managementTeam/Baburam-Kunwar-Manager-HO.jpg",
    phone: "9857646316",
    email: "dceo@cycnlbsl.org.np",
    address: "Isma 01, Gulmi",
  },
  {
    nameKey: "sangita_paudel",
    roleKey: "training_head",
    image: "/managementTeam/Sangita-Sharma-Paudel.jpg",
    phone: "9857646220",
    email: "training.cycnlbsl@gmail.com",
    address: "Ba na pa -03, Baglung",
  },
];

type ProfileCardProps = {
  member: ManagementMember;
  translatedName: string;
  translatedRole: string;
  aspectRatio?: string;
};

function ProfileCard({ member, translatedName, translatedRole, aspectRatio = "aspect-4/5" }: ProfileCardProps) {
  return (
    <article
      className="group relative overflow-hidden bg-white shadow-[0_16px_34px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(15,23,42,0.12)] focus-within:-translate-y-1 focus-within:shadow-[0_22px_46px_rgba(15,23,42,0.12)] focus-within:ring-1 focus-within:ring-[#0d837f] focus-within:ring-offset-2"
      tabIndex={0}
      aria-label={`${translatedName}, ${translatedRole}`}
    >
      <div className={`relative ${aspectRatio} w-full overflow-hidden`}>
        <Image
          src={member.image}
          alt={`${translatedName} portrait`}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-focus-within:scale-105 group-hover:brightness-90"
        />
      </div>

      <div className="relative z-10 p-4 text-center group-hover:opacity-0 group-focus-within:opacity-0">
        <h3 className="text-xl font-bold text-slate-800">{translatedName}</h3>
        <p className="text-base font-bold text-slate-500">{translatedRole}</p>
      </div>

      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-900/80 via-slate-900/60 to-transparent p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-auto gap-2">
        <p className="text-lg font-bold uppercase tracking-[0.2em] text-white">Contact</p>
        <div className="mt-2 flex flex-col items-start gap-2 text-left">
          <div className="flex items-center gap-2 text-base font-semibold">
            <FiPhone className="w-5 h-5 text-white" />
            <span>{member.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-base">
            <FiMail className="w-5 h-5 text-white" />
            <span className="break-all">{member.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <FiMapPin className="w-4 h-4 text-white/80" />
            <span>{member.address}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function ManagementTeamPage() {
  const t = await getTranslations("management-team");

  // Logic to find CEO and the rest
  const top = managementProfiles.find((m) => m.roleKey === "ceo") || managementProfiles[0];
  const others = managementProfiles.filter((m) => m !== top);

  return (
    <PublicPageShell
      imageUrl="/banner/banner.jpg"
      eyebrow={t("section_eyebrow")}
      title={t("banner_title")}
      description={t("banner_description")}
      actions={[
        { label: t("introduction_btn"), href: "/about-us" },
        { label: t("chairman_message_btn"), href: "/about-us/chairman-message" },
      ]}
    >
      <section className="bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow={t("section_eyebrow")}
          title={t("section_title")}
          description={t("section_description")}
        />

        <div className="flex flex-col items-center gap-20">
          {/* Top leader centered */}
          <div className="w-full flex justify-center">
            <div className="w-full max-w-sm">
              <ProfileCard
                member={top}
                translatedName={t(`members.${top.nameKey}` as any)}
                translatedRole={t(`roles.${top.roleKey}` as any)}
                aspectRatio="aspect-3/4"
              />
            </div>
          </div>

          {/* Other profiles below */}
          <div className="grid gap-10 sm:grid-cols-2 w-full">
            {others.map((member) => (
              <div key={member.email} className="flex justify-center">
                <div className="w-full max-w-sm">
                  <ProfileCard
                    member={member}
                    translatedName={t(`members.${member.nameKey}` as any)}
                    translatedRole={t(`roles.${member.roleKey}` as any)}
                  />
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