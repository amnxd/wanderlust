const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary, isConfigured } = require('../config/cloudinary');

// ---------------------------------------------------------------
// Cloudinary storage (preferred) with a local-disk fallback so the
// app can still run locally even without Cloudinary credentials.
// ---------------------------------------------------------------

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'wanderlust/listings',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1600, height: 1200, crop: 'limit', quality: 'auto:good' }],
    public_id: (req, file) =>
      `${Date.now()}-${Math.round(Math.random() * 1e9)}`
  }
});

// Disk fallback (only used if Cloudinary env vars are missing)
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, unique);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ok = allowed.test(path.extname(file.originalname).toLowerCase()) &&
             allowed.test(file.mimetype);
  cb(ok ? null : new Error('Only JPG, PNG, or WEBP images are allowed.'), ok);
};

if (isConfigured()) {
  console.log('🖼️  Cloudinary storage enabled (folder: wanderlust/listings)');
} else {
  console.warn('⚠️  Cloudinary not configured — falling back to local disk storage. Set CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET in .env to enable Cloudinary.');
}

const upload = multer({
  storage: isConfigured() ? cloudinaryStorage : diskStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB per file
});

module.exports = upload;
