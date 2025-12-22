import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { expCards } from "../constants";
import TitleHeader from "../components/TitleHeader";
import GlowCard from "../components/GlowCard";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef(null);
  const progressLineRef = useRef(null);

  useGSAP(() => {
    // Scroll-animated progress line
    if (progressLineRef.current) {
      gsap.fromTo(
        progressLineRef.current,
        {
          scaleY: 0,
          transformOrigin: "top center",
        },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".experience-content",
            start: "top center",
            end: "bottom center",
            scrub: 1,
          },
        }
      );
    }

    // Enhanced card entrance animation
    gsap.utils.toArray(".exp-card-wrapper").forEach((card) => {
      gsap.from(card, {
        xPercent: -50,
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
        },
      });
    });

    // Content fade-in
    gsap.utils.toArray(".expText").forEach((text) => {
      gsap.from(text, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: text,
          start: "top 70%",
        },
      });
    });

    // Floating logo animation
    gsap.utils.toArray(".company-logo-float").forEach((logo) => {
      gsap.to(logo, {
        y: -8,
        duration: 2.5,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      });
    });
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative flex-center md:mt-40 mt-20 section-padding xl:px-0 overflow-hidden"
    >
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full h-full md:px-20 px-5">
        <TitleHeader
          title="Professional Work Experience"
          sub="💼 My Career Overview"
        />

        {/* Scroll-Animated Timeline Container */}
        <div className="mt-32 relative experience-content">
          {/* Global Vertical Timeline Line (Hidden on mobile) */}
          <div className="absolute left-[18%] xl:left-[34%] top-0 bottom-0 hidden md:block pointer-events-none z-10">
            <div className="relative w-0.5 h-full">
              {/* Static background line */}
              <div className="absolute inset-0 w-full bg-gradient-to-b from-transparent via-purple-500/10 to-transparent" />

              {/* Animated progress line */}
              <div
                ref={progressLineRef}
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-500 via-purple-400 to-purple-300 shadow-lg shadow-purple-500/50"
                style={{ transformOrigin: "top center" }}
              />

              {/* Glowing dot at bottom */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <div className="w-3 h-3 bg-purple-400 rounded-full shadow-xl shadow-purple-500/70 animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-75" />
              </div>
            </div>
          </div>

          <div className="relative z-50 xl:space-y-32 space-y-16">
            {expCards.map((card, cardIndex) => (
              <div key={card.title} className="exp-card-wrapper group">
                {/* Left: Original Image Card */}
                <div className="xl:w-2/6">
                  <GlowCard card={card}>
                    <div className="relative overflow-hidden rounded-2xl group/img">
                      {/* Multi-layer gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none z-10 opacity-80 group-hover/img:opacity-60 transition-opacity duration-700" />

                      {/* Purple tint overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/20 pointer-events-none z-10 mix-blend-overlay opacity-50 group-hover/img:opacity-70 transition-opacity duration-700" />

                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover/img:translate-x-full pointer-events-none z-20" />

                      {/* Vignette */}
                      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none z-10" />

                      {/* Main Image */}
                      <img
                        src={card.imgPath}
                        alt="experience showcase"
                        className="rounded-2xl w-full h-full object-cover transform group-hover/img:scale-105 transition-transform duration-700"
                      />

                      {/* Bottom gradient */}
                      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-10" />

                      {/* Corner glow */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none opacity-0 group-hover/img:opacity-100 transition-opacity duration-700" />
                    </div>
                  </GlowCard>
                </div>

                {/* Right: Content Section */}
                <div className="xl:w-4/6">
                  <div className="flex items-start">
                    <div className="expText flex xl:gap-20 md:gap-10 gap-6 relative z-20 flex-1">
                      {/* Circular Company Logo Container */}
                      <div className="company-logo-float flex-shrink-0 relative">
                        <div className="relative group/logo">
                          {/* Outer glow ring - animated */}
                          <div className="absolute -inset-6 bg-gradient-to-br from-purple-500/30 via-blue-500/20 to-purple-500/30 rounded-full blur-2xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-700 animate-pulse" />

                          {/* Middle glow layer */}
                          <div className="absolute -inset-3 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-xl opacity-60 group-hover/logo:opacity-100 transition-opacity duration-500" />

                          {/* Premium circular glass container */}
                          <div className="relative w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-white/[0.12] via-white/[0.08] to-white/[0.04] backdrop-blur-xl border-2 border-white/20 rounded-full hover:border-purple-400/50 transition-all duration-500 shadow-2xl hover:shadow-purple-500/30 overflow-hidden flex items-center justify-center group-hover/logo:scale-105">
                            {/* Animated background pattern */}
                            <div className="absolute inset-0 opacity-30">
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),transparent_70%)]" />
                            </div>

                            {/* Rotating shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/logo:opacity-100 transition-opacity duration-700 transform rotate-45 group-hover/logo:rotate-[405deg] transition-transform duration-[2s]" />

                            {/* Logo Image - circular crop */}
                            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent">
                              <img
                                src={card.logoPath}
                                alt="company logo"
                                className="w-full h-full object-contain p-2 relative z-10 transform group-hover/logo:scale-110 transition-transform duration-500 rounded-full"
                                style={{
                                  filter: 'brightness(1.2) contrast(1.1) saturate(1.2) drop-shadow(0 2px 12px rgba(139, 92, 246, 0.5))',
                                }}
                              />
                            </div>

                            {/* Inner circular reflection */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-full" />

                            {/* Orbital ring effect */}
                            <div className="absolute inset-0 rounded-full border border-white/10 group-hover/logo:border-purple-400/30 transition-colors duration-500" />
                          </div>

                          {/* Decorative orbiting dots */}
                          <div className="absolute top-0 right-0 w-2 h-2 bg-purple-400 rounded-full blur-[2px] opacity-70 group-hover/logo:opacity-100 animate-pulse transition-opacity" />
                          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-blue-400 rounded-full blur-[2px] opacity-70 group-hover/logo:opacity-100 animate-pulse transition-opacity" style={{ animationDelay: '0.5s' }} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        {/* Title with premium gradient */}
                        <h1 className="font-bold text-2xl md:text-3xl xl:text-4xl mb-4 relative inline-block">
                          <span className="bg-gradient-to-r from-white via-white to-purple-200 bg-clip-text text-transparent hover:from-purple-300 hover:via-white hover:to-blue-300 transition-all duration-700">
                            {card.title}
                          </span>
                          <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-700" />
                        </h1>

                        {/* Date with enhanced icon */}
                        <div className="flex items-center gap-3 mb-6">
                          <div className="relative">
                            <div className="absolute inset-0 bg-purple-500/30 rounded-lg blur-md" />
                            <div className="relative w-9 h-9 bg-gradient-to-br from-purple-500/30 to-purple-600/20 rounded-lg flex items-center justify-center border border-purple-500/40 shadow-lg">
                              <span className="text-lg">🗓️</span>
                            </div>
                          </div>
                          <p className="text-purple-300 font-semibold text-base md:text-lg">
                            {card.date}
                          </p>
                        </div>

                        {/* Premium animated divider */}
                        <div className="relative h-px mb-6 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/60 via-purple-400/40 to-transparent" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-50 animate-pulse" />
                          <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-purple-400 to-transparent blur-sm" />
                        </div>

                        {/* Responsibilities header */}
                        <div className="flex items-center gap-3 mb-5">
                          <div className="relative">
                            <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-md" />
                            <div className="relative w-1.5 h-7 bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600 rounded-full shadow-lg shadow-purple-500/50" />
                          </div>
                          <p className="text-purple-300 font-bold text-base md:text-lg tracking-wide">
                            Key Responsibilities
                          </p>
                        </div>

                        {/* Enhanced list */}
                        <ul className="space-y-4">
                          {card.responsibilities.map((responsibility, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-4 group/item transform hover:translate-x-1 transition-transform duration-300"
                            >
                              {/* Premium bullet point */}
                              <div className="flex-shrink-0 relative mt-1">
                                <div className="absolute inset-0 bg-purple-500/20 rounded-lg blur-md opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />

                                <div className="relative w-6 h-6 bg-gradient-to-br from-purple-500/40 via-purple-500/30 to-purple-600/20 rounded-lg flex items-center justify-center border border-purple-500/40 group-hover/item:border-purple-400/70 group-hover/item:from-purple-500/50 group-hover/item:to-purple-600/40 group-hover/item:shadow-lg group-hover/item:shadow-purple-500/40 transition-all duration-300 overflow-hidden">
                                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                                  <div className="w-2 h-2 bg-purple-400 rounded-sm shadow-sm relative z-10" />
                                </div>
                              </div>

                              {/* Text */}
                              <p className="text-white-50 text-base md:text-lg leading-relaxed group-hover/item:text-white group-hover/item:translate-x-0.5 transition-all duration-300">
                                {responsibility}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;