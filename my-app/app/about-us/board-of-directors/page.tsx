import Image from "next/image";
import { Footer } from "@/components/Footer";

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
    image: "/images/padhmanath-Sharma-cyc-chairmain.jpg",
    phone: "98XXXXXXXX",
    email: "chairman@cycnepal.com",
    address: "Baglung, Nepal",
    isChairman: true,
  },
  {
    name: "Dr. Tarun Paudel",
    role: "Director",
    image: "/images/dr-tarun-paudel.jpg",
    phone: "98XXXXXXXX",
    email: "tarun.paudel@cycnepal.com",
    address: "Pokhara, Nepal",
  },
  {
    name: "Laxman Khadka Chhetri",
    role: "Director",
    image: "/images/laxman-khadka-chhetri.jpg",
    phone: "98XXXXXXXX",
    email: "laxman.khadka@cycnepal.com",
    address: "Baglung, Nepal",
  },
  {
    name: "Suman Gharti Chhetri",
    role: "Director (Public)",
    image: "/images/suman-gharti-chhetri.jpg",
    phone: "98XXXXXXXX",
    email: "suman.gharti@cycnepal.com",
    address: "Butwal, Nepal",
  },
  {
    name: "Dilip Paudel",
    role: "Independent Director",
    image: "/images/dilip-paudel.jpg",
    phone: "98XXXXXXXX",
    email: "dilip.paudel@cycnepal.com",
    address: "Kathmandu, Nepal",
  },
  {
    name: "Dolindra Prasad Sharma",
    role: "Company Secretary",
    image: "/images/dolindra-prasad-sharma.jpg",
    phone: "98XXXXXXXX",
    email: "dolindra.sharma@cycnepal.com",
    address: "Kathmandu, Nepal",
  },
];

type DirectorCardProps = {
  director: Director;
};

function DirectorCard({ director }: DirectorCardProps) {
  return (
    <article
      className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_16px_34px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(15,23,42,0.12)] focus-within:-translate-y-1 focus-within:shadow-[0_22px_46px_rgba(15,23,42,0.12)] focus-within:ring-2 focus-within:ring-[#0d837f] focus-within:ring-offset-2"
      tabIndex={0}
      aria-label={`${director.name}, ${director.role}`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={director.image}
          alt={`${director.name} portrait`}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02] group-focus-within:scale-[1.02]"
        />
      </div>

      <div className="relative z-10 p-4 text-center">
        <h3 className="text-lg font-semibold text-slate-800">
          {director.name}
        </h3>
        <p className="text-sm text-slate-500">{director.role}</p>
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-slate-900/70 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
          Contact
        </p>
        <p className="mt-3 text-sm font-semibold">{director.phone}</p>
        <p className="text-sm">{director.email}</p>
        <p className="mt-2 text-xs text-white/80">{director.address}</p>
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
          style={{ backgroundImage: "url('/images/board-banner.jpg')" }}
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
          <div className="mx-auto flex max-w-sm justify-center">
            <DirectorCard director={chairman} />
          </div>
        ) : null}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
