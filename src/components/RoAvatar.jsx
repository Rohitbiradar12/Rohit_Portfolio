import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const EYE_COLOR   = "#c4b5fd";
const EYE_EMISSIVE = "#a78bfa";

const metalDark = { color: "#1c1040", emissive: "#3d1f70", emissiveIntensity: 0.25, metalness: 0.85, roughness: 0.18 };
const metalMid  = { color: "#251354", emissive: "#4a2590", emissiveIntensity: 0.2,  metalness: 0.9,  roughness: 0.15 };

function RobotScene({ thinking }) {
  const groupRef   = useRef();
  const headGroup  = useRef();
  const antennaGrp = useRef();
  const eye1Ref    = useRef();
  const eye2Ref    = useRef();
  const antBallRef = useRef();
  const chestRef   = useRef();

  const blink = useRef({ timer: 0, next: 3 + Math.random() * 2, phase: "open" });

  useFrame(({ clock }, delta) => {
    const t   = clock.elapsedTime;
    const spd = thinking ? 1.6 : 1;

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.7 * spd) * 0.07;
    }

    if (headGroup.current) {
      headGroup.current.rotation.y = Math.sin(t * 0.45 * spd) * 0.12;
      headGroup.current.rotation.z = Math.sin(t * 0.35 * spd) * 0.04;
    }

    if (antennaGrp.current) {
      antennaGrp.current.rotation.z = Math.sin(t * 1.5 * spd) * 0.15;
    }

    if (antBallRef.current) {
      antBallRef.current.material.emissiveIntensity = thinking
        ? 4 + Math.sin(t * 6) * 1.2
        : 2.5 + Math.sin(t * 2) * 0.5;
    }

    if (chestRef.current) {
      chestRef.current.material.emissiveIntensity = thinking
        ? 3.5 + Math.sin(t * 5) * 0.8
        : 1.8 + Math.sin(t * 1.8) * 0.4;
    }

    [eye1Ref, eye2Ref].forEach(r => {
      if (!r.current) return;
      r.current.material.emissiveIntensity = thinking
        ? 3.5 + Math.sin(t * 5) * 0.8
        : 2 + Math.sin(t * 1.5) * 0.3;
    });

    // Blink state machine
    const b = blink.current;
    b.timer += delta;

    if (b.phase === "open" && b.timer >= b.next) {
      b.phase = "closing"; b.timer = 0;
    } else if (b.phase === "closing") {
      const p = Math.min(b.timer / 0.07, 1);
      [eye1Ref, eye2Ref].forEach(r => { if (r.current) r.current.scale.y = Math.max(0.05, 1 - p); });
      if (b.timer >= 0.07) { b.phase = "closed"; b.timer = 0; }
    } else if (b.phase === "closed") {
      if (b.timer >= 0.05) { b.phase = "opening"; b.timer = 0; }
    } else if (b.phase === "opening") {
      const p = Math.min(b.timer / 0.1, 1);
      [eye1Ref, eye2Ref].forEach(r => { if (r.current) r.current.scale.y = p; });
      if (b.timer >= 0.1) {
        [eye1Ref, eye2Ref].forEach(r => { if (r.current) r.current.scale.y = 1; });
        b.phase = "open"; b.timer = 0; b.next = 2 + Math.random() * 5;
      }
    }
  });

  return (
    <group ref={groupRef}>

      {/* ── Head ─────────────────────────── */}
      <group ref={headGroup} position={[0, 0.28, 0]}>

        <mesh castShadow>
          <boxGeometry args={[1.0, 0.88, 0.78]} />
          <meshStandardMaterial {...metalDark} />
        </mesh>

        {/* Visor / face plate */}
        <mesh position={[0, 0.06, 0.4]}>
          <boxGeometry args={[0.72, 0.42, 0.02]} />
          <meshStandardMaterial
            color="#060210"
            emissive="#2b0d5c"
            emissiveIntensity={0.6}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>

        {/* Left eye */}
        <mesh ref={eye1Ref} position={[-0.175, 0.06, 0.42]}>
          <sphereGeometry args={[0.10, 16, 16]} />
          <meshStandardMaterial
            color={EYE_COLOR}
            emissive={EYE_EMISSIVE}
            emissiveIntensity={2}
            roughness={0}
            metalness={0}
          />
        </mesh>

        {/* Right eye */}
        <mesh ref={eye2Ref} position={[0.175, 0.06, 0.42]}>
          <sphereGeometry args={[0.10, 16, 16]} />
          <meshStandardMaterial
            color={EYE_COLOR}
            emissive={EYE_EMISSIVE}
            emissiveIntensity={2}
            roughness={0}
            metalness={0}
          />
        </mesh>

        {/* Ear left */}
        <mesh position={[-0.54, 0.0, 0.0]}>
          <boxGeometry args={[0.1, 0.38, 0.46]} />
          <meshStandardMaterial {...metalMid} />
        </mesh>
        <mesh position={[-0.6, 0.0, 0.0]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color={EYE_COLOR} emissive={EYE_EMISSIVE} emissiveIntensity={1.5} roughness={0} />
        </mesh>

        {/* Ear right */}
        <mesh position={[0.54, 0.0, 0.0]}>
          <boxGeometry args={[0.1, 0.38, 0.46]} />
          <meshStandardMaterial {...metalMid} />
        </mesh>
        <mesh position={[0.6, 0.0, 0.0]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color={EYE_COLOR} emissive={EYE_EMISSIVE} emissiveIntensity={1.5} roughness={0} />
        </mesh>

        {/* Antenna (child of head — tilts with it) */}
        <group ref={antennaGrp} position={[0.15, 0.5, 0]}>
          <mesh>
            <cylinderGeometry args={[0.022, 0.022, 0.36, 8]} />
            <meshStandardMaterial color="#5b3fa0" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh ref={antBallRef} position={[0, 0.23, 0]}>
            <sphereGeometry args={[0.072, 14, 14]} />
            <meshStandardMaterial color={EYE_COLOR} emissive={EYE_EMISSIVE} emissiveIntensity={2.5} roughness={0} />
          </mesh>
        </group>

      </group>

      {/* ── Neck ─────────────────────────── */}
      <mesh position={[0, -0.27, 0]}>
        <cylinderGeometry args={[0.17, 0.21, 0.2, 10]} />
        <meshStandardMaterial {...metalMid} />
      </mesh>

      {/* ── Body ─────────────────────────── */}
      <mesh position={[0, -0.65, 0]}>
        <boxGeometry args={[0.82, 0.52, 0.66]} />
        <meshStandardMaterial {...metalDark} />
      </mesh>

      {/* Chest gem */}
      <mesh ref={chestRef} position={[0, -0.60, 0.34]}>
        <sphereGeometry args={[0.08, 14, 14]} />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#8b5cf6"
          emissiveIntensity={1.8}
          roughness={0}
          metalness={0.5}
        />
      </mesh>

    </group>
  );
}

export default function RoAvatar({ thinking = false, size = 200 }) {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 3.8], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: size, height: size }}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[2.5, 3, 3]}    intensity={2.0} color="#c4b5fd" />
      <pointLight position={[-2, -1, 2]}    intensity={1.0} color="#6d28d9" />
      <pointLight position={[0, -3, 1.5]}   intensity={0.5} color="#818cf8" />
      <Suspense fallback={null}>
        <RobotScene thinking={thinking} />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.08}
            luminanceSmoothing={0.85}
            intensity={1.8}
            mipmapBlur
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
