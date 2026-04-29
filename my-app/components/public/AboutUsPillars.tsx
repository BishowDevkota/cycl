import Image from "next/image";

type AboutUsPillarsProps = {
  vision: string;
  mission: string;
  goals: string[];
};

type PillarCard = {
  title: string;
  content?: string;
  imageUrl?: string;
  items?: string[];
};

export function AboutUsPillars({
  vision,
  mission,
  goals,
}: AboutUsPillarsProps) {
  const cards: PillarCard[] = [
    {
      title: "Vision",
      content: vision,
      imageUrl: "/aboutusPillars/vision.png",
    },
    {
      title: "Mission",
      content: mission,
      imageUrl: "/aboutusPillars/mission.png",
    },
    { title: "Goals", items: goals, imageUrl: "/aboutusPillars/goals.png" },
  ];

  return (
    <section className="mt-10">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="flex h-full flex-col bg-[#016f81] p-8 text-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] rounded-[10px] duration-300 ease-out transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[24px] font-bold uppercase tracking-[4px]">
                {card.title}
              </h3>
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
               <Image
                  src={`${card.imageUrl}`}
                  alt={`${card.title} icon`} height={80} width={80} />
              </div>
            </div>

            {card.content ? (
              <p className="mt-4 text-base leading-6 text-white/90">
                {card.content}
              </p>
            ) : (
              <ul className="mt-4 space-y-2 text-base leading-6 text-white/90">
                {card.items?.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      className="mt-2 inline-flex h-2 w-2 shrink-0 rounded-full bg-white/80"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
