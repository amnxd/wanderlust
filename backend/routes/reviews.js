const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

// GET /api/reviews/:listingId
router.get('/:listingId', async (req, res) => {
  try {
    const reviews = await Review.find({ listing: req.params.listingId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/reviews
router.post('/', protect, async (req, res) => {
  try {
    const { listingId, rating, comment } = req.body;

    // Check if user already reviewed this listing
    const existing = await Review.findOne({ listing: listingId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'You already reviewed this listing' });

    const review = await Review.create({
      listing: listingId,
      user: req.user._id,
      rating: Number(rating),
      comment
    });

    await review.populate('user', 'name avatar');
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;