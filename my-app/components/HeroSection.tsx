import { getHeroSection } from "@/services/hero-service";
import HeroCarousel from "@/components/HeroCarousel";

export async function HeroSection() {
  const hero = await getHeroSection();

  if (!hero || hero.slides.length === 0) {
    return (
      <section className="relative w-full h-[calc(100svh-60px)] max-h-[calc(100dvh-60px)] min-h-75 bg-linear-to-r from-gray-900 to-gray-800 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Site</h1>
          <p className="text-xl text-gray-300">No hero section configured yet</p>
        </div>
      </section>
    );
  }

  return (
    <HeroCarousel
      title={hero.title}
      subtitle={hero.subtitle}
      slides={hero.slides}
    />
  );
}