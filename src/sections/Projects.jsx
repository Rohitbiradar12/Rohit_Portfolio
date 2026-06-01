import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import TitleHeader from "../components/TitleHeader";
import { projects } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const PROJECT_META = {
    1: {
        tag: "EdTech Platform",
        palette: "violet",
        metrics: [
            { value: "AI", label: "Powered" },
            { value: "3D", label: "Canvas" },
        ],
    },
    2: {
        tag: "Full-Stack",
        palette: "teal",
        metrics: [
            { value: "Real-Time", label: "Sync" },
            { value: "Multi", label: "Workspace" },
        ],
    },
    3: {
        tag: "FinTech",
        palette: "amber",
        metrics: [
            { value: "Split", label: "Expenses" },
            { value: "EMI", label: "Calculator" },
        ],
    },
    4: {
        tag: "AI Voice Agent",
        palette: "blue",
        metrics: [
            { value: "Voice", label: "Real-time" },
            { value: "Auto", label: "Booking" },
        ],
    },
    5: {
        tag: "Decentralized AI",
        palette: "emerald",
        metrics: [
            { value: "On-Chain", label: "Bitcoin data" },
            { value: "COG", label: "Token protocol" },
        ],
    },
};

const ArrowIcon = ({ direction = "right" }) => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: direction === "left" ? "rotate(180deg)" : "none" }}
        aria-hidden="true"
    >
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

const ProjectCard = ({ project }) => {
    const meta = PROJECT_META[project.id] || {
        palette: "violet",
        tag: "Project",
        metrics: [],
    };

    return (
        <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`pj-card pj-${meta.palette}`}
            aria-label={`View ${project.title}`}
        >
            <div className="pj-card-media">
                <img
                    src={project.img}
                    alt={project.title}
                    className="pj-card-image"
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.style.display = "none";
                    }}
                />
                <div className="pj-card-media-fade" />

                <div className="pj-card-top">
                    <span className="pj-tag">{meta.tag}</span>
                    <div className="pj-techs">
                        {project.iconLists.slice(0, 3).map((icon, i) => (
                            <div
                                key={i}
                                className="pj-tech-tile"
                                style={{ "--tile-delay": `${i * 0.4}s` }}
                            >
                                <img
                                    src={icon}
                                    alt=""
                                    className="pj-tech-icon"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pj-card-body">
                <h3 className="pj-card-title">{project.title}</h3>
                <p className="pj-card-desc">{project.des}</p>

                {meta.metrics && meta.metrics.length > 0 && (
                    <div className="pj-metrics">
                        {meta.metrics.map((m, i) => (
                            <div key={i} className="pj-metric">
                                <div className="pj-metric-value">{m.value}</div>
                                <div className="pj-metric-label">{m.label}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="pj-card-border" />
        </a>
    );
};

const Projects = () => {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const scrollByCard = useCallback((direction) => {
        const track = trackRef.current;
        if (!track) return;
        const card = track.querySelector(".pj-card");
        if (!card) return;
        const gap = parseInt(window.getComputedStyle(track).gap) || 0;
        const cardWidth = card.offsetWidth + gap;
        track.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
    }, []);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const updateIndex = () => {
            const cards = track.querySelectorAll(".pj-card");
            const trackRect = track.getBoundingClientRect();
            let closest = 0;
            let minDist = Infinity;
            cards.forEach((card, i) => {
                const dist = Math.abs(
                    card.getBoundingClientRect().left - trackRect.left
                );
                if (dist < minDist) {
                    minDist = dist;
                    closest = i;
                }
            });
            setCurrentIndex(closest);
        };

        track.addEventListener("scroll", updateIndex, { passive: true });
        updateIndex();
        return () => track.removeEventListener("scroll", updateIndex);
    }, []);

    useGSAP(() => {
        gsap.fromTo(
            ".pj-subtitle, .pj-controls-row",
            { y: 18, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.12,
                ease: "power3.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
            }
        );

        gsap.fromTo(
            ".pj-card",
            { y: 36, opacity: 0, scale: 0.96 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.95,
                stagger: 0.12,
                ease: "power3.out",
                scrollTrigger: { trigger: ".pj-track", start: "top 85%" },
            }
        );
    }, []);

    return (
        <section
            id="projects"
            ref={sectionRef}
            className="pj-section relative md:mt-24 mt-12"
        >
            <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-10 py-20 md:py-28">
                <TitleHeader
                    title={
                        <>
                            My Latest{" "}
                            <span className="text-purple-accent gradient-text">
                                Projects
                            </span>
                        </>
                    }
                />

                <p className="pj-subtitle">
                    Full-stack systems, cloud-native backends, and developer
                    tooling — built to solve real problems.
                </p>

                <div className="pj-controls-row">
                    <div className="pj-nav">
                        <button
                            type="button"
                            onClick={() => scrollByCard(-1)}
                            className="pj-nav-btn"
                            disabled={currentIndex === 0}
                            aria-label="Previous project"
                        >
                            <ArrowIcon direction="left" />
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollByCard(1)}
                            className="pj-nav-btn"
                            disabled={currentIndex === projects.length - 1}
                            aria-label="Next project"
                        >
                            <ArrowIcon direction="right" />
                        </button>
                    </div>
                    <div className="pj-counter">
                        <span className="pj-counter-current">
                            {String(currentIndex + 1).padStart(2, "0")}
                        </span>
                        <span className="pj-counter-sep">/</span>
                        <span className="pj-counter-total">
                            {String(projects.length).padStart(2, "0")}
                        </span>
                    </div>
                </div>

                <div ref={trackRef} className="pj-track">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
