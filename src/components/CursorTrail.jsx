import { useEffect, useRef } from "react";

export default function CursorTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (matchMedia("(hover: none)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let particles = [];

    // Real cursor position
    const cursor  = { x: -300, y: -300 };
    // Lagging glow follower
    const follower = { x: -300, y: -300 };
    let lastX = -300, lastY = -300;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const onMove = (e) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      lastX = e.clientX;
      lastY = e.clientY;
      cursor.x = e.clientX;
      cursor.y = e.clientY;

      // More particles when moving faster
      const count = Math.max(2, Math.min(Math.floor(speed * 0.45), 7));
      for (let i = 0; i < count; i++) {
        const hue   = 255 + Math.random() * 65;   // purple → violet → indigo
        const large = Math.random() < 0.15;         // occasional larger spark
        particles.push({
          x:    cursor.x + (Math.random() - 0.5) * 8,
          y:    cursor.y + (Math.random() - 0.5) * 8,
          vx:   (Math.random() - 0.5) * (1.6 + speed * 0.04),
          vy:   (Math.random() - 0.5) * 1.4 - 0.6 - speed * 0.02,
          size: large ? 3.5 + Math.random() * 2 : 1.2 + Math.random() * 2.2,
          life: 1,
          decay: large ? 0.008 + Math.random() * 0.01 : 0.014 + Math.random() * 0.018,
          hue,
          lightness: 75 + Math.random() * 20,
        });
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const drawFollower = () => {
      if (follower.x < -200) return;

      // Outer halo
      const outer = ctx.createRadialGradient(
        follower.x, follower.y, 0,
        follower.x, follower.y, 90
      );
      outer.addColorStop(0,   "rgba(139, 92, 246, 0.10)");
      outer.addColorStop(0.45,"rgba(109, 40, 217, 0.05)");
      outer.addColorStop(1,   "rgba(76,  29, 149, 0)");
      ctx.fillStyle = outer;
      ctx.beginPath();
      ctx.arc(follower.x, follower.y, 90, 0, Math.PI * 2);
      ctx.fill();

      // Inner glow
      const inner = ctx.createRadialGradient(
        follower.x, follower.y, 0,
        follower.x, follower.y, 30
      );
      inner.addColorStop(0,  "rgba(196, 181, 253, 0.18)");
      inner.addColorStop(1,  "rgba(139,  92, 246, 0)");
      ctx.fillStyle = inner;
      ctx.beginPath();
      ctx.arc(follower.x, follower.y, 30, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x    += p.vx;
        p.y    += p.vy;
        p.vy   -= 0.025;   // gentle upward float
        p.vx   *= 0.965;
        p.vy   *= 0.965;
        p.life -= p.decay;
        p.size *= 0.972;

        if (p.life <= 0 || p.size < 0.18) { particles.splice(i, 1); continue; }

        const a = p.life;

        // Bloom halo (shadow trick — fast & pretty)
        ctx.save();
        ctx.shadowBlur  = 18;
        ctx.shadowColor = `hsla(${p.hue}, 85%, 70%, ${a * 0.8})`;

        // Core — near-white bright center
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 60%, 93%, ${a * 0.92})`;
        ctx.fill();
        ctx.restore();

        // Soft outer glow ring (no shadow, just transparent fill)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3.2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 72%, ${a * 0.09})`;
        ctx.fill();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ease follower toward real cursor (spring lag)
      follower.x += (cursor.x - follower.x) * 0.09;
      follower.y += (cursor.y - follower.y) * 0.09;

      drawFollower();
      drawParticles();

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
