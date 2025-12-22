import { useState, useEffect } from "react";
import { navLinks } from "../constants";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  
  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
        <div className="inner">
          <a href="#hero" className="logo">
            Rohit Biradar
          </a>

          
          <nav className="desktop">
            <ul>
              {navLinks.map(({ link, name }) => (
                <li key={name} className="group">
                  <a href={link}>
                    <span>{name}</span>
                    <span className="underline" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          
          <a href="#contact" className="contact-btn group hidden md:flex">
            <div className="inner">
              <span>Contact me</span>
            </div>
          </a>

          
          <button
            className="mobile-menu-btn md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className={`hamburger ${mobileMenuOpen ? "open" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </header>

      <div
        className={`mobile-overlay ${mobileMenuOpen ? "active" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside className={`mobile-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-sidebar-content">
          
          <div className="mobile-sidebar-header">
            <span className="mobile-sidebar-logo">Menu</span>
            <button
              className="mobile-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          
          <nav className="mobile-sidebar-nav">
            <ul>
              {navLinks.map(({ link, name }, index) => (
                <li
                  key={name}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  className={mobileMenuOpen ? "animate" : ""}
                >
                  <a href={link} onClick={handleLinkClick}>
                    <span className="nav-icon">
                      {name === "Projects" && "💼"}
                      {name === "Experience" && "🏢"}
                      {name === "Skills" && "🛠️"}
                      {name === "Testimonials" && "⭐"}
                      {name === "Resume" && "📄"}
                    </span>
                    <span className="nav-text">{name}</span>
                    <span className="nav-arrow">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          
          <div className="mobile-sidebar-footer">
            <a
              href="#contact"
              className="mobile-contact-btn"
              onClick={handleLinkClick}
            >
              <span>Contact Me</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </a>
            <p className="mobile-sidebar-credit">© 2025 Rohit Biradar</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default NavBar;
