"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: "news" | "notice";
  image: string;
  tag: string;
}

const newsData: NewsItem[] = [
  {
    id: 1,
    title: "कर्मचारी आवश्यकता सम्बन्धी सूचना",
    excerpt:
      "सिवाईसी नेपाल लघुवित्त वित्तीय संस्था लि.लाई विभिन्न पदहरूमा योग्य तथा अनुभवी नेपाली नागरिकहरूको आवश्यकता परेकोले इच्छुक उम्मेदवारहरूले निर्धारित समयभित्र दरखास्त पेश गर्नु हुन अनुरोध गरिन्छ।",
    date: "Apr 27, 2026",
    category: "notice",
    image:
      "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=600&q=80",
    tag: "रोजगारी",
  },
  {
    id: 2,
    title: "प्रमुख कार्यकारी अधिकृत पदको अन्तर्वार्ता सम्बन्धी सूचना",
    excerpt:
      "सिवाईसी नेपाल लघुवित्त वित्तीय संस्था लि.को प्रमुख कार्यकारी अधिकृत (CEO) पदको लागि छनोट भएका उम्मेदवारहरूको अन्तर्वार्ता मिति, समय तथा स्थान तोकिएको व्यहोरा सम्बन्धित सबैको जानकारीको लागि यो सूचना प्रकाशित गरिएको छ।",
    date: "Apr 23, 2026",
    category: "notice",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80",
    tag: "नियुक्ति",
  },
  {
    id: 3,
    title: "ब्याजदर पुनरावलोकन सम्बन्धी सूचना",
    excerpt:
      "नेपाल राष्ट्र बैंकको निर्देशन तथा बजारको अवस्थालाई मध्यनजर गर्दै सिवाईसी नेपाल लघुवित्त वित्तीय संस्था लि.ले कर्जा तथा निक्षेपमा लाग्ने ब्याजदर पुनरावलोकन गरेको व्यहोरा सम्पूर्ण सदस्य तथा ग्राहकहरूको जानकारीको लागि यो सूचना प्रकाशित गरिएको छ।",
    date: "Oct 18, 2025",
    category: "notice",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80",
    tag: "वित्तीय",
  },
  {
    id: 4,
    title:
      "सिवाईसी नेपाल लघुवित्त वित्तीय संस्था लि.को विशेष साधारण सभा सम्पन्न",
    excerpt:
      "सिवाईसी नेपाल लघुवित्त वित्तीय संस्था लि.को विशेष साधारण सभा पोखरा सभागृह चोकस्थित केन्द्रीय कार्यालयमा सम्पन्न भई संस्थाको आगामी आर्थिक वर्षको कार्ययोजना, बजेट तथा महत्त्वपूर्ण प्रस्तावहरू सर्वसम्मतिले पारित गरियो।",
    date: "May 17, 2022",
    category: "news",
    image:
      "https://cycnlbsl.org.np/wp-content/uploads/2022/05/188626994_1142146609616769_6630259563536815982_n-800x445-1-768x427.jpg",
    tag: "सभा",
  },
  {
    id: 5,
    title: "अर्चले पिपलबोटमा सिवाईसी नेपाल लघुवित्तले दियो स्ट्रेचर",
    excerpt:
      "सिवाईसी नेपाल लघुवित्त वित्तीय संस्था लि.ले सामाजिक उत्तरदायित्वअन्तर्गत अर्चले पिपलबोटका स्थानीय बासिन्दाहरूको स्वास्थ्य सेवामा सहयोग पुर्‍याउने उद्देश्यले स्थानीय स्वास्थ्य चौकीलाई स्ट्रेचर प्रदान गर्‍यो।",
    date: "May 17, 2022",
    category: "news",
    image:
      "https://cycnlbsl.org.np/wp-content/uploads/2022/05/143192456_463695317971856_5410839418648669555_n-1536x1152-1-800x445-1-768x427.jpg",
    tag: "सामाजिक",
  },
  {
    id: 6,
    title: "छात्रवृत्ति कार्यक्रम: आर्थिक रूपमा विपन्न विद्यार्थीहरूलाई सहयोग",
    excerpt:
      "सिवाईसी नेपाल लघुवित्त वित्तीय संस्था लि.ले आफ्ना सदस्यहरूका मेधावी तथा आर्थिक रूपमा विपन्न छात्रछात्राहरूलाई गुणस्तरीय शिक्षा प्राप्त गर्न प्रोत्साहन गर्ने उद्देश्यले छात्रवृत्ति कार्यक्रम सञ्चालन गरेको छ।",
    date: "Apr 23, 2023",
    category: "news",
    image:
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80",
    tag: "शिक्षा",
  },
];

export default function NewsAndNotices() {
  const [activeFilter, setActiveFilter] = useState<"all" | "news" | "notice">("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeFilter === "all"
      ? newsData
      : newsData.filter((n) => n.category === activeFilter);

  // Responsive visible cards
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth <= 600) setVisibleCount(1);
      else if (window.innerWidth <= 900) setVisibleCount(2);
      else setVisibleCount(3);
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const maxIndex = Math.max(0, filtered.length - visibleCount);

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeFilter, visibleCount]);

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Noto+Sans+Devanagari:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --teal-deep: #005B5C;
          --teal-mid: #007A8E;
          --mint: #A8D8B9;
          --beige: #F0E5D8;
          --off-white: #F9F9F9;
          --text-dark: #1a2e2e;
          --text-mid: #3d5a5a;
          --text-light: #7a9a9a;
        }

        .ne-section {
          background: var(--off-white);
          padding: 80px 0 100px;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }

        .ne-section::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: rgba(0, 0, 0, 0.07);
        }

        .ne-bg-accent {
          position: absolute;
          top: -80px;
          right: -120px;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(168,216,185,0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        .ne-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
        }

        .ne-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 48px;
          flex-wrap: wrap;
          gap: 24px;
        }

        .ne-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .ne-eyebrow-line {
          width: 36px;
          height: 2px;
          background: var(--teal-mid);
        }

        .ne-eyebrow-text {
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--teal-mid);
        }

        .ne-heading {
          font-family: sans-serif;
          font-size: 40px;
          font-weight: 700;
          color: var(--text-dark);
          line-height: 1.15;
          margin: 0;
        }

        .ne-heading span {
          color: var(--teal-mid);
        }

        .ne-filters {
          display: flex;
          gap: 8px;
          background: white;
          padding: 8px 10px;
          border-radius: 50px;
          box-shadow: 0 2px 12px rgba(0,91,92,0.08);
        }

        .ne-filter-btn {
          padding: 8px 22px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.25s ease;
          background: transparent;
          color: var(--text-mid);
        }

        .ne-filter-btn:hover {
          background: var(--beige);
          color: var(--teal-deep);
        }

        .ne-filter-btn.active {
          background: var(--teal-deep);
          color: white;
          box-shadow: 0 4px 14px rgba(0,91,92,0.3);
        }

        .ne-slider-wrapper {
          position: relative;
          padding: 0 60px;
        }

        .ne-track-outer {
          overflow: hidden;
          border-radius: 2px;
        }

        .ne-track {
          display: flex;
          gap: 28px;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .ne-card {
          flex: 0 0 calc((100% - 56px) / 3);
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,91,92,0.06);
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
        }

        .ne-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(0,91,92,0.14);
        }

        .ne-card-img-wrap {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .ne-card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .ne-card:hover .ne-card-img-wrap img {
          transform: scale(1.07);
        }

        .ne-card-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,91,92,0.45) 0%, transparent 60%);
        }

        .ne-card-tag {
          position: absolute;
          top: 14px;
          left: 14px;
          padding: 6px 12px;
          background: var(--teal-mid);
          color: white;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border-radius: 50px;
        }

        .ne-card-body {
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .ne-card-title {
          font-family: 'Noto Sans Devanagari', 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-dark);
          line-height: 1.55;
          margin: 0 0 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ne-card-excerpt {
          font-size: 15px;
          color: var(--text-light);
          line-height: 1.7;
          margin: 0 0 20px;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ne-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid #f0f0f0;
          margin-top: auto;
        }

        .ne-card-date {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: var(--text-light);
          font-weight: 400;
        }

        .ne-date-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--teal-mid);
          flex-shrink: 0;
        }

        .ne-read-more {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: var(--teal-deep);
          text-decoration: none;
          letter-spacing: 0.03em;
          transition: gap 0.2s ease, color 0.2s ease;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          font-family: inherit;
        }

        .ne-read-more:hover {
          gap: 10px;
          color: var(--teal-mid);
        }

        .ne-read-more-arrow {
          font-size: 14px;
          transition: transform 0.2s ease;
        }

        .ne-read-more:hover .ne-read-more-arrow {
          transform: translateX(3px);
        }

        .ne-arrow-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid var(--teal-mid);
          background: white;
          color: var(--teal-mid);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
          font-size: 16px;
          position: absolute;
          top: 50%;
          z-index: 2;
        }

        .ne-arrow-btn.left {
          left: 0;
          transform: translateY(-50%);
        }

        .ne-arrow-btn.right {
          right: 0;
          transform: translateY(-50%);
        }

        .ne-arrow-btn:hover:not(:disabled) {
          background: var(--beige);
          transform: translateY(-50%) scale(1.08);
        }

        .ne-arrow-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .ne-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 44px;
        }

        .ne-dots {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .ne-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--mint);
          cursor: pointer;
          transition: all 0.25s ease;
          border: none;
          padding: 0;
        }

        .ne-dot.active {
          width: 22px;
          border-radius: 3px;
          background: var(--teal-deep);
        }

        .ne-view-all {
          display: block;
          margin: 48px auto 0;
          padding: 14px 40px;
          background: transparent;
          border: 1.5px solid var(--teal-deep);
          color: var(--teal-deep);
          border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: all 0.28s ease;
          position: relative;
          overflow: hidden;
        }

        .ne-view-all::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--teal-deep);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.28s ease;
          z-index: 0;
        }

        .ne-view-all:hover::before {
          transform: scaleX(1);
        }

        .ne-view-all span {
          position: relative;
          z-index: 1;
          transition: color 0.28s ease;
        }

        .ne-view-all:hover span {
          color: white;
        }

        /* ===================== RESPONSIVE DESIGN ===================== */

        @media (max-width: 900px) {
          .ne-slider-wrapper {
            padding: 0 50px;
          }
          .ne-card {
            flex: 0 0 calc((100% - 28px) / 2);
          }
        }

        @media (max-width: 600px) {
          .ne-section {
            padding: 60px 0 80px;
          }

          .ne-container {
            padding: 0 20px;
          }

          .ne-slider-wrapper {
            padding: 0 20px;
          }

          .ne-card {
            flex: 0 0 100%;
          }

          .ne-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }

          .ne-filters {
            width: 100%;
            justify-content: center;
          }

          /* Hide arrows on mobile phones */
          .ne-arrow-btn {
            display: none;
          }

          .ne-card-img-wrap {
            height: 200px;
          }

          .ne-card-title {
            font-size: 15.5px;
          }

          .ne-card-excerpt {
            font-size: 14.5px;
          }

          .ne-controls {
            margin-top: 32px;
          }

          .ne-dot {
            width: 8px;
            height: 8px;
          }

          .ne-dot.active {
            width: 28px;
          }

          .ne-view-all {
            margin-top: 40px;
            padding: 16px 36px;
            font-size: 15px;
          }
        }

        /* Show arrows on tablets */
        @media (min-width: 601px) and (max-width: 900px) {
          .ne-arrow-btn {
            display: flex;
          }
        }
      `}</style>

      <section className="ne-section">
        <div className="ne-bg-accent" />

        <div className="ne-container">
          {/* Header */}
          <div className="ne-header">
            <div className="ne-title-block">
              <div className="ne-eyebrow">
                <div className="ne-eyebrow-line" />
                <span className="ne-eyebrow-text">Latest Updates</span>
              </div>
              <h2 className="ne-heading">
                News & <span>Notices</span>
              </h2>
            </div>

            <div className="ne-filters">
              {(["all", "news", "notice"] as const).map((f) => (
                <button
                  key={f}
                  className={`ne-filter-btn ${activeFilter === f ? "active" : ""}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f === "all" ? "All" : f === "news" ? "News" : "Notices"}
                </button>
              ))}
            </div>
          </div>

          {/* Slider */}
          <div className="ne-slider-wrapper">
            <button
              className="ne-arrow-btn left"
              onClick={prev}
              disabled={currentIndex === 0}
              aria-label="Previous"
            >
              <Image
                src="/images/newsAndNotices/slider-arrow.png"
                alt="Previous"
                width={32}
                height={32}
                style={{ transform: "rotate(-180deg)" }}
              />
            </button>

            <div className="ne-track-outer">
              <div
                ref={trackRef}
                className="ne-track"
                style={{
                  transform: `translateX(calc(-${currentIndex} * (100% / ${visibleCount} + 28px / ${visibleCount})))`,
                }}
              >
                {filtered.map((item) => (
                  <article
                    key={item.id}
                    className="ne-card"
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div className="ne-card-img-wrap">
                      <img src={item.image} alt={item.title} loading="lazy" />
                      <div className="ne-card-img-overlay" />
                      <span className="ne-card-tag">{item.tag}</span>
                    </div>

                    <div className="ne-card-body">
                      <h3 className="ne-card-title">{item.title}</h3>
                      <p className="ne-card-excerpt">{item.excerpt}</p>

                      <div className="ne-card-footer">
                        <div className="ne-card-date">
                          <div className="ne-date-dot" />
                          {item.date}
                        </div>
                        <button className="ne-read-more">
                          Read More
                          <Image
                            src="/images/newsAndNotices/arrow.png"
                            alt="arrow"
                            width={20}
                            height={20}
                            style={{ transform: "rotate(-90deg)" }}
                            className="ne-read-more-arrow"
                          />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <button
              className="ne-arrow-btn right"
              onClick={next}
              disabled={currentIndex >= maxIndex}
              aria-label="Next"
            >
              <Image
                src="/images/newsAndNotices/slider-arrow.png"
                alt="Next"
                width={32}
                height={32}
              />
            </button>
          </div>

          {/* Dots */}
          <div className="ne-controls">
            <div className="ne-dots">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  className={`ne-dot ${currentIndex === i ? "active" : ""}`}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* View All Button */}
          <button className="ne-view-all">
            <Link href="/news-notices">
              <span>View All News &amp; Notices</span>
            </Link>
          </button>
        </div>
      </section>
    </>
  );
}