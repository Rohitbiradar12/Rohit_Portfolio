const navLinks = [
  {
    name: "Projects",
    link: "#projects",
  },
  {
    name: "Experience",
    link: "#experience",
  },
  {
    name: "Skills",
    link: "#skills",
  },
  {
    name: "Resume",
    link: "#resume",
  },
  {
    name: "Testimonials",
    link: "#testimonials",
  }

];

const words = [
  { text: "Ideas", imgPath: "/images/ideas.svg" },
  { text: "Concepts", imgPath: "/images/concepts.svg" },
  { text: "Designs", imgPath: "/images/designs.svg" },
  { text: "Code", imgPath: "/images/code.svg" },
  { text: "Ideas", imgPath: "/images/ideas.svg" },
  { text: "Concepts", imgPath: "/images/concepts.svg" },
  { text: "Designs", imgPath: "/images/designs.svg" },
  { text: "Code", imgPath: "/images/code.svg" },
];

const logoIconsList = [
  {
    imgPath: "/images/logos/company-logo-1.png",
  },
  {
    imgPath: "/images/logos/company-logo-2.png",
  },
  {
    imgPath: "/images/logos/company-logo-3.png",
  },
  {
    imgPath: "/images/logos/company-logo-4.png",
  },
  {
    imgPath: "/images/logos/company-logo-5.png",
  },
  {
    imgPath: "/images/logos/company-logo-6.png",
  },
  {
    imgPath: "/images/logos/company-logo-7.png",
  },
  {
    imgPath: "/images/logos/company-logo-8.png",
  },
  {
    imgPath: "/images/logos/company-logo-9.png",
  },
  {
    imgPath: "/images/logos/company-logo-10.png",
  },
  {
    imgPath: "/images/logos/company-logo-11.png",
  },
];

const abilities = [
  {
    imgPath: "/images/seo.png",
    title: "Quality Focus",
    desc: "Delivering high-quality results while maintaining attention to every detail.",
  },
  {
    imgPath: "/images/chat.png",
    title: "Reliable Communication",
    desc: "Keeping you updated at every step to ensure transparency and clarity.",
  },
  {
    imgPath: "/images/time.png",
    title: "On-Time Delivery",
    desc: "Making sure projects are completed on schedule, with quality & attention to detail.",
  },
];

const techStackImgs = [
  { name: "React", imgPath: "/images/logos/react.png", color: "#61DAFB", category: "Frontend" },
  { name: "JavaScript", imgPath: "/images/logos/javascript.svg", color: "#F7DF1E", category: "Frontend" },
  { name: "TypeScript", imgPath: "/images/logos/typescript.png", color: "#3178C6", category: "Frontend" },
  { name: "HTML5", imgPath: "/images/logos/html5.svg", color: "#E34F26", category: "Frontend" },
  { name: "CSS3", imgPath: "/images/logos/css3.svg", color: "#1572B6", category: "Frontend" },
  { name: "Three.js", imgPath: "/images/logos/three.png", color: "#000000", category: "Frontend" },
  { name: "Tailwind", imgPath: "/images/logos/tailwind.svg", color: "#06B6D4", category: "Frontend" },
  
  { name: "Java", imgPath: "/images/logos/java.webp", color: "#ED8B00", category: "Backend" },
  { name: "Spring Boot", imgPath: "/images/logos/spring.png", color: "#6DB33F", category: "Backend" },
  { name: "Node.js", imgPath: "/images/logos/node.png", color: "#339933", category: "Backend" },
  { name: "Python", imgPath: "/images/logos/python.svg", color: "#3776AB", category: "Backend" },
  { name: "C#", imgPath: "/images/logos/c-sharp.webp", color: "#512BD4", category: "Backend" },
  { name: "ASP.NET", imgPath: "/images/logos/.NET.png", color: "#512BD4", category: "Backend" },
  
  { name: "MongoDB", imgPath: "/images/logos/mongo.png", color: "#47A248", category: "Database" },
  { name: "PostgreSQL", imgPath: "/images/logos/postgres.png", color: "#4169E1", category: "Database" },
  { name: "OracleDB", imgPath: "/images/logos/OracleDB.png", color: "#F80000", category: "Database" },
  { name: "MySQL", imgPath: "/images/logos/mySQL.png", color: "#4479A1", category: "Database" },
  { name: "SQL Developer", imgPath: "/images/logos/SQL.png", color: "#CC2927", category: "Database" },
  { name: "Redis", imgPath: "/images/logos/redis.png", color: "#DC382D", category: "Database" },
  
  { name: "Docker", imgPath: "/images/logo3.png", color: "#2496ED", category: "DevOps" },
  { name: "Kubernetes", imgPath: "/images/logos/kubernetes.png", color: "#326CE5", category: "DevOps" },
  { name: "Terraform", imgPath: "/images/logos/terraform.png", color: "#7B42BC", category: "DevOps" },
  { name: "AWS", imgPath: "/images/logos/aws.png", color: "#FF9900", category: "DevOps" },
  { name: "Azure", imgPath: "/images/logos/azure.png", color: "#0078D4", category: "DevOps" },
  { name: "Kafka", imgPath: "/images/logos/kafka.png", color: "#231F20", category: "DevOps" },
  { name: "Git", imgPath: "/images/logos/git.svg", color: "#F05032", category: "DevOps" },
];

const techStackIcons = [
  {
    name: "React",
    modelPath: "/models/react_logo-transformed.glb",
    scale: 1,
    rotation: [0, 0, 0],
  },
  {
    name: "Python",
    modelPath: "/models/python-transformed.glb",
    scale: 0.8,
    rotation: [0, 0, 0],
  },
  {
    name: "Node",
    modelPath: "/models/node-transformed.glb",
    scale: 5,
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    name: "ThreeJs",
    modelPath: "/models/three.js-transformed.glb",
    scale: 0.05,
    rotation: [0, 0, 0],
  },
  {
    name: "Git",
    modelPath: "/models/git-svg-transformed.glb",
    scale: 0.05,
    rotation: [0, -Math.PI / 4, 0],
  },
];

const expCards = [
  {
    review: "Rohit brought creativity and technical expertise to the team, significantly improving our backend and frontend performance. His work has been invaluable in delivering faster experiences.",
    imgPath: "/images/exp1.png",
    logoPath: "/images/torry-harris.png",
    title: " Software Developer",
    date: "March 2024 - August 2025",
    responsibilities: [
      "Engineered Spring Boot microservices for loan onboarding, eligibility, disbursement, repayment, and early closure using Oracle/PostgreSQL with both SOAP and REST APIs, aligned to financial rules and validations.",
      "Integrated Kafka-based schedulers for asynchronous workflows i.e. repayment settlement, autostrike, auto-debit to improve scalability and throughput.",
      "Implemented Redis caching for high-read configurations, product limits, global settings to reduce database load and improve latency.",
      "Automated hourly monitoring by combining shell scripts and PostgreSQL procedures to generate HTML loan reports and deliver them via SMTP.",
      "Ensured smooth Amodcus fund flow through audit-compliant WebServiceTemplate-based integrations and reliable service-to-service communication.",
],
  },
  {
    review: "Rohit contributions to LMS's applications have been outstanding. He approaches challenges with a problem-solving mindset.",
    imgPath: "/images/exp1.png",
    logoPath: "/images/torry-harris.png",
    title: "Software Developer Intern",
    date: "September 2023 - March 2024",
    responsibilities: [
      "Collaborated on backend development of a cloud-based LMS using Spring Boot microservices with a focus on secure authentication and authorization via JWT.",
      "Designed and implemented centralized authentication workflows, including secure token storage in AWS S3 for scalable and resilient session management.",
      "Built and enhanced API Gateway filter chains for authentication and dynamic routing, ensuring secure and efficient request flow across microservices.",
      "Partnered with cross-functional teams to integrate scalable security patterns, improving system integrity, reliability, and cloud readiness.",
    ],

  },
  {
    review: "Rohit’s backend work in the REVA Developer’s Club was outstanding. He built and delivered the core APIs for our Project Showcase & Team-Matching platform, enabling secure project postings, applications, and role-based access with a scalable, reliable backend.",
    imgPath: "/images/reva-university-logo.png",
    logoPath: "/images/reva.png",
    title: "Backend Developer Intern",
    date: "August 2021 - May 2023",
responsibilities: [
  "Built the backend for a club-wide ‘Project Showcase & Team-Matching’ platform that let students publish projects, tag skills/tech stacks, and get matched to teams using a simple scoring-based recommendation workflow.",
  "Designed REST APIs for project posting, applications, approvals, and role-based access (Admin/Lead/Member) with secure authentication and authorization.",
  "Modeled and optimized the database schema for projects, users, skills, and applications; added validation, pagination, and search filters for scalable usage.",
  "Implemented production-ready practices: structured error handling, logging, API documentation, and basic rate limiting to improve reliability.",
],

  },
];

const expLogos = [
  {
    name: "logo1",
    imgPath: "/images/logo1.png",
  },
  {
    name: "logo2",
    imgPath: "/images/logo2.png",
  },
  {
    name: "logo3",
    imgPath: "/images/logo3.png",
  },
];

const testimonials = [
  {
    name: "Madhavi Balachandra",
    mentions: "Senior Software Engineer",
    review:
      "It's my pleasure to acknowledge that you were one of the team members who showed a strong interest in learning Java and other technologies. You picked up the skills quickly, gained a solid understanding of the project, and in a short span of time, began contributing to a major loan management project. Keep learning and continue doing great work!",
    imgPath: "/images/manager.png",
  },
  {
    name: "Sudhakar Shivraj",
    mentions: "Software Engineer",
    review:
      "Rohit is an exceptional engineer to work with. He has a strong command of backend development and security, and he approaches every problem with clarity and precision. His ability to deliver robust, production-ready solutions makes him a valuable asset to any team.",
    imgPath: "/images/sudhakar.png",
  },
  {
    name: "Shravan Kumar",
    mentions: "Software Developer",
    review:
      "Collaborating with Rohit was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Rohit's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Rohit is the ideal partner.",
    imgPath: "/images/shravan.png",
  },
];

const socialImgs = [
  {
    name: "insta",
    imgPath: "/images/insta.png",
  },
  {
    name: "fb",
    imgPath: "/images/fb.png",
  },
  {
    name: "x",
    imgPath: "/images/x.png",
  },
  {
    name: "linkedin",
    imgPath: "/images/linkedin.png",
  },
];

const projects = [
  {
    id: 1,
    title: "3D Canvas Application",
    des: "Combines proven LMS functionality with cutting-edge AI to make grading faster, feedback richer, and learning more personalized for students and educators.",
    img: "/images/canvas.png",
    iconLists: ["/images/logos/react.png", "/images/logos/three.png", "/images/logos/git.svg"],
    link: "https://kambaz-a6-labs.vercel.app/",
  },
  {
    id: 2,
    title: "Real-Time Project Management System",
    des: "Full-stack Jira Clone project built by using Next JS 14, React, TypeScript, Shadcn UI, Tailwind CSS, Hono, backblaze,resend,nodemailer and Appwrite.",
    img: "/images/worknest.png",
    iconLists: ["/images/logos/react.png", "/images/logos/node.png", "/images/logos/git.svg", "/images/logo2.png"],
    link: "https://work-nest-rust.vercel.app/",
  },
  {
    id: 3,
    title: "Money-Mates",
    des: "MoneyMates is a full-stack web application designed for students and roommates who want to easily track shared expenses (like Splitwise) and manage their education loans with interest, EMI, and service fee calculations.",
    img: "/images/money-mates.png",
    iconLists: ["/images/logos/react.png", "/images/logos/python.svg", "/images/logos/git.svg"],
    link: "https://github.com/Rohitbiradar12/MoneyMates",
  },
  {
    id: 4,
    title: "Full-Stack Banking System",
    des: "A full-stack banking application built with Spring MVC, featuring secure account management, fund transfers, transaction history, and role-based authentication.",
    img: "/images/bank.png",
    iconLists: ["/images/logos/java.webp", "/images/logos/html5.svg", "/images/logos/css3.svg", "/images/logos/spring.png"],
    link: "https://github.com/Rohitbiradar12/Banking-System",
  },
];

export {
  words,
  abilities,
  logoIconsList,
  expCards,
  expLogos,
  testimonials,
  socialImgs,
  techStackIcons,
  techStackImgs,
  navLinks,
  projects,
};
