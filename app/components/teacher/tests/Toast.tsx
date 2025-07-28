import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center gap-3 z-50 animate-slide-up">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-500"
      >
        <X size={16} />
      </button>
    </div>
  );
} 