import { useRef, useState, useCallback, memo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { techStackImgs } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const SkillCard = memo(({ skill }) => {
  const cardRef = useRef(null);
  const contentRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || !contentRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smoother 3D tilt with reduced sensitivity
    const rotateX = ((y - centerY) / centerY) * 6;
    const rotateY = ((x - centerX) / centerX) * 6;

    // Premium spotlight effect
    const spotlight = cardRef.current.querySelector('.skill-spotlight');
    if (spotlight) {
      spotlight.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(139, 92, 246, 0.12), rgba(255, 255, 255, 0.04) 40%, transparent 65%)`;
      spotlight.style.opacity = '1';
    }

    gsap.to(contentRef.current, {
      rotateX: -rotateX,
      rotateY: rotateY,
      duration: 0.6,
      ease: "expo.out",
      overwrite: "auto"
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!cardRef.current) return;

    // Smooth card lift
    gsap.to(cardRef.current.querySelector('.skill-card-content'), {
      y: -14,
      scale: 1.03,
      duration: 0.6,
      ease: "expo.out",
      overwrite: "auto"
    });

    // Animate ambient glow
    const ambientGlow = cardRef.current.querySelector('.skill-ambient-glow');
    if (ambientGlow) {
      gsap.to(ambientGlow, {
        opacity: 0.3,
        scale: 1.2,
        duration: 0.7,
        ease: "power2.out"
      });
    }

    // Enhanced icon animation
    gsap.to(cardRef.current.querySelector('.skill-icon'), {
      scale: 1.18,
      y: -4,
      filter: 'brightness(1.2) drop-shadow(0 8px 20px var(--skill-color))',
      duration: 0.5,
      ease: "expo.out"
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current || !contentRef.current) return;

    // Fade spotlight smoothly
    const spotlight = cardRef.current.querySelector('.skill-spotlight');
    if (spotlight) {
      gsap.to(spotlight, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    }

    // Smooth settle back
    gsap.to(contentRef.current, {
      rotateX: 0,
      rotateY: 0,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: "expo.out",
      overwrite: "auto"
    });

    // Reset ambient glow
    const ambientGlow = cardRef.current.querySelector('.skill-ambient-glow');
    if (ambientGlow) {
      gsap.to(ambientGlow, {
        opacity: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out"
      });
    }

    // Reset icon smoothly
    gsap.to(cardRef.current.querySelector('.skill-icon'), {
      scale: 1,
      y: 0,
      filter: 'brightness(1) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
      duration: 0.5,
      ease: "power2.out"
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className="skill-card"
      style={{ "--skill-color": skill.color }}
      data-id={skill.id}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="skill-ambient-glow" />
      <div className="skill-border-glow" />
      <div className="skill-card-glow" />
      <div className="skill-spotlight" />

      <div ref={contentRef} className="skill-card-content">
        <div className="skill-shimmer" />

        <div className="skill-icon-wrapper">
          <div className="skill-icon-bg" />
          <div className="skill-icon-ring" />
          <img
            src={skill.imgPath}
            alt={skill.name}
            className="skill-icon"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextElementSibling) {
                e.target.nextElementSibling.style.display = 'flex';
              }
            }}
          />
          <div className="skill-icon-fallback">
            {skill.name.charAt(0)}
          </div>
        </div>

        <h3 className="skill-name">{skill.name}</h3>
        <span className="skill-badge">{skill.category}</span>
      </div>
    </div>
  );
});

SkillCard.displayName = 'SkillCard';

const TechStack = () => {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedSkills, setDisplayedSkills] = useState(techStackImgs);

  const categories = ["All", ...new Set(techStackImgs.map(tech => tech.category))];

  const handleCategoryChange = useCallback((category) => {
    if (isAnimating || category === activeCategory) return;

    setIsAnimating(true);

    const grid = gridRef.current;
    const currentCards = grid?.querySelectorAll('.skill-card') || [];

    if (grid) grid.style.minHeight = `${grid.offsetHeight}px`;

    gsap.set(currentCards, { force3D: true });

    gsap.to(currentCards, {
      opacity: 0,
      y: -20,
      scale: 0.92,
      duration: 0.35,
      stagger: { each: 0.02, from: "center" },
      ease: "power2.in",
      onComplete: () => {
        const newSkills = category === "All"
          ? techStackImgs
          : techStackImgs.filter(tech => tech.category === category);

        setActiveCategory(category);
        setDisplayedSkills(newSkills);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const newCards = grid?.querySelectorAll('.skill-card') || [];

            if (newCards.length === 0) {
              setIsAnimating(false);
              if (grid) grid.style.minHeight = '';
              return;
            }

            gsap.set(newCards, { opacity: 0, y: 30, scale: 0.9, force3D: true });

            gsap.to(newCards, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              stagger: { each: 0.03, from: "start" },
              ease: "power3.out",
              onComplete: () => {
                setIsAnimating(false);
                if (grid) grid.style.minHeight = '';
                gsap.set(newCards, { clearProps: "force3D" });
              }
            });
          });
        });
      }
    });
  }, [isAnimating, activeCategory]);

  useGSAP(() => {
    gsap.fromTo(".skills-header > *",
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
      }
    );

    gsap.fromTo(".category-filter",
      { scale: 0.8, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.5, stagger: 0.06, ease: "back.out(1.7)",
        scrollTrigger: { trigger: ".category-filters", start: "top 80%" }
      }
    );

    gsap.fromTo(".skill-card",
      { y: 50, opacity: 0, scale: 0.9 },
      {
        y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: { each: 0.04, from: "start" },
        ease: "power3.out",
        scrollTrigger: { trigger: ".skills-grid", start: "top 85%" }
      }
    );

    gsap.utils.toArray(".skill-icon").forEach((icon, i) => {
      gsap.to(icon, {
        y: -5, duration: 2.5 + (i * 0.1), ease: "sine.inOut",
        yoyo: true, repeat: -1, delay: i * 0.08
      });
    });

    ScrollTrigger.create({
      trigger: ".skills-stats",
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.fromTo(".stat-card",
          { y: 40, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.12, ease: "back.out(1.3)" }
        );

        document.querySelectorAll('.stat-number').forEach((el) => {
          const target = parseInt(el.dataset.value);
          gsap.fromTo(el, { innerText: 0 }, {
            innerText: target, duration: 2, ease: "power2.out",
            snap: { innerText: 1 },
            onUpdate: function () { el.textContent = Math.round(this.targets()[0].innerText) + "+"; }
          });
        });
      }
    });
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="skills-section">
      <div className="skills-bg">
        <div className="skills-gradient" />
        <div className="skills-orb orb-1" />
        <div className="skills-orb orb-2" />
        <div className="skills-orb orb-3" />
        <div className="skills-grid-pattern" />
        <div className="skills-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
            }} />
          ))}
        </div>
      </div>

      <div className="skills-container">
        <div className="skills-header">
          <div className="skills-badge">
            <span className="badge-icon">⚡</span>
            <span>Technologies & Tools</span>
          </div>
          <h2 className="skills-title">
            My Tech <span className="gradient-text">Arsenal</span>
          </h2>
          <p className="skills-subtitle">
            A comprehensive toolkit of modern technologies I use to build exceptional digital experiences
          </p>
        </div>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              disabled={isAnimating}
              className={`category-filter ${activeCategory === category ? 'active' : ''} ${isAnimating ? 'disabled' : ''}`}
            >
              <span className="filter-bg" />
              <span className="filter-text">{category}</span>
              {activeCategory === category && <span className="filter-glow" />}
            </button>
          ))}
        </div>

        <div ref={gridRef} className={`skills-grid ${isAnimating ? 'is-animating' : ''}`}>
          {displayedSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
            />
          ))}
        </div>

        <div className="skills-stats">
          {[
            { value: 27, label: "Technologies", icon: "🚀" },
            { value: 5, label: "Categories", icon: "📦" },
            { value: 3, label: "Years Experience", icon: "⭐" },
          ].map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <div className="stat-number" data-value={stat.value}>0+</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
