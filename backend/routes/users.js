const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('wishlist', 'title location images price averageRating');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/users/wishlist/:listingId - Toggle wishlist
router.post('/wishlist/:listingId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const listingId = req.params.listingId;
    const idx = user.wishlist.indexOf(listingId);

    if (idx === -1) {
      user.wishlist.push(listingId);
    } else {
      user.wishlist.splice(idx, 1);
    }

    await user.save();
    const updated = await User.findById(req.user._id).populate('wishlist', 'title location images price averageRating');
    res.json({ wishlist: updated.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;