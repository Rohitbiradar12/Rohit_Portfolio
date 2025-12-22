import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonials } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ".testimonials-header > *",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      }
    );

    gsap.fromTo(
      ".testimonial-card",
      {
        y: 80,
        opacity: 0,
        scale: 0.9,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".testimonials-grid",
          start: "top 85%",
        },
      }
    );

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
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="testimonials-section relative overflow-hidden py-20 md:py-32"
    >
      <div className="testimonials-bg-gradient" />
      <div className="testimonials-orb testimonials-orb-1" />
      <div className="testimonials-orb testimonials-orb-2" />
      <div className="testimonials-grid-pattern" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
        <div className="testimonials-header flex flex-col items-center gap-5 mb-16">
          <div className="hero-badge">
            <p>⭐ Words from Colleagues</p>
          </div>
          <h2 className="font-bold md:text-5xl text-3xl text-center">
            What People <span className="gradient-text">Say About Me</span>
          </h2>
          <p className="text-white-50 text-center max-w-2xl text-lg">
            Feedback from amazing people I've had the pleasure of working with
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card group">
              <div className="testimonial-card-glow" />
              <div className="testimonial-card-border" />
              <div className="testimonial-card-inner">
                <div className="quote-icon">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 7H7C5.89543 7 5 7.89543 5 9V13C5 14.1046 5.89543 15 7 15H9C10.1046 15 11 15.8954 11 17V17C11 18.1046 10.1046 19 9 19H8"
                      stroke="url(#gradient1)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M19 7H15C13.8954 7 13 7.89543 13 9V13C13 14.1046 13.8954 15 15 15H17C18.1046 15 19 15.8954 19 17V17C19 18.1046 18.1046 19 17 19H16"
                      stroke="url(#gradient2)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient1" x1="5" y1="7" x2="11" y2="19">
                        <stop stopColor="#8B5CF6" />
                        <stop offset="1" stopColor="#3B82F6" />
                      </linearGradient>
                      <linearGradient id="gradient2" x1="13" y1="7" x2="19" y2="19">
                        <stop stopColor="#8B5CF6" />
                        <stop offset="1" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <p className="testimonial-text">{testimonial.review}</p>

                <div className="testimonial-divider" />

                <div className="testimonial-author">
                  <div className="testimonial-avatar-wrapper">
                    <div className="testimonial-avatar-glow" />
                    <img
                      src={testimonial.imgPath}
                      alt={testimonial.name}
                      className="testimonial-avatar"
                    />
                    <div className="testimonial-avatar-ring" />
                  </div>
                  <div className="testimonial-author-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <p className="testimonial-role">{testimonial.mentions}</p>
                  </div>
                </div>

                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="testimonial-star"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="#FBBF24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                <div className="testimonial-shine" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
