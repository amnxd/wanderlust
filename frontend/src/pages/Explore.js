import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import ListingCard from '../components/ListingCard';
import './Explore.css';

const AMENITY_OPTIONS = [
  'WiFi', 'Pool', 'Air Conditioning', 'Free Parking',
  'Breakfast Included', 'Beachfront', 'Mountain View',
  'Fireplace', 'Restaurant', 'Chef'
];

const CATEGORIES = [
  { value: '', label: 'All', icon: '✨' },
  { value: 'Beach', label: 'Beach', icon: '🏖️' },
  { value: 'Mountains', label: 'Mountains', icon: '🏔️' },
  { value: 'Cities', label: 'Cities', icon: '🏙️' },
  { value: 'Villas', label: 'Villas', icon: '🏡' },
];

const RATING_OPTIONS = [
  { value: 0, label: 'Any' },
  { value: 4, label: '4★+' },
  { value: 4.5, label: '4.5★+' },
  { value: 4.8, label: '4.8★+' },
];

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: 0,
    maxPrice: 15000,
    minRating: 0,
    amenities: [],
    sort: 'default',
  });

  useEffect(() => {
    setLoading(true);
    axios.get('/api/listings')
      .then(res => setAllListings(res.data || []))
      .catch(() => setAllListings([]))
      .finally(() => setLoading(false));
  }, []);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (key === 'category') {
      const next = new URLSearchParams(searchParams);
      if (value) next.set('category', value); else next.delete('category');
      setSearchParams(next, { replace: true });
    }
  };

  const toggleAmenity = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const clearAll = () => {
    setFilters({
      search: '', category: '', minPrice: 0, maxPrice: 15000,
      minRating: 0, amenities: [], sort: 'default'
    });
    setSearchParams({}, { replace: true });
  };

  const filtered = allListings
    .filter(l => {
      if (!l) return false;
      if (filters.category && l.category !== filters.category) return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (
          !l.title?.toLowerCase().includes(s) &&
          !l.location?.toLowerCase().includes(s) &&
          !l.description?.toLowerCase().includes(s)
        ) return false;
      }
      const min = Math.min(filters.minPrice, filters.maxPrice);
      const max = Math.max(filters.minPrice, filters.maxPrice);
      if (l.price < min || l.price > max) return false;
      if (filters.minRating > 0 && (l.averageRating || 0) < filters.minRating) return false;
      if (filters.amenities.length > 0) {
        if (!filters.amenities.every(a => l.amenities?.includes(a))) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === 'price_asc') return a.price - b.price;
      if (filters.sort === 'price_desc') return b.price - a.price;
      if (filters.sort === 'rating') return (b.averageRating || 0) - (a.averageRating || 0);
      return 0;
    });

  const activeFilterCount = [
    filters.category,
    filters.minRating > 0,
    filters.amenities.length > 0,
    filters.maxPrice < 15000 || filters.minPrice > 0
  ].filter(Boolean).length;

  return (
    <div className="explore-page">
      {/* Topbar */}
      <div className="explore-topbar">
        <div className="explore-topbar-inner">
          <div className="explore-topbar-left">
            <button
              className="filter-toggle-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              type="button"
            >
              ⚙️ Filters
              {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
            </button>
            <div className="explore-search-mini">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search by title, location..."
                value={filters.search}
                onChange={e => updateFilter('search', e.target.value)}
              />
            </div>
          </div>
          <div className="explore-topbar-right">
            <span className="results-count">{filtered.length} properties</span>
            <select
              className="sort-select"
              value={filters.sort}
              onChange={e => updateFilter('sort', e.target.value)}
            >
              <option value="default">Recommended</option>
              <option value="rating">Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div className="category-pills-bar">
        {CATEGORIES.map(c => (
          <button
            key={c.value}
            className={`category-pill ${filters.category === c.value ? 'active' : ''}`}
            onClick={() => updateFilter('category', c.value)}
            type="button"
          >
            <span>{c.icon}</span> {c.label}
          </button>
        ))}
      </div>

      {/* Layout */}
      <div className={`explore-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <aside className={`filter-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button className="clear-all-btn" onClick={clearAll} type="button">Clear all</button>
          </div>

          <div className="filter-group">
            <label className="filter-label">Price Range</label>
            <div className="price-display">
              <span>₹{filters.minPrice.toLocaleString()}</span>
              <span>₹{filters.maxPrice.toLocaleString()}{filters.maxPrice >= 15000 ? '+' : ''}</span>
            </div>
            <div className="range-group">
              <input
                type="range"
                className="range-slider"
                min={0}
                max={15000}
                step={500}
                value={filters.minPrice}
                onChange={e => updateFilter('minPrice', Math.min(Number(e.target.value), filters.maxPrice - 500))}
              />
              <input
                type="range"
                className="range-slider"
                min={0}
                max={15000}
                step={500}
                value={filters.maxPrice}
                onChange={e => updateFilter('maxPrice', Math.max(Number(e.target.value), filters.minPrice + 500))}
              />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Minimum Rating</label>
            <div className="rating-options">
              {RATING_OPTIONS.map(r => (
                <button
                  key={r.value}
                  className={`rating-opt ${filters.minRating === r.value ? 'active' : ''}`}
                  onClick={() => updateFilter('minRating', r.value)}
                  type="button"
                >{r.label}</button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Amenities</label>
            <div className="amenity-checkboxes">
              {AMENITY_OPTIONS.map(a => (
                <label key={a} className="amenity-check">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(a)}
                    onChange={() => toggleAmenity(a)}
                  />
                  <span className="check-custom"></span>
                  {a}
                </label>
              ))}
            </div>
          </div>
        </aside>

        <main className="explore-main">
          {loading ? (
            <div className="explore-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-img" />
                  <div className="skeleton-body">
                    <div className="skeleton-line w-70" />
                    <div className="skeleton-line w-50" />
                    <div className="skeleton-line w-80" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <h3>No properties found</h3>
              <p>Try adjusting your filters or search query</p>
              <button className="btn-primary" onClick={clearAll}>Clear all filters</button>
            </div>
          ) : (
            <div className="explore-grid">
              {filtered.map(l => <ListingCard key={l._id} listing={l} />)}
            </div>
          )}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default Explore;
