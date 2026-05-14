import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const path = window.location.pathname;
      if (path !== '/auth' && path !== '/') {
        localStorage.removeItem('wanderlust_user');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(err);
  }
);

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);

  const refreshWishlist = useCallback(async () => {
    try {
      const res = await axios.get('/api/users/profile');
      const ids = (res.data.wishlist || []).map(w => (typeof w === 'string' ? w : w._id));
      setWishlistIds(ids);
    } catch {}
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('wanderlust_user');
    if (stored) {
      const userData = JSON.parse(stored);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      refreshWishlist();
    }
    setLoading(false);
  }, [refreshWishlist]);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const userData = res.data;
    localStorage.setItem('wanderlust_user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    setUser(userData);
    refreshWishlist();
    return userData;
  };

  const register = async (name, email, password, role) => {
    const res = await axios.post('/api/auth/register', { name, email, password, role });
    const userData = res.data;
    localStorage.setItem('wanderlust_user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    setUser(userData);
    setWishlistIds([]);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('wanderlust_user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setWishlistIds([]);
  };

  const toggleWishlist = async (listingId) => {
    if (!user) return null;
    const res = await axios.post(`/api/users/wishlist/${listingId}`);
    const ids = (res.data.wishlist || []).map(w => (typeof w === 'string' ? w : w._id));
    setWishlistIds(ids);
    return ids;
  };

  const isWishlisted = (listingId) => wishlistIds.includes(listingId);

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout,
      wishlistIds, toggleWishlist, isWishlisted, refreshWishlist
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
