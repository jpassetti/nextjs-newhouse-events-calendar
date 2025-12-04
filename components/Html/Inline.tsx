import React from 'react';

export interface SpanProps {
  children: React.ReactNode;
  className?: string;
}

export const Span: React.FC<SpanProps> = ({ children, className = '' }) => {
  return (
    <span className={`html-span ${className}`.trim()}>
      {children}
    </span>
  );
};

export interface StrongProps {
  children: React.ReactNode;
  className?: string;
}

export const Strong: React.FC<StrongProps> = ({ children, className = '' }) => {
  return (
    <strong className={`html-strong ${className}`.trim()}>
      {children}
    </strong>
  );
};

export interface EmphasisProps {
  children: React.ReactNode;
  className?: string;
}

export const Emphasis: React.FC<EmphasisProps> = ({ children, className = '' }) => {
  return (
    <em className={`html-em ${className}`.trim()}>
      {children}
    </em>
  );
};

export interface BreakProps {
  className?: string;
}

export const Break: React.FC<BreakProps> = ({ className = '' }) => {
  return <br className={`html-br ${className}`.trim()} />;
};
