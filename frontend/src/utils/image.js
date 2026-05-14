// Resolve an image path coming from the backend.
// - Cloudinary returns full https URLs → return as-is.
// - Local /uploads/... paths → prepend the API origin.
// - null/undefined → return the supplied fallback.
const API_ORIGIN = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const FALLBACK = 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&fit=crop';

export const resolveImg = (img, fallback = FALLBACK) => {
  if (!img) return fallback;
  if (typeof img !== 'string') return fallback;
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) return img;
  if (img.startsWith('/')) return `${API_ORIGIN}${img}`;
  return `${API_ORIGIN}/${img}`;
};

export const firstImg = (listing, fallback) =>
  resolveImg(listing?.images?.[0], fallback);
