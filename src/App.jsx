import Testimonials from "./sections/Testimonials";
import Footer from "./sections/Footer";
import Contact from "./sections/Contact";
import TechStack from "./sections/TechStack";
import Experience from "./sections/Experience";
import Resume from "./sections/Resume";
import Hero from "./sections/Hero";
import ShowcaseSection from "./sections/ShowcaseSection";
import LogoShowcase from "./sections/LogoShowcase";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Navbar from "./components/NavBar";

const App = () => (
  <>
    <Navbar />
    <Hero />
    <ShowcaseSection />
    <LogoShowcase />
    <About />
    <Projects />
    <Experience />
    <Resume />
    <TechStack />
    <Testimonials />
    <Contact />
    <Footer />
  </>
);

export default App;

