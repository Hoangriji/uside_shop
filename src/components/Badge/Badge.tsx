import React from 'react';
import './Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'secondary' | 'warning' | 'danger' | 'info' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const badgeClass = `badge badge-${variant} badge-${size} ${className}`.trim();

  return <span className={badgeClass}>{children}</span>;
};

export default Badge;