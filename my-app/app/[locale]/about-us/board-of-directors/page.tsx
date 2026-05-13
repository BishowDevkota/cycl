import Image from "next/image";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { getTranslations } from "next-intl/server";

type Director = {
  nameKey: string;   // Key for members name
  roleKey: string;   // Key for role
  image: string;
  phone: string;
  email: string;
  address: string;
  isChairman?: boolean;
};

const directors: Director[] = [
  {
    nameKey: "padhmanath_sharma",
    roleKey: "chairman",
    image: "/boardofdirectors/padhmanath-Sharma-cyc-chairmain.jpg",
    phone: "9857620069",
    email: "info@cycnlbsl.org.np",
    address: "BA.NA.PA-02",
    isChairman: true,
  },
  {
    nameKey: "tarun_paudel",
    roleKey: "director",
    image: "/boardofdirectors/dr-tarun-paudel.jpg",
    phone: "9857620216",
    email: "drtarunpaudel@gmail.com",
    address: "Jaimani Municiplity-08, Baglung",
  },
  {
    nameKey: "laxman_khadka",
    roleKey: "director",
    image: "/boardofdirectors/laxman-khadka-chhetri.png",
    phone: "9847667722",
    email: "laxmankhad912@gmail.com",
    address: "Ba.Na.Pa-09 Palthana Sigana",
  },
  {
    nameKey: "suman_gharti",
    roleKey: "director_public",
    image: "/boardofdirectors/suman-gharti-chhetri.jpg",
    phone: "9765646406",
    email: "gcsuman654@gmail.com",
    address: "Kathekhola-07, Baglung",
  },
  {
    nameKey: "dilip_paudel",
    roleKey: "independent_director",
    image: "/boardofdirectors/dilip-paudel.jpg",
    phone: "9857622082",
    email: "dilippaudel45@gmail.com",
    address: "Jaimini-01, Baglung",
  },
  {
    nameKey: "dolindra_sharma",
    roleKey: "company_secretary",
    image: "/boardofdirectors/dolindra-prasad-sharma.jpg",
    phone: "9851227052",
    email: "companysecretary@cycnlbsl.org.np",
    address: "Kathmandu-29, Anamnagar",
  },
];

type DirectorCardProps = {
  director: Director;
  translatedName: string;
  translatedRole: string;
};

function DirectorCard({ director, translatedName, translatedRole }: DirectorCardProps) {
  return (
    <article
      className="group relative mt-10 overflow-hidden bg-white shadow-[0_16px_34px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(15,23,42,0.12)] focus-within:-translate-y-1 focus-within:shadow-[0_22px_46px_rgba(15,23,42,0.12)] focus-within:ring-2 focus-within:ring-[#0d837f] focus-within:ring-offset-2"
      tabIndex={0}
      aria-label={`${translatedName}, ${translatedRole}`}
    >
      <div className="relative aspect-4/5 w-full overflow-hidden">
        <Image
          src={director.image}
          alt={`${translatedName} portrait`}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-focus-within:scale-105 group-hover:brightness-90 group-focus-within:brightness-90"
        />
      </div>

      <div className="relative z-10 border-t border-slate-100 bg-white p-4 text-center transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0">
        <h3 className="text-xl font-bold text-slate-800">{translatedName}</h3>
        <p className="text-base font-medium text-slate-500">{translatedRole}</p>
      </div>

      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-900/80 via-slate-900/60 to-transparent p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-auto gap-2">
        <p className="text-lg font-bold uppercase tracking-[0.2em] text-white">Contact</p>
        <div className="mt-2 flex flex-col items-start gap-2 text-left">
          <div className="flex items-center gap-2 text-base font-semibold">
            <FiPhone className="w-5 h-5 text-white" />
            <span>{director.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-base">
            <FiMail className="w-5 h-5 text-white" />
            <span className="break-all">{director.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <FiMapPin className="w-4 h-4 text-white/80" />
            <span>{director.address}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

async function BoardOfDirectors() {
  const t = await getTranslations("board-of-directors");
  
  const chairman = directors.find((member) => member.isChairman);
  const members = directors.filter((member) => !member.isChairman);

  return (
    <PublicPageShell
      imageUrl="/banner/banner2.jpg"
      eyebrow={t("section_eyebrow")}
      title={t("banner_title")}
      description={t("banner_description")}
      actions={[
        { label: t("introduction_btn"), href: "/about-us" },
        { label: t("chairman_message_btn"), href: "/about-us/chairman-message" },
      ]}
    >
      <section className="rounded-3xl bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow={t("section_eyebrow")}
          title={t("section_title")}
          description={t("section_description")}
        />

        {chairman ? (
          <div className="mx-auto flex justify-center">
            <div className="w-full max-w-sm">
              <DirectorCard 
                director={chairman} 
                translatedName={t(`members.${chairman.nameKey}` as any)}
                translatedRole={t(`roles.${chairman.roleKey}` as any)} 
              />
            </div>
          </div>
        ) : null}

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((director) => (
            <DirectorCard 
              key={director.nameKey} 
              director={director} 
              translatedName={t(`members.${director.nameKey}` as any)}
              translatedRole={t(`roles.${director.roleKey}` as any)} 
            />
          ))}
        </div>
      </section>
    </PublicPageShell>
  );
}

export default async function BoardOfDirectorsPage() {
  return <BoardOfDirectors />;
}