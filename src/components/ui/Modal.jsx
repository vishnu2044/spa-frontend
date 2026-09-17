// src/components/ui/Modal.jsx
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md', hideHeader = false }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeMap = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl',
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Dialog'}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={panelRef}
        className={`modal-panel ${sizeMap[size] || sizeMap.md} w-full`}
      >
        {!hideHeader && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-aura-border dark:border-aura-dark-border sticky top-0 bg-aura-surface dark:bg-aura-dark-surface z-10">
            <h2 className="font-serif text-lg text-aura-text dark:text-aura-dark-text">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-aura-muted hover:text-aura-text hover:bg-aura-surface2 dark:text-aura-dark-muted dark:hover:bg-aura-dark-surface2 transition-colors"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}
