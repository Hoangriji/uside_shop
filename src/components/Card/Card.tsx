import React from 'react';
import './Card.css';

interface CardProps {
  variant?: 'basic' | 'interactive' | 'inset' | 'elevated';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  variant = 'basic',
  children,
  className = '',
  onClick,
}) => {
  const cardClass = `card-${variant} ${className}`.trim();

  return (
    <div className={cardClass} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;