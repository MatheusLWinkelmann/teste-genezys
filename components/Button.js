import React from 'react';

export default function Button({ children, className = '', hasError = false, ...props }) {
  return (
    <button
      className={`bg-white text-black hover:bg-gray-200 hover:text-black transition-all duration-200 py-2 px-4 rounded ${hasError ? '!bg-[rgba(255,34,68,0.15)] !text-[rgb(255,34,68)]' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
