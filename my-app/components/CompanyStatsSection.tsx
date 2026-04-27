"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { CompanyStats } from "@/services/company-stats-service";

const STATS_FIELDS: Array<{
  key: keyof Omit<CompanyStats, "_id" | "createdAt" | "updatedAt">;
  label: string;
  image: string;
}> = [
  {
    key: "numberOfBranchOffice",
    label: "Branch Offices",
    image: "/company highlights/office branch.png",
  },
  {
    key: "loanOutstandingNpr",
    label: "Loan Outstanding",
    image: "/company highlights/loan_outstanding.png",
  },
  {
    key: "numberOfCenters",
    label: "Number of Centers",
    image: "/company highlights/centers.webp",
  },
  {
    key: "savingDepositNpr",
    label: "Savings & Deposits",
    image: "/company highlights/saving_deposit.png",
  },
  {
    key: "totalStaffIncludingTrainee",
    label: "Total Staff",
    image: "/company highlights/staff_icon.webp",
  },
  {
    key: "activeClients",
    label: "Active Clients",
    image: "/company highlights/client.jpg",
  },
];

export function CompanyStatsSection() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  const stats: CompanyStats = {
    numberOfBranchOffice: "3321",
    loanOutstandingNpr: "3321",
    numberOfCenters: "32321",
    savingDepositNpr: "514651",
    totalStaffIncludingTrainee: "65",
    activeClients: "62263",
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

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
          padding: 72px 24px;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        .highlights-section::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, var(--mint) 0%, transparent 70%);
          opacity: 0.35;
          border-radius: 50%;
          pointer-events: none;
        }

        .highlights-section::after {
          content: '';
          position: absolute;
          bottom: -60px; left: -60px;
          width: 320px; height: 320px;
          background: radial-gradient(circle, var(--blush) 0%, transparent 70%);
          opacity: 0.6;
          border-radius: 50%;
          pointer-events: none;
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
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2.2rem, 5vw, 3.5rem);
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
          padding: 28px 24px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(0,91,92,0.08);
          cursor: default;
          min-height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: transform 0.35s cubic-bezier(.22,.68,0,1.2),
                      box-shadow 0.35s ease,
                      border-color 0.3s ease;
          opacity: 0;
          transform: translateY(36px);
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
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(0,91,92,0.13);
        }

        .highlight-card::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 80px; height: 80px;
          background: linear-gradient(135deg, var(--mint) 0%, transparent 60%);
          opacity: 0.35;
          border-radius: 0 20px 0 80px;
          transition: opacity 0.3s;
        }

        .highlight-card:hover::before { opacity: 0.65; }

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

        .highlight-card:hover .service-icon-image {
          transform: scale(1.18);
        }

        .stat-label {
          font-family: 'DM Serif Display', serif;
          font-size: 1.6rem;
          color: var(--teal-deep);
          margin: 0 0 12px 0;
          line-height: 1.2;
          font-weight: 400;
        }

        .stat-value {
          font-size: 1rem;
          color: #536060;
          line-height: 1.6;
          margin: 0;
          font-weight: 500;
        }

        .card-divider {
          width: 36px;
          height: 2px;
          background: var(--mint);
          border-radius: 2px;
          margin-bottom: 14px;
          transition: width 0.3s ease;
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
            {STATS_FIELDS.map((field) => (
              <div
                key={field.key}
                className={`highlight-card ${visible ? "visible" : ""}`}
              >
                <div className="icon-wrapper">
                  <Image
                    src={field.image}
                    alt={field.label}
                    width={72}
                    height={72}
                    className="service-icon-image"
                  />
                </div>
                <p className="stat-label">{field.label}</p>
                <div className="card-divider" />
                <p className="stat-value">{stats[field.key] || "-"}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}