import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import './Contact.css';

const SOCIALS = [
  { icon: '📷', label: 'Instagram', handle: '@wanderlust.in' },
  { icon: '🐦', label: 'Twitter', handle: '@wanderlustIN' },
  { icon: '📘', label: 'Facebook', handle: 'Wanderlust India' },
  { icon: '💼', label: 'LinkedIn', handle: 'Wanderlust' },
];

const Contact = () => {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 700));
    toast.success(`Thanks ${form.name.split(' ')[0]}! We'll be in touch within 24 hours.`);
    setSubmitting(false);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-overlay" />
        <div className="contact-hero-content">
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>Get In Touch</span>
          <h1>We'd Love to Hear From You</h1>
          <p>Our team is here to help, 7 days a week</p>
        </div>
      </section>

      <div className="contact-body">
        <div className="contact-grid">
          {/* Form */}
          <div className="contact-form-card">
            <h2>Send a Message</h2>
            <p>We'll get back to you within 24 hours</p>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label>Name</label>
                  <input placeholder="Your full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required>
                  <option value="">Select a subject</option>
                  <option>Booking Inquiry</option>
                  <option>Become a Host</option>
                  <option>Technical Support</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea rows={5} placeholder="Tell us how we can help..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} required />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }} disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <div>
                <h4>Visit Us</h4>
                <p>123 Wanderlust Lane, Connaught Place<br />New Delhi, 110001</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">📞</div>
              <div>
                <h4>Call Us</h4>
                <p>+91 98765 43210<br />Mon–Sat, 9am–7pm IST</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">✉️</div>
              <div>
                <h4>Email Us</h4>
                <p>hello@wanderlust.com<br />support@wanderlust.com</p>
              </div>
            </div>
            <div className="info-card info-response">
              <div className="info-icon">⚡</div>
              <div>
                <h4>Quick Response</h4>
                <p>We respond to all messages within 24 hours, typically much faster.</p>
              </div>
            </div>

            <div className="info-card socials-card">
              <div className="info-icon">🌐</div>
              <div style={{ flex: 1 }}>
                <h4>Follow Us</h4>
                <div className="socials-row">
                  {SOCIALS.map(s => (
                    <span key={s.label} className="social-pill" title={s.handle}>
                      <span>{s.icon}</span> {s.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="contact-map">
          <div className="map-overlay">
            <h3>Find us in the heart of Delhi</h3>
            <p>📍 123 Wanderlust Lane, Connaught Place, New Delhi 110001</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
