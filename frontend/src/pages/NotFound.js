import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <div className="notfound-illustration">
          <span className="notfound-balloon">🎈</span>
          <span className="notfound-404">404</span>
        </div>
        <h1>You've wandered off the map</h1>
        <p>The page you're looking for has packed its bags and left. Let's get you back to your journey.</p>
        <div className="notfound-actions">
          <button className="btn-outline" onClick={() => navigate(-1)}>← Go Back</button>
          <Link to="/" className="btn-primary">🏠 Back to Home</Link>
          <Link to="/explore" className="btn-outline">🔍 Browse Stays</Link>
        </div>
        <div className="notfound-suggestions">
          <p>Popular destinations:</p>
          <div className="notfound-pills">
            <Link to="/explore?category=Beach">🏖️ Beach</Link>
            <Link to="/explore?category=Mountains">🏔️ Mountains</Link>
            <Link to="/explore?category=Cities">🏙️ Cities</Link>
            <Link to="/explore?category=Villas">🏡 Villas</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
