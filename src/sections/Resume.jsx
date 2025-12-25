import { useRef, useCallback, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const resumeStats = [
    { icon: "📊", label: "Years Experience", value: "2+" },
    { icon: "💼", label: "Projects", value: "10+" },
    { icon: "🛠️", label: "Technologies", value: "20+" },
];

const Resume = () => {
    const sectionRef = useRef(null);
    const cardRef = useRef(null);
    const glowRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    useGSAP(() => {
        gsap.fromTo(
            ".resume-header > *",
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
            ".resume-card",
            {
                y: 100,
                opacity: 0,
                rotateX: -15,
                scale: 0.9
            },
            {
                y: 0,
                opacity: 1,
                rotateX: 0,
                scale: 1,
                duration: 1.2,
                delay: 0.3,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: ".resume-card",
                    start: "top 85%",
                },
            }
        );

        gsap.fromTo(
            ".resume-stat-card",
            {
                y: 40,
                opacity: 0,
                scale: 0.8
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.15,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: ".resume-stats",
                    start: "top 85%",
                },
            }
        );

        gsap.fromTo(
            ".resume-btn",
            {
                y: 30,
                opacity: 0,
                scale: 0.9
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.12,
                delay: 0.4,
                ease: "back.out(1.4)",
                scrollTrigger: {
                    trigger: ".resume-buttons",
                    start: "top 90%",
                },
            }
        );

        gsap.to(".resume-card", {
            y: -15,
            duration: 3,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
        });
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!cardRef.current || !isHovered) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * 8;
        const rotateY = ((centerX - x) / centerX) * 8;

        setMousePosition({ x, y });

        gsap.to(cardRef.current, {
            rotateX: -rotateX,
            rotateY: rotateY,
            duration: 0.4,
            ease: "power2.out",
            transformPerspective: 1000,
        });

        if (glowRef.current) {
            gsap.to(glowRef.current, {
                x: (x - centerX) * 0.05,
                y: (y - centerY) * 0.05,
                duration: 0.4,
                ease: "power2.out",
            });
        }
    }, [isHovered]);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);

        gsap.to(cardRef.current, {
            scale: 1.02,
            y: -20,
            duration: 0.5,
            ease: "power3.out",
        });

        if (glowRef.current) {
            gsap.to(glowRef.current, {
                opacity: 0.8,
                scale: 1.1,
                duration: 0.5,
                ease: "power2.out",
            });
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);

        gsap.to(cardRef.current, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.inOut",
        });

        if (glowRef.current) {
            gsap.to(glowRef.current, {
                opacity: 0,
                scale: 1,
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
            });
        }
    }, []);

    const handleViewResume = (e) => {
        e.preventDefault();

        gsap.to(e.currentTarget, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
        });

        setTimeout(() => {
            window.open("/resume/Rohit_Resume.pdf", "_blank", "noopener,noreferrer");
        }, 200);
    };

    const handleDownloadResume = (e) => {
        e.preventDefault();

        gsap.to(e.currentTarget, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
        });

        const link = document.createElement("a");
        link.href = "/resume/Rohit_Resume.pdf";
        link.download = "Rohit_Biradar_Resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 2000);
    };

    return (
        <section
            id="resume"
            ref={sectionRef}
            className="resume-section relative min-h-screen overflow-hidden py-20 md:py-32"
        >
            <div className="resume-orb resume-orb-1" />
            <div className="resume-orb resume-orb-2" />
            <div className="resume-orb resume-orb-3" />
            <div className="resume-grid-bg" />
            <div className="resume-particles">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="resume-particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
                <div className="resume-header flex flex-col items-center gap-5 mb-16">
                    <div className="hero-badge">
                        <span className="hero-badge-shine" />
                        <p>📄 View my complete professional journey</p>
                    </div>
                    <h1 className="font-semibold md:text-6xl text-4xl text-center">
                        My Professional{" "}
                        <span className="text-purple-accent gradient-text">Resume</span>
                    </h1>
                    <p className="text-white-50 text-center max-w-2xl text-lg">
                        A comprehensive overview of my experience, skills, and achievements
                    </p>
                </div>

                <div className="resume-stats flex flex-wrap justify-center gap-4 md:gap-6 mb-16">
                    {resumeStats.map((stat, index) => (
                        <div key={index} className="resume-stat-card group">
                            <div className="resume-stat-glow" />
                            <span className="resume-stat-icon">{stat.icon}</span>
                            <span className="resume-stat-value">{stat.value}</span>
                            <span className="resume-stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center">
                    <div className="resume-card-wrapper">
                        <div ref={glowRef} className="resume-mega-glow" />

                        <div
                            ref={cardRef}
                            className="resume-card"
                            onMouseMove={handleMouseMove}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="resume-gradient-border" />
                            <div
                                className="resume-card-glow"
                                style={{ opacity: isHovered ? 1 : 0 }}
                            />
                            <div
                                className="resume-spotlight"
                                style={{
                                    opacity: isHovered ? 1 : 0,
                                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.2), transparent 40%)`,
                                }}
                            />

                            <div className="resume-shimmer" />

                            <div className="resume-noise" />
                            <div className="resume-card-inner">
                                <div className="resume-preview">
                                    <div className="resume-preview-overlay" />
                                    <div className="resume-preview-frame" />
                                    <img
                                        src="/images/resume_preview.jpg"
                                        alt="Resume Preview"
                                        className="resume-preview-img"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = `
                                                <div class="resume-preview-placeholder">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                                        <polyline points="14,2 14,8 20,8"/>
                                                        <line x1="16" y1="13" x2="8" y2="13"/>
                                                        <line x1="16" y1="17" x2="8" y2="17"/>
                                                        <line x1="10" y1="9" x2="8" y2="9"/>
                                                    </svg>
                                                    <p class="mt-4 text-white-50">Resume Preview</p>
                                                </div>
                                            `;
                                        }}
                                    />
                                </div>

                                <div className="resume-info">
                                    <div className="resume-meta">
                                        <span className="resume-meta-item">
                                            <span className="resume-meta-dot" />
                                            Last Updated: Dec 2025
                                        </span>
                                        <span className="resume-meta-item">PDF • 156 KB</span>
                                        <span className="resume-meta-item">v2025.1</span>
                                    </div>
                                </div>

                                <div className="resume-buttons flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={handleViewResume}
                                        className="resume-btn resume-btn-primary group"
                                        aria-label="View Resume"
                                    >
                                        <span className="resume-btn-bg" />
                                        <span className="resume-btn-shine" />
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="resume-btn-icon"
                                        >
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                        <span className="resume-btn-text">View Resume</span>
                                    </button>

                                    <button
                                        onClick={handleDownloadResume}
                                        className="resume-btn resume-btn-secondary group"
                                        aria-label="Download Resume PDF"
                                    >
                                        <span className="resume-btn-bg" />
                                        <span className="resume-btn-shine" />
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="resume-btn-icon"
                                        >
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                        <span className="resume-btn-text">
                                            {downloadSuccess ? "Downloaded! ✓" : "Download PDF"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-16 space-y-4">
                    <p className="text-white-50 text-lg">
                        Impressed with what you see?
                    </p>
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2 text-purple-accent hover:text-purple-300 transition-all text-xl font-semibold group"
                    >
                        Let's connect and build something amazing
                        <svg
                            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </a>
                </div>
            </div>

            {downloadSuccess && (
                <div className="resume-toast">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Resume downloaded successfully!</span>
                </div>
            )}
        </section>
    );
};

export default Resume;