const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const isConfigured = () =>
  !!(process.env.CLOUDINARY_CLOUD_NAME &&
     process.env.CLOUDINARY_API_KEY &&
     process.env.CLOUDINARY_API_SECRET);

// Extract a Cloudinary public_id from a full image URL so we can delete it.
// Example: https://res.cloudinary.com/xxx/image/upload/v123/wanderlust/abc123.jpg
//   -> wanderlust/abc123
const publicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  if (!url.includes('res.cloudinary.com')) return null;
  try {
    const afterUpload = url.split('/upload/')[1];
    if (!afterUpload) return null;
    // Drop any version segment like v123456789/
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    // Drop the file extension on the LAST segment only
    return withoutVersion.replace(/\.[^/.]+$/, '');
  } catch {
    return null;
  }
};

const destroyImage = async (url) => {
  const publicId = publicIdFromUrl(url);
  if (!publicId) return null;
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn('Cloudinary destroy failed for', publicId, '-', err.message);
    return null;
  }
};

module.exports = { cloudinary, isConfigured, publicIdFromUrl, destroyImage };
