import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { projects } from "../constants";
import PinCard from "../components/PinCard";

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
    const sectionRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo(
            ".project-card-item",
            { y: 100, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                },
            }
        );

        gsap.utils.toArray(".project-particle").forEach((particle, i) => {
            gsap.to(particle, {
                y: "random(-30, 30)",
                x: "random(-20, 20)",
                duration: "random(3, 5)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.2,
            });
        });
    }, []);

    return (
        <section
            id="projects"
            ref={sectionRef}
            className="projects-section relative py-20 md:py-32 overflow-hidden"
        >
            <div className="projects-particles">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="project-particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            <div className="projects-orb projects-orb-1" />
            <div className="projects-orb projects-orb-2" />

            <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                        A small selection of{" "}
                        <span className="text-purple-accent">recent projects</span>
                    </h2>
                </div>

                <div className="projects-grid">
                    {projects.map((project) => (
                        <div key={project.id} className="project-card-item">
                            <PinCard
                                title={project.title}
                                link={project.link}
                                className="h-full"
                            >
                                <div className="project-card-inner">
                                    <div className="project-card-image">
                                        <div className="project-card-image-bg" />
                                        <img
                                            src={project.img}
                                            alt={project.title}
                                            className="project-card-img"
                                        />
                                    </div>

                                    <div className="project-card-content">
                                        <h3 className="project-card-title">
                                            {project.title}
                                        </h3>
                                        <p className="project-card-description">
                                            {project.des}
                                        </p>

                                        <div className="project-card-footer">
                                            <div className="project-tech-icons">
                                                {project.iconLists.map((icon, index) => (
                                                    <div
                                                        key={index}
                                                        className="project-tech-icon"
                                                        style={{
                                                            transform: `translateX(-${index * 8}px)`,
                                                            zIndex: project.iconLists.length - index,
                                                        }}
                                                    >
                                                        <img src={icon} alt="tech" />
                                                    </div>
                                                ))}
                                            </div>

                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="project-cta"
                                            >
                                                <span>Check Live Site</span>
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                    />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </PinCard>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
