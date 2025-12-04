import React from 'react';

export interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
}

export const Paragraph: React.FC<ParagraphProps> = ({ children, className = '' }) => {
  return (
    <p className={`html-paragraph ${className}`.trim()}>
      {children}
    </p>
  );
};
