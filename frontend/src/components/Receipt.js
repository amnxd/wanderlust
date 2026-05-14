import React from 'react';
import { firstImg } from '../utils/image';
import './Receipt.css';

const Receipt = ({ booking, listing, user, onClose }) => {
  const handlePrint = () => window.print();

  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const nights = Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)));
  const subtotal = nights * (listing?.price || (booking.totalPrice / nights));
  const cleaningFee = 500;
  const serviceFee = Math.max(0, booking.totalPrice - subtotal - cleaningFee);

  return (
    <div className="receipt">
      <div className="receipt-header">
        <div>
          <div className="receipt-brand">🎈 WANDERLUST</div>
          <p className="receipt-tagline">Booking Confirmation</p>
        </div>
        <div className="receipt-meta">
          <p><strong>Booking ID:</strong> {booking._id?.slice(-10).toUpperCase()}</p>
          <p><strong>Issued:</strong> {new Date().toLocaleDateString()}</p>
          <span className={`badge badge-${booking.status}`}>{booking.status}</span>
        </div>
      </div>

      <div className="receipt-section">
        <h3>Guest Details</h3>
        <div className="receipt-grid-2">
          <div><span>Name</span><strong>{user?.name || booking.traveler?.name || '—'}</strong></div>
          <div><span>Email</span><strong>{user?.email || booking.traveler?.email || '—'}</strong></div>
          <div><span>Guests</span><strong>{booking.guests}</strong></div>
        </div>
      </div>

      <div className="receipt-section">
        <h3>Stay Details</h3>
        <div className="receipt-property">
          {listing?.images?.[0] && (
            <img src={firstImg(listing)} alt="" />
          )}
          <div>
            <h4>{listing?.title || booking.listing?.title}</h4>
            <p>📍 {listing?.location || booking.listing?.location}</p>
            <p>{listing?.category} · Hosted by {listing?.host?.name || 'Wanderlust'}</p>
          </div>
        </div>
        <div className="receipt-grid-2">
          <div><span>Check-in</span><strong>{checkIn.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</strong></div>
          <div><span>Check-out</span><strong>{checkOut.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</strong></div>
          <div><span>Nights</span><strong>{nights}</strong></div>
        </div>
      </div>

      <div className="receipt-section">
        <h3>Payment Summary</h3>
        <div className="receipt-line"><span>₹{listing?.price?.toLocaleString() || (subtotal/nights).toFixed(0)} × {nights} night{nights > 1 ? 's' : ''}</span><span>₹{subtotal.toLocaleString()}</span></div>
        <div className="receipt-line"><span>Cleaning fee</span><span>₹{cleaningFee.toLocaleString()}</span></div>
        <div className="receipt-line"><span>Service fee</span><span>₹{serviceFee.toLocaleString()}</span></div>
        <div className="receipt-line total"><span>Total Paid</span><span>₹{booking.totalPrice?.toLocaleString()}</span></div>
      </div>

      {booking.payment?.transactionId && (
        <div className="receipt-section receipt-payment">
          <h3>Payment Confirmation</h3>
          <div className="receipt-grid-2">
            <div><span>Method</span><strong>{(booking.payment.method || 'card').toUpperCase()}</strong></div>
            <div><span>Status</span><strong style={{ color: '#065f46' }}>{booking.payment.status?.toUpperCase()}</strong></div>
            <div><span>Transaction ID</span><strong className="receipt-txn">{booking.payment.transactionId}</strong></div>
            <div><span>Paid On</span><strong>{booking.payment.paidAt ? new Date(booking.payment.paidAt).toLocaleString() : '—'}</strong></div>
          </div>
        </div>
      )}

      <div className="receipt-footer">
        <p><strong>Need help?</strong> Email us at support@wanderlust.com or call +91 98765 43210</p>
        <p className="receipt-fineprint">This is a computer-generated receipt. No signature is required. Wanderlust Pvt. Ltd. · CIN U99999XX9999XXX999999 · GSTIN 99XXXXX9999X9X9</p>
      </div>

      {onClose && (
        <div className="receipt-actions no-print">
          <button className="btn-outline" onClick={onClose}>Close</button>
          <button className="btn-primary" onClick={handlePrint}>🖨️ Print / Save as PDF</button>
        </div>
      )}
    </div>
  );
};

export default Receipt;
