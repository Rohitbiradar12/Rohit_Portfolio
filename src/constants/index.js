const navLinks = [
  {
    name: "Work",
    link: "#work",
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
    name: "Testimonials",
    link: "#testimonials",
  },
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

const counterItems = [
  { value: 15, suffix: "+", label: "Years of Experience" },
  { value: 200, suffix: "+", label: "Satisfied Clients" },
  { value: 108, suffix: "+", label: "Completed Projects" },
  { value: 90, suffix: "%", label: "Client Retention Rate" },
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
      "Developed and maintained user-facing features for the Hostinger website.",
      "Collaborated closely with UI/UX designers to ensure seamless user experiences.",
      "Optimized web applications for maximum speed and scalability.",
    ],
  },
  {
    review: "Rohit contributions to Docker's web applications have been outstanding. He approaches challenges with a problem-solving mindset.",
    imgPath: "/images/exp1.png",
    logoPath: "/images/torry-harris.png",
    title: "Software Developer Intern",
    date: "September 2023 - March 2024",
    responsibilities: [
      "Led the development of Docker's web applications, focusing on scalability.",
      "Worked with backend engineers to integrate APIs seamlessly with the frontend.",
      "Contributed to open-source projects that were used with the Docker ecosystem.",
    ],
  },
  {
    review: "Rohit's work on Appwrite’s mobile app brought a high level of quality and efficiency. He delivered solutions that enhanced our mobile experience & meet our product goals.",
    imgPath: "/images/exp3.png",
    logoPath: "/images/logo3.png",
    title: "Backend Developer Intern",
    date: "March 2019 - May 2020",
    responsibilities: [
      "Built cross-platform mobile apps using React Native, integrating with Appwrite's backend services.",
      "Improved app performance and user experience through code optimization and testing.",
      "Coordinated with the product team to implement features based on feedback.",
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
    title: "AI Image SaaS - Canva Alternative",
    des: "A REAL Software-as-a-Service app with AI features and payments & credits system using the latest tech stack.",
    img: "/images/project3.png",
    iconLists: ["/images/logos/react.png", "/images/logos/python.svg", "/images/logos/git.svg"],
    link: "https://github.com/yourprofile/ai-image-saas",
  },
  {
    id: 4,
    title: "Animated Apple iPhone 3D Website",
    des: "Recreated the Apple iPhone 15 Pro website, combining GSAP animations and Three.js 3D effects.",
    img: "/images/project1.png",
    iconLists: ["/images/logos/react.png", "/images/logos/three.png", "/images/logos/git.svg"],
    link: "https://github.com/yourprofile/apple-clone",
  },
];

export {
  words,
  abilities,
  logoIconsList,
  counterItems,
  expCards,
  expLogos,
  testimonials,
  socialImgs,
  techStackIcons,
  techStackImgs,
  navLinks,
  projects,
};
