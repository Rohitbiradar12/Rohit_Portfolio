import { useRef, useCallback, memo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import TitleHeader from "../components/TitleHeader";
import { techStackImgs } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_ORDER = ["Frontend", "Backend", "Database", "DevOps"];

const groupByCategory = (list) => {
  const map = new Map();
  CATEGORY_ORDER.forEach((c) => map.set(c, []));
  list.forEach((t) => {
    if (!map.has(t.category)) map.set(t.category, []);
    map.get(t.category).push(t);
  });
  return Array.from(map.entries()).filter(([, arr]) => arr.length > 0);
};

const TechChip = memo(({ tech }) => (
  <div className="ts-chip">
    <div className="ts-chip-spotlight" />
    <div className="ts-chip-accent" />
    <div className="ts-chip-inner">
      <div className="ts-chip-icon-wrap">
        <img
          src={tech.imgPath}
          alt={tech.name}
          className="ts-chip-icon"
          loading="lazy"
        />
      </div>
      <div className="ts-chip-name">{tech.name}</div>
      <div className="ts-chip-meta">{tech.experience}</div>
    </div>
  </div>
));
TechChip.displayName = "TechChip";

const TechStack = () => {
  const sectionRef = useRef(null);
  const grouped = groupByCategory(techStackImgs);

  const handleGridMouseMove = useCallback((e) => {
    const chip = e.target.closest(".ts-chip");
    if (!chip) return;
    const rect = chip.getBoundingClientRect();
    chip.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    chip.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      ".ts-stats-bar",
      { y: 14, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      }
    );

    gsap.utils.toArray(".ts-group").forEach((group) => {
      gsap.fromTo(
        group.querySelector(".ts-group-rule"),
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: group, start: "top 85%" },
        }
      );

      gsap.fromTo(
        [
          group.querySelector(".ts-group-title"),
          group.querySelector(".ts-group-count"),
        ],
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: group, start: "top 85%" },
        }
      );

      gsap.fromTo(
        group.querySelectorAll(".ts-chip"),
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.035,
          ease: "power2.out",
          scrollTrigger: { trigger: group, start: "top 85%" },
        }
      );
    });
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="ts-section relative md:mt-24 mt-12"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-10 py-20 md:py-32">
        <TitleHeader
          title={
            <>
              My Tech{" "}
              <span className="text-purple-accent gradient-text">Arsenal</span>
            </>
          }
        />

        <div className="ts-stats-bar">
          <span>{techStackImgs.length} Technologies</span>
          <span className="ts-stats-dot">·</span>
          <span>{String(grouped.length).padStart(2, "0")} Disciplines</span>
          <span className="ts-stats-dot">·</span>
          <span>02+ Years in Production</span>
        </div>

        <div className="ts-stack">
          {grouped.map(([cat, items]) => (
            <div key={cat} className="ts-group">
              <div className="ts-group-head">
                <h3 className="ts-group-title">{cat}</h3>
                <span className="ts-group-rule" />
                <span className="ts-group-count">
                  {String(items.length).padStart(2, "0")}
                </span>
              </div>
              <div
                className="ts-group-grid"
                onMouseMove={handleGridMouseMove}
              >
                {items.map((tech) => (
                  <TechChip key={tech.id} tech={tech} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
