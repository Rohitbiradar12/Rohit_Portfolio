// Ro's dance, as a small physics simulation rather than keyframes.
//
// A choreography (on an unhurried 96 bpm beat) sets targets and fires jumps; physics does the moving:
// - Hops are ballistic under one constant gravity. A jump of height h takes off at v0 = √(2gh) and
//   stays up T = 2v0/g, so it is scheduled by its landing beat and takes off T earlier: every
//   landing hits the beat.
// - Squash and stretch is an under-damped spring (it wobbles like jelly). Ro crouches before a
//   jump, stretches with vertical speed in the air, and takes an impulse proportional to the
//   impact speed on landing. Volume is preserved: width = 1/√height.
// - Lean is a damped pendulum driven by horizontal acceleration, so the body lags, swings and
//   settles instead of tilting on cue.
// - Position, spin, bow and the pupils all follow damped springs: slight overshoot, then settle.
// Everything integrates in fixed 1/240 s steps, so the motion is identical at any frame rate.

export const BEAT = 60 / 96;
const STEP = 1 / 240;
const END_BEAT = 13.7;
const BOW = { from: 11.9, to: 13 }; // after a moment of beaming at the landing
const GRAVITY = 600; // px/s²: light, as befits a ghost, so every hop has real hang time

/** A damped spring with natural frequency `hz` and damping ratio `zeta`. */
function spring(hz, zeta) {
  const w = 2 * Math.PI * hz;
  return { x: 0, v: 0, k: w * w, c: 2 * zeta * w };
}
const pull = (s, target, force = 0) => { s.v += (s.k * (target - s.x) - s.c * s.v + force) * STEP; s.x += s.v * STEP; };

const smooth = (p) => p * p * (3 - 2 * p);
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2)); // to (−π, π]: same pose, no drift
const window01 = (b, from, to) => (b <= from || b >= to ? 0 : Math.sin((Math.PI * (b - from)) / (to - from)));
const between = (b, from, to) => b >= from && b < to;
// Anticipation: sink by `depth` over the `beats` before a take-off.
const crouch = (b, takeoff, beats, depth) => (between(b, takeoff - beats, takeoff) ? -depth * smooth((b - takeoff + beats) / beats) : 0);

// Jumps by landing beat: h = apex height (px), x = where Ro lands; one carries a full spin.
const JUMPS = [
  { land: 1, h: 10, x: 13 },
  { land: 2, h: 10, x: -13 },
  { land: 3, h: 10, x: 13 },
  { land: 4, h: 10, x: 0 },
  { land: 6, h: 40, x: 0, spin: true },
  { land: 11, h: 22, x: 0, finale: true },
].map((j) => {
  const v0 = Math.sqrt(2 * GRAVITY * j.h);
  return { ...j, v0, at: j.land - (2 * v0) / GRAVITY / BEAT };
});

// What the choreography asks for at beat b (the springs decide how the body gets there).
function targets(b) {
  const shimmy = window01(b, 6.4, 9.9);
  const roll = Math.PI * (b - 6.4);
  return {
    // Crouch before each big jump; a gentle bob during the shimmy.
    squash: (between(b, 0.2, JUMPS[0].at) ? -0.07 : 0)
      + crouch(b, JUMPS[4].at, 0.45, 0.17)
      + crouch(b, JUMPS[5].at, 0.32, 0.12)
      + 0.035 * Math.sin(2 * roll) * shimmy,
    sway: 3.5 * Math.sin(2 * roll) * shimmy,
    lean: 0.1 * Math.sin(2 * roll) * shimmy,
    bow: 0.34 * window01(b, BOW.from, BOW.to),
    look: shimmy > 0.05
      ? { x: Math.cos(roll) * shimmy, y: Math.sin(roll) * shimmy }
      : between(b, JUMPS[4].at - 0.45, 6.2) ? { x: 0, y: 0.75 } : { x: 0, y: 0.2 },
  };
}

export function createDance({ onLand } = {}) {
  // Soft springs: low frequencies so everything glides, overshoots gently and settles slowly.
  const x = spring(2.1, 0.6);        // px
  const lean = spring(1.6, 0.32);    // rad; pendulum
  const squash = spring(2.9, 0.3);   // height − 1
  const spin = spring(1.35, 0.72);   // rad
  const bow = spring(1.4, 0.65);     // rad
  const lookX = spring(2.3, 0.55);
  const lookY = spring(2.3, 0.55);
  const air = { y: 0, vy: 0, flying: false };
  // eyes: closed ("‿") for the whole dance, lost in the music; blush: arrives when Ro sticks the final landing.
  let homeX = 0, spinTarget = 0, eyes = 0, blush = 0, beaming = false, time = 0, carry = 0, next = 0, prevVx = 0, finale = false;

  const tick = () => {
    const b = time / BEAT;
    while (next < JUMPS.length && b >= JUMPS[next].at) {
      const j = JUMPS[next++];
      if (air.flying) continue;
      air.flying = true;
      air.vy = j.v0;
      finale = !!j.finale;
      homeX = j.x;
      if (j.spin) spinTarget += Math.PI * 2;
      squash.v += 2.2; // push-off: the crouch springs open
    }
    const t = targets(b);

    if (air.flying) {
      air.vy -= GRAVITY * STEP;
      air.y += air.vy * STEP;
      if (air.y <= 0) {
        const impact = -air.vy;
        air.y = 0; air.vy = 0; air.flying = false;
        squash.v -= impact * 0.009;
        lookY.v -= impact * 0.02;
        if (finale) beaming = true; // stuck the landing
        onLand?.(impact);
      }
    }

    // Stretch along vertical speed while airborne.
    const stretch = air.flying ? Math.max(-0.08, Math.min(0.12, air.vy * 0.0005)) : 0;
    pull(squash, t.squash + stretch);
    pull(x, homeX + t.sway);
    const ax = (x.v - prevVx) / STEP;
    prevVx = x.v;
    pull(lean, t.lean, ax * 0.01);
    pull(spin, spinTarget);
    pull(bow, t.bow);
    pull(lookX, t.look.x);
    pull(lookY, t.look.y);
    eyes += (1 - eyes) * Math.min(1, STEP * 12);
    blush += ((beaming ? 1 : 0) - blush) * Math.min(1, STEP * 9);
    time += STEP;
  };

  const settled = () => !air.flying && [x, lean, squash, bow].every((s) => Math.abs(s.x) < 0.004 && Math.abs(s.v) < 0.02) && Math.abs(spin.x - spinTarget) < 0.01;

  return {
    /** Advance by `dt` seconds of wall time; returns the pose to draw. */
    step(dt) {
      carry += Math.min(dt, 1 / 20);
      while (carry >= STEP) { tick(); carry -= STEP; }
      const sy = 1 + squash.x;
      return {
        x: x.x,
        y: -air.y, // CSS: up is negative
        height: air.y,
        lean: lean.x,
        spin: wrap(spin.x),
        bow: bow.x,
        sy,
        sx: 1 / Math.sqrt(Math.max(0.5, sy)),
        look: { x: Math.max(-1, Math.min(1, lookX.x)), y: Math.max(-1, Math.min(1, lookY.x)) },
        happy: eyes,
        flush: blush,
      };
    },
    /** The routine has played out and every spring has come to rest. */
    get done() { return time / BEAT > END_BEAT && (settled() || time / BEAT > END_BEAT + 3); },
    get seconds() { return time; },
  };
}

/** Upper bound on the routine's length, for timers that must not cut it short. */
export const DANCE_SECONDS = (END_BEAT + 3) * BEAT;
