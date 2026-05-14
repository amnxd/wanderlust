import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import ListingDetail from "./pages/ListingDetail";
import HostDashboard from "./pages/HostDashboard";
import TravelerDashboard from "./pages/TravelerDashboard";
import NotFound from "./pages/NotFound";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Shell = ({ children, hideFooter = false }) => (
  <>
    <Navbar />
    <main className="app-main">{children}</main>
    {!hideFooter && <Footer />}
  </>
);

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Shell><Home /></Shell>} />
            <Route path="/explore" element={<Shell><Explore /></Shell>} />
            <Route path="/about" element={<Shell><About /></Shell>} />
            <Route path="/contact" element={<Shell><Contact /></Shell>} />
            <Route path="/auth" element={<Shell hideFooter><Auth /></Shell>} />
            <Route path="/listing/:id" element={<Shell><ListingDetail /></Shell>} />
            <Route path="/host/dashboard" element={<Shell hideFooter><HostDashboard /></Shell>} />
            <Route path="/traveler/dashboard" element={<Shell hideFooter><TravelerDashboard /></Shell>} />
            <Route path="/profile" element={<Shell hideFooter><TravelerDashboard initialTab="profile" /></Shell>} />
            <Route path="/wishlist" element={<Shell hideFooter><TravelerDashboard initialTab="wishlist" /></Shell>} />
            <Route path="/bookings" element={<Shell hideFooter><TravelerDashboard initialTab="bookings" /></Shell>} />
            <Route path="*" element={<Shell><NotFound /></Shell>} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
