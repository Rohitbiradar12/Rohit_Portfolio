import test from "node:test";
import assert from "node:assert/strict";
import { createDance, BEAT, DANCE_SECONDS } from "../src/assistant/dance.js";

// Play the whole routine at a given frame rate, recording every pose and landing.
function perform(fps) {
  const landings = [];
  const dance = createDance({ onLand: (impact) => landings.push({ beat: dance.seconds / BEAT, impact }) });
  const poses = [];
  while (!dance.done && poses.length < fps * 20) {
    const pose = dance.step(1 / fps);
    poses.push({ t: dance.seconds, tick: Math.round(dance.seconds * 240), ...pose });
  }
  return { dance, poses, landings };
}

test("every landing hits the beat", () => {
  const { landings } = perform(60);
  assert.deepEqual(landings.map((l) => Math.round(l.beat)), [1, 2, 3, 4, 6, 11]);
  for (const { beat } of landings) assert.ok(Math.abs(beat - Math.round(beat)) < 0.02, `landed at beat ${beat}`);
});

test("hops are ballistic under one gravity: apex heights match and impact speed grows with √height", () => {
  const { poses, landings } = perform(60);
  const apex = (from, to) => Math.max(...poses.filter((p) => p.t / BEAT >= from && p.t / BEAT < to).map((p) => p.height));
  assert.ok(Math.abs(apex(0, 1.05) - 10) < 0.4);
  assert.ok(Math.abs(apex(5, 6.05) - 40) < 0.8);
  assert.ok(Math.abs(apex(10, 11.05) - 22) < 0.6);
  // v = √(2gh): the 40px jump lands twice as fast as the 10px hops.
  assert.ok(Math.abs(landings[4].impact / landings[0].impact - 2) < 0.05);
});

test("squash and stretch preserve volume and stay within a tasteful range", () => {
  const { poses } = perform(60);
  for (const p of poses) {
    assert.ok(Math.abs(p.sx * p.sx * p.sy - 1) < 1e-9, "width² × height stays 1");
    assert.ok(p.sy > 0.75 && p.sy < 1.3, `height scale ${p.sy}`);
  }
});

test("the dance comes to rest and finishes well within its time budget", () => {
  const { dance, poses } = perform(60);
  assert.ok(dance.done);
  assert.ok(dance.seconds < DANCE_SECONDS);
  const last = poses.at(-1);
  for (const key of ["x", "height", "lean", "bow", "spin"]) assert.ok(Math.abs(last[key]) < 0.01, `${key} = ${last[key]}`);
  assert.ok(Math.abs(last.sy - 1) < 0.01);
});

test("motion is frame-rate independent: 60 Hz and 144 Hz screens see the identical dance", () => {
  // The sim runs in fixed 1/240 s ticks, so at the same tick the pose must match exactly.
  const fast = new Map(perform(144).poses.map((p) => [p.tick, p]));
  const shared = perform(60).poses.filter((p) => fast.has(p.tick));
  assert.ok(shared.length > 50);
  for (const p of shared) {
    const q = fast.get(p.tick);
    for (const key of ["x", "height", "lean", "spin", "sy", "bow"]) assert.ok(Math.abs(p[key] - q[key]) < 1e-9, `${key} at tick ${p.tick}`);
  }
});
