import React from 'react';

export interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({ level, children, className = '' }) => {
  const HeadingTag = `h${level}` as const;
  return React.createElement(
    HeadingTag,
    { className: `html-heading html-h${level} ${className}`.trim() },
    children
  );
};
