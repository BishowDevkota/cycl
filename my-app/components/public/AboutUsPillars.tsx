type AboutUsPillarsProps = {
  vision: string;
  mission: string;
  goals: string[];
};

type PillarCard = {
  title: string;
  content?: string;
  items?: string[];
};

export function AboutUsPillars({
  vision,
  mission,
  goals,
}: AboutUsPillarsProps) {
  const cards: PillarCard[] = [
    { title: "Vision", content: vision },
    { title: "Mission", content: mission },
    { title: "Goals", items: goals },
  ];

  return (
    <section className="mt-10">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="flex h-full flex-col rounded-2xl bg-[#016f81] p-5 text-white shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
          >
            <h3 className="text-lg font-semibold uppercase tracking-[0.12em]">
              {card.title}
            </h3>

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
