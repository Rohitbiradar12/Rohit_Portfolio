import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const achievements = [
  {
    icon: "🏆",
    title: "Best Innovation Award",
    organization: "University Hackathon 2022",
    description: "Third place for AI-powered LMS solution",
    date: "Nov 2022",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: "📜",
    title: "Azure Certified Developer",
    organization: "Microsoft",
    description: "Associate level certification (AZ-900)",
    date: "April 2023",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: "🎓",
    title: "Dean's List",
    organization: "REVA University",
    description: "Academic excellence recognition",
    date: "2023-2024",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: "💻",
    title: "Open Source Contributor",
    organization: "GitHub",
    description: "100+ contributions to various projects",
    date: "2025",
    color: "from-green-500 to-emerald-500"
  }
];

const Achievements = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ".achievement-card",
      { y: 80, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <section
      id="achievements"
      ref={sectionRef}
      className="relative min-h-screen flex-center section-padding overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#13162d] to-[#0a0a1a]" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="hero-badge mx-auto mb-6">
            <p>🎯 Recognition & Milestones</p>
          </div>
          <h2 className="font-semibold md:text-5xl text-3xl mb-4">
            Achievements & <span className="text-purple-accent">Certifications</span>
          </h2>
          <p className="text-white-50 text-lg max-w-2xl mx-auto">
            Milestones and recognitions that reflect my commitment to excellence
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="achievement-card group relative"
            >
              {/* Gradient Border */}
              <div className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl`} />
              
              {/* Card */}
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition-all duration-300">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {achievement.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-2">
                  {achievement.title}
                </h3>
                <p className="text-purple-accent font-medium mb-3">
                  {achievement.organization}
                </p>
                <p className="text-white-50 mb-4">
                  {achievement.description}
                </p>
                <p className="text-sm text-white-50">
                  📅 {achievement.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;