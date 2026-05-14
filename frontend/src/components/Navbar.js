import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };
  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${isTransparent ? 'transparent' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src="/image.png" alt="Wanderlust Logo" className="brand-logo" />
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/explore" className={`nav-link ${location.pathname === '/explore' ? 'active' : ''}`}>Explore</Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
        </div>

        <div className="navbar-auth" ref={dropdownRef}>
          {user ? (
            <div className="user-menu">
              <button className="user-btn" onClick={() => setMenuOpen(!menuOpen)}>
                <div className="user-avatar">{user.name[0].toUpperCase()}</div>
                <span className="user-name">{user.name.split(' ')[0]}</span>
                <span className={`chevron ${menuOpen ? 'open' : ''}`}>▾</span>
              </button>
              {menuOpen && (
                <div className="dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">{user.name[0].toUpperCase()}</div>
                    <div>
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to={user.role === 'host' ? '/host/dashboard' : '/traveler/dashboard'} className="dropdown-item">
                    <span>🏠</span> Dashboard
                  </Link>
                  <Link to="/profile" className="dropdown-item"><span>👤</span> Profile</Link>
                  {user.role !== 'host' && (
                    <Link to="/wishlist" className="dropdown-item"><span>💖</span> Wishlist</Link>
                  )}
                  {user.role !== 'host' && (
                    <Link to="/traveler/dashboard" className="dropdown-item"><span>🧳</span> My Trips</Link>
                  )}
                  {user.role === 'host' && (
                    <Link to="/host/dashboard" className="dropdown-item"><span>📊</span> Host Panel</Link>
                  )}
                  <div className="dropdown-divider" />
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/auth" className="btn-ghost">Log in</Link>
              <Link to="/auth?signup=true" className="btn-primary btn-nav">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;