"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  stat: string;
  route: string;
}
const services: Service[] = [
  {
    id: 1,
    title: "Loan",
    description:
      "Cycnlbsl has wide range of loan products both non-collateral and collateral.",
    image: "/images/services/loans.avif",
    stat: "Low Interest",
    route: "/loans",
  },
  {
    id: 2,
    title: "Saving",
    description:
      "Cycnlbsl has several saving products to encourage members to save money for the future.",
    image: "/images/services/deposits.png",
    stat: "High Returns",
    route: "/savings",
  },
];

export default function ServicesSection(): React.JSX.Element {
  const [visible, setVisible] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement | null>(null);

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

        .services-section {
          background: var(--off-white);
          padding: 100px 24px;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        .services-section::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, var(--mint) 0%, transparent 70%);
          opacity: 0.35;
          border-radius: 50%;
          pointer-events: none;
        }

        .services-section::after {
          content: '';
          position: absolute;
          bottom: -60px; left: -60px;
          width: 320px; height: 320px;
          background: radial-gradient(circle, var(--blush) 0%, transparent 70%);
          opacity: 0.6;
          border-radius: 50%;
          pointer-events: none;
        }

        .services-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .services-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: center;
          margin-bottom: 16px;
        }

        .eyebrow-line {
          width: 40px;
          height: 2px;
          background: var(--teal-mid);
          border-radius: 2px;
        }

        .eyebrow-text {
          font-size: 16px;
          font-weight: ;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--teal-mid);
        }

        .services-heading {
          font-family: sans-serif;
          font-size: 40px;
          color: var(--teal-deep);
          text-align: center;
          margin: 0 0 16px 0;
          line-height: 1.15;
          font-weight: 700;
        }

        .services-subtext {
          text-align: center;
          font-size: 1.05rem;
          color: #5a7070;
          max-width: 520px;
          margin: 0 auto 72px;
          line-height: 1.7;
          font-weight: 300;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 28px;
        }

        .service-card {
          background: #fff;
          border-radius: 20px;
          padding: 40px 32px 36px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(0,91,92,0.08);
          cursor: default;
          transition: transform 0.35s cubic-bezier(.22,.68,0,1.2),
                      box-shadow 0.35s ease,
                      border-color 0.3s ease;
          opacity: 0;
          transform: translateY(36px);
        }

        .service-card.visible {
          animation: cardIn 0.65s cubic-bezier(.22,.68,0,1.2) forwards;
        }

        .service-card:nth-child(1) { animation-delay: 0.05s; }
        .service-card:nth-child(2) { animation-delay: 0.15s; }
        .service-card:nth-child(3) { animation-delay: 0.25s; }
        .service-card:nth-child(4) { animation-delay: 0.35s; }

        @keyframes cardIn {
          to { opacity: 1; transform: translateY(0); }
        }

        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(0,91,92,0.13);
        //   border-color: var(--mint);
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 80px; height: 80px;
          background: linear-gradient(135deg, var(--mint) 0%, transparent 60%);
          opacity: 0.35;
          border-radius: 0 20px 0 80px;
          transition: opacity 0.3s;
        }

        .service-card:hover::before { opacity: 0.65; }

        .icon-wrapper {         
          height: 100px;
          margin-bottom: 28px;
          position: relative;
        display: flex;
          align-items: center;

        }

        .icon-wrapper img {
            transition: transform 0.4s ease;
        }

        .service-card:hover .icon-wrapper img {
        transform: scale(1.25);   /* ← 25% zoom on card hover */
        }

        service-card:hover .image-zoom {
        transform: scale(1.25) !important;
        }


        .service-card:hover .image-zoom {
        transform: scale(1.25) translateY(-10px) !important;
        }

        .service-icon-svg {
          width: 72px;
          height: 72px;
        }

        .stat-badge {
          position: absolute;
          top: 0; right: 0;
          background: var(--blush);
          color: var(--teal-deep);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 20px;
          white-space: nowrap;
        }

        .service-number {
          font-size: 32px;
          font-weight: 200;
          letter-spacing: 0.12em;
          color: var(--teal-mid);
          text-transform: uppercase;
          margin-bottom: 8px;
          display: block;
        }

        .service-title {
          font-family: 'DM Serif Display', serif;
          font-size: 2rem;
          color: var(--teal-deep);
          margin: 0 0 16px 0;
          line-height: 1.2;

        }

        .service-description {
          font-size: 1rem;
          color: #536060;
          line-height: 1.75;
          margin: 0 0 28px 0;
          font-weight: 500;
        }

        .card-divider {
          width: 36px;
          height: 2px;
          background: var(--mint);
          border-radius: 2px;
    
          margin-bottom: 20px;
          transition: width 0.3s ease;
        }

        .service-card:hover .card-divider { width: 56px; }

        .service-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--teal-mid);
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: gap 0.2s ease, color 0.2s ease;
        }

        .service-link:hover {
          color: var(--teal-deep);
          gap: 14px;
        }

        .link-arrow {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--mint);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .service-link:hover .link-arrow {
          background: var(--teal-mid);
          transform: scale(1.1);
        }

        .link-arrow svg path {
          stroke: var(--teal-deep);
          transition: stroke 0.2s;
        }

        .service-link:hover .link-arrow svg path { stroke: #fff; }

        .services-cta-strip {
          margin-top: 64px;
          background: linear-gradient(135deg, var(--teal-deep) 0%, var(--teal-mid) 100%);
          border-radius: 20px;
          padding: 40px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          position: relative;
          overflow: hidden;
        }

        .services-cta-strip::after {
          content: '';
          position: absolute;
          right: -40px; top: -40px;
          width: 220px; height: 220px;
          background: radial-gradient(circle, var(--mint) 0%, transparent 65%);
          opacity: 0.18;
          border-radius: 50%;
          pointer-events: none;
        }

        .cta-text h3 {
          font-family: 'DM Serif Display', serif;
          font-size: 1.6rem;
          color: #fff;
          margin: 0 0 6px 0;
        }

        .cta-text p {
          font-size: 0.9rem;
          color: var(--mint);
          margin: 0;
          font-weight: 300;
        }

        .cta-button {
          background: var(--blush);
          color: var(--teal-deep);
          border: none;
          padding: 14px 32px;
          border-radius: 50px;
          font-size: 0.92rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          white-space: nowrap;
          position: relative;
          z-index: 1;
        }

        .cta-button:hover {
          background: #fff;
          transform: scale(1.04);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

        @media (max-width: 768px) {
          .services-section { padding: 72px 16px; }
          .services-cta-strip { padding: 28px 24px; flex-direction: column; text-align: center; }
          .service-card { padding: 32px 24px 28px; }
        }
      `}</style>

      <section className="services-section" ref={sectionRef}>
        <div className="services-container">
          <div className="services-eyebrow">
            <span className="eyebrow-line" />
            <span className="eyebrow-text">Our Services</span>
            <span className="eyebrow-line" />
          </div>

          <h2 className="services-heading">What We Offer</h2>
          <p className="services-subtext">
            Empowering members with trusted financial solutions — from savings
            to seamless transfers — built for every stage of life.
          </p>

          <div className="services-grid">
            {services.map((svc: Service, i: number) => (
              <div
                key={svc.id}
                className={`service-card ${visible ? "visible" : ""}`}
              >
                <div className="icon-wrapper ">
                  <Image
                    src={svc.image}
                    alt={svc.title}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                  <span className="stat-badge">{svc.stat}</span>
                </div>

                <span className="service-number"></span>
                <h3 className="service-title">{i+1}{". " + svc.title}</h3>
                <div className="card-divider" />
                <p className="service-description">{svc.description}</p>

                <Link href={svc.route} className="service-link">
                  Learn More
                  <span className="link-arrow">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 5h6M5.5 2.5L8 5l-2.5 2.5"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
