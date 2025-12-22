import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import TitleHeader from "../components/TitleHeader";
import { techStackImgs } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const TechStack = () => {
  const sectionRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...new Set(techStackImgs.map(tech => tech.category))];

  const filteredSkills = activeCategory === "All"
    ? techStackImgs
    : techStackImgs.filter(tech => tech.category === activeCategory);

  useGSAP(() => {
    gsap.fromTo(
      ".skills-header > *",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      }
    );

    gsap.fromTo(
      ".category-pill",
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".category-container",
          start: "top 85%",
        },
      }
    );

    gsap.fromTo(
      ".skill-card",
      {
        y: 80,
        opacity: 0,
        rotateY: -15,
        scale: 0.8
      },
      {
        y: 0,
        opacity: 1,
        rotateY: 0,
        scale: 1,
        duration: 0.8,
        stagger: {
          each: 0.08,
          from: "start"
        },
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".skills-grid",
          start: "top 85%",
        },
      }
    );

    gsap.utils.toArray(".skill-icon-float").forEach((icon, i) => {
      gsap.to(icon, {
        y: -8,
        duration: 2 + (i * 0.2),
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        delay: i * 0.1,
      });
    });

  }, [activeCategory]);

  const handleCategoryChange = (category) => {
    gsap.to(".skill-card", {
      scale: 0.8,
      opacity: 0,
      duration: 0.2,
      stagger: 0.02,
      ease: "power2.in",
      onComplete: () => {
        setActiveCategory(category);
        gsap.fromTo(
          ".skill-card",
          { scale: 0.8, opacity: 0, y: 30 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "back.out(1.4)",
          }
        );
      },
    });
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="skills-section relative min-h-screen overflow-hidden py-20 md:py-32"
    >
      <div className="skills-bg-gradient" />
      <div className="skills-orb skills-orb-1" />
      <div className="skills-orb skills-orb-2" />
      <div className="skills-orb skills-orb-3" />

      <div className="skills-grid-pattern" />

      <div className="skills-particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="skills-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
        <div className="skills-header flex flex-col items-center gap-5 mb-12">
          <div className="hero-badge">
            <p>🛠️ Technologies & Tools</p>
          </div>
          <h2 className="font-bold md:text-5xl text-3xl text-center">
            My Tech <span className="gradient-text">Arsenal</span>
          </h2>
          <p className="text-white-50 text-center max-w-2xl text-lg">
            A comprehensive toolkit of modern technologies I use to build exceptional digital experiences
          </p>
        </div>

        <div className="category-container flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`category-pill ${activeCategory === category ? 'active' : ''}`}
            >
              <span className="category-pill-bg" />
              <span className="category-pill-text">{category}</span>
              {activeCategory === category && <span className="category-pill-glow" />}
            </button>
          ))}
        </div>

        <div className="skills-grid">
          {filteredSkills.map((skill, index) => (
            <div
              key={skill.name}
              className="skill-card group"
              style={{ "--skill-color": skill.color }}
            >
              <div className="skill-card-glow" />
              <div className="skill-card-border" />

              <div className="skill-card-inner">
                <div className="skill-icon-container">
                  <div className="skill-icon-bg" />
                  <div className="skill-icon-float">
                    <img
                      src={skill.imgPath}
                      alt={skill.name}
                      className="skill-icon-img"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="skill-icon-fallback" style="color: ${skill.color}">
                            ${skill.name.charAt(0)}
                          </div>
                        `;
                      }}
                    />
                  </div>
                  <div className="skill-orbit-ring" />
                </div>

                <h3 className="skill-name">{skill.name}</h3>
                <span className="skill-category">{skill.category}</span>

                <div className="skill-shine" />
              </div>
            </div>
          ))}
        </div>

        <div className="skills-stats mt-20">
          <div className="skills-stats-grid">
            {[
              { value: "18+", label: "Technologies", icon: "⚡" },
              { value: "4+", label: "Categories", icon: "📚" },
              { value: "2+", label: "Years Experience", icon: "🎯" },
            ].map((stat, index) => (
              <div key={index} className="skills-stat-card">
                <span className="skills-stat-icon">{stat.icon}</span>
                <span className="skills-stat-value">{stat.value}</span>
                <span className="skills-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
