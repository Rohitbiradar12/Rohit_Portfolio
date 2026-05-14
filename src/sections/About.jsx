import { useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FaLinkedinIn, FaGithub, FaXTwitter } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";

import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
    { name: "GitHub", url: "https://github.com/Rohitbiradar12/", icon: FaGithub },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/biradar-rohit/", icon: FaLinkedinIn },
    { name: "X", url: "https://x.com/iamRohit1567", icon: FaXTwitter },
    { name: "LeetCode", url: "https://leetcode.com/u/Rohit_Biradar/", icon: SiLeetcode },
];

const coreStack = [
    "Spring Boot", "Kafka", "Redis", "Python", "PostgreSQL",
    "Java", "Docker", "Jenkins", "AWS", "Kubernetes",
];

const About = () => {
    const sectionRef = useRef(null);
    const photoRef = useRef(null);

    const handleChipMouseMove = useCallback((e) => {
        const chip = e.target.closest(".ab-tag, .ab-social");
        if (!chip) return;
        const rect = chip.getBoundingClientRect();
        chip.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        chip.style.setProperty("--my", `${e.clientY - rect.top}px`);
    }, []);

    useGSAP(() => {
        gsap.to(photoRef.current, {
            yPercent: -10,
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            },
        });

        gsap.fromTo(
            ".ab-stats-bar",
            { y: 14, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
            }
        );

        gsap.utils.toArray(".ab-group").forEach((group) => {
            gsap.fromTo(
                group.querySelector(".ab-group-rule"),
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
                    group.querySelector(".ab-group-title"),
                    group.querySelector(".ab-group-count"),
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
                group.querySelectorAll(
                    ".ab-bio p, .ab-tag, .ab-social, .ab-photo-wrap"
                ),
                { y: 14, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.04,
                    ease: "power2.out",
                    scrollTrigger: { trigger: group, start: "top 85%" },
                }
            );
        });
    }, []);

    return (
        <section
            id="about"
            ref={sectionRef}
            className="ab-section relative md:mt-8 mt-4"
        >
            <div className="relative z-10 w-full max-w-6xl mx-auto px-5 md:px-10 pt-10 md:pt-16 pb-20 md:pb-32">
                <TitleHeader
                    title={
                        <>
                            About{" "}
                            <span className="text-purple-accent gradient-text">Me</span>
                        </>
                    }
                />

                <div className="ab-stats-bar">
                    <span>Based in Boston</span>
                    <span className="ab-stats-dot">·</span>
                    <span>MS CS @ Northeastern</span>
                    <span className="ab-stats-dot">·</span>
                    <span>02+ Years Building</span>
                </div>

                <div className="ab-stack">
                    {/* PROFILE */}
                    <div className="ab-group">
                        <div className="ab-group-head">
                            <h3 className="ab-group-title">Profile</h3>
                            <span className="ab-group-rule" />
                        </div>

                        <div className="ab-profile">
                            <div ref={photoRef} className="ab-photo-wrap">
                                <img
                                    src="/images/rohit-photo.png"
                                    alt="Rohit Biradar"
                                    className="ab-photo"
                                />
                            </div>

                            <div className="ab-bio">
                                <p>
                                    Hi, I'm <span className="text-highlight">Rohit</span>, a
                                    Software Development Engineer with hands-on experience
                                    in building{" "}
                                    <span className="text-highlight">scalable microservices</span>,
                                    optimizing backend systems, and improving enterprise
                                    efficiency. At{" "}
                                    <span className="text-highlight">
                                        Torry Harris Integration Solutions
                                    </span>
                                    , I worked on a Loan Management System across African
                                    markets, contributing to the development of 15+
                                    microservices that reduced loan processing time by 35%
                                    and improved data reliability.
                                </p>
                                <p>
                                    My expertise includes{" "}
                                    <span className="text-highlight">Spring Boot</span>,{" "}
                                    <span className="text-highlight">PostgreSQL</span>,{" "}
                                    <span className="text-highlight">Kafka</span>,{" "}
                                    <span className="text-highlight">Redis</span>, and
                                    automation pipelines — driving system performance and
                                    achieving 99.99% transaction success rates.
                                </p>
                                <p>
                                    With a Computer Science degree from{" "}
                                    <span className="text-highlight">REVA University</span>,
                                    I thrive on solving complex problems and delivering
                                    impactful solutions. Starting September 2025, I'll be
                                    pursuing my{" "}
                                    <span className="text-highlight">
                                        MS in Computer Science
                                    </span>{" "}
                                    at{" "}
                                    <span className="text-highlight">
                                        Northeastern University
                                    </span>{" "}
                                    (Khoury College), focusing on cloud computing and
                                    scalable system design.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CORE STACK */}
                    <div className="ab-group">
                        <div className="ab-group-head">
                            <h3 className="ab-group-title">Core Stack</h3>
                            <span className="ab-group-rule" />
                        </div>

                        <div className="ab-tags" onMouseMove={handleChipMouseMove}>
                            {coreStack.map((skill) => (
                                <div key={skill} className="ab-tag">
                                    <div className="ab-tag-spotlight" />
                                    <span className="ab-tag-name">{skill}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CONNECT */}
                    <div className="ab-group">
                        <div className="ab-group-head">
                            <h3 className="ab-group-title">Connect</h3>
                            <span className="ab-group-rule" />
                        </div>

                        <div className="ab-socials" onMouseMove={handleChipMouseMove}>
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ab-social"
                                    aria-label={`Visit my ${social.name} profile`}
                                >
                                    <div className="ab-social-spotlight" />
                                    <social.icon size={15} className="ab-social-icon" />
                                    <span className="ab-social-name">{social.name}</span>
                                    <svg
                                        className="ab-social-arrow"
                                        width="11"
                                        height="11"
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
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
