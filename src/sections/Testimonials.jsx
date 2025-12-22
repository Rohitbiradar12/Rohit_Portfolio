import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonials } from "../constants";
import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // Cards entrance animation
    gsap.fromTo(
      ".testimonial-card",
      {
        y: 80,
        opacity: 0,
        scale: 0.95,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".testimonials-grid",
          start: "top 85%",
        },
      }
    );

    // Quote marks animation
    gsap.fromTo(
      ".quote-icon",
      { scale: 0, rotation: -180 },
      {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.3,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".testimonials-grid",
          start: "top 85%",
        },
      }
    );

    // Stars animation
    gsap.fromTo(
      ".testimonial-star",
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: 0.05,
        delay: 0.5,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".testimonials-grid",
          start: "top 85%",
        },
      }
    );
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative overflow-hidden py-20 md:py-32"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
        {/* Header */}
        <TitleHeader
          title="What People Say About Me"
          sub="⭐ Words from Colleagues"
        />

        {/* Testimonials Grid */}
        <div className="testimonials-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card group relative"
            >
              {/* Card Glow on Hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500/30 via-blue-500/20 to-purple-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Main Card */}
              <div className="relative h-full bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 hover:border-purple-500/40 transition-all duration-500 flex flex-col">

                {/* Top Row: Quote Icon + Stars */}
                <div className="flex items-center justify-between mb-5">
                  {/* Quote Icon */}
                  <div className="quote-icon relative">
                    <div className="absolute inset-0 bg-purple-500/30 blur-md rounded-lg" />
                    <div className="relative w-10 h-10 bg-gradient-to-br from-purple-500/40 to-purple-600/30 rounded-lg border border-purple-500/40 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-purple-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="testimonial-star w-4 h-4"
                        fill="#FBBF24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-white-50 text-base leading-relaxed flex-grow mb-6 group-hover:text-white/90 transition-colors duration-300">
                  "{testimonial.review}"
                </p>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent mb-5" />

                {/* Author Section */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/50 to-blue-500/50 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-purple-400/50 transition-colors duration-300">
                      <img
                        src={testimonial.imgPath}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Author Info */}
                  <div className="min-w-0">
                    <h4 className="font-semibold text-white text-base truncate group-hover:text-purple-300 transition-colors duration-300">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-purple-300/70 truncate">
                      {testimonial.mentions}
                    </p>
                  </div>
                </div>

                {/* Shimmer Effect on Hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-x-full group-hover:translate-x-full pointer-events-none" style={{ transitionDuration: '1s' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-white-50 text-lg mb-6">
            Want to work together?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30"
          >
            Let's Connect
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;