import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import SceneBoundary from "../components/SceneBoundary";
import { GHOST_EYES as TRACED_EYES, GHOST_OUTLINE as TRACED_OUTLINE } from "./ghostShape";

// The traced logo looks right. Mirroring negates x and reverses the point order, which keeps each
// loop's winding (outline clockwise, eyes counter-clockwise).
function mirror(flat) {
  const out = [];
  for (let i = flat.length - 2; i >= 0; i -= 2) out.push(-flat[i], flat[i + 1]);
  return out;
}
// Ro faces left (towards the page) at home, and right (towards the chat) beside the open chat.
const FACES = {
  left: { outline: mirror(TRACED_OUTLINE), eyes: TRACED_EYES.map((eye) => ({ ...eye, x: -eye.x, outline: mirror(eye.outline) })) },
  right: { outline: TRACED_OUTLINE, eyes: TRACED_EYES },
};

const DEPTH = 0.45;
const BEVEL_SIZE = 0.1;
const BEVEL_THICKNESS = 0.36;
const BEVEL_SEGMENTS = 14;
const SOCKET_Z = DEPTH / 2 - 0.01; // eye floor, just below where each funnel meets the wall
const PUPIL = { rx: 0.058, ry: 0.08 };
const PUPIL_Z = DEPTH / 2 + BEVEL_THICKNESS - 0.03; // just inside the eye opening
const PUPIL_MARGIN = 0.05; // the funnel has narrowed by ~0.04 at PUPIL_Z
const FLOAT_PX = 9;
const FLOAT_PERIOD = 3.6;
const TURN_SECONDS = 0.55;
const CAP_Z = DEPTH / 2 + BEVEL_THICKNESS; // the flat front face
const BLUSH = { rx: 0.27, ry: 0.15, below: 0.16, outward: 0.07 };

// Rosy cheeks sit just below each eye, nudged outward from the pair.
function cheekPositions(eyes) {
  const centre = eyes.reduce((sum, eye) => sum + eye.x, 0) / eyes.length;
  return eyes.map((eye) => [eye.x + Math.sign(eye.x - centre) * BLUSH.outward, eye.y - eye.ry - BLUSH.below]);
}

// A soft rose gradient that fades to nothing at the edge, drawn once.
function blushMaterial() {
  const size = 128;
  const canvas = Object.assign(document.createElement("canvas"), { width: size, height: size });
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255, 86, 138, 1)");
  gradient.addColorStop(0.5, "rgba(255, 108, 155, 0.6)");
  gradient.addColorStop(1, "rgba(255, 140, 175, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({ map, transparent: true, opacity: 0, depthWrite: false, toneMapped: false, visible: false });
}

const toPoints = (flat) => Array.from({ length: flat.length / 2 }, (_, i) => new THREE.Vector2(flat[2 * i], flat[2 * i + 1]));

// Move a closed loop d inwards along its normals (counter-clockwise loops have their inside on the left).
function inset(points, d) {
  const area = points.reduce((sum, p, i) => { const q = points[(i + 1) % points.length]; return sum + p.x * q.y - q.x * p.y; }, 0);
  const side = area > 0 ? d : -d;
  return points.map((p, i) => {
    const a = points[(i - 1 + points.length) % points.length], b = points[(i + 1) % points.length];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    return new THREE.Vector2(p.x - ((b.y - a.y) / len) * side, p.y + ((b.x - a.x) / len) * side);
  });
}

function ghostGeometry({ outline, eyes }) {
  // The front face is triangulated from this base shape as-is, and the bevel then pushes the side
  // walls out by BEVEL_SIZE (and narrows the holes by it). So the outline goes in inset by the bevel,
  // which puts the walls on the traced silhouette, and the eyes go in at full size, so each funnel
  // opens to exactly the traced eye.
  const shape = new THREE.Shape(inset(toPoints(outline), BEVEL_SIZE));
  shape.holes = eyes.map((eye) => new THREE.Path(toPoints(eye.outline)));
  let geometry = new THREE.ExtrudeGeometry(shape, {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: BEVEL_THICKNESS,
    bevelSize: BEVEL_SIZE,
    bevelSegments: BEVEL_SEGMENTS,
  });
  // Side walls are generated for the outline first, then for each hole, at 6 vertices per point
  // per layer. Split them so the eye recesses get their own (black) material.
  const sides = geometry.groups[1];
  const outerWalls = (outline.length / 2) * 6 * (1 + 2 * BEVEL_SEGMENTS);
  geometry.clearGroups();
  geometry.addGroup(0, sides.start + outerWalls, 0);
  geometry.addGroup(sides.start + outerWalls, Infinity, 1);
  geometry.translate(0, 0, -DEPTH / 2);
  // ExtrudeGeometry is non-indexed (faceted); weld it so the bevel shades smoothly.
  geometry.deleteAttribute("uv");
  geometry.deleteAttribute("normal");
  geometry = mergeVertices(geometry, 1e-4);
  geometry.computeVertexNormals();
  return geometry;
}

// Dark floor of each eye: the traced eye shape, enlarged a little so its rim hides inside the walls.
function eyeFloorGeometry(eye) {
  const floor = new THREE.ShapeGeometry(new THREE.Shape(toPoints(eye.outline)));
  floor.translate(-eye.x, -eye.y, 0);
  floor.scale(1.15, 1.1, 1);
  floor.translate(eye.x, eye.y, SOCKET_Z);
  return floor;
}

const disc = new THREE.CircleGeometry(1, 48);
const plane = new THREE.PlaneGeometry(1, 1);

function svgPath(flat) {
  let d = "";
  for (let i = 0; i < flat.length; i += 2) d += `${i ? "L" : "M"}${flat[i]} ${-flat[i + 1]}`;
  return d + "Z";
}

function Face({ face, parts, groupRef, pupilRefs, cheekMaterial }) {
  return (
    <group ref={groupRef}>
      <mesh geometry={parts.body}>
        <meshPhysicalMaterial attach="material-0" color="#ffffff" roughness={0.38} clearcoat={0.55} clearcoatRoughness={0.28} />
        <meshPhysicalMaterial attach="material-1" color="#050309" roughness={0.5} clearcoat={0.4} clearcoatRoughness={0.35} envMapIntensity={0.15} />
      </mesh>
      {parts.floors.map((floor, i) => (
        <mesh key={i} geometry={floor}>
          <meshBasicMaterial color="#05030a" />
        </mesh>
      ))}
      {face.eyes.map((eye, i) => (
        <mesh key={i} ref={pupilRefs[i]} geometry={disc} position={[eye.x, eye.y, PUPIL_Z]} scale={[PUPIL.rx, PUPIL.ry, 1]}>
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      ))}
      {cheekPositions(face.eyes).map(([x, y], i) => (
        <mesh key={"cheek" + i} geometry={plane} material={cheekMaterial} position={[x, y, CAP_Z + 0.006]} scale={[BLUSH.rx * 2, BLUSH.ry * 2, 1]} renderOrder={1} />
      ))}
    </group>
  );
}

function Ghost({ reduced, pointer, shadowRef, facing, gaze, blush }) {
  const floatRef = useRef();
  const turnRef = useRef();
  const faceRefs = { left: useRef(), right: useRef() };
  const pupilRefs = { left: [useRef(), useRef()], right: [useRef(), useRef()] };
  const look = useRef({ x: 0, y: 0 });
  const turn = useRef({ shown: facing, target: facing, start: null });
  const parts = useMemo(
    () => Object.fromEntries(Object.entries(FACES).map(([name, face]) => [name, { body: ghostGeometry(face), floors: face.eyes.map(eyeFloorGeometry) }])),
    [],
  );
  const cheeks = useMemo(blushMaterial, []);
  const flush = useRef(0);
  const { size, viewport, gl, invalidate } = useThree();
  const rect = useRef(null);

  useEffect(() => () => Object.values(parts).forEach(({ body, floors }) => { body.dispose(); floors.forEach((f) => f.dispose()); }), [parts]);
  useEffect(() => () => { cheeks.map.dispose(); cheeks.dispose(); }, [cheeks]);
  // The launcher is position: fixed, so its box only changes on resize.
  useEffect(() => {
    const measure = () => { rect.current = gl.domElement.getBoundingClientRect(); };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [gl, size]);
  // With reduced motion the scene renders on demand, so redraw when the pose changes.
  useEffect(() => invalidate(), [facing, gaze, blush, invalidate]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;

    // Turning around: spin to edge-on, swap to the mirrored face, and spin back to face forward.
    const tr = turn.current;
    if (tr.target !== facing) {
      tr.target = facing;
      tr.start = reduced || facing === tr.shown ? null : t;
      if (reduced) tr.shown = facing;
    }
    let angle = 0;
    if (tr.start !== null) {
      const s = Math.min(1, (t - tr.start) / TURN_SECONDS) * 2;
      if (s < 1) angle = s * s * (Math.PI / 2);
      else { tr.shown = tr.target; angle = -((2 - s) ** 2) * (Math.PI / 2); }
      if (s >= 2) tr.start = null;
    }
    turnRef.current.rotation.y = angle;
    faceRefs.left.current.visible = tr.shown === "left";
    faceRefs.right.current.visible = tr.shown === "right";

    // The body never reacts to the cursor. The pupils follow it at home, look ahead while flying,
    // watch the chat beside it, and drift upwards while a reply is on its way.
    let tx = 0, ty = 0;
    if (gaze === "cursor") {
      const box = rect.current, p = pointer.current;
      if (box && p.active) {
        const dx = p.x - (box.left + box.width / 2);
        const dy = p.y - (box.top + box.height * 0.42);
        const dist = Math.hypot(dx, dy);
        const reach = Math.min(1, dist / 320); // close → straight ahead
        if (dist) { tx = (dx / dist) * reach; ty = (-dy / dist) * reach; }
      }
    } else if (gaze === "thinking") {
      tx = reduced ? 0 : 0.35 * Math.sin(t * 1.3);
      ty = 0.85;
    } else {
      tx = gaze.x; ty = gaze.y;
    }
    const glide = reduced ? 1 : 1 - Math.exp(-Math.min(delta, 1 / 30) * 3.2);
    const l = look.current;
    l.x += (tx - l.x) * glide;
    l.y += (ty - l.y) * glide;

    // Hovered: the cheeks flush pink and the pupils widen a little, as if flustered.
    flush.current += ((blush ? 1 : 0) - flush.current) * (reduced ? 1 : 1 - Math.exp(-Math.min(delta, 1 / 30) * 7));
    cheeks.opacity = flush.current;
    cheeks.visible = flush.current > 0.01;
    const dilate = 1 + 0.12 * flush.current;

    for (const name of Object.keys(FACES)) {
      FACES[name].eyes.forEach((eye, i) => {
        const pupil = pupilRefs[name][i].current;
        if (!pupil) return;
        pupil.position.x = eye.x + l.x * (eye.rx - PUPIL.rx - PUPIL_MARGIN);
        pupil.position.y = eye.y + l.y * (eye.ry - PUPIL.ry - PUPIL_MARGIN);
        pupil.scale.set(PUPIL.rx * dilate, PUPIL.ry * dilate, 1);
      });
    }

    if (reduced) return;
    const wave = Math.sin((t * Math.PI * 2) / FLOAT_PERIOD);
    floatRef.current.position.y = 0.2 + wave * FLOAT_PX * (viewport.height / size.height);
    const shadow = shadowRef.current;
    if (shadow) {
      shadow.style.opacity = String(0.55 - wave * 0.2);
      shadow.style.transform = `translateX(-50%) scale(${0.975 - wave * 0.125})`;
    }
  });

  return (
    <group ref={floatRef} position={[0, 0.2, 0]}>
      <group ref={turnRef}>
        {Object.entries(FACES).map(([name, face]) => (
          <Face key={name} face={face} parts={parts[name]} groupRef={faceRefs[name]} pupilRefs={pupilRefs[name]} cheekMaterial={cheeks} />
        ))}
      </group>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.75} />
      {/* Key from the upper right lights the dome; soft fill keeps the face out of shadow. */}
      <directionalLight position={[5, 6, 6]} intensity={2.8} />
      <directionalLight position={[-6, 1, 4]} intensity={0.75} color="#efeaff" />
      <directionalLight position={[0, 4, -6]} intensity={0.9} color="#d9ccff" />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[4, 5, 4]} scale={[6, 4, 1]} />
        <Lightformer form="rect" intensity={0.8} position={[-5, 0, 3]} scale={[4, 6, 1]} />
        <Lightformer form="rect" intensity={0.5} color="#e9e2ff" position={[0, -5, 2]} scale={[6, 2, 1]} />
      </Environment>
    </>
  );
}

export function GhostFallback({ facing = "left" }) {
  const face = FACES[facing];
  return (
    <svg className="ro-fallback" viewBox="-1.8 -2.2 3.6 4.4" aria-hidden="true">
      <path d={svgPath(face.outline)} fill="#fff" />
      {face.eyes.map((eye, i) => <path key={i} d={svgPath(eye.outline)} fill="#05030a" />)}
    </svg>
  );
}

export default function RoGhost({ reduced, paused, shadowRef, facing = "left", gaze = "cursor", blush = false }) {
  const pointer = useRef({ x: 0, y: 0, active: false });
  const invalidate = useRef(null);

  useEffect(() => {
    const move = (e) => {
      pointer.current = { x: e.clientX, y: e.clientY, active: true };
      invalidate.current?.();
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <SceneBoundary fallback={<GhostFallback facing={facing} />}>
      <Canvas
        className="ro-canvas"
        dpr={[1, 2]}
        frameloop={paused ? "never" : reduced ? "demand" : "always"}
        camera={{ position: [0, 0, 40], fov: 8.9 }} // long lens: little perspective distortion
        gl={{ alpha: true, antialias: true }}
        onCreated={(state) => {
          state.gl.toneMapping = THREE.NeutralToneMapping;
          state.gl.toneMappingExposure = 1.25;
          invalidate.current = state.invalidate;
        }}
        fallback={<GhostFallback facing={facing} />}
      >
        <Lights />
        <Ghost reduced={reduced} pointer={pointer} shadowRef={shadowRef} facing={facing} gaze={gaze} blush={blush} />
      </Canvas>
    </SceneBoundary>
  );
}
