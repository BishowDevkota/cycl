"use client";

import React, { useEffect, useRef, useState } from "react";

export interface CompanyStatCard {
  _id?: string;
  heading: string;
  value: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

const fallbackStats: CompanyStatCard[] = [
  {
    _id: "fallback-1",
    heading: "Branch Offices",
    value: "3321",
    imageUrl: "/company highlights/office branch.png",
    displayOrder: 0,
    isActive: true,
  },
  {
    _id: "fallback-2",
    heading: "Loan Outstanding",
    value: "514,651 NPR",
    imageUrl: "/company highlights/loan_outstanding.png",
    displayOrder: 1,
    isActive: true,
  },
  {
    _id: "fallback-3",
    heading: "Number of Centers",
    value: "274",
    imageUrl: "/company highlights/centers.webp",
    displayOrder: 2,
    isActive: true,
  },
  {
    _id: "fallback-4",
    heading: "Savings & Deposits",
    value: "1,150,000 NPR",
    imageUrl: "/company highlights/saving_deposit.png",
    displayOrder: 3,
    isActive: true,
  },
  {
    _id: "fallback-5",
    heading: "Total Staff",
    value: "65",
    imageUrl: "/company highlights/staff_icon.webp",
    displayOrder: 4,
    isActive: true,
  },
  {
    _id: "fallback-6",
    heading: "Active Clients",
    value: "62,263",
    imageUrl: "/company highlights/client.jpg",
    displayOrder: 5,
    isActive: true,
  },
];

export function CompanyStatsSection() {
  const [visible, setVisible] = useState(false);
  const [stats, setStats] = useState<CompanyStatCard[]>([]);
  const [displayValues, setDisplayValues] = useState<Record<string, string>>({});
  const [animatedMap, setAnimatedMap] = useState<Record<string, boolean>>({});
  const sectionRef = useRef<HTMLElement | null>(null);
  // track which stat keys have been animated so we don't re-run on reload
  const animatedKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let active = true;

    const fetchStats = async () => {
      try {
        const response = await fetch("/api/home/company-stats", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load company stats");
        }

        const data = (await response.json()) as unknown;
        const statItems = Array.isArray(data) ? data : [];

        if (!active) return;

        setStats(
          statItems
            .filter(
              (item): item is CompanyStatCard =>
                typeof item === "object" &&
                item !== null &&
                typeof item.heading === "string" &&
                typeof item.value === "string" &&
                typeof item.imageUrl === "string",
            )
            .sort((a, b) => a.displayOrder - b.displayOrder),
        );
      } catch (error) {
        console.error("Error fetching public company stats:", error);
      }
    };

    void fetchStats();

    return () => {
      active = false;
    };
  }, []);

  const renderedStats = stats.length > 0 ? stats : fallbackStats;

  const formatNumber = (n: number, original: string) => {
    const hasDecimal = original.indexOf(".") !== -1;
    if (hasDecimal) return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);

      try {
        const rect = sectionRef.current.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
        const ratio = rect.height > 0 ? visibleHeight / rect.height : 0;
        if (ratio >= 0.15) requestAnimationFrame(() => setVisible(true));
      } catch {
        // ignore in non-browser contexts
      }
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    const toAnimate = renderedStats.filter((item, idx) => {
      const key = item._id || `${item.heading}-${idx}`;
      return !animatedKeysRef.current.has(key);
    });
    if (toAnimate.length === 0) return;

    const timeouts: number[] = [];
    setAnimatedMap((s) => ({ ...s }));

    toAnimate.forEach((item) => {
      const originalIdx = renderedStats.findIndex((r) => (r._id || r.heading) === (item._id || item.heading));
      const key = item._id || `${item.heading}-${originalIdx}`;
      const raw = item.value || "";

      const match = raw.match(/[0-9.,]+/);
      if (!match) {
        animatedKeysRef.current.add(key);
        setAnimatedMap((s) => ({ ...s, [key]: true }));
        setDisplayValues((s) => ({ ...s, [key]: raw }));
        return;
      }

      const numericPart = match[0].replace(/,/g, "");
      const suffix = raw.replace(match[0], "").trim();
      const target = parseFloat(numericPart);
      if (Number.isNaN(target)) {
        animatedKeysRef.current.add(key);
        setAnimatedMap((s) => ({ ...s, [key]: true }));
        setDisplayValues((s) => ({ ...s, [key]: raw }));
        return;
      }

      // Timing constants (edit these to change animation gaps)
      const entranceBase = 20; // ms, base delay for first card
      const entranceStep = 50; // ms, additional delay per card
      const entranceAnimDuration = 300; // ms, card entrance animation duration
      const entranceDelay = entranceBase + originalIdx * entranceStep;
      const statRevealDelay = entranceDelay + entranceAnimDuration;
      const countStartOffset = 40; // ms after stat reveals to start count-up
      const countStartDelay = statRevealDelay + countStartOffset;
      const duration = 1200 + (originalIdx % 3) * 200;

      const revealTimeout = window.setTimeout(() => {
        animatedKeysRef.current.add(key);
        setAnimatedMap((s) => ({ ...s, [key]: true }));
        setDisplayValues((s) => ({ ...s, [key]: `0${suffix ? " " + suffix : ""}` }));

        const start = performance.now();

        const step = (now: number) => {
          const elapsed = now - start;
          const t = Math.min(1, elapsed / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const current = target * eased;
          const formatted = formatNumber(current, match[0]);
          setDisplayValues((s) => ({ ...s, [key]: `${formatted}${suffix ? " " + suffix : ""}` }));
          if (t < 1) requestAnimationFrame(step);
        };

        const countTimeout = window.setTimeout(() => {
          requestAnimationFrame(step);
        }, 0);

        timeouts.push(countTimeout);
      }, countStartDelay);

      timeouts.push(revealTimeout);
    });

    return () => timeouts.forEach((id) => clearTimeout(id));
  }, [visible, renderedStats]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --teal-deep:  #005B5C;
          --teal-mid:   #007A8E;
          --mint:       #A8D8B9;
          --blush:      #F0E5D8;
          --off-white:  #F9F9F9;
        }

        .highlights-section {
          background: var(--off-white);
          padding: 80px 24px 120px;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        .highlights-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .highlights-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .highlights-heading {
          font-family: sans-serif;
          font-weight: 700;
          font-size: 36px;
          color: var(--teal-deep);
          margin: 0 0 16px 0;
          line-height: 1.15;
        }

        .highlights-subtext {
          font-size: 1.05rem;
          color: #5a7070;
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.7;
          font-weight: 300;
        }

        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          align-items: stretch;
        }

        .highlight-card {
          background: #fff;
          border-radius: 20px;
          padding-top: 44px;
          padding-bottom: 28px;
          padding-left: 28px;
          padding-right: 28px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(0,91,92,0.08);
          cursor: default;
          max-height:120px;
          display: flex;
          justify-content: space-between;
          gap: 32px;
          align-items: center;
          text-align: center;
          transition: transform 0.35s cubic-bezier(.22,.68,0,1.2),
                      box-shadow 0.35s ease,
                      border-color 0.3s ease;
          opacity: 0;
          transform: translateY(36px);
          box-shadow: 0 12px 40px rgba(0,91,92,0.06);
        }

        .highlight-card.visible {
          animation: cardIn 0.65s cubic-bezier(.22,.68,0,1.2) forwards;
        }

        .highlight-card:nth-child(1) { animation-delay: 0.05s; }
        .highlight-card:nth-child(2) { animation-delay: 0.15s; }
        .highlight-card:nth-child(3) { animation-delay: 0.25s; }
        .highlight-card:nth-child(4) { animation-delay: 0.35s; }
        .highlight-card:nth-child(5) { animation-delay: 0.45s; }
        .highlight-card:nth-child(6) { animation-delay: 0.55s; }

        @keyframes cardIn {
          to { opacity: 1; transform: translateY(0); }
        }

        .highlight-card:hover {
          transform: translateY(20px);
          box-shadow: 0 20px 60px rgba(0,91,92,0.5);
        }

        .icon-wrapper {
          height: 82px;
          margin-bottom: 18px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .service-icon-image {
          width: 72px;
          height: 72px;
          transition: transform 0.4s ease;
          object-fit: contain;
          object-position: center;
          background: transparent;
          mix-blend-mode: multiply;
        }

        .stat-label {
        font-family: sans-serif;
          font-size: 1.2rem;
          color: var(--teal-deep);
          margin: 0 0 12px 0;
          line-height: 1.2;
          font-weight: 600;
        }

        .stat-value {
          font-size: 2.4rem;
          color: black;
          line-height: 1.6;
          margin: 0;
          font-weight: 900;
          transform: translateY(6px);
          opacity: 0;
          transition: transform 0.6s cubic-bezier(.22,.68,0,1.2), opacity 0.6s ease;
        }
        .stat-value.animated {
          transform: translateY(0);
          opacity: 1;
        }
        .stat-value:hover{
          transform: scale(1.05);
          color: var(--teal-mid);
          transition: transform 0.3s ease, color 0.3s ease;
        }

        .highlight-card:hover .card-divider { width: 56px; }

        @media (max-width: 1024px) {
          .highlights-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 768px) {
          .highlights-section { padding: 56px 16px; }
          .highlights-header { margin-bottom: 32px; }
          .highlights-grid { grid-template-columns: 1fr; }
          .highlights-grid { gap: 20px; }
          .highlight-card { padding: 24px 20px; min-height: 220px; }
          .icon-wrapper { height: 74px; }
          .service-icon-image { width: 64px; height: 64px; }
          .stat-label { font-size: 1.4rem; }
        }
      `}</style>

      <section className="highlights-section" ref={sectionRef}>
        <div className="highlights-container">
          <div className="highlights-header">
            <h2 className="highlights-heading">Company Highlights</h2>
            <p className="highlights-subtext">
              Key metrics showcasing our growth and commitment to serving our members.
            </p>
          </div>

          <div className="highlights-grid">
            {renderedStats.map((item, index) => (
              <div
                key={item._id || `${item.heading}-${index}`}
                className={`highlight-card ${visible ? "visible" : ""}`}>

                <div className="icon-wrapper">
                  <img
                    src={item.imageUrl || "/company highlights/office branch.png"}
                    alt={item.heading}
                    className="service-icon-image"
                  />
                </div>
                <div>

                <p className={`stat-value ${animatedMap[item._id || `${item.heading}-${index}`] ? 'animated' : ''}`}>
                  {displayValues[item._id || `${item.heading}-${index}`] ?? item.value ?? '-'}
                </p>
                <p className="stat-label">{item.heading}</p>
                {/* <div className="card-divider" /> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
