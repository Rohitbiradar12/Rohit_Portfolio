import { createPortal } from "react-dom";
import useDialog from "../hooks/useDialog";
import { useRef, useState, useCallback } from "react";
import emailjs from "@emailjs/browser";

import TitleHeader from "../components/TitleHeader";
import ContactExperience from "../components/models/contact/ContactExperience";

const SuccessAnimation = ({ onClose, returnFocusRef }) => {
  const dialogRef = useRef(null);
  useDialog(dialogRef, true, onClose, returnFocusRef);

  return createPortal(
    <div className="ct-modal-overlay">
      <div data-dialog-backdrop className="ct-modal-backdrop" onClick={onClose} />
      <div ref={dialogRef} tabIndex={-1} className="ct-modal ct-modal-success" role="dialog" aria-modal="true" aria-label="Message sent">
        <div className="ct-modal-icon-wrap">
          <svg className="ct-modal-icon" viewBox="0 0 52 52" aria-hidden="true">
            <circle className="ct-modal-ring" cx="26" cy="26" r="24" fill="none" />
            <path
              className="ct-modal-check"
              fill="none"
              d="M14.5 27 L22 34.5 L38 18.5"
            />
          </svg>
        </div>

        <p className="ct-modal-label">Success · Message Sent</p>
        <h3 className="ct-modal-title">I'll get back to you soon.</h3>
        <p className="ct-modal-text">
          Thanks for reaching out. You'll hear from me at the email you
          provided.
        </p>

        <button
          type="button"
          className="ct-modal-btn"
          onClick={onClose}
          aria-label="Continue"
        >
          <span>Continue</span>
          <svg
            width="14"
            height="14"
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
        </button>
      </div>
    </div>, document.body
  );
};

const ErrorAnimation = ({ onClose, returnFocusRef }) => {
  const dialogRef = useRef(null);
  useDialog(dialogRef, true, onClose, returnFocusRef);

  return createPortal(
    <div className="ct-modal-overlay">
      <div data-dialog-backdrop className="ct-modal-backdrop" onClick={onClose} />
      <div ref={dialogRef} tabIndex={-1} className="ct-modal ct-modal-error" role="alertdialog" aria-modal="true" aria-label="Message delivery failed">
        <div className="ct-modal-icon-wrap">
          <svg className="ct-modal-icon" viewBox="0 0 52 52" aria-hidden="true">
            <circle className="ct-modal-ring" cx="26" cy="26" r="24" fill="none" />
            <path
              className="ct-modal-x ct-modal-x-1"
              fill="none"
              d="M17 17 L35 35"
            />
            <path
              className="ct-modal-x ct-modal-x-2"
              fill="none"
              d="M35 17 L17 35"
            />
          </svg>
        </div>

        <p className="ct-modal-label">Error · Delivery Failed</p>
        <h3 className="ct-modal-title">Couldn't send your message.</h3>
        <p className="ct-modal-text">
          Something went wrong on our end. Try again, or email me directly at
          biradar.roh@northeastern.edu.
        </p>

        <button
          type="button"
          className="ct-modal-btn"
          onClick={onClose}
          aria-label="Try again"
        >
          <span>Try Again</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M1 4v6h6" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10" />
          </svg>
        </button>
      </div>
    </div>, document.body
  );
};

const Contact = () => {
  const formRef = useRef(null);
  const submitRef = useRef(null);
  const sending = useRef(false);
  const closeSuccess = useCallback(() => setShowSuccess(false), []);
  const closeError = useCallback(() => setShowError(false), []);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending.current) return;
    sending.current = true;
    setLoading(true);

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      );

      // Primary delivery succeeded; acknowledgement failure must not suggest resending.
      if (import.meta.env.VITE_APP_EMAILJS_AUTOREPLY_TEMPLATE_ID) {
        try {
          await emailjs.sendForm(
            import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_APP_EMAILJS_AUTOREPLY_TEMPLATE_ID,
            formRef.current,
            import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
          );
        } catch { /* The primary message was already delivered. */ }
      }

      setForm({ name: "", email: "", message: "" });
      setShowSuccess(true);
    } catch {
      setShowError(true);
    } finally {
      sending.current = false;
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="ct-section relative md:mt-24 mt-12">
      {showSuccess && <SuccessAnimation onClose={closeSuccess} returnFocusRef={submitRef} />}
      {showError && <ErrorAnimation onClose={closeError} returnFocusRef={submitRef} />}

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-10 py-20 md:py-28">
        <TitleHeader
          title={
            <>
              Get in Touch — Let's{" "}
              <span className="text-purple-accent gradient-text">Connect</span>
            </>
          }
        />

        <div className="ct-stats-bar">
          <span>Boston, MA</span>
          <span className="ct-stats-dot">·</span>
          <span>Open to Opportunities</span>
          <span className="ct-stats-dot">·</span>
          <span>Replies within 24h</span>
        </div>

        <div className="ct-grid">
          <div className="ct-form-wrap">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="ct-form"
            >
              <div className="ct-field">
                <label htmlFor="name" className="ct-label">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  readOnly={loading}
                  placeholder="What's your good name?"
                  required
                  className="ct-input"
                />
              </div>

              <div className="ct-field">
                <label htmlFor="email" className="ct-label">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  readOnly={loading}
                  placeholder="What's your email address?"
                  required
                  className="ct-input"
                />
              </div>

              <div className="ct-field">
                <label htmlFor="message" className="ct-label">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  readOnly={loading}
                  placeholder="How can I help you?"
                  rows="5"
                  required
                  className="ct-input ct-textarea"
                />
              </div>

              <button
                ref={submitRef}
                type="submit"
                disabled={loading}
                className="ct-submit"
                aria-label="Send message"
              >
                <span className="ct-submit-spotlight" />
                <span className="ct-submit-label">
                  {loading ? "Sending..." : "Send Message"}
                </span>
                <svg
                  className="ct-submit-arrow"
                  width="14"
                  height="14"
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
              </button>
            </form>
          </div>

          <div className="ct-scene-wrap">
            <div className="ct-scene">
              <ContactExperience />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

