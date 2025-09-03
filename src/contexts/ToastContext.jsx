import React, { createContext, useContext } from 'react';
import toast from 'react-hot-toast';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const showSuccess = (message) => {
    toast.success(message);
  };

  const showError = (message) => {
    toast.error(message);
  };

  const showInfo = (message) => {
    toast(message);
  };

  const showWarning = (message) => {
    toast(message, {
      icon: '⚠️',
      style: {
        borderLeft: '4px solid #f59e0b',
      },
    });
  };

  const showLoading = (message) => {
    return toast.loading(message);
  };

  const dismissToast = (toastId) => {
    toast.dismiss(toastId);
  };

  const value = {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    dismissToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastContext;

