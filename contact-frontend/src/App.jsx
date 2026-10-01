
import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(null);

    if (!recaptchaToken) {
      setStatus({
        type: 'error',
        message: 'Please complete the reCAPTCHA checkbox before sending.',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          recaptchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to send your message.',
        );
      }

      setStatus({
        type: 'success',
        message: data.message,
      });

      setForm(initialForm);
      setRecaptchaToken(null);
      recaptchaRef.current?.reset();
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error.message || 'Server error. Please try again later.',
      });
      setRecaptchaToken(null);
      recaptchaRef.current?.reset();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="contact-layout">
        <div className="contact-intro">
          <a className="wordmark" href="#top" aria-label="Northline home">
            <span className="wordmark-icon" aria-hidden="true">N</span>
            <span>northline</span>
          </a>
          <div className="intro-copy" id="top">
            <span className="eyebrow">A GOOD PLACE TO START</span>
            <h1>Let's make<br />something <em>matter.</em></h1>
          <p>
              Have a question, an idea, or a project taking shape? Tell us a little
              about it. We’ll get back to you within one business day.
          </p>
          </div>
          <div className="contact-details">
            <div>
              <span className="detail-label">EMAIL</span>
              <a href="mailto:hello@northline.studio">hello@northline.studio</a>
            </div>
            <div>
              <span className="detail-label">RESPONSE TIME</span>
              <span>Usually within one business day</span>
            </div>
          </div>
          <span className="intro-index" aria-hidden="true">01 / 01</span>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-heading">
            <span className="eyebrow">YOUR NOTE</span>
            <h2>Tell us what's on your mind.</h2>
          </div>
          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="What is this about?"
              value={form.subject}
              onChange={handleChange}
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Write your message here..."
              value={form.message}
              onChange={handleChange}
              maxLength={5000}
              rows={6}
              required
            />
          </div>

          <div className="captcha-widget">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={setRecaptchaToken}
              onExpired={() => setRecaptchaToken(null)}
            />
          </div>

          {status && (
            <div className={`status ${status.type}`} role="status">
              {status.message}
            </div>
          )}

          <button type="submit" disabled={loading}>
            <span>{loading ? 'Sending message...' : 'Send message'}</span>
            <span className="button-arrow" aria-hidden="true">↗</span>
          </button>

          <p className="privacy-note">
            This form is protected by Google reCAPTCHA.
          </p>
        </form>
      </section>
    </main>
  );
}