import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ListingCard from '../components/ListingCard';
import './Home.css';

const CATEGORIES = [
  { label: 'Beach', icon: '🏖️', desc: 'Coastal paradise', color: '#0ea5e9' },
  { label: 'Mountains', icon: '🏔️', desc: 'Alpine escapes', color: '#10b981' },
  { label: 'Cities', icon: '🏙️', desc: 'Urban adventures', color: '#8b5cf6' },
  { label: 'Villas', icon: '🏡', desc: 'Luxury retreats', color: '#f59e0b' },
];

const WHY_US = [
  { icon: '🛡️', title: 'Secure Booking', desc: 'Every booking is protected with end-to-end security and instant confirmation.' },
  { icon: '✅', title: 'Verified Stays', desc: 'All 50+ properties are personally verified by our hospitality experts.' },
  { icon: '💰', title: 'Best Pricing', desc: 'Competitive rates with no hidden fees. Price match guarantee on all listings.' },
  { icon: '💖', title: 'Personalized', desc: 'AI-powered recommendations tailored to your travel preferences and history.' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', city: 'Mumbai', rating: 5, text: 'Wanderlust transformed our anniversary trip into the most magical experience. The Goa villa exceeded every expectation!', avatar: 'P' },
  { name: 'Rahul Verma', city: 'Delhi', rating: 5, text: 'Booked the Darjeeling tea estate retreat and it was absolutely breathtaking. Exceptional service from start to finish.', avatar: 'R' },
  { name: 'Ananya Krishnan', city: 'Bangalore', rating: 5, text: 'The Kerala houseboat villa was a dream come true. Wanderlust curates only the finest properties in India.', avatar: 'A' },
];

const Home = () => {
  const [search, setSearch] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [popularListings, setPopularListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setHeroLoaded(true), 100);
    axios.get('/api/listings?sort=rating')
      .then(res => setPopularListings(res.data.slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests > 1) params.set('guests', guests);
    navigate(`/explore?${params.toString()}`);
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    navigate(`/explore?category=${cat}`);
  };

  return (
    <div className="home">
      {/* HERO */}
      <section className={`hero ${heroLoaded ? 'hero-loaded' : ''}`}>
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-particles">
          {[...Array(6)].map((_, i) => <div key={i} className={`particle particle-${i+1}`} />)}
        </div>
        <div className="hero-content">
          <div className="hero-badge">🌟 India's #1 Curated Travel Platform</div>
          <h1 className="hero-title">
            Discover Your<br />
            <span className="hero-title-accent">Perfect Escape</span>
          </h1>
          <p className="hero-subtitle">50+ handpicked properties across India — from Himalayan retreats to Goan villas</p>
          
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-field">
              <span className="search-field-icon">📍</span>
              <div className="search-field-inner">
                <label>Where</label>
                <input
                  type="text"
                  placeholder="Destination, city or property"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            <div className="search-divider" />
            <div className="search-field">
              <span className="search-field-icon">📅</span>
              <div className="search-field-inner">
                <label>Check In</label>
                <input type="date" value={checkIn} min={new Date().toISOString().split('T')[0]} onChange={e => setCheckIn(e.target.value)} className="search-input" />
              </div>
            </div>
            <div className="search-divider" />
            <div className="search-field">
              <span className="search-field-icon">📅</span>
              <div className="search-field-inner">
                <label>Check Out</label>
                <input type="date" value={checkOut} min={checkIn || new Date().toISOString().split('T')[0]} onChange={e => setCheckOut(e.target.value)} className="search-input" />
              </div>
            </div>
            <div className="search-divider" />
            <div className="search-field">
              <span className="search-field-icon">👥</span>
              <div className="search-field-inner">
                <label>Guests</label>
                <select value={guests} onChange={e => setGuests(e.target.value)} className="search-input">
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} guest{n>1?'s':''}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="search-btn">
              <span>🔍</span> Search
            </button>
          </form>

          <div className="hero-stats">
            <div className="hero-stat"><strong>50+</strong><span>Properties</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>20+</strong><span>Destinations</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>4.8★</strong><span>Avg Rating</span></div>
          </div>
        </div>
        <div className="hero-scroll-hint">
          <span>Scroll to explore</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Browse by type</span>
            <h2 className="section-title">Explore Categories</h2>
            <p className="section-subtitle">Find your ideal stay from our curated collection</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <button
                key={cat.label}
                className={`category-card ${activeCategory === cat.label ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat.label)}
                style={{ '--cat-color': cat.color }}
              >
                <div className="category-icon-wrap">
                  <span className="category-icon">{cat.icon}</span>
                </div>
                <div className="category-text">
                  <span className="category-label">{cat.label}</span>
                  <span className="category-desc">{cat.desc}</span>
                </div>
                <div className="category-arrow">→</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR LISTINGS */}
      <section className="section listings-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Top rated</span>
            <h2 className="section-title">Most Loved Stays</h2>
            <p className="section-subtitle">Handpicked by our guests, refined by our team</p>
          </div>
          {loading ? (
            <div className="skeleton-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card"><div className="skeleton-img"/><div className="skeleton-body"><div className="skeleton-line w-70"/><div className="skeleton-line w-50"/><div className="skeleton-line w-80"/></div></div>)}
            </div>
          ) : (
            <div className="listings-grid">
              {popularListings.map(l => <ListingCard key={l._id} listing={l} />)}
            </div>
          )}
          <div className="section-cta">
            <Link to="/explore" className="btn-primary btn-lg">
              View All 50+ Listings <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section why-section">
        <div className="why-bg-pattern" />
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why Wanderlust</span>
            <h2 className="section-title">Travel with Confidence</h2>
            <p className="section-subtitle">We're not just a booking platform — we're your travel companion</p>
          </div>
          <div className="why-grid">
            {WHY_US.map((item, i) => (
              <div key={item.title} className="why-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="why-icon-wrap">
                  <span className="why-icon">{item.icon}</span>
                </div>
                <h3 className="why-title">{item.title}</h3>
                <p className="why-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Guest stories</span>
            <h2 className="section-title">What Our Travelers Say</h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">{'★'.repeat(t.rating)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to host your property?</h2>
          <p>Join 200+ hosts earning extra income on Wanderlust</p>
          <Link to="/auth" className="btn-white">Become a Host →</Link>
        </div>
      </section>

    </div>
  );
};

export default Home;