import { useCallback, useEffect, useRef, useState } from "react";
import useReducedMotion from "../hooks/useReducedMotion";
import RoGhost from "./RoGhost";
import "./ro-launcher.css";

const BUBBLE_MS = 5500;
const BUBBLE_GAP_MS = 7000;
// Room for Ro beside the 520px chat panel; narrower screens show the chat full-screen.
const DOCK_QUERY = "(min-width: 720px)";
const DOCK_GAP = 18;
const AHEAD_LEFT = { x: -1, y: 0.15 };
const AHEAD_RIGHT = { x: 1, y: 0.15 };
const AT_CHAT = { x: 0.9, y: 0.15 };

// Keyed by section id. Each thought shows at most once per visit.
const THOUGHTS = {
  about: "that's rohit — boston-based, backend-first, MS CS at northeastern.",
  projects: "these are the projects — every card links to a live build or repo.",
  experience: "AWS, then torry harris. click a role to see what he actually built.",
  achievements: "awards and certs. the azure one links to the credential.",
  skills: "the toolbox. ask me where any of these were used for real.",
  game: "need a break? this one's playable — arrow keys or swipe.",
  resume: "want the one-pager? view it here or grab the PDF.",
  testimonials: "what people who worked with him say.",
  contact: "say hi — the form goes straight to his inbox.",
};

const Icon = ({ d }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d.map((path) => <path key={path} d={path} />)}
  </svg>
);

const ITEMS = [
  { id: "chat", label: "Chat with Ro", sub: "Ask about Rohit's work", icon: ["M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z", "M8.5 12h.01M12 12h.01M15.5 12h.01"] },
  { id: "compare", label: "Match a role", sub: "Map a job description to his work", icon: ["M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1", "M4 6h16a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1z", "M3 12h18"] },
  { id: "game", label: "Play a game", sub: "Jump to Code Runner", icon: ["M6 11h4M8 9v4", "M15 12h.01M18 10h.01", "M17.3 5H6.7a4 4 0 0 0-4 3.6l-.6 5.8A3 3 0 0 0 7.2 17l1.3-1.6a2 2 0 0 1 1.6-.8h3.8a2 2 0 0 1 1.6.8l1.3 1.6a3 3 0 0 0 5.1-2.6l-.6-5.8A4 4 0 0 0 17.3 5z"] },
];

export default function RoLauncher({ assistantOpen, thinking, onSelect }) {
  const reduced = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bubble, setBubble] = useState(null);
  const [phase, setPhase] = useState("home"); // home → out → docked → back → home
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const phaseRef = useRef("home");
  const flight = useRef([]);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const shadowRef = useRef(null);
  const bubbleTimer = useRef(null);
  const lastBubble = useRef(-Infinity);
  const seen = useRef(new Set());
  const blocked = useRef(false);
  blocked.current = menuOpen || assistantOpen || phase !== "home";

  const say = useCallback((key, text) => {
    if (blocked.current || seen.current.has(key) || performance.now() - lastBubble.current < BUBBLE_GAP_MS) return;
    seen.current.add(key);
    lastBubble.current = performance.now();
    clearTimeout(bubbleTimer.current);
    setBubble({ key, text });
    bubbleTimer.current = setTimeout(() => setBubble(null), BUBBLE_MS);
  }, []);

  const dismissBubble = () => { clearTimeout(bubbleTimer.current); setBubble(null); };

  // Comment on a section once it reaches the middle of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && say(e.target.id, THOUGHTS[e.target.id])),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    Object.keys(THOUGHTS).forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    const greet = setTimeout(() => say("hello", "hi, i'm ro — tap me to ask about rohit's work."), 6000);
    return () => { observer.disconnect(); clearTimeout(greet); clearTimeout(bubbleTimer.current); };
  }, [say]);

  useEffect(() => {
    if (menuOpen || assistantOpen) dismissBubble();
    if (assistantOpen) { setMenuOpen(false); setHovered(false); }
  }, [menuOpen, assistantOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    menuRef.current?.querySelector("[role=menuitem]")?.focus();
    const outside = (e) => { if (!rootRef.current?.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [menuOpen]);

  // While the chat is open, fly beside it (when there's room) and face it; fly home when it closes.
  useEffect(() => {
    const root = rootRef.current;
    const setNow = (next) => { phaseRef.current = next; setPhase(next); };
    const target = () => {
      const panel = document.getElementById("ask-rohit-dialog");
      if (!panel || !matchMedia(DOCK_QUERY).matches) return null;
      // offset* positions ignore transforms, so they stay put while Ro is mid-flight.
      return {
        x: panel.offsetLeft - DOCK_GAP - (root.offsetLeft + root.offsetWidth),
        y: panel.offsetTop + panel.offsetHeight - (root.offsetTop + root.offsetHeight),
      };
    };
    const place = (to) => {
      flight.current.forEach((animation) => animation.cancel());
      root.style.transform = to ? `translate(${to.x}px, ${to.y}px)` : "";
    };
    const fly = (to, duration, done) => {
      const now = new DOMMatrixReadOnly(getComputedStyle(root).transform); // includes a running flight
      const from = { x: now.e, y: now.f };
      const dx = to.x - from.x;
      const lift = Math.min(160, Math.max(60, Math.abs(dx) * 0.22));
      const bank = Math.sign(dx) * 9;
      // A quadratic Bézier with its control point above the midpoint: rise, glide, land.
      const frames = Array.from({ length: 25 }, (_, i) => {
        const t = i / 24, u = 1 - t;
        const x = u * u * from.x + 2 * u * t * (from.x + dx / 2) + t * t * to.x;
        const y = u * u * from.y + 2 * u * t * (Math.min(from.y, to.y) - lift) + t * t * to.y;
        return { transform: `translate(${x}px, ${y}px) rotate(${bank * Math.sin(Math.PI * t)}deg)` };
      });
      place(to.x || to.y ? to : null);
      const path = root.animate(frames, { duration, easing: "cubic-bezier(0.45, 0, 0.25, 1)" });
      const shadow = shadowRef.current?.animate(
        [{ opacity: 0.5 }, { opacity: 0, offset: 0.15 }, { opacity: 0, offset: 0.85 }, { opacity: 0.5 }],
        { duration },
      );
      flight.current = [path, shadow].filter(Boolean);
      path.onfinish = done;
    };

    if (assistantOpen) {
      const to = target();
      if (to && reduced) { place(to); setNow("docked"); }
      else if (to) { setNow("out"); fly(to, 950, () => setNow("docked")); }
      const resize = () => {
        const next = target();
        if (next) { place(next); setNow("docked"); }
        else if (phaseRef.current !== "home") { place(null); setNow("home"); }
      };
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }
    if (phaseRef.current === "home") return;
    if (reduced) { place(null); setNow("home"); }
    else { setNow("back"); fly({ x: 0, y: 0 }, 800, () => setNow("home")); }
  }, [assistantOpen, reduced]);

  const facing = phase === "docked" || phase === "back" ? "right" : "left";
  const gaze = { out: AHEAD_LEFT, back: AHEAD_RIGHT, docked: thinking ? "thinking" : AT_CHAT }[phase] ?? "cursor";

  const closeMenu = () => { setMenuOpen(false); triggerRef.current?.focus(); };

  const choose = (id) => {
    closeMenu();
    if (id !== "game") return onSelect(id);
    const section = document.getElementById("game");
    section?.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
    section?.querySelector("canvas")?.focus({ preventScroll: true });
  };

  const menuKeys = (e) => {
    const items = [...menuRef.current.querySelectorAll("[role=menuitem]")];
    const index = items.indexOf(document.activeElement);
    const move = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: items.length - 1 }[e.key];
    if (move !== undefined) { e.preventDefault(); items[(move + items.length) % items.length].focus(); }
    else if (e.key === "Escape" || e.key === "Tab") { e.preventDefault(); e.stopPropagation(); closeMenu(); }
  };

  return (
    <div ref={rootRef} className="ro-root" data-open={menuOpen || undefined} data-docked={phase !== "home" || undefined}>
      {bubble && (
        <div key={bubble.key} className="ro-bubble" role="status" onClick={dismissBubble}>
          <p>{bubble.text}</p>
          <span className="ro-bubble-drain" aria-hidden="true" />
        </div>
      )}

      {menuOpen && (
        <div ref={menuRef} id="ro-menu" className="ro-menu" role="menu" aria-label="Ask Ro" onKeyDown={menuKeys}>
          {ITEMS.map((item, i) => (
            <button key={item.id} type="button" role="menuitem" tabIndex={-1} className="ro-item" style={{ "--i": i }} onClick={() => choose(item.id)}>
              <span className="ro-item-icon"><Icon d={item.icon} /></span>
              <span className="ro-item-text"><strong>{item.label}</strong><span>{item.sub}</span></span>
            </button>
          ))}
        </div>
      )}

      <div className="ro-stage">
        <div ref={shadowRef} className="ro-shadow" aria-hidden="true" />
        <div className="ro-visual" aria-hidden="true">
          <RoGhost reduced={reduced} paused={assistantOpen && phase === "home"} shadowRef={shadowRef} facing={facing} gaze={gaze} blush={(hovered || keyboardFocus) && phase === "home"} />
        </div>
        <button
          ref={triggerRef}
          type="button"
          className="ro-hit"
          aria-label="Ask Ro"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? "ro-menu" : undefined}
          onClick={() => setMenuOpen((open) => !open)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onFocus={(e) => setKeyboardFocus(e.currentTarget.matches(":focus-visible"))}
          onBlur={() => setKeyboardFocus(false)}
        />
        <span className="ro-label" aria-hidden="true">{menuOpen ? "close" : "ask ro"}</span>
      </div>
    </div>
  );
}
