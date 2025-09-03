import React from 'react';
import { Toaster } from 'react-hot-toast';

export function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.5rem',
        },
        success: {
          iconTheme: {
            primary: 'hsl(145, 72%, 47%)',
            secondary: 'black',
          },
        },
        error: {
          iconTheme: {
            primary: '#ff4b4b',
            secondary: 'black',
          },
        },
      }}
    />
  );
}

export default Toast;

