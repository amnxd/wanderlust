const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const { protect } = require('../middleware/auth');

// POST /api/bookings - Create booking
router.post('/', protect, async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guests } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return res.status(400).json({ message: 'Invalid dates' });

    const totalPrice = listing.price * nights;

    const booking = await Booking.create({
      listing: listingId,
      traveler: req.user._id,
      host: listing.host,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: Number(guests) || 1,
      totalPrice
    });

    await booking.populate([
      { path: 'listing', select: 'title location images price' },
      { path: 'traveler', select: 'name email' }
    ]);

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/bookings/my - Get traveler's bookings
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ traveler: req.user._id })
      .populate('listing', 'title location images price')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/bookings/host - Get host's received bookings
router.get('/host', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ host: req.user._id })
      .populate('listing', 'title location images')
      .populate('traveler', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/bookings/:id/pay - Dummy payment processor
router.post('/:id/pay', protect, async (req, res) => {
  try {
    const { method, cardNumber, cardName } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.traveler.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (booking.payment?.status === 'paid') {
      return res.status(400).json({ message: 'Booking already paid' });
    }

    // Simulate gateway processing latency + simple validation
    await new Promise(r => setTimeout(r, 800));
    if (method === 'card') {
      const digits = (cardNumber || '').replace(/\s+/g, '');
      if (digits.length < 12 || !/^\d+$/.test(digits)) {
        return res.status(400).json({ message: 'Invalid card number' });
      }
      if (!cardName || cardName.trim().length < 2) {
        return res.status(400).json({ message: 'Card name required' });
      }
    }

    booking.payment = {
      status: 'paid',
      method: method || 'card',
      transactionId: 'TXN-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      paidAt: new Date()
    };
    booking.status = 'confirmed';
    await booking.save();
    await booking.populate([
      { path: 'listing', select: 'title location images price' },
      { path: 'traveler', select: 'name email' }
    ]);
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/bookings/:id/status - Update booking status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Only host or the traveler can update
    if (
      booking.host.toString() !== req.user._id.toString() &&
      booking.traveler.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;