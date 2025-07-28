'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Toast, { ToastType } from './Toast';

// Singleton để quản lý toast
type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};

let toastQueue: ToastItem[] = [];
let listeners: Function[] = [];
let toastIdCounter = 0;

export const showToast = (message: string, type: ToastType = 'info') => {
  const id = `toast-${++toastIdCounter}`;
  const toast = { id, message, type };
  toastQueue = [...toastQueue, toast];
  listeners.forEach(listener => listener(toastQueue));
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    removeToast(id);
  }, 3000);
};

export const removeToast = (id: string) => {
  toastQueue = toastQueue.filter(toast => toast.id !== id);
  listeners.forEach(listener => listener(toastQueue));
};

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Subscribe to toast updates
    const handleToastUpdate = (newToasts: ToastItem[]) => {
      setToasts([...newToasts]);
    };
    
    listeners.push(handleToastUpdate);
    
    return () => {
      listeners = listeners.filter(listener => listener !== handleToastUpdate);
    };
  }, []);

  // Don't render anything until mounted
  if (!mounted) return null;

  // Only render portal when window is available
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;
