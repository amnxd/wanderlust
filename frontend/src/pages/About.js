import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const TEAM = [
  { name: 'Nancy Tiwari', role: 'Team Lead + Frontend & System Architecture Developer', avatar: 'N', emoji: '👩‍💼', bio: 'Managed frontend development, responsive UI, and overall project architecture. Coordinated project planning, feature implementation, and presentation flow.' },
  { name: 'Tanya Jaiswal', role: 'Security Specialist + Database Developer', avatar: 'T', emoji: '🔐', bio: 'Implemented authentication, validation, and security-related modules. Worked with MongoDB Atlas, Passport.js, and session management.' },
  { name: 'Sachin Yadav', role: 'Research Analyst + Requirement Engineer', avatar: 'S', emoji: '📊', bio: 'Handled system research, requirement analysis, and future scope planning. Worked on documentation, project objectives, and user experience analysis.' },
  { name: 'Sudhanshu Upadhyay', role: 'Backend Developer + API & Testing Lead', avatar: 'S', emoji: '⚙️', bio: 'Developed backend APIs, CRUD operations, routing, and middleware logic. Handled testing, debugging, and backend integration.' },
];

const STATS = [
  { value: '50+', label: 'Curated Properties' },
  { value: '20+', label: 'Indian Destinations' },
  { value: '4.8★', label: 'Average Rating' },
  { value: '2,000+', label: 'Happy Guests' },
];

const VALUES = [
  { icon: '✨', title: 'Quality First', desc: 'We personally vet every property to ensure exceptional standards.' },
  { icon: '🤝', title: 'Trust & Transparency', desc: 'Honest pricing, real reviews, no hidden surprises.' },
  { icon: '🌱', title: 'Sustainable Travel', desc: 'We partner with eco-conscious hosts who care about the planet.' },
  { icon: '❤️', title: 'Local Impact', desc: 'Every booking supports local communities and small businesses.' },
];

const JOURNEY = [
  { year: '2021', title: 'The Idea', desc: 'Born from countless trips and an obsession with finding the perfect stay.' },
  { year: '2022', title: 'First 10 Properties', desc: 'Launched in Goa with handpicked beachfront villas and homestays.' },
  { year: '2023', title: 'Going Pan-India', desc: 'Expanded to 15 cities with 30+ partners across the country.' },
  { year: '2024', title: '50+ Stays Live', desc: 'Reached 2,000 happy guests and 50+ verified destinations.' },
];

const FAQS = [
  { q: 'How are properties verified?', a: 'Every Wanderlust property is personally inspected by our hospitality team. We check amenities, cleanliness, host reliability, and overall guest experience before listing.' },
  { q: 'Can I cancel my booking?', a: 'Yes. Bookings can be cancelled from your traveler dashboard. Refunds depend on the property\'s cancellation policy and how close to check-in you cancel.' },
  { q: 'How do I become a host?', a: 'Sign up as a host, complete your profile, and add your property listing. Our team will review and reach out within 48 hours.' },
  { q: 'Is payment secure?', a: 'All transactions are processed through our encrypted payment gateway. Your card details are never stored on our servers.' },
  { q: 'Do you offer customer support?', a: 'Yes — our support team is available 7 days a week via email, phone, and live chat to help you before, during, and after your stay.' },
];

const About = () => {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-overlay" />
        <div className="about-hero-content">
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>Our Story</span>
          <h1>Inspiring Journeys,<br />Connecting Worlds</h1>
          <p>We believe every traveler deserves an extraordinary experience</p>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <div className="about-container">
          <div className="stats-row">
            {STATS.map(s => (
              <div key={s.label} className="stat-pill">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="about-mv">
        <div className="about-container">
          <div className="mv-grid">
            <div className="mv-card">
              <div className="mv-icon-wrap">🌍</div>
              <h2>Our Mission</h2>
              <p>Empowering travelers and hosts to discover India's hidden gems, creating meaningful connections and unforgettable memories through carefully curated, authentic stays.</p>
            </div>
            <div className="mv-card mv-vision">
              <div className="mv-icon-wrap">🎯</div>
              <h2>Our Vision</h2>
              <p>To become India's most trusted travel companion — bridging the gap between adventurous souls and extraordinary places, one perfect stay at a time.</p>
            </div>
          </div>

          <div className="problem-box">
            <div className="problem-item">
              <strong>The Problem</strong>
              <p>Travelers struggle to find trusted, unique stays that go beyond generic hotels. Finding authentic, handpicked properties across India's diverse landscape was frustrating and time-consuming.</p>
            </div>
            <div className="problem-divider" />
            <div className="problem-item">
              <strong>Our Solution</strong>
              <p>Wanderlust personally vets every property on our platform. Our team of hospitality experts curates only the finest stays — from royal Rajputana villas to Kerala backwater houseboats.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="about-container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <span className="section-tag">What we stand for</span>
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle">The principles that guide every booking we facilitate</p>
          </div>
          <div className="values-grid">
            {VALUES.map(v => (
              <div key={v.title} className="value-card">
                <div className="value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="about-journey">
        <div className="about-container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <span className="section-tag">Our journey</span>
            <h2 className="section-title">From Idea to India's Favorite</h2>
          </div>
          <div className="timeline">
            {JOURNEY.map((j, i) => (
              <div key={j.year} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-card">
                  <span className="timeline-year">{j.year}</span>
                  <h4>{j.title}</h4>
                  <p>{j.desc}</p>
                </div>
                <div className="timeline-dot" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-team">
        <div className="about-container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="section-tag">The people behind it</span>
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">Passionate travelers, hospitality experts, and tech innovators</p>
          </div>
          <div className="team-grid">
            {TEAM.map(m => (
              <div key={m.name} className="team-card">
                <div className="team-avatar-wrap">
                  <div className="team-avatar">{m.avatar}</div>
                  <span className="team-emoji">{m.emoji}</span>
                </div>
                <h3 className="team-name">{m.name}</h3>
                <p className="team-role">{m.role}</p>
                <p className="team-bio">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="about-faq">
        <div className="about-container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <span className="section-tag">Got questions?</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="faq-list">
            {FAQS.map((f, i) => (
              <button
                key={i}
                className={`faq-item ${openFaq === i ? 'open' : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                type="button"
              >
                <div className="faq-q">
                  <span>{f.q}</span>
                  <span className="faq-arrow">{openFaq === i ? '−' : '+'}</span>
                </div>
                {openFaq === i && <p className="faq-a">{f.a}</p>}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-container" style={{ textAlign: 'center' }}>
          <h2>Ready to start your journey?</h2>
          <p>Explore 50+ handpicked properties across India</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/explore" className="btn-white">Explore Listings →</Link>
            <Link to="/auth" className="btn-outline" style={{ borderColor: 'white', color: 'white' }}>Become a Host</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
