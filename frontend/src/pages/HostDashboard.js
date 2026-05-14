import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/EmptyState';
import { resolveImg, firstImg } from '../utils/image';
import './Dashboard.css';

const HostDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [form, setForm] = useState({ title: '', description: '', price: '', location: '', category: 'Cities', amenities: '' });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [formMsg, setFormMsg] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [listRes, bookRes] = await Promise.all([
        axios.get('/api/listings/host/my'),
        axios.get('/api/bookings/host')
      ]);
      setListings(listRes.data);
      setBookings(bookRes.data);
    } catch {}
  };

  const handleFormChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setFormMsg('');
    if (!form.title || !form.description || !form.price || !form.location) {
      setFormMsg('Please fill all required fields.'); return;
    }
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    images.forEach(img => data.append('images', img));
    try {
      if (editId) {
        await axios.put(`/api/listings/${editId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Listing updated!');
        setFormMsg('✅ Listing updated!');
        setEditId(null);
      } else {
        await axios.post('/api/listings', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Listing created!');
        setFormMsg('✅ Listing created!');
      }
      setForm({ title: '', description: '', price: '', location: '', category: 'Cities', amenities: '' });
      setImages([]);
      setExistingImages([]);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error saving listing.';
      setFormMsg(msg);
      toast.error(msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await axios.delete(`/api/listings/${id}`);
      setListings(listings.filter(l => l._id !== id));
      toast.success('Listing deleted');
    } catch {
      toast.error('Could not delete listing');
    }
  };

  const handleEdit = (listing) => {
    setForm({
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: listing.location,
      category: listing.category,
      amenities: listing.amenities?.join(', ') || ''
    });
    setExistingImages(listing.images || []);
    setImages([]);
    setFormMsg('');
    setEditId(listing._id);
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setExistingImages([]);
    setImages([]);
    setForm({ title: '', description: '', price: '', location: '', category: 'Cities', amenities: '' });
    setFormMsg('');
  };

  const removeImagePreview = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await axios.put(`/api/bookings/${id}/status`, { status });
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
      toast.success(`Booking ${status}`);
    } catch {
      toast.error('Could not update booking');
    }
  };

  const revenue = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div className="dashboard">
      <div className="dash-sidebar">
        <div className="dash-user">
          <div className="dash-avatar">{user?.name[0]?.toUpperCase()}</div>
          <div>
            <p className="dash-user-name">{user?.name}</p>
            <p className="dash-user-role">Host</p>
          </div>
        </div>
        <nav className="dash-nav">
          {[
            { id: 'overview', icon: '🏠', label: 'Dashboard' },
            { id: 'listings', icon: '🏘️', label: 'My Listings' },
            { id: 'add', icon: '➕', label: 'Add Listing' },
            { id: 'bookings', icon: '📋', label: 'Bookings' },
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
        {/* Overview */}
        {activeTab === 'overview' && (
          <div>
            <h1 className="dash-heading">Welcome to Your Host Dashboard</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">🏡</span>
                <div><p className="stat-label">Total Listings</p><p className="stat-value">{listings.length}</p></div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📋</span>
                <div><p className="stat-label">Total Bookings</p><p className="stat-value">{bookings.length}</p></div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">💰</span>
                <div><p className="stat-label">Total Revenue</p><p className="stat-value">₹{revenue.toLocaleString()}</p></div>
              </div>
            </div>

            <h2 className="panel-title" style={{ marginTop: '32px', marginBottom: '16px' }}>My Listings</h2>
            <div className="listings-table">
              <div className="table-header">
                <span>Image</span><span>Title</span><span>Price</span><span>Actions</span>
              </div>
              {listings.map(l => (
                <div key={l._id} className="table-row">
                  <img
                    src={firstImg(l)}
                    alt={l.title} className="table-img"
                  />
                  <span className="table-title">{l.title}</span>
                  <span>₹{l.price.toLocaleString()}/night</span>
                  <div className="table-actions">
                    <button className="btn-outline btn-sm" onClick={() => handleEdit(l)}>Edit</button>
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(l._id)}>Delete</button>
                  </div>
                </div>
              ))}
              {listings.length === 0 && (
                <EmptyState
                  icon="🏘️"
                  title="No listings yet"
                  description="Add your first property to start hosting travellers."
                  action={<button className="btn-primary" onClick={() => setActiveTab('add')}>+ Add Listing</button>}
                />
              )}
            </div>
          </div>
        )}

        {/* My Listings */}
        {activeTab === 'listings' && (
          <div>
            <h1 className="dash-heading">My Listings</h1>
            <div className="listings-table">
              <div className="table-header">
                <span>Image</span><span>Title</span><span>Price</span><span>Rating</span><span>Actions</span>
              </div>
              {listings.map(l => (
                <div key={l._id} className="table-row">
                  <img
                    src={firstImg(l)}
                    alt={l.title} className="table-img"
                  />
                  <span className="table-title">{l.title}<br/><small style={{ color: 'var(--text-light)' }}>📍 {l.location}</small></span>
                  <span>₹{l.price.toLocaleString()}/night</span>
                  <span>⭐ {l.averageRating || 'New'}</span>
                  <div className="table-actions">
                    <button className="btn-outline btn-sm" onClick={() => handleEdit(l)}>Edit</button>
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(l._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add/Edit Listing */}
        {activeTab === 'add' && (
          <div>
            <h1 className="dash-heading">{editId ? 'Edit Listing' : 'Add New Listing'}</h1>
            <div className="add-listing-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Title *</label>
                  <input name="title" value={form.title} onChange={handleFormChange} placeholder="e.g. Cozy Beach House" />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input name="location" value={form.location} onChange={handleFormChange} placeholder="e.g. Goa, India" />
                </div>
                <div className="form-group">
                  <label>Price per night (₹) *</label>
                  <input type="number" name="price" value={form.price} onChange={handleFormChange} placeholder="e.g. 3500" />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={form.category} onChange={handleFormChange}>
                    {['Beach', 'Mountains', 'Cities', 'Villas'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea name="description" rows="4" value={form.description} onChange={handleFormChange} placeholder="Describe your property..." />
              </div>
              <div className="form-group">
                <label>Amenities (comma-separated)</label>
                <input name="amenities" value={form.amenities} onChange={handleFormChange} placeholder="WiFi, Pool, Air Conditioning, Parking" />
              </div>
              {editId && existingImages.length > 0 && (
                <div className="form-group">
                  <label>Current Images</label>
                  <div className="img-preview-grid">
                    {existingImages.map((img, i) => (
                      <div key={i} className="img-preview-item">
                        <img src={resolveImg(img)} alt={`existing ${i}`} />
                      </div>
                    ))}
                  </div>
                  <p className="img-helper">Uploading new images will replace these.</p>
                </div>
              )}
              <div className="form-group">
                <label>{editId ? 'Replace Images' : 'Upload Images (max 5)'}</label>
                <label className="file-drop">
                  <input type="file" multiple accept="image/*" onChange={e => setImages(Array.from(e.target.files).slice(0, 5))} />
                  <span className="file-drop-icon">📷</span>
                  <span className="file-drop-text">
                    {images.length > 0 ? `${images.length} image(s) selected` : 'Click to select images'}
                  </span>
                  <span className="file-drop-hint">JPG, PNG, WEBP · Max 5MB each</span>
                </label>
                {images.length > 0 && (
                  <div className="img-preview-grid">
                    {images.map((file, i) => (
                      <div key={i} className="img-preview-item">
                        <img src={URL.createObjectURL(file)} alt={`preview ${i}`} />
                        <button type="button" className="img-preview-remove" onClick={() => removeImagePreview(i)}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {formMsg && <p className={`form-msg ${formMsg.startsWith('✅') ? 'success' : ''}`}>{formMsg}</p>}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-primary" onClick={handleSubmit}>
                  {editId ? '💾 Update Listing' : '➕ Create Listing'}
                </button>
                {editId && (
                  <button className="btn-outline" onClick={cancelEdit}>
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bookings */}
        {activeTab === 'bookings' && (
          <div>
            <h1 className="dash-heading">Bookings</h1>
            <div className="listings-table bookings-table">
              <div className="table-header">
                <span>Guest</span><span>Property</span><span>Dates</span><span>Total</span><span>Status</span><span>Actions</span>
              </div>
              {bookings.map(b => (
                <div key={b._id} className="table-row">
                  <span className="table-title">{b.traveler?.name}<br/><small style={{ color: 'var(--text-light)' }}>{b.traveler?.email}</small></span>
                  <span>{b.listing?.title}</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-mid)' }}>
                    {new Date(b.checkIn).toLocaleDateString()} →<br/>{new Date(b.checkOut).toLocaleDateString()}
                  </span>
                  <span style={{ fontWeight: 700 }}>₹{b.totalPrice?.toLocaleString()}</span>
                  <span><span className={`badge badge-${b.status}`}>{b.status}</span></span>
                  <div className="table-actions">
                    {b.status === 'pending' && (
                      <>
                        <button className="btn-outline btn-sm" style={{ color: '#15803d', borderColor: '#15803d' }}
                          onClick={() => updateBookingStatus(b._id, 'confirmed')}>Confirm</button>
                        <button className="btn-danger btn-sm"
                          onClick={() => updateBookingStatus(b._id, 'cancelled')}>Decline</button>
                      </>
                    )}
                    {b.status === 'confirmed' && (
                      <button className="btn-outline btn-sm" onClick={() => updateBookingStatus(b._id, 'completed')}>Mark Completed</button>
                    )}
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <EmptyState
                  icon="📋"
                  title="No bookings yet"
                  description="Bookings from travellers will appear here."
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostDashboard;