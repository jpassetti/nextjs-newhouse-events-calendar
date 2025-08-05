import React from 'react';

interface IconProps {
  name: 'calendar' | 'location';
  size?: number | string; // e.g. 24 or '1.5em'
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, className = '' }) => {
  if (name === 'calendar') {
    return (
      <span className={`inline-flex items-center justify-center w-[1.5em] h-[1.5em] ${className}`}
        style={{ minWidth: size, minHeight: size }}
        aria-hidden="true"
      >
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="4" fill="none"/>
          <path d="M16 2v4M8 2v4M3 10h18" />
          <path d="M9 16l2 2 4-4" />
        </svg>
      </span>
    );
  }
  if (name === 'location') {
    return (
      <span className={`inline-flex items-center justify-center w-[1.5em] h-[1.5em] ${className}`}
        style={{ minWidth: size, minHeight: size }}
        aria-hidden="true"
      >
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2C6.686 2 4 4.686 4 8c0 4.418 5.25 9.25 5.477 9.477a1 1 0 0 0 1.414 0C10.75 17.25 16 12.418 16 8c0-3.314-2.686-6-6-6zm0 8.5A2.5 2.5 0 1 1 10 5a2.5 2.5 0 0 1 0 5.5z" fill="#888"/>
        </svg>
      </span>
    );
  }
  return null;
};

export default Icon;
