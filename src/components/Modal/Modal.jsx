import React, { useEffect } from 'react';
import './Modal.scss';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`modal__overlay ${isOpen ? 'modal__overlay--active' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="modal__content">
        <div className="modal__header">
          <h3 className="modal__title">{title}</h3>
          <button 
            className="modal__close"
            onClick={onClose}
            aria-label="關閉對話框"
          >
            ×
          </button>
        </div>
        <div className="modal__body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;