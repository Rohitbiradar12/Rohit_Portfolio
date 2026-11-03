import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useGSAP from "../hooks/usePortfolioGSAP";
import TitleHeader from "../components/TitleHeader";
import { projects } from "../constants";
import "../styles/awards.css";

gsap.registerPlugin(ScrollTrigger);

const project = (id) => projects.find((p) => p.id === id);

const KIND = {
  Hackathon: "#f5a54b",
  Certification: "#7fb2ff",
  Award: "#f0c75e",
  Academic: "#b9a1f5",
  "Open source": "#5fd7a1",
};

const Glyph = ({ d, fill }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill={fill ? "currentColor" : "none"} stroke={fill ? "none" : "currentColor"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    {d.map((path) => <path key={path} d={path} />)}
  </svg>
);

const GLYPHS = {
  trophy: ["M8 4h8v5a4 4 0 0 1-8 0V4z", "M8 6H5.5a2 2 0 0 0 0 4H8M16 6h2.5a2 2 0 0 1 0 4H16", "M12 13v4M8.5 20h7M10 17h4l.5 3h-5l.5-3z"],
  cap: ["M2 9.5 12 5l10 4.5-10 4.5L2 9.5z", "M6 11.3v4.2c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.2", "M20.5 10.2v5.3"],
  github: ["M12 1.5C6.2 1.5 1.5 6.2 1.5 12c0 4.6 3 8.6 7.2 10 .5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.4-3.5-1.4-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.5 1.2 3.1.9.1-.7.4-1.2.7-1.4-2.3-.3-4.8-1.2-4.8-5.2 0-1.1.4-2.1 1.1-2.8-.1-.3-.5-1.4.1-2.8 0 0 .9-.3 2.9 1.1a10 10 0 0 1 5.2 0c2-1.4 2.9-1.1 2.9-1.1.6 1.4.2 2.5.1 2.8.7.7 1.1 1.7 1.1 2.8 0 4-2.5 4.9-4.8 5.2.4.3.7 1 .7 2v2.9c0 .3.2.6.7.5 4.2-1.4 7.2-5.4 7.2-10C22.5 6.2 17.8 1.5 12 1.5z"],
};

// Newest first. `media` is the row's thumbnail; `proof` links to a public record, and rows without
// one simply aren't links.
const AWARDS = [
  {
    id: "mit-bitcoin",
    title: "MIT Bitcoin Hackathon",
    issuer: "MIT Bitcoin Club",
    kind: "Hackathon",
    year: "2026",
    prize: "People's Choice",
    line: "Built CogAgent Marketplace with a teammate: an AI-agent marketplace on live Bitcoin data.",
    proof: { label: "Project", href: project(5).link },
    media: { img: project(5).img, style: "shot" },
  },
  {
    id: "hacknation",
    title: "HackNation Hackathon",
    issuer: "HackNation",
    kind: "Hackathon",
    year: "2026",
    prize: "2nd Place",
    line: "Built CallPilot with a teammate: an AI voice agent that phones providers and books appointments.",
    proof: { label: "Project", href: project(4).link },
    media: { img: project(4).img, style: "shot" },
  },
  {
    id: "azure",
    title: "Azure Fundamentals",
    issuer: "Microsoft · AZ-900",
    kind: "Certification",
    year: "2023",
    line: "Core cloud concepts, Azure services, security and governance.",
    proof: { label: "Verify", href: "https://www.credly.com/badges/37307b62-f451-4311-8fbb-9f54a518999e" },
    media: { img: "/images/logos/azure-fundamentals-badge.webp", style: "badge" },
  },
  {
    id: "innovation",
    title: "Innovation Award",
    issuer: "University hackathon",
    kind: "Award",
    year: "2022",
    line: "Recognized for an AI-powered learning-management solution.",
    media: { glyph: "trophy" },
  },
  {
    id: "deans-list",
    title: "Dean's List",
    issuer: "REVA University",
    kind: "Academic",
    line: "Recognized for academic excellence during the B.Tech in Computer Science.",
    media: { glyph: "cap" },
  },
  {
    id: "open-source",
    title: "Open Source",
    issuer: "GitHub · Rohitbiradar12",
    kind: "Open source",
    year: "Ongoing",
    line: "Public projects and contributions, from Spring Boot services to AI agents.",
    proof: { label: "Profile", href: "https://github.com/Rohitbiradar12" },
    media: { glyph: "github", fill: true },
  },
];

// A project screenshot, the real badge, or a drawn emblem for items without an image.
function Thumb({ item }) {
  const { style, glyph, fill } = item.media;
  const { img } = item.media;
  return (
    <span className={`aw-thumb is-${img ? style : "emblem"}`} aria-hidden="true">
      {img ? <img src={img} alt="" loading="lazy" decoding="async" /> : <Glyph d={GLYPHS[glyph]} fill={fill} />}
    </span>
  );
}

const Arrow = () => (
  <svg className="aw-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const Achievements = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(".aw-intro", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } });
    gsap.fromTo(".aw-rule", { scaleX: 0 }, { scaleX: 1, duration: 1.1, stagger: 0.08, ease: "power3.inOut", scrollTrigger: { trigger: ".aw-list", start: "top 85%" } });
    // clearProps: a leftover transform on the record link would shrink its whole-row click area.
    gsap.fromTo(".aw-row :is(.aw-num, .aw-thumb, .aw-main, .aw-kind, .aw-year, .aw-proof)", { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.025, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: ".aw-list", start: "top 85%" } });
  });

  return (
    <section id="achievements" ref={sectionRef} className="aw-section relative md:mt-24 mt-12">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 md:px-10 py-16 md:py-24">
        <TitleHeader title={<>Awards &amp; <span className="text-purple-accent gradient-text">Certifications</span></>} />
        <p className="aw-intro">Recognition, credentials and the work behind them. Where there's a public record, the row links to it.</p>

        <div className="aw-head" aria-hidden="true">
          <span>No.</span><span /><span>Recognition</span><span>Type</span><span>Year</span><span>Record</span>
        </div>

        <ol className="aw-list">
          {AWARDS.map((item, i) => (
            <li key={item.id} className={"aw-row" + (item.proof ? " has-proof" : "")} style={{ "--accent": KIND[item.kind] }}>
              <span className="aw-rule" aria-hidden="true" />
              <span className="aw-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <Thumb item={item} />
              <div className="aw-main">
                <div className="aw-title-row">
                  <h3 className="aw-title">{item.title}</h3>
                  {item.prize && <span className="aw-prize"><Glyph d={GLYPHS.trophy} />{item.prize}</span>}
                </div>
                <p className="aw-issuer">{item.issuer}</p>
                <p className="aw-line">{item.line}</p>
              </div>
              <div className="aw-meta">
                <span className="aw-kind"><i aria-hidden="true" />{item.kind}</span>
                <span className="aw-year">{item.year ?? "—"}</span>
              </div>
              {item.proof ? (
                <a className="aw-proof" href={item.proof.href} target="_blank" rel="noopener noreferrer" aria-label={`${item.proof.label}: ${item.title} (opens in a new tab)`}>
                  {item.proof.label}<Arrow />
                </a>
              ) : <span className="aw-proof is-none" aria-hidden="true">—</span>}
            </li>
          ))}
        </ol>
        <span className="aw-rule is-last" aria-hidden="true" />
      </div>
    </section>
  );
};

export default Achievements;
