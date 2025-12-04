import React from 'react';

export interface LinkProps {
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
  className?: string;
}

export const Link: React.FC<LinkProps> = ({ 
  href = '#', 
  target, 
  rel, 
  children, 
  className = '' 
}) => {
  return (
    <a 
      href={href}
      target={target}
      rel={rel}
      className={`html-link ${className}`.trim()}
    >
      {children}
    </a>
  );
};
