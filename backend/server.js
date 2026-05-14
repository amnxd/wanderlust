const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(cors({
  origin: ['https://wanderlust-iota-black.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ======================
// ROUTES
// ======================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/users', require('./routes/users'));

// ======================
// DATABASE CONNECTION
// ======================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4   // 🔥 fixes DNS / ECONNREFUSED issue
    });

    console.log('✅ MongoDB Connected');

    // Start server ONLY after DB connects
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// ======================
// START SERVER
// ======================
connectDB();