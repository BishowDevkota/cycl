"use client";
import { useEffect, useRef } from "react";
import "../app/globals.css";

export default function BottomMarquee() {
  const content =
    " 📢 Welcome to CYC Nepal Laghubitta Bittiya Sanstha Ltd. • 124 Branch Offices Nationwide • Loan & Saving Services • Empowering Communities Through Microfinance • Visit Us at Sabhagriha Chowk, Pokhara • Call: 061-590894 ";

  const trackRef = useRef<HTMLDivElement | null>(null);
  const firstRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const track = trackRef.current;
      const first = firstRef.current;
      if (!track || !first) return;

      const applyMeasurements = () => {
        // robust width measurement with several fallbacks
        const offset = first.offsetWidth || 0;
        const scroll = first.scrollWidth || 0;
        const rect = Math.round(first.getBoundingClientRect().width) || 0;
        const parentWidth = (track.parentElement && track.parentElement.clientWidth) || 0;
        const defaultWidth = parentWidth || 300;
        let width = Math.max(offset, scroll, rect, defaultWidth);
        // ensure integer pixels to avoid subpixel rounding issues
        width = Math.ceil(width);

        const height = Math.ceil(first.getBoundingClientRect().height) || 24;
        // add a tiny overlap to hide subpixel rounding/jump at loop point
        const overlap = 2; // increased overlap
        track.style.width = `${width * 2 + overlap * 2}px`;
        track.style.height = `${height}px`;
        track.style.setProperty("--marquee-distance", `-${width + overlap}px`);

        // ensure animation-duration remains as configured in CSS var
        const duration = getComputedStyle(track).getPropertyValue("--marquee-duration").trim() || "18s";
        // set inline animation as fallback so it's applied even if CSS loads late
        track.style.animation = `marquee ${duration} linear infinite`;
      };

      // Wait for fonts to load to avoid measuring before text metrics finalize
      const runAfterFonts = () => {
        try {
          if (document && (document as any).fonts && (document as any).fonts.ready) {
            (document as any).fonts.ready.then(applyMeasurements).catch(() => applyMeasurements());
          } else {
            applyMeasurements();
          }
        } catch (e) {
          applyMeasurements();
        }
      };

      runAfterFonts();

      // Observe size changes of the first copy (e.g., on resize or font changes)
      let ro: ResizeObserver | null = null;
      if (typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(() => applyMeasurements());
        try {
          ro.observe(first);
        } catch (e) {
          // ignore observe errors
        }
      }

      const handleResize = () => applyMeasurements();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (ro) try { ro.disconnect(); } catch (e) {}
      };
    } catch (err) {
      // fail silently but log to console to aid debugging
      // eslint-disable-next-line no-console
      console.error("BottomMarquee measurement error:", err);
    }
  }, []);

  return (
    <div className="marquee-container fixed bottom-0 left-0 w-full bg-[#016f81] text-white overflow-hidden z-50">
      <div ref={trackRef} className="animate-marquee font-medium">
        <div ref={firstRef} className="whitespace-nowrap inline-block py-2">
          {content}
        </div>
        <div className="whitespace-nowrap inline-block py-2">{content}</div>
      </div>
    </div>
  );
}