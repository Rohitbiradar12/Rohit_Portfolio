import { useRef, useCallback, memo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import TitleHeader from "../components/TitleHeader";

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

const AchievementCard = memo(({ ach, index }) => {
    const cardRef = useRef(null);
    const contentRef = useRef(null);

    const handleMouseMove = useCallback((e) => {
        if (!cardRef.current || !contentRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rx = ((y - cy) / cy) * 6;
        const ry = ((x - cx) / cx) * 6;

        const spot = cardRef.current.querySelector(".ach-spotlight");
        if (spot) {
            spot.style.background = `radial-gradient(420px circle at ${x}px ${y}px, ${ach.glow}, transparent 55%)`;
            spot.style.opacity = "1";
        }

        gsap.to(contentRef.current, {
            rotateX: -rx,
            rotateY: ry,
            duration: 0.55,
            ease: "expo.out",
            overwrite: "auto",
        });
    }, [ach.glow]);

    const handleMouseLeave = useCallback(() => {
        if (!cardRef.current || !contentRef.current) return;

        const spot = cardRef.current.querySelector(".ach-spotlight");
        if (spot) gsap.to(spot, { opacity: 0, duration: 0.5, ease: "power2.out" });

        gsap.to(contentRef.current, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.75,
            ease: "expo.out",
            overwrite: "auto",
        });
    }, []);

    const Tag = ach.link ? "a" : "div";
    const linkProps = ach.link
        ? { href: ach.link, target: "_blank", rel: "noopener noreferrer" }
        : {};

    return (
        <Tag
            ref={cardRef}
            className={`ach-card${ach.link ? " ach-card-link" : ""}`}
            style={{ "--ach-color": ach.color, "--ach-glow": ach.glow }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            {...linkProps}
        >
            <div className="ach-border" />
            <div className="ach-ambient" />
            <div className="ach-spotlight" />

            <div ref={contentRef} className="ach-content">
                <div className="ach-shimmer" />

                <div className="ach-top">
                    <div className="ach-icon-wrap">
                        <div className="ach-icon-ring" />
                        <div className="ach-icon-bg" />
                        {ach.icon.startsWith("/") ? (
                            <img src={ach.icon} alt={ach.title} className="ach-icon" />
                        ) : (
                            <span className="ach-icon">{ach.icon}</span>
                        )}
                    </div>
                    <div className="ach-badge">
                        <span className="ach-badge-dot" />
                        {ach.badge}
                    </div>
                </div>

                <h3 className="ach-title">
                    {ach.title}
                    {ach.link && (
                        <svg
                            className="ach-title-link"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M7 17L17 7" />
                            <path d="M8 7h9v9" />
                        </svg>
                    )}
                </h3>
                <p className="ach-org">{ach.organization}</p>

                <div className="ach-divider" />

                <p className="ach-desc">{ach.description}</p>

                <div className="ach-footer">
                    <span className="ach-date">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {ach.date}
                    </span>
                    <span className="ach-no">{String(index + 1).padStart(2, "0")}</span>
                </div>
            </div>
        </Tag>
    );
});
AchievementCard.displayName = "AchievementCard";

const Achievements = () => {
    const sectionRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo(
            ".ach-card",
            { y: 80, opacity: 0, scale: 0.92 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.12,
                ease: "back.out(1.3)",
                scrollTrigger: {
                    trigger: ".ach-grid",
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

        gsap.utils.toArray(".ach-icon").forEach((el, i) => {
            gsap.to(el, {
                y: -6,
                duration: 2.6 + i * 0.15,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                delay: i * 0.2,
            });
        });
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
                <div className="ach-particles">
                    {[...Array(18)].map((_, i) => (
                        <div
                            key={i}
                            className="ach-particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 6}s`,
                                animationDuration: `${5 + Math.random() * 6}s`,
                            }}
                        />
                    ))}
                </div>
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

                <div className="ach-grid">
                    {achievements.map((ach, i) => (
                        <AchievementCard key={ach.title} ach={ach} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Achievements;
