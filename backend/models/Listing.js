const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  images: [{ type: String }],
  amenities: [{ type: String }],
  category: {
    type: String,
    enum: ['Beach', 'Mountains', 'Cities', 'Villas'],
    default: 'Cities'
  },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', listingSchema);