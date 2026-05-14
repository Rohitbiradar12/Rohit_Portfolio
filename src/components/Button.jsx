const Button = ({ text, className, href = "projects" }) => {
  return (
    <a
      href={`#${href}`}
      onClick={(e) => {
        e.preventDefault();
        const target = document.getElementById(href);
        if (target) {
          const offset = window.innerHeight * 0.15;
          const top =
            target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }}
      className={`hero-cta ${className ?? ""}`}
    >
      <span className="hero-cta-spotlight" />
      <span className="hero-cta-label">{text}</span>
      <svg
        className="hero-cta-arrow"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </a>
  );
};

export default Button;
