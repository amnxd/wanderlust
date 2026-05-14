import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Auth.css';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [isLogin, setIsLogin] = useState(!params.get('signup'));
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'traveler' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const toast = useToast();

  useEffect(() => {
    setIsLogin(!params.get('signup'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!isLogin && form.name.trim().length < 2) {
      setError('Name must be at least 2 characters.'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    setLoading(true);
    try {
      let userData;
      if (isLogin) {
        userData = await login(form.email, form.password);
        toast.success(`Welcome back, ${userData.name.split(' ')[0]}!`);
      } else {
        userData = await register(form.name, form.email, form.password, form.role);
        toast.success(`Welcome to Wanderlust, ${userData.name.split(' ')[0]}!`);
      }
      navigate(userData.role === 'host' ? '/host/dashboard' : '/traveler/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (kind) => {
    if (kind === 'host') {
      setForm({ ...form, email: 'admin@wanderlust.com', password: 'admin123' });
    } else {
      setForm({ ...form, email: 'traveler@wanderlust.com', password: 'traveler123' });
    }
    setIsLogin(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-header-bg" />
          <div className="auth-header-content">
            <span className="auth-logo-icon">{isLogin ? '🔒' : '👤'}</span>
            <h2 className="auth-brand">WANDERLUST</h2>
          </div>
        </div>

        <div className="auth-body">
          <h2 className="auth-title">{isLogin ? 'Welcome back' : 'Create your account'}</h2>
          <p className="auth-subtitle">
            {isLogin ? 'Sign in to continue your journey' : 'Start exploring extraordinary stays today'}
          </p>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <div className="input-with-icon">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Password
                {isLogin && <Link to="#" className="forgot-link" onClick={(e) => e.preventDefault()}>Forgot password?</Link>}
              </label>
              <div className="input-with-icon">
                <span className="input-icon">🔒</span>
                <input
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  className="pwd-toggle"
                  onClick={() => setShowPwd(!showPwd)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="form-group">
                <label>I am a</label>
                <div className="role-select">
                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="traveler"
                      checked={form.role === 'traveler'}
                      onChange={handleChange}
                    />
                    <span className="role-label">🧳 Traveler</span>
                  </label>
                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="host"
                      checked={form.role === 'host'}
                      onChange={handleChange}
                    />
                    <span className="role-label">🏠 Host</span>
                  </label>
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary auth-btn" disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
            </button>
          </form>

          {isLogin && (
            <div className="demo-creds">
              <p>Try a demo account:</p>
              <div className="demo-row">
                <button type="button" className="demo-btn" onClick={() => fillDemo('traveler')}>🧳 Traveler</button>
                <button type="button" className="demo-btn" onClick={() => fillDemo('host')}>🏠 Host</button>
              </div>
            </div>
          )}

          <p className="auth-switch">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button className="switch-btn" type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
