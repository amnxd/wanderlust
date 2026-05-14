import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { firstImg } from '../utils/image';
import './ListingCard.css';

const ListingCard = ({ listing, onWishlistToggle }) => {
  const { user, isWishlisted, toggleWishlist } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const wishlisted = listing?._id ? isWishlisted(listing._id) : false;

  const imageUrl = firstImg(listing, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&fit=crop');

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast?.info('Please log in to save properties');
      navigate('/auth');
      return;
    }
    setBusy(true);
    try {
      await toggleWishlist(listing._id);
      const nowSaved = !wishlisted;
      toast?.success(nowSaved ? 'Added to wishlist ❤️' : 'Removed from wishlist');
      if (onWishlistToggle) onWishlistToggle(listing._id);
    } catch {
      toast?.error('Could not update wishlist');
    }
    setBusy(false);
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const partial = rating - full;
    return (
      <span className="star-row">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`star ${i < full ? 'full' : i === full && partial >= 0.5 ? 'half' : 'empty'}`}>★</span>
        ))}
      </span>
    );
  };

  return (
    <div className="listing-card">
      <Link to={`/listing/${listing?._id}`} className="listing-card-link">
        <div className="listing-img-wrapper">
          <img src={imageUrl} alt={listing?.title} className="listing-img" loading="lazy" />
          <div className="listing-overlay" />
          <span className="listing-category-badge">{listing?.category || 'Stay'}</span>
          <button
            className={`wishlist-btn ${wishlisted ? 'wishlisted' : ''} ${busy ? 'loading' : ''}`}
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            type="button"
          >
            {wishlisted ? '❤️' : '🤍'}
          </button>
          <div className="listing-price-overlay">
            <span className="price-overlay-amount">₹{listing?.price?.toLocaleString()}</span>
            <span className="price-overlay-per">/night</span>
          </div>
        </div>

        <div className="listing-info">
          <div className="listing-header">
            <h3 className="listing-title">{listing?.title}</h3>
          </div>
          <p className="listing-location">
            <span className="location-pin">📍</span>
            {listing?.location}
          </p>
          <div className="listing-footer">
            <div className="listing-rating">
              {listing?.averageRating ? (
                <>
                  {renderStars(listing.averageRating)}
                  <span className="rating-num">{listing.averageRating}</span>
                  <span className="rating-count">({listing.numReviews})</span>
                </>
              ) : (
                <span className="new-badge">✨ New</span>
              )}
            </div>
          </div>
          {listing?.amenities?.length > 0 && (
            <div className="listing-amenities">
              {listing.amenities.slice(0, 3).map(a => (
                <span key={a} className="amenity-pill">{a}</span>
              ))}
              {listing.amenities.length > 3 && <span className="amenity-pill more">+{listing.amenities.length - 3}</span>}
            </div>
          )}
          <div className="listing-cta">
            <span className="view-details-text">View Details →</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
