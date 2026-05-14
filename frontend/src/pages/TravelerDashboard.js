import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import Receipt from '../components/Receipt';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';
import { firstImg } from '../utils/image';
import './Dashboard.css';

const TravelerDashboard = ({ initialTab = 'overview' }) => {
  const { user, refreshWishlist } = useAuth();
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [receiptBooking, setReceiptBooking] = useState(null);

  useEffect(() => { setActiveTab(initialTab); }, [initialTab]);

  const fetchData = async () => {
    try {
      const [bookRes, profileRes] = await Promise.all([
        axios.get('/api/bookings/my'),
        axios.get('/api/users/profile')
      ]);
      setBookings(bookRes.data);
      setWishlist(profileRes.data.wishlist || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axios.put(`/api/bookings/${id}/status`, { status: 'cancelled' });
      setBookings(bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch {
      toast.error('Could not cancel booking');
    }
  };

  const removeWishlist = async (listingId) => {
    try {
      const res = await axios.post(`/api/users/wishlist/${listingId}`);
      setWishlist(res.data.wishlist);
      if (refreshWishlist) refreshWishlist();
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Could not update wishlist');
    }
  };

  const upcomingStays = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');

  return (
    <div className="dashboard">
      <div className="dash-sidebar">
        <div className="dash-user">
          <div className="dash-avatar">{user?.name[0]?.toUpperCase()}</div>
          <div>
            <p className="dash-user-name">{user?.name}</p>
            <p className="dash-user-role">Traveler</p>
          </div>
        </div>
        <nav className="dash-nav">
          {[
            { id: 'overview', icon: '🏠', label: 'Dashboard' },
            { id: 'bookings', icon: '📋', label: 'My Bookings' },
            { id: 'wishlist', icon: '💖', label: 'Wishlist' },
            { id: 'profile', icon: '👤', label: 'Profile' },
          ].map(item => (
            <button
              key={item.id}
              className={`dash-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="dash-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h1 className="dash-heading">Welcome Back, {user?.name.split(' ')[0]}! 👋</h1>
            <p className="dash-subheading">Here's an overview of your activities.</p>

            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">🧳</span>
                <div>
                  <p className="stat-label">Total Bookings</p>
                  <p className="stat-value">{bookings.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📅</span>
                <div>
                  <p className="stat-label">Upcoming Stays</p>
                  <p className="stat-value">{upcomingStays.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">💖</span>
                <div>
                  <p className="stat-label">Wishlist</p>
                  <p className="stat-value">{wishlist.length}</p>
                </div>
              </div>
            </div>

            <div className="overview-grid">
              <div className="overview-panel">
                <h2 className="panel-title">My Bookings</h2>
                {bookings.slice(0, 3).map(b => (
                  <div key={b._id} className="booking-row">
                    <img
                      src={firstImg(b.listing)}
                      alt={b.listing?.title}
                      className="booking-img"
                    />
                    <div className="booking-info">
                      <p className="booking-title">{b.listing?.title}</p>
                      <p className="booking-dates">
                        {new Date(b.checkIn).toLocaleDateString()} – {new Date(b.checkOut).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`badge badge-${b.status}`}>{b.status}</span>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <p className="empty-msg">No bookings yet. <Link to="/explore">Explore now →</Link></p>
                )}
              </div>

              <div className="overview-panel">
                <h2 className="panel-title">My Wishlist</h2>
                {wishlist.slice(0, 3).map(item => (
                  <div key={item._id} className="booking-row">
                    <img
                      src={firstImg(item)}
                      alt={item.title}
                      className="booking-img"
                    />
                    <div className="booking-info">
                      <p className="booking-title">{item.title}</p>
                      <p className="booking-dates">📍 {item.location}</p>
                    </div>
                    <Link to={`/listing/${item._id}`} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>View</Link>
                  </div>
                ))}
                {wishlist.length === 0 && <p className="empty-msg">No saved properties.</p>}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h1 className="dash-heading">My Bookings</h1>
            {loading ? <Spinner size="md" label="Loading bookings..." /> : bookings.length === 0 ? (
              <EmptyState
                icon="🧳"
                title="No bookings yet"
                description="Your future adventures are just a click away."
                action={<Link to="/explore" className="btn-primary">Explore Stays →</Link>}
              />
            ) : (
              <div className="bookings-list">
                {bookings.map(b => (
                  <div key={b._id} className="booking-card-full">
                    <img
                      src={firstImg(b.listing)}
                      alt={b.listing?.title}
                      className="booking-card-img"
                    />
                    <div className="booking-card-info">
                      <h3>{b.listing?.title}</h3>
                      <p>📍 {b.listing?.location}</p>
                      <p>📅 {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}</p>
                      <p>👥 {b.guests} guest{b.guests > 1 ? 's' : ''}</p>
                      <p className="booking-total">Total: ₹{b.totalPrice?.toLocaleString()}</p>
                    </div>
                    <div className="booking-card-actions">
                      <span className={`badge badge-${b.status}`}>{b.status}</span>
                      {b.payment?.status === 'paid' && (
                        <button className="btn-outline" style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                          onClick={() => setReceiptBooking(b)}>
                          🧾 Receipt
                        </button>
                      )}
                      {(b.status === 'pending' || b.status === 'confirmed') && (
                        <button className="btn-outline" style={{ color: '#e05a5a', borderColor: '#e05a5a', fontSize: '0.82rem', padding: '6px 14px' }}
                          onClick={() => cancelBooking(b._id)}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div>
            <h1 className="dash-heading">My Wishlist 💖</h1>
            {wishlist.length === 0 ? (
              <EmptyState
                icon="💖"
                title="Your wishlist is empty"
                description="Save your favourite stays here so you can come back to them later."
                action={<Link to="/explore" className="btn-primary">Browse Stays →</Link>}
              />
            ) : (
              <div className="wishlist-grid">
                {wishlist.map(item => (
                  <div key={item._id} className="wishlist-card">
                    <img
                      src={firstImg(item)}
                      alt={item.title}
                      className="wishlist-img"
                    />
                    <div className="wishlist-info">
                      <h3>{item.title}</h3>
                      <p>📍 {item.location}</p>
                      <p>₹{item.price?.toLocaleString()}/night</p>
                      <div className="wishlist-actions">
                        <Link to={`/listing/${item._id}`} className="btn-primary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>View</Link>
                        <button className="btn-outline" style={{ color: '#e05a5a', borderColor: '#e05a5a', fontSize: '0.85rem', padding: '8px 16px' }}
                          onClick={() => removeWishlist(item._id)}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && <ProfilePanel user={user} />}
      </div>

      <Modal
        open={!!receiptBooking}
        onClose={() => setReceiptBooking(null)}
        title="Booking Receipt"
        size="lg"
      >
        {receiptBooking && (
          <Receipt
            booking={receiptBooking}
            listing={receiptBooking.listing}
            user={user}
            onClose={() => setReceiptBooking(null)}
          />
        )}
      </Modal>
    </div>
  );
};

const ProfilePanel = ({ user }) => {
  const toast = useToast();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.name.trim() || !form.email.trim()) { toast.error('Name and email are required.'); return; }
    setSaving(true);
    try {
      await axios.put('/api/users/profile', { name: form.name, email: form.email });
      const stored = JSON.parse(localStorage.getItem('wanderlust_user') || '{}');
      const updated = { ...stored, name: form.name, email: form.email };
      localStorage.setItem('wanderlust_user', JSON.stringify(updated));
      toast.success('Profile updated! Refresh to see your name in the header.');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="dash-heading">My Profile</h1>
      <p className="dash-subheading">Manage your personal information and preferences.</p>
      <div className="profile-card profile-card-editable">
        <div className="profile-avatar">{(form.name || user?.name || 'U')[0]?.toUpperCase()}</div>
        <div className="profile-details" style={{ flex: 1 }}>
          {!editing ? (
            <>
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> Traveler</p>
              <button className="btn-outline" style={{ marginTop: 12 }} onClick={() => setEditing(true)}>✏️ Edit Profile</button>
            </>
          ) : (
            <>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label>Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                <button className="btn-outline" onClick={() => { setEditing(false); setForm({ name: user?.name || '', email: user?.email || '' }); }}>Cancel</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelerDashboard;