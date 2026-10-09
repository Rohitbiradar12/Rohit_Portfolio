import useDialog from "../hooks/useDialog";
import { useState, useEffect, useRef, useCallback } from "react";
import { navLinks } from "../constants";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dialogRef = useRef(null);
  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);
  useDialog(dialogRef, mobileMenuOpen, closeMenu);
  useEffect(() => {
    const media = matchMedia("(min-width: 1024px)");
    const resize = () => { if (media.matches) closeMenu(); };
    media.addEventListener("change", resize);
    return () => media.removeEventListener("change", resize);
  }, [closeMenu]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };




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


          <a href="#contact" className="nav-cta hidden md:inline-flex">
            <span className="nav-cta-label">Contact me</span>
            <svg
              className="nav-cta-arrow"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>


          <button
            className="mobile-menu-btn"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
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

      <aside id="mobile-navigation" ref={dialogRef} role="dialog" aria-modal={mobileMenuOpen ? "true" : undefined} aria-label="Navigation menu" aria-hidden={!mobileMenuOpen} inert={!mobileMenuOpen} tabIndex={-1} className={`mobile-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-sidebar-content">

          <div className="sb-header">
            <a href="#hero" className="sb-logo" onClick={handleLinkClick}>Rohit Biradar</a>
            <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <nav className="mobile-sidebar-nav">
            <ul>
              {navLinks.map(({ link, name }, index) => (
                <li key={name} style={{ animationDelay: `${index * 0.06}s` }} className={mobileMenuOpen ? "animate" : ""}>
                  <a href={link} onClick={handleLinkClick}>
                    <span className="nav-text">{name}</span>
                    <svg className="nav-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mobile-sidebar-footer">
            <a href="#contact" className="sb-cta" onClick={handleLinkClick}>
              <span>Let's connect</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <div className="sb-socials">
              <a href="https://github.com/Rohitbiradar12" target="_blank" rel="noopener noreferrer" className="sb-social" aria-label="GitHub">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
              <a href="https://linkedin.com/in/rohit-biradar-0b9a081b7" target="_blank" rel="noopener noreferrer" className="sb-social" aria-label="LinkedIn">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="mailto:biradar.roh@northeastern.edu" className="sb-social" aria-label="Email">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </a>
            </div>
            <p className="mobile-sidebar-credit">© {new Date().getFullYear()} Rohit Biradar</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default NavBar;
