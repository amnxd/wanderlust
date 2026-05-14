const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  traveler: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, default: 1 },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  payment: {
    status: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
    method: { type: String, default: '' },
    transactionId: { type: String, default: '' },
    paidAt: { type: Date }
  },
  createdAt: { type: Date, default: Date.now }
});

// Guard against accidental re-registration / overwrite errors.
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

module.exports = Booking;
