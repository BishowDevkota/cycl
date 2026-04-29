"use client";
import { useEffect, useRef } from "react";
import "../app/globals.css";

export default function BottomMarquee() {
  const content =
    " 📢 Welcome to CYC Nepal Laghubitta Bittiya Sanstha Ltd. • 124 Branch Offices Nationwide • Loan & Saving Services • Empowering Communities Through Microfinance • Visit Us at Sabhagriha Chowk, Pokhara • Call: 061-590894 ";

  const trackRef = useRef<HTMLDivElement | null>(null);
  const firstRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const first = firstRef.current;
    if (!track || !first) return;

    const applyMeasurements = () => {
      const width = first.offsetWidth;
      const height = first.offsetHeight;
      // add a tiny overlap (1px) to hide subpixel rounding/jump at loop point
      const overlap = 1;
      track.style.width = `${width * 2 + overlap * 2}px`;
      track.style.height = `${height}px`;
      track.style.setProperty("--marquee-distance", `-${width + overlap}px`);
      // ensure animation-duration remains as configured in CSS var
      const duration = getComputedStyle(track).getPropertyValue("--marquee-duration").trim() || "18s";
      track.style.animationDuration = duration;
    };

    // Wait for fonts to load to avoid measuring before text metrics finalize
    const runAfterFonts = () => {
      try {
        if ('fonts' in document) {
          // @ts-ignore
          document.fonts.ready.then(applyMeasurements);
        } else {
          applyMeasurements();
        }
      } catch (e) {
        applyMeasurements();
      }
    };

    runAfterFonts();

    // Observe size changes of the first copy (e.g., on resize or font changes)
    const ro = new ResizeObserver(() => applyMeasurements());
    ro.observe(first);

    const handleResize = () => applyMeasurements();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#016f81] text-white overflow-hidden z-50">
      <div ref={trackRef} className="animate-marquee font-medium">
        <div ref={firstRef} className="whitespace-nowrap inline-block py-2">
          {content}
        </div>
        <div className="whitespace-nowrap inline-block py-2">{content}</div>
      </div>
    </div>
  );
}