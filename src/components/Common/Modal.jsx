import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, actions = null, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative bg-dark-bg-secondary border border-dark-bg-tertiary rounded-lg shadow-xl ${sizes[size]}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-bg-tertiary">
          <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {children}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex gap-3 p-6 border-t border-dark-bg-tertiary">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal; 