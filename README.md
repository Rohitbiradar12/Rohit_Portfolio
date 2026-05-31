<div align="center">
  <img src="public/images/readme.png" alt="Rohit's 3D Portfolio" width="800">
  
  <br />
  <br />

  <img src="https://img.shields.io/badge/-Three.js-black?style=for-the-badge&logo=three.js&logoColor=white" />
  <img src="https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/-GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" />
  <img src="https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />

  <h1>Interactive 3D Portfolio</h1>
  <p>A modern web experience combining real-time 3D graphics with smooth animations and responsive design</p>
</div>

---

## About This Project

This portfolio pushes beyond traditional static websites by integrating Three.js-powered 3D scenes with React's component architecture. Every interaction is crafted to feel natural—from the scroll-triggered camera movements to the responsive lighting that adapts to user input.

The goal was simple: create something memorable that showcases both technical capability and attention to design detail. The 3D room scene in the hero section sets the tone, while GSAP handles the transitions between sections with precision timing.

## Technical Foundation

**Core Technologies**
- Three.js & React Three Fiber for WebGL rendering
- GSAP for animation sequencing and scroll interactions
- React 19 with concurrent features for smooth UI updates
- Vite for fast development iteration and optimized production builds
- Tailwind CSS for consistent styling with custom design tokens

**Key Libraries**
- `@react-three/drei` - Essential Three.js helpers and abstractions
- `@react-three/fiber` - React reconciler for Three.js scene graph
- `EmailJS` - Client-side email functionality for contact form
- `Sentry` - Error tracking and performance monitoring

## What's Inside

**3D Graphics Engine**  
The hero section features a fully modeled 3D room with dynamic lighting, reflective surfaces, and animated elements. The scene responds to viewport changes and user interactions, with optimized LOD (Level of Detail) switching for performance.

**Scroll-Driven Storytelling**  
GSAP ScrollTrigger orchestrates camera movements and element animations as you navigate through sections. Each transition is timed to feel intentional rather than reactive.

**Project Showcase**  
Interactive 3D cards with depth and parallax effects. Each project card includes live demos, tech stacks, and links to repositories.

**Experience Timeline**  
A chronological view of professional experience with company details, role responsibilities, and technology highlights.

**Tech Stack Visualization**  
Filterable grid of technologies organized by category (Frontend, Backend, Database, Tools). Visual indicators show proficiency levels.

**Contact Integration**  
Direct email functionality through EmailJS with custom templates for both initial contact and auto-replies. Form validation and submission states handled client-side.

## Getting Started

**Requirements**
- Node.js 18 or higher
- npm or yarn package manager

**Installation**

```bash
git clone https://github.com/Rohitbiradar12/Rohit_Portfolio.git
cd Rohit_Portfolio
npm install
```

**Environment Setup**

Create `.env` in the project root:

```env
VITE_APP_EMAILJS_SERVICE_ID=your_service_id
VITE_APP_EMAILJS_TEMPLATE_ID=your_template_id
VITE_APP_EMAILJS_AUTOREPLY_TEMPLATE_ID=your_autoreply_template_id
VITE_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

Sign up at [EmailJS](https://www.emailjs.com/) to get your credentials. The service handles email delivery without requiring a backend server.

**Development**

```bash
npm run dev
```

The development server starts at `http://localhost:5173` with hot module replacement enabled.

**Production Build**

```bash
npm run build
npm run preview
```

The build outputs to the `dist/` directory. Vite automatically handles code splitting, asset optimization, and tree shaking.

## Performance Considerations

The 3D scene uses several optimization techniques:
- Frustum culling to avoid rendering off-screen objects
- Texture compression and lazy loading for assets
- Adaptive quality settings based on device capabilities
- RequestAnimationFrame throttling on mobile devices

Initial load time is kept under 3 seconds on 3G connections through aggressive code splitting and deferred loading of non-critical assets.

## Browser Support

Tested and optimized for:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari (iOS 14+)
- Chrome Android

WebGL 2.0 support is required. Graceful degradation to 2D fallback is implemented for unsupported browsers.

## Connect

**Rohit Biradar**  
Software Developer specializing in full-stack development and 3D web experiences

[LinkedIn](https://www.linkedin.com/in/biradar-rohit/) · [X/Twitter](https://x.com/iamRohit1567) · [LeetCode](https://leetcode.com/Rohit_biradar)

Email: biradarrohit155@gmail.com

---

<div align="center">
  <sub>Designed and developed by me</sub>
</div>