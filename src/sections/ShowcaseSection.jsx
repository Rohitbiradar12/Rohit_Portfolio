import { useRef, memo, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useGSAP from "../hooks/usePortfolioGSAP";

import TitleHeader from "../components/TitleHeader";
import "../styles/achievements.css";

gsap.registerPlugin(ScrollTrigger);

const achievements = [
    {
        icon: "🏆",
        title: "Best Innovation Award",
        organization: "University Hackathon",
        description: "Third place for an AI-powered LMS solution recognized for its impact and originality.",
        date: "Nov 2022",
        badge: "Award",
        color: "#fbbf24",
        glow: "rgba(251, 191, 36, 0.45)",
    },
    {
        icon: "/images/logos/azure-fundamentals-badge.webp",
        title: "Azure Fundamentals",
        organization: "Microsoft",
        description: "AZ-900 credential covering core cloud concepts, Azure services, security, and governance.",
        date: "April 2023",
        badge: "Certified",
        color: "#3b82f6",
        glow: "rgba(59, 130, 246, 0.45)",
        link: "https://www.credly.com/badges/37307b62-f451-4311-8fbb-9f54a518999e",
    },
    {
        icon: "🎓",
        title: "Dean's List",
        organization: "REVA University",
        description: "Recognized for sustained academic excellence across consecutive semesters.",
        date: "2023 – 2024",
        badge: "Honor",
        color: "#a855f7",
        glow: "rgba(168, 85, 247, 0.45)",
    },
    {
        icon: "💻",
        title: "Open Source Contributor",
        organization: "GitHub",
        description: "100+ contributions spanning libraries, tools, and community-driven projects.",
        date: "2025",
        badge: "Active",
        color: "#10b981",
        glow: "rgba(16, 185, 129, 0.45)",
    },
];

const summaryStats = [
    { value: "04", suffix: null, label: "Major Honors", caption: "Hackathons & academic recognitions" },
    { value: "100", suffix: "+", label: "Contributions", caption: "Across open-source projects" },
    { value: "03", suffix: null, label: "Years Recognized", caption: "Of consistent excellence" },
];

const AchievementAccordion = memo(({ ach, index, isActive, isDimmed, onEnter, onLeave }) => {
    const Tag = ach.link ? "a" : "div";
    const linkProps = ach.link
        ? { href: ach.link, target: "_blank", rel: "noopener noreferrer" }
        : {};

    return (
        <Tag
            className={`ach-acc-item${isActive ? " is-active" : ""}${isDimmed ? " is-dimmed" : ""}${ach.link ? " ach-acc-link" : ""}`}
            style={{ "--ach-color": ach.color, "--ach-glow": ach.glow }}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            {...linkProps}
        >
            <div className="ach-acc-bar" />
            <div className="ach-acc-glow" />
            <div className="ach-acc-wm">{String(index + 1).padStart(2, "0")}</div>

            <div className="ach-acc-head">
                <div className="ach-acc-left">
                    <div className="ach-acc-icon-wrap">
                        {ach.icon.startsWith("/") ? (
                            <img src={ach.icon} alt={ach.title} className="ach-acc-icon-img" />
                        ) : (
                            <span className="ach-acc-icon">{ach.icon}</span>
                        )}
                    </div>
                    <div className="ach-acc-title-group">
                        <h3 className="ach-acc-title">{ach.title}</h3>
                        <p className="ach-acc-org">{ach.organization}</p>
                    </div>
                </div>
                <div className="ach-acc-right">
                    <span className="ach-acc-badge">
                        <span className="ach-acc-badge-dot" />
                        {ach.badge}
                    </span>
                    <span className="ach-acc-date">{ach.date}</span>
                </div>
            </div>

            <div className="ach-acc-body">
                <div className="ach-acc-body-inner">
                    <p className="ach-acc-desc">{ach.description}</p>
                    {ach.link && (
                        <span className="ach-acc-view">
                            View credential
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M7 17L17 7"/><path d="M8 7h9v9"/>
                            </svg>
                        </span>
                    )}
                </div>
            </div>
        </Tag>
    );
});
AchievementAccordion.displayName = "AchievementAccordion";

const Achievements = () => {
    const sectionRef = useRef(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    useGSAP(() => {
        gsap.fromTo(
            ".ach-acc-item",
            { y: 80, opacity: 0, scale: 0.92 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.12,
                ease: "back.out(1.3)",
                scrollTrigger: {
                    trigger: ".ach-accordion",
                    start: "top 85%",
                },
            }
        );

        gsap.fromTo(
            ".ach-stat",
            { y: 14, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.18,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".ach-stats",
                    start: "top 90%",
                },
            }
        );
    }, []);

    return (
        <section
            id="achievements"
            ref={sectionRef}
            className="ach-section relative flex-center section-padding md:mt-40 mt-20 overflow-hidden"
        >
            <div className="ach-bg">
                <div className="ach-orb ach-orb-1" />
                <div className="ach-orb ach-orb-2" />
                <div className="ach-orb ach-orb-3" />
                <div className="ach-grid-pattern" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-10">
                <TitleHeader
                    title={
                        <>
                            Distinguished{" "}
                            <span className="text-purple-accent gradient-text">Achievements</span>{" "}
                            & Certifications
                        </>
                    }
                />

                <div className="ach-stats">
                    {summaryStats.map((stat, i) => (
                        <div key={i} className="ach-stat">
                            <div className="ach-stat-head">
                                <span className="ach-stat-dot" />
                                <span className="ach-stat-label">{stat.label}</span>
                            </div>
                            <div className="ach-stat-value">
                                {stat.value}
                                {stat.suffix && (
                                    <span className="ach-stat-suffix">{stat.suffix}</span>
                                )}
                            </div>
                            <div className="ach-stat-rule" />
                            <div className="ach-stat-caption">{stat.caption}</div>
                        </div>
                    ))}
                </div>

                <div className="ach-accordion">
                    {achievements.map((ach, i) => (
                        <AchievementAccordion
                            key={ach.title}
                            ach={ach}
                            index={i}
                            isActive={hoveredIndex === i}
                            isDimmed={hoveredIndex !== null && hoveredIndex !== i}
                            onEnter={() => setHoveredIndex(i)}
                            onLeave={() => setHoveredIndex(null)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Achievements;
