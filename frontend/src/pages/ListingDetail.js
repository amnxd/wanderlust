import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import PaymentGateway from '../components/PaymentGateway';
import Receipt from '../components/Receipt';
import { resolveImg as resolveImgUtil } from '../utils/image';
import './ListingDetail.css';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&fit=crop';

const ListingDetail = () => {
  const { id } = useParams();
  const { user, isWishlisted, toggleWishlist } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [mainImg, setMainImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const [booking, setBooking] = useState({ checkIn: '', checkOut: '', guests: 1 });
  const [bookingLoading, setBookingLoading] = useState(false);

  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listRes, revRes] = await Promise.all([
          axios.get(`/api/listings/${id}`),
          axios.get(`/api/reviews/${id}`)
        ]);
        setListing(listRes.data);
        setReviews(revRes.data);
      } catch {
        toast.error('Could not load this listing');
        navigate('/explore');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [id]);

  const calcNights = () => {
    if (!booking.checkIn || !booking.checkOut) return 0;
    const diff = new Date(booking.checkOut) - new Date(booking.checkIn);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const nights = calcNights();
  const subtotal = listing ? nights * listing.price : 0;
  const cleaningFee = subtotal > 0 ? 500 : 0;
  const serviceFee = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;
  const totalPrice = subtotal + cleaningFee + serviceFee;

  const handleBook = async () => {
    if (!user) {
      toast.info('Please log in to book this stay');
      navigate('/auth');
      return;
    }
    if (!booking.checkIn || !booking.checkOut) {
      toast.error('Please select check-in and check-out dates.');
      return;
    }
    if (nights <= 0) {
      toast.error('Check-out must be after check-in.');
      return;
    }
    setBookingLoading(true);
    try {
      const res = await axios.post('/api/bookings', {
        listingId: id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests
      });
      setPendingBooking(res.data);
      setPaymentOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
    setBookingLoading(false);
  };

  const handleReview = async () => {
    if (!user) { navigate('/auth'); return; }
    if (!review.comment.trim()) {
      toast.error('Please write a comment.');
      return;
    }
    setReviewLoading(true);
    try {
      const res = await axios.post('/api/reviews', {
        listingId: id,
        rating: review.rating,
        comment: review.comment
      });
      setReviews([res.data, ...reviews]);
      setReview({ rating: 5, comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting review');
    }
    setReviewLoading(false);
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.info('Please log in to save properties');
      navigate('/auth');
      return;
    }
    try {
      await toggleWishlist(id);
      toast.success(isWishlisted(id) ? 'Removed from wishlist' : 'Added to wishlist ❤️');
    } catch {
      toast.error('Could not update wishlist');
    }
  };

  const handlePaymentSuccess = (bookingData) => {
    setPaymentOpen(false);
    setPendingBooking(null);
    setConfirmedBooking(bookingData);
    setBooking({ checkIn: '', checkOut: '', guests: 1 });
    toast.success('🎉 Booking confirmed! View your trips for the receipt.');
  };

  const handleShare = (channel) => {
    const url = window.location.href;
    const text = `Check out ${listing.title} on Wanderlust!`;
    if (channel === 'copy') {
      navigator.clipboard?.writeText(url);
      toast.success('Link copied to clipboard!');
    } else {
      const links = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      };
      window.open(links[channel], '_blank', 'noopener,noreferrer');
    }
    setShareOpen(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size="lg" label="Loading property..." />
      </div>
    );
  }
  if (!listing) return null;

  const resolveImg = (img) => resolveImgUtil(img, FALLBACK_IMG);
  const imgs = listing.images?.length > 0 ? listing.images : [];
  const heroImg = imgs.length > 0 ? resolveImg(imgs[mainImg]) : FALLBACK_IMG;
  const wishlisted = isWishlisted(id);
  const hasReviewed = user && reviews.some(r => r.user?._id === user._id);

  return (
    <div className="detail-page">
      <div className="detail-container">

        {/* HEADER */}
        <div className="detail-header">
          <h1 className="detail-title">{listing.title}</h1>
          <div className="detail-header-meta">
            <div className="detail-meta-left">
              {listing.averageRating > 0 && (
                <span className="meta-rating">★ {listing.averageRating} <span className="meta-dim">({listing.numReviews} reviews)</span></span>
              )}
              <span className="meta-dim">·</span>
              <span className="meta-location">📍 {listing.location}</span>
            </div>
            <div className="detail-meta-right">
              <button className="detail-action" onClick={() => setShareOpen(true)} type="button">
                ↗ Share
              </button>
              <button className={`detail-action ${wishlisted ? 'active' : ''}`} onClick={handleWishlist} type="button">
                {wishlisted ? '❤️ Saved' : '🤍 Save'}
              </button>
            </div>
          </div>
        </div>

        {/* GALLERY */}
        <div className="detail-gallery">
          <button className="gallery-main" onClick={() => setGalleryOpen(true)} type="button">
            <img src={heroImg} alt={listing.title} />
            {imgs.length > 1 && <span className="gallery-show-all">⊞ Show all photos</span>}
          </button>
          {imgs.length > 1 && (
            <div className="gallery-thumbs">
              {imgs.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  className={`gallery-thumb ${mainImg === i ? 'active' : ''}`}
                  onClick={() => setMainImg(i)}
                  type="button"
                >
                  <img src={resolveImg(img)} alt={`view ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* MAIN GRID */}
        <div className="detail-grid">
          <div className="detail-main">
            <div className="detail-host-row">
              <div className="detail-host-info">
                <div className="host-avatar">{listing.host?.name?.[0]?.toUpperCase() || 'H'}</div>
                <div>
                  <h3>Hosted by {listing.host?.name || 'Host'}</h3>
                  <p>Category: <strong>{listing.category}</strong></p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h2>About this place</h2>
              <p className="detail-description">{listing.description}</p>
            </div>

            {listing.amenities?.length > 0 && (
              <div className="detail-section">
                <h2>What this place offers</h2>
                <div className="amenities-grid">
                  {listing.amenities.map(a => (
                    <div key={a} className="amenity-item">
                      <span>✓</span> {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REVIEWS */}
            <div className="detail-section">
              <h2>
                {listing.averageRating > 0
                  ? `★ ${listing.averageRating} · ${reviews.length} review${reviews.length !== 1 ? 's' : ''}`
                  : 'Reviews'}
              </h2>

              {user && !hasReviewed && (
                <div className="review-form">
                  <h4>Leave a review</h4>
                  <div className="rating-input">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        type="button"
                        className={`star-btn ${n <= review.rating ? 'active' : ''}`}
                        onClick={() => setReview({ ...review, rating: n })}
                      >★</button>
                    ))}
                    <span className="rating-text">{review.rating} / 5</span>
                  </div>
                  <textarea
                    placeholder="Share your experience..."
                    value={review.comment}
                    onChange={e => setReview({ ...review, comment: e.target.value })}
                  />
                  <button className="btn-primary" onClick={handleReview} disabled={reviewLoading}>
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              )}

              {hasReviewed && <p className="review-already">✓ You have already reviewed this stay.</p>}

              {reviews.length === 0 ? (
                <EmptyState icon="✍️" title="No reviews yet" description="Be the first to share your experience!" />
              ) : (
                <div className="reviews-list">
                  {reviews.map(r => (
                    <div key={r._id} className="review-card">
                      <div className="review-header">
                        <div className="review-avatar">{r.user?.name?.[0]?.toUpperCase() || 'U'}</div>
                        <div>
                          <strong>{r.user?.name || 'Guest'}</strong>
                          <p className="review-date">{new Date(r.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="review-rating">{'★'.repeat(r.rating)}<span className="review-rating-empty">{'★'.repeat(5 - r.rating)}</span></div>
                      </div>
                      <p className="review-comment">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* BOOKING SIDEBAR */}
          <aside className="booking-card">
            <div className="booking-price-row">
              <span className="booking-price">₹{listing.price?.toLocaleString()}</span>
              <span className="booking-per">/night</span>
            </div>

            <div className="booking-fields">
              <div className="booking-row-2">
                <div className="booking-field">
                  <label>Check In</label>
                  <input
                    type="date"
                    value={booking.checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setBooking({ ...booking, checkIn: e.target.value })}
                  />
                </div>
                <div className="booking-field">
                  <label>Check Out</label>
                  <input
                    type="date"
                    value={booking.checkOut}
                    min={booking.checkIn || new Date().toISOString().split('T')[0]}
                    onChange={e => setBooking({ ...booking, checkOut: e.target.value })}
                  />
                </div>
              </div>
              <div className="booking-field">
                <label>Guests</label>
                <select value={booking.guests} onChange={e => setBooking({ ...booking, guests: Number(e.target.value) })}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
            </div>

            {nights > 0 && (
              <div className="price-breakdown">
                <div className="price-row"><span>₹{listing.price?.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="price-row"><span>Cleaning fee</span><span>₹{cleaningFee.toLocaleString()}</span></div>
                <div className="price-row"><span>Service fee (5%)</span><span>₹{serviceFee.toLocaleString()}</span></div>
                <div className="price-divider" />
                <div className="price-row total"><span>Total</span><span>₹{totalPrice.toLocaleString()}</span></div>
              </div>
            )}

            <button
              className="btn-primary booking-btn"
              onClick={handleBook}
              disabled={bookingLoading || nights <= 0}
            >
              {bookingLoading ? 'Reserving...' : 'Reserve & Pay'}
            </button>
            <p className="booking-note">You won't be charged yet.</p>
          </aside>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      <Modal
        open={paymentOpen && !!pendingBooking}
        onClose={() => setPaymentOpen(false)}
        title="Confirm and Pay"
        size="md"
        closeable={true}
      >
        {pendingBooking && (
          <PaymentGateway
            booking={pendingBooking}
            listing={listing}
            heroImg={heroImg}
            onSuccess={handlePaymentSuccess}
            onClose={() => setPaymentOpen(false)}
          />
        )}
      </Modal>

      {/* CONFIRMATION + RECEIPT */}
      <Modal
        open={!!confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
        title="Booking Confirmed 🎉"
        size="lg"
      >
        {confirmedBooking && (
          <>
            <Receipt
              booking={confirmedBooking}
              listing={listing}
              user={user}
              onClose={null}
            />
            <div className="receipt-actions" style={{ marginTop: 24 }}>
              <button className="btn-outline" onClick={() => window.print()}>🖨️ Print Receipt</button>
              <button className="btn-primary" onClick={() => navigate('/traveler/dashboard')}>View My Trips →</button>
            </div>
          </>
        )}
      </Modal>

      {/* GALLERY MODAL */}
      <Modal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        title={`${listing.title} — ${imgs.length} photos`}
        size="xl"
      >
        <div className="gallery-modal-grid">
          {imgs.map((img, i) => (
            <img key={i} src={resolveImg(img)} alt={`gallery ${i + 1}`} />
          ))}
        </div>
      </Modal>

      {/* SHARE MODAL */}
      <Modal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title="Share this stay"
        size="sm"
      >
        <div className="share-grid">
          <button className="share-btn" onClick={() => handleShare('whatsapp')}><span>💬</span> WhatsApp</button>
          <button className="share-btn" onClick={() => handleShare('twitter')}><span>🐦</span> Twitter</button>
          <button className="share-btn" onClick={() => handleShare('facebook')}><span>📘</span> Facebook</button>
          <button className="share-btn" onClick={() => handleShare('copy')}><span>🔗</span> Copy Link</button>
        </div>
      </Modal>
    </div>
  );
};

export default ListingDetail;
