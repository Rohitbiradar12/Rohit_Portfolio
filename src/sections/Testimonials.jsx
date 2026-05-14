import { useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { testimonials } from "../constants";
import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIAL_COMPANIES = {
  "Madhavi Balachandra": "Torry Harris",
  "Sudhakar Shivraj": "Torry Harris",
  "Shravan Kumar": "Northeastern University",
};

const QuoteGlyph = () => (
  <svg
    className="tm-quote-mark"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

const Testimonials = () => {
  const sectionRef = useRef(null);

  const handleGridMouseMove = useCallback((e) => {
    const card = e.target.closest(".tm-card");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      ".tm-stats-bar",
      { y: 14, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      }
    );

    gsap.fromTo(
      ".tm-card",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".tm-grid", start: "top 85%" },
      }
    );
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="tm-section relative md:mt-24 mt-12"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-10 py-20 md:py-28">
        <TitleHeader
          title={
            <>
              What People Say{" "}
              <span className="text-purple-accent gradient-text">About Me</span>
            </>
          }
        />

        <div className="tm-stats-bar">
          <span>Endorsements</span>
          <span className="tm-stats-dot">·</span>
          <span>Engineers & Managers</span>
          <span className="tm-stats-dot">·</span>
          <span>From Real Projects</span>
        </div>

        <div className="tm-grid" onMouseMove={handleGridMouseMove}>
          {testimonials.map((t, i) => {
            const company = TESTIMONIAL_COMPANIES[t.name];
            return (
              <article key={i} className="tm-card">
                <div className="tm-spotlight" />

                <div className="tm-card-inner">
                  <QuoteGlyph />

                  <p className="tm-quote">{t.review}</p>

                  <div className="tm-divider" />

                  <div className="tm-author">
                    <div className="tm-avatar-wrap">
                      <img
                        src={t.imgPath}
                        alt={t.name}
                        className="tm-avatar"
                        loading="lazy"
                      />
                    </div>
                    <div className="tm-author-meta">
                      <h4 className="tm-name">{t.name}</h4>
                      <p className="tm-role">{t.mentions}</p>
                      {company && <p className="tm-company">{company}</p>}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
