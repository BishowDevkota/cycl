import Image from "next/image";
import { Footer } from "@/components/Footer";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

type Director = {
  name: string;
  role: string;
  image: string;
  phone: string;
  email: string;
  address: string;
  isChairman?: boolean;
};

const directors: Director[] = [
  {
    name: "Padhmanath Sharma",
    role: "Chairman",
    image: "/boardofdirectors/padhmanath-Sharma-cyc-chairmain.jpg",
    phone: "9857620069",
    email: "info@cycnlbsl.org.np",
    address: "BA.NA.PA-02",
    isChairman: true,
  },
  {
    name: "Dr. Tarun Paudel",
    role: "Director",
    image: "/boardofdirectors/dr-tarun-paudel.jpg",
    phone: "9857620216",
    email: "drtarunpaudel@gmail.com",
    address: "Jaimani Municiplity-08, Baglung",
  },
  {
    name: "Laxman Khadka Chhetri",
    role: "Director",
    image: "/boardofdirectors/laxman-khadka-chhetri.png",
    phone: "9847667722",
    email: "laxmankhad912@gmail.com",
    address: "Ba.Na.Pa-09 Palthana Sigana",
  },
  {
    name: "Suman Gharti Chhetri",
    role: "Director (Public)",
    image: "/boardofdirectors/suman-gharti-chhetri.jpg",
    phone: "9765646406",
    email: "gcsuman654@gmail.com",
    address: "Kathekhola-07, Baglung",
  },
  {
    name: "Dilip Paudel",
    role: "Independent Director",
    image: "/boardofdirectors/dilip-paudel.jpg",
    phone: "9857622082",
    email: "dilippaudel45@gmail.com",
    address: "Jaimini-01, Baglung",
  },
  {
    name: "Dolindra Prasad Sharma",
    role: "Company Secretary",
    image: "/boardofdirectors/dolindra-prasad-sharma.jpg",
    phone: "9851227052",
    email: "companysecretary@cycnlbsl.org.np",
    address: "Kathmandu-29, Anamnagar",
  },
];

type DirectorCardProps = {
  director: Director;
};

function DirectorCard({ director }: DirectorCardProps) {
  return (
    <article
      className="group relative overflow-hidden bg-white shadow-[0_16px_34px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(15,23,42,0.12)] focus-within:-translate-y-1 focus-within:shadow-[0_22px_46px_rgba(15,23,42,0.12)] focus-within:ring-1 focus-within:ring-[#0d837f] focus-within:ring-offset-2 mt-10"
      tabIndex={0}
      aria-label={`${director.name}, ${director.role}`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={director.image}
          alt={`${director.name} portrait`}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-focus-within:scale-105 group-hover:brightness-90"
        />
      </div>

      <div className="relative z-10 p-4 text-center group-hover:opacity-0 group-focus-within:opacity-0">
        <h3 className="text-xl font-bold text-slate-800">{director.name}</h3>
        <p className="text-base text-bold text-slate-500">{director.role}</p>
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
            <span>{director.email}</span>
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

function BoardOfDirectors() {
  const chairman = directors.find((member) => member.isChairman);
  const members = directors.filter((member) => !member.isChairman);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="relative isolate overflow-hidden bg-slate-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/banner/banner.jpg')" }}
        />
        <div className="absolute inset-0 bg-slate-900/55" />
        <div className="relative mx-auto flex max-w-screen-xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            Board of Directors
          </p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Board of Directors
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Home - Board of Directors
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
        {chairman ? (
          <div className="mx-auto flex justify-center">
            <div className="min-w-xs">
              <DirectorCard director={chairman} />
            </div>
          </div>
        ) : null}

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((director) => (
            <DirectorCard key={director.name} director={director} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BoardOfDirectorsPage() {
  return <BoardOfDirectors />;
}
