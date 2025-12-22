import { useRef, useCallback, useState, useEffect } from "react";
import { gsap } from "gsap";

const PinCard = ({ children, title, link, className = "" }) => {
    const containerRef = useRef(null);
    const cardRef = useRef(null);
    const glowRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);

        if (cardRef.current) {
            gsap.to(cardRef.current, {
                rotateX: 20,
                scale: 0.98,
                y: -8,
                duration: 0.6,
                ease: "power3.out",
            });
        }

        if (glowRef.current) {
            gsap.to(glowRef.current, {
                opacity: 0.6,
                scale: 1.05,
                duration: 0.6,
                ease: "power2.out",
            });
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);

        if (cardRef.current) {
            gsap.killTweensOf(cardRef.current);
            gsap.to(cardRef.current, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    if (cardRef.current && !isHovered) {
                        gsap.to(cardRef.current, {
                            y: -5,
                            duration: 2.5,
                            ease: "power1.inOut",
                            yoyo: true,
                            repeat: -1,
                        });
                    }
                }
            });
        }

        if (glowRef.current) {
            gsap.killTweensOf(glowRef.current);
            gsap.to(glowRef.current, {
                opacity: 0,
                scale: 1,
                x: 0,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
            });
        }

        setMousePosition({ x: 0, y: 0 });
    }, [isHovered]);

    const handleMouseMove = useCallback((e) => {
        if (!isHovered || !cardRef.current || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 12;
        const rotateX = ((centerY - y) / centerY) * 8;

        setMousePosition({ x, y });

        gsap.to(cardRef.current, {
            rotateY: rotateY,
            rotateX: rotateX + 20,
            duration: 0.3,
            ease: "power2.out",
        });

        if (glowRef.current) {
            gsap.to(glowRef.current, {
                x: (x - centerX) * 0.1,
                y: (y - centerY) * 0.1,
                duration: 0.3,
                ease: "power2.out",
            });
        }
    }, [isHovered]);

    useEffect(() => {
        if (cardRef.current) {
            gsap.to(cardRef.current, {
                y: -5,
                duration: 2.5,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1,
            });
        }

        return () => {
            if (cardRef.current) {
                gsap.killTweensOf(cardRef.current);
            }
        };
    }, []); 

    useEffect(() => {
        if (isHovered && cardRef.current) {
            gsap.killTweensOf(cardRef.current);
        }
    }, [isHovered]);

    return (
        <div
            ref={containerRef}
            className={`pin-container ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
        >
            <div className={`pin-head ${isHovered ? "pin-head-visible" : ""}`}>
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pin-head-label"
                >
                    <span className="pin-head-text">{title}</span>
                    <div className="pin-head-shine" />
                </a>
                <div className="pin-head-line" />
            </div>

            <div ref={glowRef} className="card-glow" />

            <div ref={cardRef} className="pin-card">
                <div
                    className="card-spotlight"
                    style={{
                        background: isHovered
                            ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 50%)`
                            : 'transparent',
                    }}
                />

                <div className="card-shimmer" />

                <div className="card-border-gradient" />

                {children}
            </div>

            <div className={`pin-shaft ${isHovered ? "pin-shaft-extended" : ""}`}>
                <div className="pin-shaft-line pin-shaft-line-blur" />
                <div className="pin-shaft-line pin-shaft-line-solid" />
                <div className="pin-shaft-glow" />
                <div className="pin-shaft-dot">
                    <div className="pin-shaft-dot-inner" />
                </div>
                <div className="pin-shaft-particles">
                    <div className="particle particle-1" />
                    <div className="particle particle-2" />
                    <div className="particle particle-3" />
                </div>
            </div>

            <div className="ripple-container">
                <div className="ripple-ring ripple-ring-1">
                    <div className="ripple-inner" />
                </div>
                <div className="ripple-ring ripple-ring-2">
                    <div className="ripple-inner" />
                </div>
                <div className="ripple-ring ripple-ring-3">
                    <div className="ripple-inner" />
                </div>
            </div>

            <div className="ambient-particles">
                <div className="ambient-particle" style={{ "--delay": "0s", "--duration": "3s" }} />
                <div className="ambient-particle" style={{ "--delay": "1s", "--duration": "4s" }} />
                <div className="ambient-particle" style={{ "--delay": "2s", "--duration": "3.5s" }} />
            </div>
        </div>
    );
};

export default PinCard;