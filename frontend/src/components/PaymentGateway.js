import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaymentGateway.css';

const METHODS = [
  { id: 'card', icon: '💳', label: 'Card', desc: 'Credit / Debit' },
  { id: 'upi', icon: '📱', label: 'UPI', desc: 'GPay, PhonePe, Paytm' },
  { id: 'netbanking', icon: '🏦', label: 'Net Banking', desc: '50+ banks' },
  { id: 'wallet', icon: '💰', label: 'Wallet', desc: 'Paytm, MobiKwik' },
  { id: 'cash', icon: '💵', label: 'Pay at Stay', desc: 'Pay on arrival' },
];

const BANKS = [
  { id: 'sbi', name: 'State Bank of India', icon: '🏛️' },
  { id: 'hdfc', name: 'HDFC Bank', icon: '🏦' },
  { id: 'icici', name: 'ICICI Bank', icon: '🏦' },
  { id: 'axis', name: 'Axis Bank', icon: '🏦' },
  { id: 'kotak', name: 'Kotak Mahindra', icon: '🏦' },
  { id: 'pnb', name: 'Punjab National Bank', icon: '🏛️' },
];

const WALLETS = [
  { id: 'paytm', name: 'Paytm', icon: '💙' },
  { id: 'mobikwik', name: 'MobiKwik', icon: '🔵' },
  { id: 'amazonpay', name: 'Amazon Pay', icon: '🛒' },
  { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
];

const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', icon: '🅖' },
  { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
  { id: 'paytm', name: 'Paytm', icon: '💙' },
  { id: 'bhim', name: 'BHIM', icon: '🇮🇳' },
];

const PaymentGateway = ({ booking, listing, heroImg, onSuccess, onClose }) => {
  const [step, setStep] = useState('method');
  const [method, setMethod] = useState('card');
  const [savedCards, setSavedCards] = useState([]);
  const [selectedSavedCard, setSelectedSavedCard] = useState(null);

  // Card fields
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '', save: false });

  // UPI
  const [upiId, setUpiId] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState('');

  // NetBanking
  const [selectedBank, setSelectedBank] = useState('');

  // Wallet
  const [selectedWallet, setSelectedWallet] = useState('');
  const [walletPhone, setWalletPhone] = useState('');

  // OTP
  const [otp, setOtp] = useState('');
  const [otpExpected] = useState('123456');

  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('wl_saved_cards') || '[]');
      setSavedCards(stored);
    } catch {}
  }, []);

  const formatCardNumber = (val) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (val) => {
    const v = val.replace(/\D/g, '').slice(0, 4);
    return v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v;
  };

  const detectCardBrand = (number) => {
    const n = number.replace(/\s/g, '');
    if (/^4/.test(n)) return { name: 'VISA', icon: '🟦' };
    if (/^5[1-5]/.test(n)) return { name: 'MasterCard', icon: '🟧' };
    if (/^3[47]/.test(n)) return { name: 'Amex', icon: '🟩' };
    if (/^6/.test(n)) return { name: 'RuPay', icon: '🟨' };
    return null;
  };

  const validateMethod = () => {
    setErr('');
    if (method === 'cash') return true;
    if (selectedSavedCard) return true;
    if (method === 'card') {
      const digits = card.number.replace(/\s+/g, '');
      if (digits.length < 12) return setErr('Please enter a valid card number.') && false;
      if (!card.name.trim()) return setErr('Please enter the cardholder name.') && false;
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) return setErr('Expiry must be MM/YY.') && false;
      const [mm, yy] = card.expiry.split('/').map(Number);
      if (mm < 1 || mm > 12) return setErr('Invalid expiry month.') && false;
      const now = new Date();
      const expDate = new Date(2000 + yy, mm - 1, 1);
      if (expDate < new Date(now.getFullYear(), now.getMonth(), 1)) return setErr('Card has expired.') && false;
      if (!/^\d{3,4}$/.test(card.cvv)) return setErr('CVV must be 3-4 digits.') && false;
    }
    if (method === 'upi') {
      if (!upiId && !selectedUpiApp) return setErr('Enter UPI ID or pick an app.') && false;
      if (upiId && !/^[\w.-]+@[\w]+$/.test(upiId)) return setErr('UPI ID format: name@bank') && false;
    }
    if (method === 'netbanking') {
      if (!selectedBank) return setErr('Please select your bank.') && false;
    }
    if (method === 'wallet') {
      if (!selectedWallet) return setErr('Please pick a wallet.') && false;
      if (!/^\d{10}$/.test(walletPhone)) return setErr('Enter a valid 10-digit phone number.') && false;
    }
    return true;
  };

  const goToOtp = () => {
    if (!validateMethod()) return;
    if (method === 'cash') return processPayment();
    setStep('otp');
    setProgress(20);
  };

  const processPayment = async () => {
    setErr('');
    if (step === 'otp') {
      if (otp !== otpExpected) {
        setErr('Invalid OTP. Try 123456 (demo).');
        return;
      }
    }

    setLoading(true);
    setStep('processing');
    setProgress(40);

    const tick = setInterval(() => {
      setProgress(p => Math.min(p + 12, 90));
    }, 250);

    try {
      const res = await axios.post(`/api/bookings/${booking._id}/pay`, {
        method,
        cardNumber: selectedSavedCard?.last4
          ? '4111111111' + selectedSavedCard.last4
          : card.number,
        cardName: selectedSavedCard?.name || card.name || upiId || selectedBank || selectedWallet || 'Demo'
      });

      // Save card if requested
      if (method === 'card' && card.save && !selectedSavedCard) {
        const last4 = card.number.replace(/\s/g, '').slice(-4);
        const brand = detectCardBrand(card.number);
        const newSaved = [...savedCards, {
          id: Date.now(),
          last4,
          name: card.name,
          brand: brand?.name || 'Card',
          expiry: card.expiry
        }];
        localStorage.setItem('wl_saved_cards', JSON.stringify(newSaved));
        setSavedCards(newSaved);
      }

      clearInterval(tick);
      setProgress(100);
      setTimeout(() => {
        onSuccess(res.data);
      }, 400);
    } catch (e) {
      clearInterval(tick);
      setProgress(0);
      setErr(e.response?.data?.message || 'Payment failed. Please try again.');
      setStep('method');
      setLoading(false);
    }
  };

  const removeSavedCard = (id) => {
    const updated = savedCards.filter(c => c.id !== id);
    localStorage.setItem('wl_saved_cards', JSON.stringify(updated));
    setSavedCards(updated);
    if (selectedSavedCard?.id === id) setSelectedSavedCard(null);
  };

  const total = booking.totalPrice;
  const brand = detectCardBrand(card.number);

  if (step === 'processing') {
    return (
      <div className="pg-processing">
        <div className="pg-processing-icon">{progress < 100 ? '🔄' : '✅'}</div>
        <h2>{progress < 100 ? 'Processing payment...' : 'Payment confirmed!'}</h2>
        <p>{progress < 100 ? 'Please don\'t close this window' : 'Redirecting...'}</p>
        <div className="pg-progress-bar">
          <div className="pg-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="pg-processing-steps">
          <div className={`pg-step ${progress >= 20 ? 'done' : ''}`}>✓ Verifying details</div>
          <div className={`pg-step ${progress >= 50 ? 'done' : ''}`}>✓ Contacting bank</div>
          <div className={`pg-step ${progress >= 80 ? 'done' : ''}`}>✓ Processing transaction</div>
          <div className={`pg-step ${progress >= 100 ? 'done' : ''}`}>✓ Confirming booking</div>
        </div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="pg-otp">
        <button className="pg-back" onClick={() => setStep('method')}>← Back</button>
        <div className="pg-otp-icon">🔐</div>
        <h2>Verify with OTP</h2>
        <p>An OTP has been sent to your registered mobile number.<br/>
          <span className="pg-demo-hint">Demo OTP: <strong>123456</strong></span>
        </p>
        <div className="pg-otp-input-wrap">
          {[0,1,2,3,4,5].map(i => (
            <input
              key={i}
              type="text"
              maxLength={1}
              className="pg-otp-input"
              value={otp[i] || ''}
              onChange={(e) => {
                const next = otp.split('');
                next[i] = e.target.value.replace(/\D/g, '');
                const joined = next.join('').slice(0, 6);
                setOtp(joined);
                if (e.target.value && e.target.nextSibling) e.target.nextSibling.focus();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !otp[i] && e.target.previousSibling) {
                  e.target.previousSibling.focus();
                }
              }}
            />
          ))}
        </div>
        <p className="pg-otp-resend">Didn't receive OTP? <button className="link-btn" type="button" onClick={() => setOtp('')}>Resend</button></p>
        {err && <div className="pg-error">⚠️ {err}</div>}
        <button className="btn-primary pg-confirm-btn" onClick={processPayment} disabled={otp.length < 6}>
          Verify & Pay ₹{total?.toLocaleString()}
        </button>
      </div>
    );
  }

  return (
    <div className="pg-main">
      {/* Booking summary */}
      <div className="pg-summary">
        <img src={heroImg} alt="" />
        <div>
          <h4>{listing.title}</h4>
          <p>📍 {listing.location}</p>
          <p>{new Date(booking.checkIn).toLocaleDateString()} → {new Date(booking.checkOut).toLocaleDateString()}</p>
          <p className="pg-summary-total">Total: ₹{total?.toLocaleString()}</p>
        </div>
      </div>

      {/* Method selector */}
      <div className="pg-section-label">Payment Method</div>
      <div className="pg-methods">
        {METHODS.map(m => (
          <button
            key={m.id}
            className={`pg-method ${method === m.id ? 'active' : ''}`}
            onClick={() => { setMethod(m.id); setSelectedSavedCard(null); setErr(''); }}
            type="button"
          >
            <span className="pg-method-icon">{m.icon}</span>
            <span className="pg-method-label">{m.label}</span>
            <span className="pg-method-desc">{m.desc}</span>
          </button>
        ))}
      </div>

      {/* CARD METHOD */}
      {method === 'card' && (
        <div className="pg-fields">
          {savedCards.length > 0 && (
            <div className="pg-saved-cards">
              <div className="pg-section-label">Saved Cards</div>
              {savedCards.map(c => (
                <button
                  key={c.id}
                  type="button"
                  className={`pg-saved-card ${selectedSavedCard?.id === c.id ? 'active' : ''}`}
                  onClick={() => setSelectedSavedCard(selectedSavedCard?.id === c.id ? null : c)}
                >
                  <span className="pg-card-brand">{c.brand}</span>
                  <span className="pg-card-num">•••• •••• •••• {c.last4}</span>
                  <span className="pg-card-name">{c.name}</span>
                  <span className="pg-card-expiry">{c.expiry}</span>
                  <span
                    className="pg-card-remove"
                    onClick={(e) => { e.stopPropagation(); removeSavedCard(c.id); }}
                    role="button"
                  >🗑️</span>
                </button>
              ))}
              <div className="pg-divider"><span>or use a new card</span></div>
            </div>
          )}

          {!selectedSavedCard && (
            <>
              <div className="form-group">
                <label>Card Number</label>
                <div className="pg-input-with-brand">
                  <input
                    placeholder="1234 5678 9012 3456"
                    value={card.number}
                    onChange={e => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                    inputMode="numeric"
                  />
                  {brand && <span className="pg-brand-badge">{brand.icon} {brand.name}</span>}
                </div>
              </div>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  placeholder="As printed on card"
                  value={card.name}
                  onChange={e => setCard({ ...card, name: e.target.value })}
                />
              </div>
              <div className="pg-row-2">
                <div className="form-group">
                  <label>Expiry</label>
                  <input
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                    inputMode="numeric"
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    maxLength={4}
                    value={card.cvv}
                    onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })}
                    inputMode="numeric"
                  />
                </div>
              </div>
              <label className="pg-check">
                <input type="checkbox" checked={card.save} onChange={e => setCard({ ...card, save: e.target.checked })} />
                <span>Save this card for faster checkout</span>
              </label>
            </>
          )}
        </div>
      )}

      {/* UPI METHOD */}
      {method === 'upi' && (
        <div className="pg-fields">
          <div className="pg-upi-apps">
            {UPI_APPS.map(app => (
              <button
                key={app.id}
                type="button"
                className={`pg-upi-app ${selectedUpiApp === app.id ? 'active' : ''}`}
                onClick={() => setSelectedUpiApp(selectedUpiApp === app.id ? '' : app.id)}
              >
                <span className="pg-upi-icon">{app.icon}</span>
                <span>{app.name}</span>
              </button>
            ))}
          </div>
          <div className="pg-divider"><span>or enter UPI ID</span></div>
          <div className="form-group">
            <label>UPI ID</label>
            <input
              placeholder="yourname@upi"
              value={upiId}
              onChange={e => setUpiId(e.target.value.toLowerCase())}
            />
          </div>
          <p className="pg-info">A payment request will be sent to your UPI app.</p>
        </div>
      )}

      {/* NETBANKING */}
      {method === 'netbanking' && (
        <div className="pg-fields">
          <div className="pg-section-label">Select your bank</div>
          <div className="pg-banks">
            {BANKS.map(b => (
              <button
                key={b.id}
                type="button"
                className={`pg-bank ${selectedBank === b.id ? 'active' : ''}`}
                onClick={() => setSelectedBank(b.id)}
              >
                <span className="pg-bank-icon">{b.icon}</span>
                <span>{b.name}</span>
              </button>
            ))}
          </div>
          <p className="pg-info">You'll be redirected to your bank's secure login page.</p>
        </div>
      )}

      {/* WALLET */}
      {method === 'wallet' && (
        <div className="pg-fields">
          <div className="pg-section-label">Select wallet</div>
          <div className="pg-banks">
            {WALLETS.map(w => (
              <button
                key={w.id}
                type="button"
                className={`pg-bank ${selectedWallet === w.id ? 'active' : ''}`}
                onClick={() => setSelectedWallet(w.id)}
              >
                <span className="pg-bank-icon">{w.icon}</span>
                <span>{w.name}</span>
              </button>
            ))}
          </div>
          {selectedWallet && (
            <div className="form-group" style={{ marginTop: 12 }}>
              <label>Mobile number linked to {WALLETS.find(w => w.id === selectedWallet)?.name}</label>
              <input
                placeholder="10-digit mobile number"
                value={walletPhone}
                onChange={e => setWalletPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                inputMode="numeric"
                maxLength={10}
              />
            </div>
          )}
        </div>
      )}

      {/* CASH */}
      {method === 'cash' && (
        <div className="pg-fields">
          <div className="pg-cash-info">
            <span className="pg-cash-icon">💵</span>
            <div>
              <h4>Pay at the property</h4>
              <p>You'll pay <strong>₹{total?.toLocaleString()}</strong> directly at check-in. Your booking will be marked confirmed instantly.</p>
              <ul>
                <li>✓ No upfront payment</li>
                <li>✓ Cash, UPI, or card accepted on-site</li>
                <li>✓ Cancel free up to 24h before check-in</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="pg-demo-banner">
        🛡️ <strong>Demo Mode</strong> — this is a dummy gateway. No real money is taken. {method !== 'cash' && 'Use OTP 123456 to confirm.'}
      </div>

      {err && <div className="pg-error">⚠️ {err}</div>}

      <div className="pg-actions">
        <button className="btn-outline" onClick={onClose} disabled={loading}>Cancel</button>
        <button className="btn-primary pg-pay-btn" onClick={goToOtp} disabled={loading}>
          {method === 'cash' ? 'Confirm Booking' : `Pay ₹${total?.toLocaleString()}`} →
        </button>
      </div>

      <div className="pg-secure">
        <span>🔒</span> Your payment is secured with 256-bit SSL encryption · Powered by Wanderlust Pay
      </div>
    </div>
  );
};

export default PaymentGateway;
