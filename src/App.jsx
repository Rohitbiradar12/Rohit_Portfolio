import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Achievements from "./sections/ShowcaseSection";
import TechStack from "./sections/TechStack";
import Testimonials from "./sections/Testimonials";
import Resume from "./sections/Resume";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import Navbar from "./components/NavBar";

const App = () => (
  <>
    <Navbar />
    <Hero />
    <About />
    <Projects />
    <Experience />
    <Achievements />
    <TechStack />
    <Resume />
    <Testimonials />
    <Contact />
    <Footer />
  </>
);

export default App;
