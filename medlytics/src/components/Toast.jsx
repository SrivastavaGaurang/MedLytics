// Toast.jsx — Notification component
import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ type = 'info', message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeClass = {
    success: 'toast-success',
    error: 'toast-error',
    info: 'toast-info'
  }[type];

  return (
    <div className={`toast-container ${typeClass}`} role="alert" aria-live="assertive">
      <div className="toast-message">{message}</div>
    </div>
  );
};

export default Toast;
