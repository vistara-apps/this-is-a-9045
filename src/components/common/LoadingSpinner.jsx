import React from 'react';

export function LoadingSpinner({ size = 'md', color = 'accent', fullScreen = false }) {
  // Size classes
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };
  
  // Color classes
  const colorClasses = {
    accent: 'text-accent',
    white: 'text-white',
    gray: 'text-gray-400',
    primary: 'text-primary'
  };
  
  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const spinnerColor = colorClasses[color] || colorClasses.accent;
  
  const spinner = (
    <div className={`${spinnerSize} ${spinnerColor}`}>
      <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          {spinner}
          {props.message && (
            <p className="mt-4 text-white">{props.message}</p>
          )}
        </div>
      </div>
    );
  }
  
  return spinner;
}

export function LoadingOverlay({ message }) {
  return (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
      <LoadingSpinner size="lg" color="white" />
      {message && (
        <p className="mt-4 text-white font-medium">{message}</p>
      )}
    </div>
  );
}

export default LoadingSpinner;

