const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const { protect, hostOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { isConfigured, destroyImage } = require('../config/cloudinary');

// When using Cloudinary, multer-storage-cloudinary places the secure URL on
// `file.path`. With local disk we just stored the filename, so we build a
// `/uploads/...` relative URL.
const fileToImageUrl = (file) => {
  if (isConfigured()) return file.path; // full https Cloudinary URL
  return `/uploads/${file.filename}`;
};

// GET /api/listings — all listings with search/filter
router.get('/', async (req, res) => {
  const { search, category, minPrice, maxPrice, rating, amenities, sort } = req.query;
  let query = {};
  if (category) query.category = category;
  if (minPrice || maxPrice) query.price = {};
  if (minPrice) query.price.$gte = Number(minPrice);
  if (maxPrice) query.price.$lte = Number(maxPrice);
  if (rating) query.averageRating = { $gte: Number(rating) };
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  if (amenities) {
    const amenityList = amenities.split(',');
    query.amenities = { $all: amenityList };
  }

  let sortObj = { createdAt: -1 };
  if (sort === 'price_asc') sortObj = { price: 1 };
  if (sort === 'price_desc') sortObj = { price: -1 };
  if (sort === 'rating') sortObj = { averageRating: -1 };

  const listings = await Listing.find(query).populate('host', 'name email').sort(sortObj);
  res.json(listings);
});

// GET /api/listings/host/my
router.get('/host/my', protect, hostOnly, async (req, res) => {
  const listings = await Listing.find({ host: req.user._id }).sort({ createdAt: -1 });
  res.json(listings);
});

// GET /api/listings/:id
router.get('/:id', async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate('host', 'name email avatar');
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  res.json(listing);
});

// POST /api/listings
router.post('/', protect, hostOnly, upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, price, location, category, amenities } = req.body;
    const images = req.files ? req.files.map(fileToImageUrl) : [];
    const amenityList = amenities ? amenities.split(',').map(a => a.trim()).filter(Boolean) : [];
    const listing = await Listing.create({
      title,
      description,
      price: Number(price),
      location,
      category,
      amenities: amenityList,
      images,
      host: req.user._id
    });
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/listings/:id
router.put('/:id', protect, hostOnly, upload.array('images', 5), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    if (listing.host.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const { title, description, price, location, category, amenities } = req.body;
    const amenityList = amenities ? amenities.split(',').map(a => a.trim()).filter(Boolean) : listing.amenities;

    let images = listing.images;
    if (req.files?.length > 0) {
      // Replace images: best-effort delete the old ones from Cloudinary
      if (isConfigured() && Array.isArray(listing.images)) {
        await Promise.all(listing.images.map(url => destroyImage(url)));
      }
      images = req.files.map(fileToImageUrl);
    }

    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      { title, description, price: Number(price), location, category, amenities: amenityList, images },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/listings/:id
router.delete('/:id', protect, hostOnly, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    if (listing.host.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    // Best-effort: clean up Cloudinary assets attached to this listing.
    if (isConfigured() && Array.isArray(listing.images)) {
      await Promise.all(listing.images.map(url => destroyImage(url)));
    }

    await listing.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
