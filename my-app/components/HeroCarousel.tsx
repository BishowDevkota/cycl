"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HeroSlide } from "@/lib/hero-service";

type HeroCarouselProps = {
  slides: HeroSlide[];
  intervalMs?: number;
};

export default function HeroCarousel({
  slides,
  intervalMs = 6000,
}: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [slides.length, intervalMs]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full h-[calc(100svh-136px)] max-h-[calc(100dvh-136px)] min-h-[300px] sm:h-[calc(100svh-142px)] sm:max-h-[calc(100dvh-142px)] overflow-hidden">
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={slide.imagePublicId}
            className={`absolute inset-0 transition-opacity duration-700 ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority={index === 0}
              unoptimized
            />

            <div className="absolute inset-0 bg-black/40"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-center leading-tight">
                {slide.title}
              </h1>

              {slide.subtitle && (
                <p className="text-base sm:text-lg text-gray-100 mb-8 text-center max-w-3xl">
                  {slide.subtitle}
                </p>
              )}

              {slide.ctaText && slide.ctaLink && (
                <Link
                  href={slide.ctaLink}
                  className="inline-block px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {slide.ctaText}
                </Link>
              )}
            </div>
          </div>
        );
      })}

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                index === activeIndex ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
