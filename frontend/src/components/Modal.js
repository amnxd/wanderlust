import React, { useEffect } from 'react';
import './Modal.css';

const Modal = ({ open, onClose, title, children, size = 'md', closeable = true, footer = null }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape' && closeable) onClose?.(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose, closeable]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget && closeable) onClose?.(); }}
      role="dialog"
      aria-modal="true"
    >
      <div className={`modal modal-${size}`}>
        {(title || closeable) && (
          <div className="modal-header">
            {title && <h2 className="modal-title">{title}</h2>}
            {closeable && (
              <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
            )}
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
