import React from 'react';

export interface UnorderedListProps {
  children: React.ReactNode;
  className?: string;
}

export const UnorderedList: React.FC<UnorderedListProps> = ({ children, className = '' }) => {
  return (
    <ul className={`html-list html-ul ${className}`.trim()}>
      {children}
    </ul>
  );
};

export interface OrderedListProps {
  children: React.ReactNode;
  className?: string;
}

export const OrderedList: React.FC<OrderedListProps> = ({ children, className = '' }) => {
  return (
    <ol className={`html-list html-ol ${className}`.trim()}>
      {children}
    </ol>
  );
};

export interface ListItemProps {
  children: React.ReactNode;
  className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({ children, className = '' }) => {
  return (
    <li className={`html-list-item ${className}`.trim()}>
      {children}
    </li>
  );
};
