const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// After saving a review, update listing's averageRating
reviewSchema.post('save', async function() {
  const Listing = require('./Listing');
  const Review = this.constructor;
  const stats = await Review.aggregate([
    { $match: { listing: this.listing } },
    { $group: { _id: '$listing', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  if (stats.length > 0) {
    await Listing.findByIdAndUpdate(this.listing, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].count
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);