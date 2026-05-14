import React, { createContext, useContext, useState, useCallback } from 'react';
import './ToastContext.css';

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

let nextId = 1;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const push = useCallback((message, type = 'info', duration = 3500) => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const toast = {
    success: (m, d) => push(m, 'success', d),
    error: (m, d) => push(m, 'error', d),
    info: (m, d) => push(m, 'info', d),
    warning: (m, d) => push(m, 'warning', d),
  };

  const ICONS = { success: '✅', error: '⚠️', info: 'ℹ️', warning: '⚠️' };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-icon">{ICONS[t.type] || 'ℹ️'}</span>
            <span className="toast-message">{t.message}</span>
            <button className="toast-close" onClick={() => remove(t.id)} aria-label="Close">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
