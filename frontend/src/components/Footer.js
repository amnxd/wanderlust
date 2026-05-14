import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const toast = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }
    toast.success(`Thanks! ${email} is now subscribed.`);
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-newsletter">
          <div className="footer-newsletter-text">
            <h3>Get travel inspiration in your inbox</h3>
            <p>Curated stays, hidden gems, and exclusive deals. No spam, ever.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary">Subscribe →</button>
          </form>
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/image.png" alt="Wanderlust Logo" className="footer-logo-img" />
            <p>India's most trusted platform for discovering extraordinary stays. From Himalayan peaks to tropical beaches.</p>
            <div className="footer-socials">
              <a href="#instagram" onClick={(e) => e.preventDefault()} aria-label="Instagram">📷</a>
              <a href="#twitter" onClick={(e) => e.preventDefault()} aria-label="Twitter">🐦</a>
              <a href="#facebook" onClick={(e) => e.preventDefault()} aria-label="Facebook">📘</a>
              <a href="#linkedin" onClick={(e) => e.preventDefault()} aria-label="LinkedIn">💼</a>
            </div>
          </div>
          <div className="footer-links-col">
            <h4>Explore</h4>
            <Link to="/explore">All Listings</Link>
            <Link to="/explore?category=Beach">Beach Stays</Link>
            <Link to="/explore?category=Mountains">Mountain Retreats</Link>
            <Link to="/explore?category=Cities">City Hotels</Link>
            <Link to="/explore?category=Villas">Luxury Villas</Link>
          </div>
          <div className="footer-links-col">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/about">Our Team</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/about">Careers</Link>
            <Link to="/about">Press</Link>
          </div>
          <div className="footer-links-col">
            <h4>Support</h4>
            <Link to="/contact">Help Center</Link>
            <Link to="/contact">Cancellation Policy</Link>
            <Link to="/auth">Become a Host</Link>
            <Link to="/host/dashboard">Host Dashboard</Link>
          </div>
          <div className="footer-links-col">
            <h4>Legal</h4>
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
            <a href="#cookie" onClick={(e) => e.preventDefault()}>Cookie Policy</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Wanderlust. All rights reserved. Made with ❤️ for India's explorers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
