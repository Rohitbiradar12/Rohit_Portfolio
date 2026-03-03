import { useState, useEffect, useRef, useCallback } from "react";
import TitleHeader from "../components/TitleHeader";

const W = 480, H = 700;
const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;
const HORIZON = 160, FLOOR_Y = H - 50;
const ROAD_W = 360, LANE_W = ROAD_W / 3;
const CAM = 200, SPAWN_Z = 1600;
const LANE_OFF = [-LANE_W, 0, LANE_W];
const proj = (z) => {
    const s = CAM / (CAM + z);
    return { s, y: HORIZON + (FLOOR_Y - HORIZON) * s, x: (off) => W / 2 + off * s };
};

const COLS = [
    { label: "⚛", color: "#61DAFB", name: "React" },
    { label: "JS", color: "#F7DF1E", name: "JS" },
    { label: "🐍", color: "#3776AB", name: "Python" },
    { label: "⚡", color: "#fbbf24", name: "Bolt" },
    { label: "☕", color: "#ED8B00", name: "Java" },
    { label: "🟢", color: "#339933", name: "Node" },
];

const CODE_CHARS = "{}()[];=>/<>const let var function return if else for while import export class async await".split("");

const GameSection = () => {
    const canvasRef = useRef(null);
    const sectionRef = useRef(null);
    const gRef = useRef(null);
    const afRef = useRef(null);
    const touchRef = useRef(null);
    const visibleRef = useRef(true);
    const [score, setScore] = useState(0);
    const [hi, setHi] = useState(() => {
        try { return parseInt(localStorage.getItem("crHi") || "0", 10); } catch { return 0; }
    });
    const [dist, setDist] = useState(0);

    const init = useCallback(() => {
        gRef.current = {
            tLane: 1, laneX: 0,
            obs: [], cols: [], parts: [], speedLines: [],
            gridOff: 0, speed: 4.5, dist: 0, score: 0,
            frame: 0, over: false, started: false,
            lastObs: -60, lastCol: -30, shakeX: 0, shakeY: 0, shakeDecay: 0,
            stars: Array.from({ length: IS_MOBILE ? 35 : 80 }, () => ({
                x: Math.random() * W, y: Math.random() * (HORIZON + 30),
                sz: Math.random() * 2 + 0.3, a: Math.random() * 0.6 + 0.1,
                twinkleSpeed: Math.random() * 0.03 + 0.01,
                phase: Math.random() * Math.PI * 2,
            })),
            buildingsFar: Array.from({ length: IS_MOBILE ? 12 : 25 }, (_, i) => {
                const count = IS_MOBILE ? 12 : 25;
                return {
                    x: i * (W / count) - 5 + Math.random() * 8,
                    w: 10 + Math.random() * 18,
                    h: 20 + Math.random() * 45,
                    hasAntenna: Math.random() > 0.6,
                    antennaH: 8 + Math.random() * 15,
                    windowColor: Math.random() > 0.5 ? "rgba(139,92,246," : "rgba(59,130,246,",
                };
            }),
            buildingsNear: Array.from({ length: IS_MOBILE ? 8 : 16 }, (_, i) => {
                const count = IS_MOBILE ? 8 : 16;
                return {
                    x: i * (W / count) - 8 + Math.random() * 12,
                    w: 18 + Math.random() * 30,
                    h: 35 + Math.random() * 75,
                    hasAntenna: Math.random() > 0.5,
                    antennaH: 10 + Math.random() * 20,
                    windowColor: Math.random() > 0.5 ? "rgba(167,139,250," : "rgba(96,165,250,",
                    neonSign: !IS_MOBILE && Math.random() > 0.7,
                    neonColor: ["#f472b6", "#a78bfa", "#60a5fa", "#34d399"][Math.floor(Math.random() * 4)],
                };
            }),
            codeParticles: Array.from({ length: IS_MOBILE ? 0 : 25 }, () => ({
                x: Math.random() * W,
                y: Math.random() * HORIZON * 0.8,
                char: CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
                a: Math.random() * 0.12 + 0.03,
                speed: Math.random() * 0.3 + 0.1,
                sz: Math.random() * 8 + 6,
            })),
            auroraPhase: 0,
            sideStructures: Array.from({ length: IS_MOBILE ? 6 : 12 }, (_, i) => ({
                z: i * 130 + Math.random() * 60,
                side: Math.random() > 0.5 ? -1 : 1,
                type: Math.floor(Math.random() * 3),
                h: 30 + Math.random() * 40,
            })),
        };
        setScore(0); setDist(0);
    }, []);

    const startGame = useCallback(() => {
        init();
        const g = gRef.current;
        g.started = true;

    }, [init]);

    const moveLeft = useCallback(() => {
        const g = gRef.current;
        if (!g || g.over) return;
        if (!g.started) { startGame(); return; }
        if (g.tLane > 0) g.tLane--;
    }, [startGame]);

    const moveRight = useCallback(() => {
        const g = gRef.current;
        if (!g || g.over) return;
        if (!g.started) { startGame(); return; }
        if (g.tLane < 2) g.tLane++;
    }, [startGame]);

    const handleAction = useCallback(() => {
        const g = gRef.current;
        if (!g) return;
        if (g.over || !g.started) { startGame(); return; }
    }, [startGame]);

    useEffect(() => {
        const fn = (e) => {
            if (e.code === "ArrowLeft" || e.code === "KeyA") { e.preventDefault(); moveLeft(); }
            else if (e.code === "ArrowRight" || e.code === "KeyD") { e.preventDefault(); moveRight(); }
            else if (e.code === "Space" || e.code === "Enter") { e.preventDefault(); handleAction(); }
        };
        window.addEventListener("keydown", fn);
        return () => window.removeEventListener("keydown", fn);
    }, [moveLeft, moveRight, handleAction]);

    const onTS = (e) => { touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const onTE = (e) => {
        if (!touchRef.current) return;
        const dx = e.changedTouches[0].clientX - touchRef.current.x;
        if (Math.abs(dx) > 30) { dx < 0 ? moveLeft() : moveRight(); }
        else handleAction();
        touchRef.current = null;
    };

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { visibleRef.current = e.isIntersecting; }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        init();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const render = () => {
            const g = gRef.current;
            if (!g) { afRef.current = requestAnimationFrame(render); return; }
            if (!visibleRef.current) { afRef.current = requestAnimationFrame(render); return; }

            if (g.started && !g.over) {
                g.frame++;
                g.dist += g.speed;
                g.speed = 4.5 + g.dist * 0.00018;
                g.gridOff = (g.gridOff + g.speed) % 80;
                g.auroraPhase += 0.008;

                if (g.frame - g.lastObs > Math.max(30, 75 - g.dist * 0.003)) {
                    const l1 = Math.floor(Math.random() * 3);
                    g.obs.push({ lane: l1, z: SPAWN_Z, type: Math.floor(Math.random() * 3) });
                    if (Math.random() > 0.5 && g.speed > 6) {
                        let l2; do { l2 = Math.floor(Math.random() * 3); } while (l2 === l1);
                        g.obs.push({ lane: l2, z: SPAWN_Z, type: Math.floor(Math.random() * 3) });
                    }
                    g.lastObs = g.frame;
                }
                if (g.frame - g.lastCol > Math.max(22, 50 - g.dist * 0.002)) {
                    g.cols.push({ lane: Math.floor(Math.random() * 3), z: SPAWN_Z, ci: Math.floor(Math.random() * COLS.length), rot: 0 });
                    g.lastCol = g.frame;
                }

                if (g.speed > 6 && g.frame % 3 === 0) {
                    g.speedLines.push({
                        x: Math.random() * W, y: HORIZON + Math.random() * (H - HORIZON),
                        len: 15 + Math.random() * 30 + (g.speed - 6) * 8,
                        a: 0.15 + Math.random() * 0.15,
                    });
                }
                g.speedLines = g.speedLines.filter(l => { l.a -= 0.015; return l.a > 0; });

                g.obs.forEach(o => { o.z -= g.speed * 3.8; });
                g.cols.forEach(c => { c.z -= g.speed * 3.8; c.rot += 0.04; });
                g.obs = g.obs.filter(o => o.z > -120);
                g.cols = g.cols.filter(c => c.z > -120);

                g.sideStructures.forEach(s => {
                    s.z -= g.speed * 3.8;
                    if (s.z < -100) { s.z = SPAWN_Z + Math.random() * 200; s.side = Math.random() > 0.5 ? -1 : 1; }
                });
                g.obs.forEach(o => {
                    if (o.z < 22 && o.z > -12 && o.lane === g.tLane && !o.hit) {
                        g.over = true; o.hit = true;
                        g.shakeX = 0; g.shakeY = 0; g.shakeDecay = 20;
                        const ox = proj(0).x(LANE_OFF[o.lane]);
                        for (let i = 0; i < 40; i++) {
                            g.parts.push({
                                x: ox, y: FLOOR_Y - 20,
                                vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 10 - 3,
                                a: 1, sz: Math.random() * 6 + 2,
                                c: ["#ef4444", "#f97316", "#fbbf24", "#fff"][Math.floor(Math.random() * 4)]
                            });
                        }
                        const sc = g.score; const ds = Math.floor(g.dist / 10);
                        setScore(sc); setDist(ds);
                        setHi(prev => {
                            const best = Math.max(prev, sc + ds);
                            try { localStorage.setItem("crHi", best.toString()); } catch { }
                            return best;
                        });
                    }
                });

                g.cols = g.cols.filter(c => {
                    if (c.z < 22 && c.z > -12 && c.lane === g.tLane) {
                        g.score += 100; setScore(g.score);
                        const cx = proj(0).x(LANE_OFF[c.lane]);
                        for (let i = 0; i < 14; i++) {
                            g.parts.push({
                                x: cx, y: FLOOR_Y - 30,
                                vx: (Math.random() - 0.5) * 8, vy: -Math.random() * 6 - 2,
                                a: 1, sz: Math.random() * 4 + 1, c: COLS[c.ci].color
                            });
                        }
                        return false;
                    }
                    return true;
                });

                const px = W / 2 + g.laneX;
                if (g.frame % (IS_MOBILE ? 4 : 2) === 0) {
                    for (let i = 0; i < (IS_MOBILE ? 1 : 3); i++) {
                        g.parts.push({
                            x: px + (Math.random() - 0.5) * 16, y: FLOOR_Y + 28 + Math.random() * 6,
                            vx: (Math.random() - 0.5) * 1, vy: Math.random() * 1.5 + 0.5,
                            a: 0.4 + Math.random() * 0.2, sz: Math.random() * 3 + 1,
                            c: ["#8b5cf6", "#3b82f6", "#6366f1", "#a78bfa"][Math.floor(Math.random() * 4)]
                        });
                    }
                }
                if (g.frame % 4 === 0) {
                    g.parts.push({
                        x: px + (Math.random() - 0.5) * 6, y: FLOOR_Y + 32,
                        vx: (Math.random() - 0.5) * 0.5, vy: 2.5, a: 0.5, sz: 5 + Math.random() * 4,
                        c: `rgba(100,80,160,0.3)`
                    });
                }
            }

            g.laneX += (LANE_OFF[g.tLane] - g.laneX) * 0.14;

            if (g.shakeDecay > 0) {
                g.shakeX = (Math.random() - 0.5) * g.shakeDecay * 0.8;
                g.shakeY = (Math.random() - 0.5) * g.shakeDecay * 0.5;
                g.shakeDecay *= 0.88;
                if (g.shakeDecay < 0.5) g.shakeDecay = 0;
            }

            g.parts = g.parts.filter(p => p.a > 0);
            g.parts.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.a -= 0.016; });

            g.codeParticles.forEach(cp => {
                cp.x -= cp.speed;
                if (cp.x < -20) { cp.x = W + 20; cp.y = Math.random() * HORIZON * 0.8; }
            });

            ctx.save();
            ctx.translate(g.shakeX, g.shakeY);

            const sky = ctx.createLinearGradient(0, 0, 0, HORIZON + 50);
            sky.addColorStop(0, "#020208");
            sky.addColorStop(0.3, "#06061a");
            sky.addColorStop(0.7, "#0c0c28");
            sky.addColorStop(1, "#14143a");
            ctx.fillStyle = sky; ctx.fillRect(0, 0, W, HORIZON + 50);

            const aPhase = g.auroraPhase || 0;
            for (let i = 0; i < 3; i++) {
                const ax = W / 2 + Math.sin(aPhase + i * 2) * 120;
                const ag = ctx.createRadialGradient(ax, HORIZON - 10, 0, ax, HORIZON - 10, 160);
                const aColors = ["rgba(139,92,246,", "rgba(59,130,246,", "rgba(20,184,166,"];
                ag.addColorStop(0, aColors[i] + "0.08)");
                ag.addColorStop(0.5, aColors[i] + "0.03)");
                ag.addColorStop(1, "transparent");
                ctx.fillStyle = ag; ctx.fillRect(0, 0, W, HORIZON + 30);
            }

            g.stars.forEach(st => {
                const twinkle = Math.sin((g.frame || 0) * st.twinkleSpeed + st.phase);
                const alpha = st.a + twinkle * 0.2;
                if (alpha > 0) {
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = "#fff";
                    ctx.beginPath(); ctx.arc(st.x, st.y, st.sz, 0, Math.PI * 2); ctx.fill();
                    if (!IS_MOBILE && st.sz > 1.2) {
                        ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.3})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath(); ctx.moveTo(st.x - st.sz * 2, st.y); ctx.lineTo(st.x + st.sz * 2, st.y); ctx.stroke();
                        ctx.beginPath(); ctx.moveTo(st.x, st.y - st.sz * 2); ctx.lineTo(st.x, st.y + st.sz * 2); ctx.stroke();
                    }
                }
            });
            ctx.globalAlpha = 1;

            g.codeParticles.forEach(cp => {
                ctx.globalAlpha = cp.a;
                ctx.fillStyle = "#a78bfa";
                ctx.font = `${cp.sz}px 'Courier New',monospace`;
                ctx.fillText(cp.char, cp.x, cp.y);
            });
            ctx.globalAlpha = 1;

            g.buildingsFar.forEach(b => {
                const by = HORIZON + 5;
                ctx.fillStyle = "rgba(15,10,30,0.95)";
                ctx.fillRect(b.x, by - b.h, b.w, b.h + 10);
                if (b.hasAntenna) {
                    ctx.strokeStyle = "rgba(100,80,160,0.4)";
                    ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(b.x + b.w / 2, by - b.h); ctx.lineTo(b.x + b.w / 2, by - b.h - b.antennaH); ctx.stroke();
                    if (Math.sin((g.frame || 0) * 0.05 + b.x) > 0.3) {
                        ctx.fillStyle = "#ef4444";
                        ctx.beginPath(); ctx.arc(b.x + b.w / 2, by - b.h - b.antennaH, 1.5, 0, Math.PI * 2); ctx.fill();
                    }
                }
                for (let wy = by - b.h + 4; wy < by; wy += 6) {
                    for (let wx = b.x + 2; wx < b.x + b.w - 2; wx += 5) {
                        const wAlpha = 0.08 + Math.sin((g.frame || 0) * 0.01 + wx + wy) * 0.05;
                        ctx.fillStyle = b.windowColor + wAlpha + ")";
                        ctx.fillRect(wx, wy, 2, 3);
                    }
                }
            });

            g.buildingsNear.forEach(b => {
                const by = HORIZON + 12;
                ctx.fillStyle = "rgba(10,8,22,0.97)";
                ctx.fillRect(b.x, by - b.h, b.w, b.h + 15);
                ctx.fillStyle = "rgba(139,92,246,0.1)";
                ctx.fillRect(b.x, by - b.h, b.w, 2);
                if (b.hasAntenna) {
                    ctx.strokeStyle = "rgba(139,92,246,0.3)";
                    ctx.lineWidth = 1.5;
                    ctx.beginPath(); ctx.moveTo(b.x + b.w / 2, by - b.h); ctx.lineTo(b.x + b.w / 2, by - b.h - b.antennaH); ctx.stroke();
                    if (Math.sin((g.frame || 0) * 0.04 + b.x) > 0) {
                        ctx.fillStyle = "#ef4444";
                        if (!IS_MOBILE) { ctx.shadowColor = "#ef4444"; ctx.shadowBlur = 6; }
                        ctx.beginPath(); ctx.arc(b.x + b.w / 2, by - b.h - b.antennaH, 2, 0, Math.PI * 2); ctx.fill();
                        ctx.shadowBlur = 0;
                    }
                }
                if (b.neonSign) {
                    ctx.fillStyle = b.neonColor;
                    if (!IS_MOBILE) { ctx.shadowColor = b.neonColor; ctx.shadowBlur = 8; }
                    ctx.fillRect(b.x + 3, by - b.h * 0.4, b.w - 6, 4);
                    ctx.shadowBlur = 0;
                }
                for (let wy = by - b.h + 5; wy < by; wy += 8) {
                    for (let wx = b.x + 3; wx < b.x + b.w - 3; wx += 6) {
                        const wAlpha = 0.1 + Math.sin((g.frame || 0) * 0.008 + wx * 0.5 + wy * 0.3) * 0.08;
                        ctx.fillStyle = b.windowColor + wAlpha + ")";
                        ctx.fillRect(wx, wy, 3, 4);
                    }
                }
            });

            const gnd = ctx.createLinearGradient(0, HORIZON + 10, 0, H);
            gnd.addColorStop(0, "#08081a"); gnd.addColorStop(0.3, "#0a0a1e"); gnd.addColorStop(1, "#060614");
            ctx.fillStyle = gnd; ctx.fillRect(0, HORIZON + 10, W, H - HORIZON);
            for (let z = g.gridOff; z < SPAWN_Z; z += 80) {
                const p = proj(z);
                const hw = (ROAD_W * 2) * p.s;
                const alpha = Math.min(0.3, 0.06 / p.s);
                ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
                ctx.lineWidth = Math.max(0.5, 1.5 * p.s);
                ctx.beginPath(); ctx.moveTo(W / 2 - hw, p.y); ctx.lineTo(W / 2 + hw, p.y); ctx.stroke();
            }

            for (let i = -8; i <= 8; i++) {
                const bx = W / 2 + i * (LANE_W * 0.7);
                ctx.strokeStyle = `rgba(59,130,246,${Math.abs(i) <= 2 ? 0.05 : 0.03})`;
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(W / 2, HORIZON); ctx.lineTo(bx, H); ctx.stroke();
            }

            ctx.beginPath();
            const roadTopHW = ROAD_W * 0.02;
            ctx.moveTo(W / 2 - roadTopHW, HORIZON);
            ctx.lineTo(W / 2 + roadTopHW, HORIZON);
            ctx.lineTo(W / 2 + ROAD_W / 2 + 10, H);
            ctx.lineTo(W / 2 - ROAD_W / 2 - 10, H);
            ctx.closePath();
            ctx.fillStyle = "rgba(8,8,20,0.6)";
            ctx.fill();

            for (let side = -1; side <= 1; side += 2) {
                const bx = W / 2 + side * (ROAD_W / 2 + 5);
                const grad = ctx.createLinearGradient(0, HORIZON, 0, H);
                grad.addColorStop(0, "rgba(139,92,246,0)");
                grad.addColorStop(0.3, "rgba(139,92,246,0.4)");
                grad.addColorStop(1, "rgba(139,92,246,0.6)");
                ctx.strokeStyle = grad;
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(W / 2, HORIZON); ctx.lineTo(bx, H); ctx.stroke();
            }

            for (let side = -1; side <= 1; side += 2) {
                for (let z = g.gridOff; z < SPAWN_Z; z += 80) {
                    const p1 = proj(z);
                    const p2 = proj(z + 30);
                    const lx1 = p1.x(side * LANE_W / 2);
                    const lx2 = p2.x(side * LANE_W / 2);
                    ctx.strokeStyle = `rgba(139,92,246,${Math.min(0.25, 0.05 / p1.s)})`;
                    ctx.lineWidth = Math.max(0.5, 2 * p1.s);
                    ctx.beginPath(); ctx.moveTo(lx1, p1.y); ctx.lineTo(lx2, p2.y); ctx.stroke();
                }
            }

            g.sideStructures.forEach(ss => {
                if (ss.z < 0 || ss.z > SPAWN_Z) return;
                const p = proj(ss.z);
                const sx = p.x(ss.side * (ROAD_W / 2 + 30));
                const h = ss.h * p.s;
                ctx.strokeStyle = `rgba(100,80,160,${0.3 * p.s})`;
                ctx.lineWidth = Math.max(1, 3 * p.s);
                ctx.beginPath(); ctx.moveTo(sx, p.y); ctx.lineTo(sx, p.y - h); ctx.stroke();
                ctx.fillStyle = `rgba(139,92,246,${0.4 * p.s})`;
                if (!IS_MOBILE) { ctx.shadowColor = "#8b5cf6"; ctx.shadowBlur = 8 * p.s; }
                ctx.beginPath(); ctx.arc(sx, p.y - h, 3 * p.s, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;
            });

            const drawables = [
                ...g.obs.map(o => ({ ...o, kind: "obs" })),
                ...g.cols.map(c => ({ ...c, kind: "col" })),
            ].sort((a, b) => b.z - a.z);

            drawables.forEach(d => {
                if (d.z < -60 || d.z > SPAWN_Z) return;
                const p = proj(d.z);
                const cx = p.x(LANE_OFF[d.lane]);
                const sz = 30 * p.s;

                if (d.kind === "obs") {
                    const labels = ["400", "401", "403", "404", "500", "502", "503", "BUG", "NULL", "NaN"];
                    const label = labels[Math.abs(Math.floor(d.z + d.lane * 100)) % labels.length];
                    const colors = [["#ef4444", "#dc2626", "#991b1b"], ["#f97316", "#ea580c", "#9a3412"], ["#ec4899", "#db2777", "#9d174d"]];
                    const oc = colors[d.type] || colors[0];
                    ctx.save();
                    if (!IS_MOBILE) { ctx.shadowColor = oc[0]; ctx.shadowBlur = 15 * p.s; }
                    ctx.fillStyle = oc[0];
                    ctx.beginPath();
                    ctx.moveTo(cx - sz, p.y - sz * 1.3); ctx.lineTo(cx, p.y - sz * 1.9);
                    ctx.lineTo(cx + sz, p.y - sz * 1.3); ctx.lineTo(cx, p.y - sz * 0.7);
                    ctx.closePath(); ctx.fill();
                    ctx.fillStyle = oc[1];
                    ctx.beginPath();
                    ctx.moveTo(cx - sz, p.y - sz * 1.3); ctx.lineTo(cx, p.y - sz * 0.7);
                    ctx.lineTo(cx, p.y + sz * 0.2); ctx.lineTo(cx - sz, p.y - sz * 0.4);
                    ctx.closePath(); ctx.fill();
                    ctx.fillStyle = oc[2];
                    ctx.beginPath();
                    ctx.moveTo(cx + sz, p.y - sz * 1.3); ctx.lineTo(cx, p.y - sz * 0.7);
                    ctx.lineTo(cx, p.y + sz * 0.2); ctx.lineTo(cx + sz, p.y - sz * 0.4);
                    ctx.closePath(); ctx.fill();
                    ctx.strokeStyle = `rgba(255,255,255,${0.2 * p.s})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(cx - sz, p.y - sz * 1.3); ctx.lineTo(cx, p.y - sz * 1.9); ctx.lineTo(cx + sz, p.y - sz * 1.3);
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = "rgba(255,255,255,0.9)";
                    ctx.font = `bold ${Math.max(7, sz * 0.5)}px 'Courier New',monospace`;
                    ctx.textAlign = "center"; ctx.textBaseline = "middle";
                    ctx.fillText(label, cx, p.y - sz * 0.75);
                    if (p.s > 0.15) {
                        for (let gl = 0; gl < 2; gl++) {
                            const gy = p.y - sz * (0.5 + Math.random() * 0.8);
                            ctx.fillStyle = `rgba(255,255,255,${0.06 * p.s})`;
                            ctx.fillRect(cx - sz, gy, sz * 2, 1);
                        }
                    }
                    ctx.fillStyle = `rgba(${d.type === 0 ? '239,68,68' : d.type === 1 ? '249,115,22' : '236,72,153'},${0.12 * p.s})`;
                    const sw = sz * 1.8;
                    ctx.beginPath(); ctx.ellipse(cx, p.y + sz * 0.2, sw, sz * 0.25, 0, 0, Math.PI * 2); ctx.fill();
                    ctx.restore();
                } else {
                    const sym = COLS[d.ci];
                    const rot = d.rot || 0;
                    ctx.save();
                    ctx.shadowColor = sym.color; ctx.shadowBlur = 20 * p.s;
                    ctx.strokeStyle = sym.color + "66";
                    ctx.lineWidth = 1.5 * p.s;
                    ctx.beginPath(); ctx.arc(cx, p.y - sz, sz * 1.1, 0, Math.PI * 2); ctx.stroke();
                    ctx.strokeStyle = sym.color;
                    ctx.lineWidth = 2 * p.s;
                    ctx.beginPath(); ctx.arc(cx, p.y - sz, sz * 1.1, rot, rot + Math.PI * 0.8); ctx.stroke();
                    const ig = ctx.createRadialGradient(cx, p.y - sz, 0, cx, p.y - sz, sz * 0.85);
                    ig.addColorStop(0, sym.color + "44"); ig.addColorStop(0.6, sym.color + "18"); ig.addColorStop(1, "transparent");
                    ctx.fillStyle = ig;
                    ctx.beginPath(); ctx.arc(cx, p.y - sz, sz * 0.85, 0, Math.PI * 2); ctx.fill();
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = sym.color;
                    ctx.font = `bold ${Math.max(8, sz * 0.7)}px sans-serif`;
                    ctx.textAlign = "center"; ctx.textBaseline = "middle";
                    ctx.fillText(sym.label, cx, p.y - sz);
                    ctx.fillStyle = sym.color + "15";
                    ctx.beginPath(); ctx.ellipse(cx, p.y + sz * 0.15, sz * 0.9, sz * 0.2, 0, 0, Math.PI * 2); ctx.fill();
                    ctx.restore();
                }
            });

            const px = W / 2 + g.laneX;
            const py = FLOOR_Y - 6;
            const cw = 22, ch = 44;
            const carScale = 0.55;
            ctx.save();
            ctx.translate(px, py);
            ctx.scale(carScale, carScale);
            ctx.translate(-px, -py);

            const ugGrad = ctx.createRadialGradient(px, py, 5, px, py, 40);
            ugGrad.addColorStop(0, "rgba(139,92,246,0.3)"); ugGrad.addColorStop(1, "transparent");
            ctx.fillStyle = ugGrad;
            ctx.beginPath(); ctx.ellipse(px, py + 5, 30, 18, 0, 0, Math.PI * 2); ctx.fill();

            ctx.save();
            ctx.globalAlpha = 0.08;
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.moveTo(px - 10, py - ch); ctx.lineTo(px - 18, py - ch - 45); ctx.lineTo(px - 2, py - ch);
            ctx.closePath(); ctx.fill();
            ctx.beginPath();
            ctx.moveTo(px + 10, py - ch); ctx.lineTo(px + 18, py - ch - 45); ctx.lineTo(px + 2, py - ch);
            ctx.closePath(); ctx.fill();
            ctx.restore();

            ctx.fillStyle = "rgba(0,0,0,0.35)";
            ctx.beginPath(); ctx.ellipse(px, py + 6, cw + 4, 8, 0, 0, Math.PI * 2); ctx.fill();

            ctx.shadowColor = "#8b5cf6"; ctx.shadowBlur = 18;
            const bodyGrad = ctx.createLinearGradient(px, py - ch, px, py + ch);
            bodyGrad.addColorStop(0, "#7c3aed"); bodyGrad.addColorStop(0.35, "#6d28d9");
            bodyGrad.addColorStop(0.65, "#5b21b6"); bodyGrad.addColorStop(1, "#4c1d95");
            ctx.fillStyle = bodyGrad;
            ctx.beginPath();
            ctx.moveTo(px - cw + 6, py - ch);
            ctx.quadraticCurveTo(px, py - ch - 8, px + cw - 6, py - ch);
            ctx.lineTo(px + cw, py - ch + 12);
            ctx.lineTo(px + cw, py + ch - 10);
            ctx.quadraticCurveTo(px + cw - 2, py + ch, px + cw - 8, py + ch);
            ctx.lineTo(px - cw + 8, py + ch);
            ctx.quadraticCurveTo(px - cw + 2, py + ch, px - cw, py + ch - 10);
            ctx.lineTo(px - cw, py - ch + 12);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.strokeStyle = "rgba(167,139,250,0.4)";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = "rgba(255,255,255,0.12)";
            ctx.fillRect(px - 3, py - ch + 4, 6, ch * 2 - 8);

            ctx.fillStyle = "rgba(100,180,255,0.3)";
            ctx.strokeStyle = "rgba(150,200,255,0.4)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(px - cw + 5, py - ch + 14);
            ctx.lineTo(px + cw - 5, py - ch + 14);
            ctx.lineTo(px + cw - 8, py - 8);
            ctx.lineTo(px - cw + 8, py - 8);
            ctx.closePath();
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = "rgba(255,255,255,0.08)";
            ctx.beginPath();
            ctx.moveTo(px - 6, py - ch + 15); ctx.lineTo(px + 2, py - ch + 15);
            ctx.lineTo(px - 2, py - 9); ctx.lineTo(px - 10, py - 9);
            ctx.closePath(); ctx.fill();

            ctx.fillStyle = "rgba(80,140,220,0.2)";
            ctx.beginPath();
            ctx.moveTo(px - cw + 10, py + 10);
            ctx.lineTo(px + cw - 10, py + 10);
            ctx.lineTo(px + cw - 7, py + ch - 14);
            ctx.lineTo(px - cw + 7, py + ch - 14);
            ctx.closePath();
            ctx.fill();

            const wheelW = 7, wheelH = 14;
            const wheels = [
                { x: px - cw - 2, y: py - 22 },
                { x: px + cw - wheelW + 2, y: py - 22 },
                { x: px - cw - 2, y: py + 16 },
                { x: px + cw - wheelW + 2, y: py + 16 },
            ];
            wheels.forEach(wh => {
                ctx.fillStyle = "#1a1a2e";
                ctx.beginPath(); ctx.roundRect(wh.x, wh.y, wheelW, wheelH, 2); ctx.fill();
                ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 0.8;
                for (let ty = wh.y + 2; ty < wh.y + wheelH - 1; ty += 3) {
                    ctx.beginPath(); ctx.moveTo(wh.x + 1, ty); ctx.lineTo(wh.x + wheelW - 1, ty); ctx.stroke();
                }
                ctx.fillStyle = "rgba(139,92,246,0.2)";
                ctx.fillRect(wh.x + 2, wh.y + 4, wheelW - 4, wheelH - 8);
            });

            ctx.fillStyle = "#5b21b6";
            ctx.fillRect(px - cw - 4, py - 16, 4, 5);
            ctx.fillRect(px + cw, py - 16, 4, 5);
            ctx.fillStyle = "rgba(167,139,250,0.4)";
            ctx.fillRect(px - cw - 4, py - 16, 4, 2);
            ctx.fillRect(px + cw, py - 16, 4, 2);

            ctx.fillStyle = "#fff";
            ctx.shadowColor = "#fff"; ctx.shadowBlur = 12;
            ctx.beginPath(); ctx.ellipse(px - 12, py - ch + 2, 4, 2.5, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(px + 12, py - ch + 2, 4, 2.5, 0, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;

            ctx.fillStyle = "#ef4444";
            ctx.shadowColor = "#ef4444"; ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.ellipse(px - 12, py + ch - 2, 5, 2, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(px + 12, py + ch - 2, 5, 2, 0, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;

            ctx.fillStyle = "rgba(139,92,246,0.15)";
            ctx.beginPath(); ctx.roundRect(px - 10, py - 6, 20, 16, 4); ctx.fill();

            ctx.restore();

            g.speedLines.forEach(sl => {
                ctx.save();
                ctx.globalAlpha = sl.a;
                ctx.strokeStyle = "rgba(139,92,246,0.6)";
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(sl.x, sl.y); ctx.lineTo(sl.x, sl.y - sl.len); ctx.stroke();
                ctx.restore();
            });

            g.parts.forEach(p => {
                ctx.save();
                ctx.globalAlpha = Math.max(0, p.a);
                ctx.shadowColor = p.c; ctx.shadowBlur = 4;
                ctx.fillStyle = p.c;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.sz / 2, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
            });

            if (g.started) {
                ctx.save();
                ctx.font = 'bold 20px "Mona Sans",sans-serif';
                ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.textAlign = "left";
                ctx.fillText(`Score: ${g.score + Math.floor(g.dist / 10)}`, 18, 34);
                ctx.textAlign = "right";
                ctx.font = '600 14px "Mona Sans",sans-serif';
                ctx.fillStyle = "rgba(255,255,255,0.45)";
                ctx.fillText(`${g.speed.toFixed(1)}x`, W - 18, 34);
                const barW = 60, barX = W - 18 - barW, barY = 40;
                ctx.fillStyle = "rgba(255,255,255,0.06)";
                ctx.fillRect(barX, barY, barW, 4);
                const fill = Math.min(1, (g.speed - 4.5) / 10);
                const barGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
                barGrad.addColorStop(0, "#8b5cf6"); barGrad.addColorStop(1, "#ef4444");
                ctx.fillStyle = barGrad;
                ctx.fillRect(barX, barY, barW * fill, 4);
                ctx.restore();
            }

            if (!g.started && !g.over) {
                ctx.save();
                ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.fillRect(0, 0, W, H);
                ctx.textAlign = "center";
                ctx.font = 'bold 40px "Mona Sans",sans-serif';
                const tg2 = ctx.createLinearGradient(W / 2 - 120, 0, W / 2 + 120, 0);
                tg2.addColorStop(0, "#c4b5fd"); tg2.addColorStop(0.5, "#a78bfa"); tg2.addColorStop(1, "#60a5fa");
                ctx.fillStyle = tg2;
                ctx.shadowColor = "#8b5cf6"; ctx.shadowBlur = 30;
                ctx.fillText("Code Runner", W / 2, H / 2 - 55);
                ctx.shadowBlur = 0;
                ctx.font = '14px "Mona Sans",sans-serif';
                ctx.fillStyle = "rgba(255,255,255,0.45)";
                ctx.fillText("← → Arrow keys · Swipe on mobile", W / 2, H / 2 + 5);
                ctx.font = '16px "Mona Sans",sans-serif';
                ctx.fillStyle = "rgba(255,255,255,0.55)";
                ctx.fillText("Click or press Space to start", W / 2, H / 2 + 40);
                const ab = Math.sin(Date.now() * 0.004) * 6;
                ctx.fillStyle = "rgba(167,139,250,0.4)";
                ctx.font = "22px sans-serif";
                ctx.fillText("▼", W / 2, H / 2 + 75 + ab);
                ctx.restore();
            }

            if (g.over) {
                ctx.save();
                const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.7);
                vig.addColorStop(0, "rgba(0,0,0,0.3)"); vig.addColorStop(1, "rgba(0,0,0,0.7)");
                ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);
                ctx.textAlign = "center";
                ctx.font = 'bold 38px "Mona Sans",sans-serif';
                ctx.fillStyle = "#f87171"; ctx.shadowColor = "#ef4444"; ctx.shadowBlur = 25;
                ctx.fillText("Game Over", W / 2, H / 2 - 60);
                ctx.shadowBlur = 0;
                ctx.font = 'bold 58px "Mona Sans",sans-serif';
                ctx.fillStyle = "#fff";
                ctx.fillText(g.score + Math.floor(g.dist / 10), W / 2, H / 2 + 10);
                ctx.font = '14px "Mona Sans",sans-serif';
                ctx.fillStyle = "rgba(255,255,255,0.35)";
                ctx.fillText("points", W / 2, H / 2 + 35);
                ctx.font = '15px "Mona Sans",sans-serif';
                ctx.fillStyle = "rgba(255,255,255,0.5)";
                ctx.fillText("Tap to play again", W / 2, H / 2 + 85);
                ctx.restore();
            }

            ctx.restore();
            afRef.current = requestAnimationFrame(render);
        };

        afRef.current = requestAnimationFrame(render);
        return () => { if (afRef.current) cancelAnimationFrame(afRef.current); };
    }, [init]);

    return (
        <section id="game" ref={sectionRef} className="cr-section relative overflow-hidden">
            <div className="cr-orb cr-orb1" />
            <div className="cr-orb cr-orb2" />
            <div className="relative z-10 w-full max-w-6xl mx-auto px-5 md:px-10 py-20 md:py-32">
                <TitleHeader title={<>Code <span className="text-purple-accent gradient-text">Runner</span></>} />
                <p className="text-center text-white-50 mt-4 mb-6 md:text-lg max-w-xl mx-auto">
                    Dodge bugs and collect tech icons in a neon cyberpunk city!
                </p>
                <div className="cr-stats">
                    <div className="cr-stat"><span className="cr-stat-l">Score</span><span className="cr-stat-v">{score + dist}</span></div>
                    <div className="cr-stat cr-stat-hi"><span className="cr-stat-l">Best</span><span className="cr-stat-v">🏆 {hi}</span></div>
                </div>
                <div className="cr-canvas-wrap" onClick={handleAction} onTouchStart={onTS} onTouchEnd={onTE}>
                    <canvas ref={canvasRef} width={W} height={H} className="cr-canvas" />
                </div>
                <div className="cr-mobile-btns">
                    <button className="cr-mbtn" onClick={moveLeft} aria-label="Move left">←</button>
                    <button className="cr-mbtn cr-mbtn-go" onClick={handleAction} aria-label="Start">▶</button>
                    <button className="cr-mbtn" onClick={moveRight} aria-label="Move right">→</button>
                </div>
                <p className="text-center text-white-50/40 mt-4 text-sm cr-desktop-hint">
                    <kbd className="cr-kbd">←</kbd> <kbd className="cr-kbd">→</kbd> to dodge &nbsp;·&nbsp; <kbd className="cr-kbd">Space</kbd> to start
                </p>
            </div>
        </section>
    );
};

export default GameSection;
