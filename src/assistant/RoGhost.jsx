import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import SceneBoundary from "../components/SceneBoundary";
import { GHOST_EYES as TRACED_EYES, GHOST_OUTLINE as TRACED_OUTLINE } from "./ghostShape";
import { createDance } from "./dance";

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
const FEET_Y = -2; // squash and stretch pivot here, so Ro lands on the same spot
const HIP_Y = -0.8; // lean and bow pivot here, low in the body like a centre of mass
const STILL = { x: 0, y: 0, height: 0, lean: 0, spin: 0, bow: 0, sy: 1, sx: 1, look: null, happy: 0, flush: 0 };
const BEAM = { ...STILL, happy: 1, flush: 1 }; // reduced motion: no moves, just a happy face

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

const BLINK = { close: 0.09, hold: 0.05, open: 0.13, line: 0.065 }; // seconds; line = thickness of the closed "‿"
const LID = { x: 1.12, y: 1.04 }; // lids overlap the eye rim; extra width keeps the closed "‿" off the sides

// An eyelid: an oval a little larger than the eye that slides down from just above it. Being full
// width it never leaves slivers at the sides; it stops a little short, leaving a thin dark curve
// along the bottom of the eye: a closed, smiling "‿". (A fan from the centre, rather than the traced
// outline, avoids long thin triangles that can leave pinholes when rasterised.)
function lidGeometry(eye) {
  const lid = new THREE.CircleGeometry(1, 64);
  lid.scale(eye.rx * LID.x, eye.ry * LID.y, 1);
  return lid;
}
// How far above the eye the lid sits: clear of it when open, nearly covering it when closed.
const lidOffset = (eye, closure) => {
  const open = 2 * eye.ry * LID.y, closed = BLINK.line + eye.ry * (LID.y - 1);
  return open - (open - closed) * closure;
};

const disc = new THREE.CircleGeometry(1, 48);
const plane = new THREE.PlaneGeometry(1, 1);

function svgPath(flat) {
  let d = "";
  for (let i = 0; i < flat.length; i += 2) d += `${i ? "L" : "M"}${flat[i]} ${-flat[i + 1]}`;
  return d + "Z";
}

function Face({ face, parts, groupRef, pupilRefs, cheekMaterial, lidRefs, lidMaterial }) {
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
      {parts.lids.map((lid, i) => (
        <mesh key={"lid" + i} ref={lidRefs[i]} geometry={lid} material={lidMaterial} position={[face.eyes[i].x, face.eyes[i].y + lidOffset(face.eyes[i], 0), CAP_Z + 0.004]} renderOrder={1} visible={false} />
      ))}
      {cheekPositions(face.eyes).map(([x, y], i) => (
        <mesh key={"cheek" + i} geometry={plane} material={cheekMaterial} position={[x, y, CAP_Z + 0.006]} scale={[BLUSH.rx * 2, BLUSH.ry * 2, 1]} renderOrder={2} />
      ))}
    </group>
  );
}

function Ghost({ reduced, pointer, shadowRef, visualRef, facing, gaze, blush, dance, onLand, onDanceEnd }) {
  const floatRef = useRef();
  const leanRef = useRef();
  const squashRef = useRef();
  const turnRef = useRef();
  // One physics simulation per performance (see dance.js); `calm` fades the idle float out while
  // dancing so hops start and land on solid ground; `shut` and `glow` ease the closed eyes and blush.
  const moves = useRef({ id: 0, sim: null, ended: false, calm: 1, shut: 0, glow: 0 });
  const landRef = useRef(onLand);
  landRef.current = onLand;
  const pivot = useMemo(() => ({ hip: new THREE.Vector3(), turned: new THREE.Vector3() }), []);
  const faceRefs = { left: useRef(), right: useRef() };
  const pupilRefs = { left: [useRef(), useRef()], right: [useRef(), useRef()] };
  const lidRefs = { left: [useRef(), useRef()], right: [useRef(), useRef()] };
  const look = useRef({ x: 0, y: 0 });
  const turn = useRef({ shown: facing, target: facing, start: null });
  const blink = useRef({ next: 2 + Math.random() * 3, start: -1, quick: false });
  const parts = useMemo(
    () => Object.fromEntries(Object.entries(FACES).map(([name, face]) => [name, { body: ghostGeometry(face), floors: face.eyes.map(eyeFloorGeometry), lids: face.eyes.map(lidGeometry) }])),
    [],
  );
  const cheeks = useMemo(blushMaterial, []);
  // Lids draw after the body without depth testing, so the dark eye rim just beneath can never poke through.
  const lidMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.38, clearcoat: 0.55, clearcoatRoughness: 0.28, depthTest: false }), []);
  const flush = useRef(0);
  const { size, viewport, gl, invalidate } = useThree();
  const rect = useRef(null);

  useEffect(() => () => Object.values(parts).forEach(({ body, floors, lids }) => { body.dispose(); [...floors, ...lids].forEach((g) => g.dispose()); }), [parts]);
  useEffect(() => () => { cheeks.map.dispose(); cheeks.dispose(); lidMaterial.dispose(); }, [cheeks, lidMaterial]);
  // The launcher is position: fixed, so its box only changes on resize.
  useEffect(() => {
    const measure = () => { rect.current = gl.domElement.getBoundingClientRect(); };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [gl, size]);
  // With reduced motion the scene renders on demand, so redraw when the pose changes.
  useEffect(() => invalidate(), [facing, gaze, blush, dance, invalidate]);

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

    // Dancing. With reduced motion Ro only beams (happy eyes and a blush) instead of moving.
    const mv = moves.current;
    if (dance !== mv.id) {
      mv.id = dance;
      mv.sim = dance && !reduced ? createDance({ onLand: (impact) => landRef.current?.(impact) }) : null;
      mv.ended = false;
    }
    const pose = mv.sim ? mv.sim.step(delta) : dance ? BEAM : STILL;
    if (mv.sim?.done && !mv.ended) { mv.ended = true; onDanceEnd?.(); }
    const settle = reduced ? 1 : 1 - Math.exp(-Math.min(delta, 1 / 30) * 9);
    mv.shut += (pose.happy - mv.shut) * settle; // closed "‿" eyes
    mv.glow += (pose.flush - mv.glow) * settle;  // dance blush
    mv.calm += ((mv.sim ? 0 : 1) - mv.calm) * (reduced ? 1 : 1 - Math.exp(-Math.min(delta, 1 / 30) * 5));

    // Lean and bow turn about the hips: rotate, then shift so the hip point stays put.
    const leanGroup = leanRef.current;
    leanGroup.rotation.set(pose.bow, 0, pose.lean);
    pivot.hip.set(0, HIP_Y, 0);
    pivot.turned.copy(pivot.hip).applyEuler(leanGroup.rotation);
    leanGroup.position.copy(pivot.hip).sub(pivot.turned);
    // Squash and stretch about the feet (volume-preserving widths come from the sim); spin on top.
    const squashGroup = squashRef.current;
    squashGroup.rotation.y = pose.spin;
    squashGroup.scale.set(pose.sx, pose.sy, pose.sx);
    squashGroup.position.y = FEET_Y * (1 - pose.sy);
    // Travel and hops move the whole canvas, so Ro never clips at its edges.
    const visual = visualRef?.current;
    if (visual) visual.style.transform = Math.abs(pose.x) + Math.abs(pose.y) > 0.01 ? `translate3d(${pose.x.toFixed(2)}px, ${pose.y.toFixed(2)}px, 0)` : "";
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
    } else if (pose.look) {
      tx = pose.look.x; ty = pose.look.y;
    } else if (gaze === "thinking") {
      tx = reduced ? 0 : 0.35 * Math.sin(t * 1.3);
      ty = 0.85;
    } else {
      tx = gaze.x; ty = gaze.y;
    }
    const glide = reduced || pose.look ? 1 : 1 - Math.exp(-Math.min(delta, 1 / 30) * 3.2); // the sim springs the pupils itself
    const l = look.current;
    l.x += (tx - l.x) * glide;
    l.y += (ty - l.y) * glide;

    // Hovered: the cheeks flush pink and the pupils widen a little, as if flustered.
    flush.current += ((blush ? 1 : 0) - flush.current) * (reduced ? 1 : 1 - Math.exp(-Math.min(delta, 1 / 30) * 7));
    const rosy = Math.max(flush.current, mv.glow);
    cheeks.opacity = rosy;
    cheeks.visible = rosy > 0.01;
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

    // Blink every few seconds, now and then twice in quick succession: the lids sweep down
    // (ease in), hold for a moment, then lift (ease out).
    let closure = 0;
    const b = blink.current;
    if (!reduced) {
      if (b.start < 0 && t >= b.next) b.start = t;
      if (b.start >= 0) {
        const e = t - b.start;
        if (e < BLINK.close) closure = (e / BLINK.close) ** 2;
        else if (e < BLINK.close + BLINK.hold) closure = 1;
        else if (e < BLINK.close + BLINK.hold + BLINK.open) closure = (1 - (e - BLINK.close - BLINK.hold) / BLINK.open) ** 2;
        else {
          b.start = -1;
          b.quick = !b.quick && Math.random() < 0.2;
          b.next = t + (b.quick ? 0.16 : 2.5 + Math.random() * 4);
        }
      }
    }
    for (const name of Object.keys(FACES))
      FACES[name].eyes.forEach((eye, i) => {
        const lid = lidRefs[name][i].current;
        if (!lid) return;
        const shut = Math.max(closure, mv.shut);
        lid.position.y = eye.y + lidOffset(eye, shut);
        lid.visible = shut > 0.001;
      });

    if (reduced) return;
    const wave = Math.sin((t * Math.PI * 2) / FLOAT_PERIOD) * mv.calm;
    floatRef.current.position.y = 0.2 + wave * FLOAT_PX * (viewport.height / size.height);
    const shadow = shadowRef.current;
    if (shadow) {
      // The shadow stays on the ground under Ro, shrinking and fading with height like a real one.
      const lift = pose.height;
      shadow.style.opacity = String((0.55 - wave * 0.2) / (1 + lift / 28));
      shadow.style.transform = `translateX(calc(-50% + ${pose.x.toFixed(2)}px)) scale(${(0.975 - wave * 0.125) / (1 + lift / 55)})`;
    }
  });

  return (
    <group ref={floatRef} position={[0, 0.2, 0]}>
      <group ref={leanRef}>
        <group ref={squashRef}>
          <group ref={turnRef}>
            {Object.entries(FACES).map(([name, face]) => (
              <Face key={name} face={face} parts={parts[name]} groupRef={faceRefs[name]} pupilRefs={pupilRefs[name]} cheekMaterial={cheeks} lidRefs={lidRefs[name]} lidMaterial={lidMaterial} />
            ))}
          </group>
        </group>
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

export default function RoGhost({ reduced, paused, shadowRef, visualRef, facing = "left", gaze = "cursor", blush = false, dance = 0, onLand, onDanceEnd }) {
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
        camera={{ position: [0, 0, 40], fov: 8.9, near: 30, far: 50 }} // long lens; tight depth range for crisp layering
        gl={{ alpha: true, antialias: true }}
        onCreated={(state) => {
          state.gl.toneMapping = THREE.NeutralToneMapping;
          state.gl.toneMappingExposure = 1.25;
          invalidate.current = state.invalidate;
        }}
        fallback={<GhostFallback facing={facing} />}
      >
        <Lights />
        <Ghost reduced={reduced} pointer={pointer} shadowRef={shadowRef} visualRef={visualRef} facing={facing} gaze={gaze} blush={blush} dance={dance} onLand={onLand} onDanceEnd={onDanceEnd} />
      </Canvas>
    </SceneBoundary>
  );
}
