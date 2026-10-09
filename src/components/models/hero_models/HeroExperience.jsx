import useReducedMotion from "../../../hooks/useReducedMotion";
import SceneBoundary from "../../SceneBoundary";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import { Suspense, useEffect, useRef, useState } from "react";

import { Room } from "./Room";
import HeroLights from "./HeroLights";
import Particles from "./Particles";

const HeroExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const reduced = useReducedMotion();
  const wrapperRef = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: "150px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} style={{ width: "100%", height: "100%" }}>
      <SceneBoundary><Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        frameloop={visible ? (reduced ? "demand" : "always") : "never"}
        fallback={<div className="scene-fallback">Explore Rohit’s work below. This device does not support the 3D view.</div>}
      >
        <ambientLight intensity={0.2} color="#1a1a40" />
        <OrbitControls
          enablePan={false}
          enableZoom={!isTablet}
          maxDistance={20}
          minDistance={5}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI / 2}
        />

        <Suspense fallback={null}>
          <HeroLights />
          {!reduced && <Particles count={100} />}
          <group
            scale={isMobile ? 0.7 : 1}
            position={[0, -3.5, 0]}
            rotation={[0, -Math.PI / 4, 0]}
          >
            <Room />
          </group>
        </Suspense>
      </Canvas></SceneBoundary>
    </div>
  );
};

export default HeroExperience;
