import React from 'react';
import './Spinner.css';

const Spinner = ({ size = 'md', label = '' }) => (
  <div className={`spinner-wrap spinner-${size}`} role="status" aria-live="polite">
    <div className="spinner-ring" />
    {label && <p className="spinner-label">{label}</p>}
  </div>
);

export default Spinner;
