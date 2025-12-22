import { useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FaLinkedinIn, FaGithub, FaXTwitter } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
    { name: "linkedin", url: "https://www.linkedin.com/in/biradar-rohit/", icon: FaLinkedinIn },
    { name: "github", url: "https://github.com/Rohitbiradar12/", icon: FaGithub },
    { name: "twitter", url: "https://x.com/iamRohit1567", icon: FaXTwitter },
    { name: "leetcode", url: "https://leetcode.com/rohit_394", icon: SiLeetcode },
];

const About = () => {
    const sectionRef = useRef(null);
    const imageRef = useRef(null);
    const contentRef = useRef(null);


    useGSAP(() => {

        gsap.to(imageRef.current, {
            yPercent: -15,
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            },
        });

        gsap.fromTo(
            ".about-content-item",
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: contentRef.current,
                    start: "top bottom-=100",
                },
            }
        );

        gsap.fromTo(
            ".social-icon-3d",
            { scale: 0, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: ".social-icons-container",
                    start: "top bottom-=50",
                },
            }
        );
    }, []);

    const handleMouseMove = useCallback((e) => {
        const card = imageRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 0.3,
            ease: "power2.out",
            transformPerspective: 1000,
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        gsap.to(imageRef.current, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: "power2.out",
        });
    }, []);

    return (
        <section
            id="about"
            ref={sectionRef}
            className="about-section relative min-h-screen overflow-hidden py-20 md:py-32"
        >


            <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
                <div className="flex flex-col xl:flex-row gap-10 xl:gap-20 items-center">
                    <div className="w-full xl:w-[40%] flex justify-center">
                        <div
                            ref={imageRef}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            className="about-image-wrapper relative"
                        >
                            <div className="about-gradient-border" />

                            <div className="about-image-container">
                                <img
                                    src="/images/rohit-photo.png"
                                    alt="Rohit - Software Developer"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="about-image-shadow" />
                        </div>
                    </div>
                    <div ref={contentRef} className="w-full xl:w-[60%]">
                        <div className="about-glass-container">
                            <h2 className="about-content-item gradient-text text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                About Me
                            </h2>
                           <p className="about-content-item text-white-50 text-lg md:text-xl leading-relaxed mb-6">
                                Hi, I'm <span className="text-highlight">Rohit</span>, a Software Developer Engineer with hands-on experience in building
                                <span className="text-highlight"> scalable microservices</span>, optimizing backend systems, and improving enterprise efficiency.
                                At <span className="text-highlight">Torry Harris Integration Solutions</span>, I worked on a Loan Management System across African markets,
                                contributing to the development of 15+ microservices that reduced loan processing time by 35% and improved data reliability.
                            </p>


                           <p className="about-content-item text-white-50 text-lg md:text-xl leading-relaxed mb-6">
                                My expertise includes <span className="text-highlight">Spring Boot</span>, <span className="text-highlight">PostgreSQL</span>,
                                <span className="text-highlight"> Kafka</span>, <span className="text-highlight">Redis</span>, and automation pipelines —
                                driving system performance and achieving 99.99% transaction success rates.
                            </p>

                            <p className="about-content-item text-white-50 text-lg md:text-xl leading-relaxed mb-8">
                                With a Computer Science degree from <span className="text-highlight">REVA University</span>, I thrive on solving complex problems
                                and delivering impactful solutions. Starting September 2025, I'll be pursuing my
                                <span className="text-highlight"> MS in Computer Science</span> at <span className="text-highlight">Northeastern University</span> (Khoury College),
                                focusing on cloud computing and scalable system design.
                            </p>

                            <div className="about-content-item flex flex-wrap gap-3 mb-8">
                                {["Spring Boot", "kafka", "Redis", "PostgreSQL", "Java", "Docker", "Jenkins", "AWS", "Kubernetes"].map((skill) => (
                                    <span key={skill} className="skill-pill">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div className="about-content-item social-icons-container flex gap-4">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-icon-3d"
                                        aria-label={`Visit my ${social.name} profile`}
                                    >
                                        <social.icon size={24} className="text-white" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
