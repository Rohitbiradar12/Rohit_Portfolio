import { useRef, useCallback, memo, Suspense, useMemo, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import useGSAP from "../hooks/usePortfolioGSAP";

import TitleHeader from "../components/TitleHeader";
import SceneBoundary from "../components/SceneBoundary";
import "../styles/achievements.css";

gsap.registerPlugin(ScrollTrigger);

const G_COUNT    = 7200;
const CORE_COUNT = 800;

function GalaxyParticles({ scatterRef }) {
    const groupRef   = useRef();
    const galaxyRef  = useRef();
    const galaxy2Ref = useRef();
    const coreRef    = useRef();
    const starsRef   = useRef();

    // ── Circular disc texture (makes particles round, not square) ─────
    const disc = useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext("2d");
        const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0,   "rgba(255,255,255,1)");
        g.addColorStop(0.45,"rgba(255,255,255,0.85)");
        g.addColorStop(1,   "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(canvas);
    }, []);

    // ── All geometry data computed once ───────────────────────────────
    const data = useMemo(() => {
        // — Primary galaxy —
        const gPos    = new Float32Array(G_COUNT * 3);
        const gColors = new Float32Array(G_COUNT * 3);
        const amber  = new THREE.Color("#fcd34d");
        const gold   = new THREE.Color("#fde68a");
        const rose   = new THREE.Color("#f472b6");
        const magenta= new THREE.Color("#e879f9");
        const purple = new THREE.Color("#a78bfa");
        const indigo = new THREE.Color("#818cf8");
        const cyan   = new THREE.Color("#22d3ee");
        const palette = [amber, gold, rose, magenta, purple, indigo, cyan];

        for (let i = 0; i < G_COUNT; i++) {
            const arm         = i % 6;
            const branchAngle = (arm / 6) * Math.PI * 2;
            const radius      = Math.pow(Math.random(), 0.55) * 7.5;
            const spin        = radius * 2.1;
            const sc          = Math.pow(Math.random(), 3.0) * 0.55;
            gPos[i*3]     = Math.cos(branchAngle + spin) * radius + (Math.random()-0.5) * sc * 1.6;
            gPos[i*3+1]   = (Math.random()-0.5) * sc * 0.22;
            gPos[i*3+2]   = Math.sin(branchAngle + spin) * radius + (Math.random()-0.5) * sc * 1.6;
            const t   = radius / 7.5;
            const seg = t * (palette.length - 1);
            const lo  = Math.floor(seg);
            const hi  = Math.min(lo + 1, palette.length - 1);
            const c   = palette[lo].clone().lerp(palette[hi], seg - lo);
            gColors[i*3] = c.r; gColors[i*3+1] = c.g; gColors[i*3+2] = c.b;
        }

        // Scatter target — fly outward from origin, big vertical spread
        const gScatter = new Float32Array(G_COUNT * 3);
        for (let i = 0; i < G_COUNT; i++) {
            const ox = gPos[i*3], oy = gPos[i*3+1], oz = gPos[i*3+2];
            const spread = 2.8 + Math.random() * 2.2;
            gScatter[i*3]   = ox * spread + (Math.random()-0.5) * 4;
            gScatter[i*3+1] = oy * spread + (Math.random()-0.5) * 14;
            gScatter[i*3+2] = oz * spread + (Math.random()-0.5) * 4;
        }
        const gOrig = gPos.slice(); // pristine copy

        // — Core —
        const cPos = new Float32Array(CORE_COUNT * 3);
        for (let i = 0; i < CORE_COUNT; i++) {
            const r     = Math.pow(Math.random(), 1.2) * 1.1;
            const theta = Math.random() * Math.PI * 2;
            const phi   = Math.acos(2 * Math.random() - 1);
            cPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
            cPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta) * 0.32;
            cPos[i*3+2] = r * Math.cos(phi);
        }
        const cScatter = new Float32Array(CORE_COUNT * 3);
        for (let i = 0; i < CORE_COUNT; i++) {
            cScatter[i*3]   = (Math.random()-0.5) * 22;
            cScatter[i*3+1] = (Math.random()-0.5) * 22;
            cScatter[i*3+2] = (Math.random()-0.5) * 22;
        }
        const cOrig = cPos.slice();

        // — Background galaxy —
        const g2Pos    = new Float32Array(1600 * 3);
        const g2Colors = new Float32Array(1600 * 3);
        const c1 = new THREE.Color("#6366f1"), c2 = new THREE.Color("#38bdf8");
        for (let i = 0; i < 1600; i++) {
            const arm = i % 3, ba = (arm/3)*Math.PI*2, r = Math.random()*5.8, sp = r*1.35;
            g2Pos[i*3]   = Math.cos(ba+sp)*r + (Math.random()-0.5)*0.55;
            g2Pos[i*3+1] = (Math.random()-0.5)*0.16;
            g2Pos[i*3+2] = Math.sin(ba+sp)*r + (Math.random()-0.5)*0.55;
            const gc = c1.clone().lerp(c2, r/5.8);
            g2Colors[i*3]=gc.r; g2Colors[i*3+1]=gc.g; g2Colors[i*3+2]=gc.b;
        }

        // — Star field —
        const stars = new Float32Array(1800 * 3);
        for (let i = 0; i < 1800; i++) {
            stars[i*3]=(Math.random()-0.5)*32; stars[i*3+1]=(Math.random()-0.5)*12; stars[i*3+2]=(Math.random()-0.5)*16;
        }

        return { gPos, gColors, gScatter, gOrig, cPos, cScatter, cOrig, g2Pos, g2Colors, stars };
    }, []);

    useFrame((state) => {
        const t         = state.clock.elapsedTime;
        const scattered = scatterRef.current;
        const mx        = state.pointer.x * 0.14;
        const my        = state.pointer.y * 0.07;

        // ── Group rotation + float ─────────────────────────────────────
        if (groupRef.current) {
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, t * 0.05 + mx, 0.035);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.sin(t*0.035)*0.11 - 0.18 + my, 0.035);
            groupRef.current.position.y = Math.sin(t * 0.28) * 0.06;
        }
        if (galaxy2Ref.current) galaxy2Ref.current.rotation.y = -t * 0.025;
        if (starsRef.current)   starsRef.current.rotation.y   =  t * 0.007;

        // Core pulse (only when not scattered)
        if (coreRef.current && !scattered) {
            coreRef.current.scale.setScalar(1 + Math.sin(t * 2.4) * 0.09);
        }

        // ── Scatter / rejoin — mutate buffer positions every frame ─────
        const scatterSpeed = 0.072;  // fast burst outward
        const rejoinSpeed  = 0.028;  // slow gravity-like pull

        if (galaxyRef.current) {
            const pa   = galaxyRef.current.geometry.attributes.position.array;
            const tgt  = scattered ? data.gScatter : data.gOrig;
            const spd  = scattered ? scatterSpeed : rejoinSpeed;
            for (let i = 0; i < G_COUNT * 3; i++) {
                pa[i] += (tgt[i] - pa[i]) * spd;
            }
            galaxyRef.current.geometry.attributes.position.needsUpdate = true;
        }

        if (coreRef.current) {
            const pa  = coreRef.current.geometry.attributes.position.array;
            const tgt = scattered ? data.cScatter : data.cOrig;
            const spd = scattered ? scatterSpeed + 0.02 : rejoinSpeed - 0.005;
            for (let i = 0; i < CORE_COUNT * 3; i++) {
                pa[i] += (tgt[i] - pa[i]) * spd;
            }
            coreRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <>
            {/* Deep star field */}
            <points ref={starsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={1800} array={data.stars} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial size={0.013} sizeAttenuation color="#ede9fe" transparent opacity={0.35} toneMapped={false} alphaMap={disc} alphaTest={0.01} />
            </points>

            {/* Background galaxy — depth layer */}
            <points ref={galaxy2Ref} rotation={[Math.PI * 0.3, 0.6, 0.4]} position={[1.5, -0.5, -3]}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={1600} array={data.g2Pos}    itemSize={3} />
                    <bufferAttribute attach="attributes-color"    count={1600} array={data.g2Colors} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial size={0.02} sizeAttenuation vertexColors transparent opacity={0.22} toneMapped={false} alphaMap={disc} alphaTest={0.01} />
            </points>

            {/* Main interactive group */}
            <group ref={groupRef}>
                {/* Primary spiral arms — positions mutated each frame */}
                <points ref={galaxyRef}>
                    <bufferGeometry>
                        <bufferAttribute attach="attributes-position" count={G_COUNT} array={data.gPos}    itemSize={3} />
                        <bufferAttribute attach="attributes-color"    count={G_COUNT} array={data.gColors} itemSize={3} />
                    </bufferGeometry>
                    <pointsMaterial size={0.034} sizeAttenuation vertexColors transparent opacity={0.97} toneMapped={false} alphaMap={disc} alphaTest={0.01} />
                </points>

                {/* Core — positions mutated, scale pulses */}
                <points ref={coreRef}>
                    <bufferGeometry>
                        <bufferAttribute attach="attributes-position" count={CORE_COUNT} array={data.cPos} itemSize={3} />
                    </bufferGeometry>
                    <pointsMaterial size={0.08} sizeAttenuation color="#fef9c3" transparent opacity={1} toneMapped={false} alphaMap={disc} alphaTest={0.01} />
                </points>
            </group>
        </>
    );
}

const AchievementGalaxy = () => {
    if (typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

    const scatterRef  = useRef(false);
    const labelRef    = useRef(null);

    const handleClick = useCallback(() => {
        scatterRef.current = !scatterRef.current;
        if (labelRef.current) {
            labelRef.current.textContent = scatterRef.current
                ? "click to reform"
                : "click to scatter";
        }
    }, []);

    return (
        <div
            className="ach-galaxy-wrap"
            onClick={handleClick}
            style={{ cursor: "pointer" }}
            title="Click to scatter · click again to reform"
        >
            <SceneBoundary>
                <Suspense fallback={null}>
                    <Canvas
                        camera={{ position: [0, 1.4, 10.5], fov: 50 }}
                        gl={{ antialias: true, alpha: true }}
                        style={{ width: "100%", height: "100%" }}
                    >
                        <GalaxyParticles scatterRef={scatterRef} />
                        <EffectComposer>
                            <Bloom luminanceThreshold={0.01} luminanceSmoothing={0.9} intensity={2.2} mipmapBlur />
                        </EffectComposer>
                    </Canvas>
                </Suspense>
            </SceneBoundary>

            <div className="ach-galaxy-fade" />

            <div className="ach-galaxy-label">
                <span className="ach-galaxy-dot" />
                <span ref={labelRef}>click to scatter</span>
            </div>
        </div>
    );
};

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

const AchievementAccordion = memo(({ ach, index, isActive, isDimmed, onEnter, onLeave }) => {
    const Tag = ach.link ? "a" : "div";
    const linkProps = ach.link
        ? { href: ach.link, target: "_blank", rel: "noopener noreferrer" }
        : {};

    return (
        <Tag
            className={`ach-acc-item${isActive ? " is-active" : ""}${isDimmed ? " is-dimmed" : ""}${ach.link ? " ach-acc-link" : ""}`}
            style={{ "--ach-color": ach.color, "--ach-glow": ach.glow }}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            {...linkProps}
        >
            <div className="ach-acc-bar" />
            <div className="ach-acc-glow" />
            <div className="ach-acc-wm">{String(index + 1).padStart(2, "0")}</div>

            <div className="ach-acc-head">
                <div className="ach-acc-left">
                    <div className="ach-acc-icon-wrap">
                        {ach.icon.startsWith("/") ? (
                            <img src={ach.icon} alt={ach.title} className="ach-acc-icon-img" />
                        ) : (
                            <span className="ach-acc-icon">{ach.icon}</span>
                        )}
                    </div>
                    <div className="ach-acc-title-group">
                        <h3 className="ach-acc-title">{ach.title}</h3>
                        <p className="ach-acc-org">{ach.organization}</p>
                    </div>
                </div>
                <div className="ach-acc-right">
                    <span className="ach-acc-badge">
                        <span className="ach-acc-badge-dot" />
                        {ach.badge}
                    </span>
                    <span className="ach-acc-date">{ach.date}</span>
                </div>
            </div>

            <div className="ach-acc-body">
                <div className="ach-acc-body-inner">
                    <p className="ach-acc-desc">{ach.description}</p>
                    {ach.link && (
                        <span className="ach-acc-view">
                            View credential
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M7 17L17 7"/><path d="M8 7h9v9"/>
                            </svg>
                        </span>
                    )}
                </div>
            </div>
        </Tag>
    );
});
AchievementAccordion.displayName = "AchievementAccordion";

const Achievements = () => {
    const sectionRef = useRef(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    useGSAP(() => {
        gsap.fromTo(
            ".ach-acc-item",
            { y: 80, opacity: 0, scale: 0.92 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.12,
                ease: "back.out(1.3)",
                scrollTrigger: {
                    trigger: ".ach-accordion",
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

                <AchievementGalaxy />

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

                <div className="ach-accordion">
                    {achievements.map((ach, i) => (
                        <AchievementAccordion
                            key={ach.title}
                            ach={ach}
                            index={i}
                            isActive={hoveredIndex === i}
                            isDimmed={hoveredIndex !== null && hoveredIndex !== i}
                            onEnter={() => setHoveredIndex(i)}
                            onLeave={() => setHoveredIndex(null)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Achievements;
