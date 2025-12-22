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
                                Hi, I'm <span className="text-highlight">Rohit</span>, a passionate software developer
                                based in Boston with expertise in building exceptional digital experiences.
                                I specialize in creating innovative web applications that combine
                                <span className="text-highlight"> cutting-edge technology</span> with
                                elegant design.
                            </p>

                            <p className="about-content-item text-white-50 text-lg md:text-xl leading-relaxed mb-8">
                                With a strong foundation in <span className="text-highlight">React</span>,
                                <span className="text-highlight"> Three.js</span>, and modern backend technologies,
                                I transform complex ideas into seamless, user-centric solutions.
                                My goal is to craft software that not only works flawlessly but also
                                delivers <span className="text-highlight">memorable experiences</span>.
                            </p>

                            <div className="about-content-item flex flex-wrap gap-3 mb-8">
                                {["React", "Three.js", "Node.js", "Python", "TypeScript", "AWS"].map((skill) => (
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
