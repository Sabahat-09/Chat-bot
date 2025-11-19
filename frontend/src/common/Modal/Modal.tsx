import React from 'react';
import { useModal } from './Modal.ts';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) => {
  const { handleBackdropClick, handleEscape } = useModal({ isOpen, onClose });

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      onKeyDown={handleEscape}
      tabIndex={-1}
    >
      <div className={`modal-content ${className}`} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button className="modal-close" onClick={onClose}>
              ×
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

