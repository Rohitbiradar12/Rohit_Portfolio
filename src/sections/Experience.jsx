import { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import TitleHeader from "../components/TitleHeader";
import { expCards } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const ChevronIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M6 9l6 6 6-6" />
    </svg>
);

const ROLE_META = {
    0: {
        company: "Torry Harris Integration Solutions",
        location: "Bangalore, India",
        accent: "#a78bfa",
        badge: "Most Recent",
        metrics: [
            { value: "10+", label: "Microservices shipped" },
            { value: "35%", label: "Faster loan processing" },
            { value: "98.99%", label: "Transaction success rate" },
        ],
        techs: [
            "Spring Boot",
            "Kafka",
            "Redis",
            "PostgreSQL",
            "Oracle",
            "Java",
            "REST",
        ],
    },
    1: {
        company: "Torry Harris Integration Solutions",
        location: "Bangalore, India",
        accent: "#60a5fa",
        techs: [
            "Spring Boot",
            "JWT",
            "AWS S3",
            "API Gateway",
            "Microservices",
            "Java",
        ],
    },
    2: {
        company: "REVA Developer's Club",
        location: "REVA University, India",
        accent: "#34d399",
        techs: [
            "REST APIs",
            "Database Design",
            "Role-Based Auth",
            "Pagination",
            "Logging",
        ],
    },
};

const MONTH_ABBR = {
    January: "Jan",
    February: "Feb",
    March: "Mar",
    April: "Apr",
    May: "May",
    June: "Jun",
    July: "Jul",
    August: "Aug",
    September: "Sep",
    October: "Oct",
    November: "Nov",
    December: "Dec",
};

const formatDate = (date) => {
    if (!date) return "";
    let out = date;
    Object.entries(MONTH_ABBR).forEach(([full, abbr]) => {
        out = out.replace(new RegExp(`\\b${full}\\b`, "g"), abbr);
    });
    return out.replace(/\s*-\s*/g, " — ");
};

const PinIcon = () => (
    <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const ExperienceRow = ({ card, index, isLast }) => {
    const meta = ROLE_META[index] || {};
    const accent = meta.accent || "#a78bfa";
    const nextMeta = ROLE_META[index + 1];
    const nextAccent = nextMeta?.accent || accent;
    const [isOpen, setIsOpen] = useState(index === 0);

    const toggle = useCallback(() => setIsOpen((v) => !v), []);
    const handleKey = useCallback(
        (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle();
            }
        },
        [toggle]
    );

    return (
        <article
            className={`tl-row${isOpen ? " is-open" : ""}`}
            style={{ "--accent": accent, "--next-accent": nextAccent }}
        >
            <div className="tl-rail">
                <div className="tl-num">{String(index + 1).padStart(2, "0")}</div>
                <div className="tl-logo">
                    <img
                        src={card.logoPath}
                        alt={meta.company || "company"}
                        loading="lazy"
                    />
                </div>
                {!isLast && <div className="tl-line" />}
            </div>

            <div className="tl-card">
                <div className="tl-accent-bar" />
                <div className="tl-spotlight" />
                <div className="tl-card-glow" />

                <div
                    className="tl-card-head"
                    onClick={toggle}
                    onKeyDown={handleKey}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    aria-controls={`tl-body-${index}`}
                >
                    <div className="tl-card-head-left">
                        {meta.badge && (
                            <span className="tl-badge">
                                <span className="tl-badge-dot" />
                                {meta.badge}
                            </span>
                        )}
                        <h3 className="tl-company">{meta.company}</h3>
                        <p className="tl-role">{(card.title || "").trim()}</p>
                        {meta.location && (
                            <p className="tl-location">
                                <PinIcon />
                                <span>{meta.location}</span>
                            </p>
                        )}
                    </div>
                    <div className="tl-card-head-right">
                        <div className="tl-date">{formatDate(card.date)}</div>
                        <div className="tl-chevron" aria-hidden="true">
                            <ChevronIcon />
                        </div>
                    </div>
                </div>

                <div className="tl-body" id={`tl-body-${index}`}>
                    <div className="tl-body-inner">
                        {meta.metrics && meta.metrics.length > 0 && (
                            <div className="tl-metrics">
                                {meta.metrics.map((m, i) => (
                                    <div key={i} className="tl-metric">
                                        <div className="tl-metric-value">{m.value}</div>
                                        <div className="tl-metric-rule" />
                                        <div className="tl-metric-label">{m.label}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <ul className="tl-bullets">
                            {card.responsibilities.map((r, i) => (
                                <li key={i} className="tl-bullet">
                                    <span className="tl-bullet-dot" />
                                    <span className="tl-bullet-text">{r}</span>
                                </li>
                            ))}
                        </ul>

                        {meta.techs && meta.techs.length > 0 && (
                            <>
                                <div className="tl-divider" />
                                <div className="tl-tags">
                                    {meta.techs.map((t, i) => (
                                        <span key={i} className="tl-tag">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};

const Experience = () => {
    const sectionRef = useRef(null);

    const handleTimelineMouseMove = useCallback((e) => {
        const card = e.target.closest(".tl-card");
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    }, []);

    useGSAP(() => {
        gsap.fromTo(
            ".tl-stats-bar",
            { y: 14, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
            }
        );

        gsap.utils.toArray(".tl-row").forEach((row) => {
            gsap.fromTo(
                row.querySelector(".tl-rail"),
                { opacity: 0, scale: 0.92 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.7,
                    ease: "power3.out",
                    scrollTrigger: { trigger: row, start: "top 85%" },
                }
            );

            gsap.fromTo(
                row.querySelector(".tl-card"),
                { x: 24, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.85,
                    ease: "power3.out",
                    scrollTrigger: { trigger: row, start: "top 85%" },
                }
            );

            gsap.fromTo(
                row.querySelectorAll(".tl-bullet"),
                { y: 12, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.55,
                    stagger: 0.06,
                    ease: "power3.out",
                    scrollTrigger: { trigger: row, start: "top 80%" },
                }
            );
        });
    }, []);

    return (
        <section
            id="experience"
            ref={sectionRef}
            className="ex-section relative md:mt-24 mt-12"
        >
            <div className="relative z-10 w-full max-w-6xl mx-auto px-5 md:px-10 py-16 md:py-24">
                <TitleHeader
                    title={
                        <>
                            Professional{" "}
                            <span className="text-purple-accent gradient-text">
                                Experience
                            </span>
                        </>
                    }
                />

                <div className="tl-stats-bar">
                    <span>
                        {String(expCards.length).padStart(2, "0")} Roles
                    </span>
                    <span className="tl-stats-dot">·</span>
                    <span>Microservices</span>
                    <span className="tl-stats-dot">·</span>
                    <span>Cloud-Native Backend</span>
                </div>

                <div
                    className="tl-timeline"
                    onMouseMove={handleTimelineMouseMove}
                >
                    {expCards.map((card, i) => (
                        <ExperienceRow
                            key={i}
                            card={card}
                            index={i}
                            isLast={i === expCards.length - 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
