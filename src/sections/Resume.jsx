import { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

const RESUME_PATH = "/resume/Rohit_Resume.pdf";

const EyeIcon = () => (
    <svg
        className="rs-btn-icon"
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
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const DownloadIcon = () => (
    <svg
        className="rs-btn-icon"
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
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const ArrowIcon = () => (
    <svg
        className="rs-btn-arrow"
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

const Resume = () => {
    const sectionRef = useRef(null);
    const [imgError, setImgError] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    const handleViewResume = useCallback((e) => {
        e.preventDefault();
        window.open(RESUME_PATH, "_blank", "noopener,noreferrer");
    }, []);

    const handleDownloadResume = useCallback((e) => {
        e.preventDefault();
        const link = document.createElement("a");
        link.href = RESUME_PATH;
        link.download = "Rohit_Resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 2200);
    }, []);

    const handleActionsMouseMove = useCallback((e) => {
        const btn = e.target.closest(".rs-btn");
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        btn.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        btn.style.setProperty("--my", `${e.clientY - rect.top}px`);
    }, []);

    useGSAP(() => {
        gsap.fromTo(
            ".rs-stats-bar",
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
            ".rs-preview-wrap",
            { y: 32, opacity: 0, scale: 0.97 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1.05,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".rs-preview-wrap",
                    start: "top 85%",
                },
            }
        );

        gsap.fromTo(
            ".rs-btn",
            { y: 16, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.12,
                ease: "power3.out",
                scrollTrigger: { trigger: ".rs-actions", start: "top 90%" },
            }
        );

        gsap.fromTo(
            ".rs-cta",
            { y: 14, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.7,
                delay: 0.15,
                ease: "power3.out",
                scrollTrigger: { trigger: ".rs-cta", start: "top 92%" },
            }
        );
    }, []);

    return (
        <section
            id="resume"
            ref={sectionRef}
            className="rs-section relative md:mt-24 mt-12"
        >
            <div className="relative z-10 w-full max-w-5xl mx-auto px-5 md:px-10 py-20 md:py-28">
                <TitleHeader
                    title={
                        <>
                            My Professional{" "}
                            <span className="text-purple-accent gradient-text">
                                Resume
                            </span>
                        </>
                    }
                />

                <div className="rs-stats-bar">
                    <span>Updated Dec 2025</span>
                    <span className="rs-stats-dot">·</span>
                    <span>PDF</span>
                    <span className="rs-stats-dot">·</span>
                    <span>156 KB</span>
                    <span className="rs-stats-dot">·</span>
                    <span>v2025.1</span>
                </div>

                <div className="rs-preview-wrap">
                    <div className="rs-preview">
                        {!imgError ? (
                            <img
                                src="/images/resume_preview.jpg"
                                alt="Resume preview"
                                className="rs-preview-img"
                                onError={() => setImgError(true)}
                                loading="lazy"
                            />
                        ) : (
                            <div className="rs-preview-placeholder">
                                <svg
                                    width="56"
                                    height="56"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <line x1="10" y1="9" x2="8" y2="9" />
                                </svg>
                                <span>Resume Preview</span>
                            </div>
                        )}
                        <div className="rs-preview-fade" />
                    </div>
                </div>

                <div
                    className="rs-actions"
                    onMouseMove={handleActionsMouseMove}
                >
                    <button
                        type="button"
                        onClick={handleViewResume}
                        className="rs-btn rs-btn-primary"
                        aria-label="View resume"
                    >
                        <div className="rs-btn-spotlight" />
                        <EyeIcon />
                        <span className="rs-btn-label">View Resume</span>
                        <ArrowIcon />
                    </button>

                    <button
                        type="button"
                        onClick={handleDownloadResume}
                        className="rs-btn rs-btn-secondary"
                        aria-label="Download resume PDF"
                    >
                        <div className="rs-btn-spotlight" />
                        <DownloadIcon />
                        <span className="rs-btn-label">
                            {downloadSuccess ? "Downloaded" : "Download PDF"}
                        </span>
                        <ArrowIcon />
                    </button>
                </div>

                <a href="#contact" className="rs-cta">
                    <span>Impressed? Let's connect and build something</span>
                    <svg
                        className="rs-cta-arrow"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </a>
            </div>
        </section>
    );
};

export default Resume;
