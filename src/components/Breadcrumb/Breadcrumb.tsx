import React from 'react';
import './Breadcrumb.css';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav className={`breadcrumb ${className}`.trim()}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href ? (
            <a href={item.href} className="breadcrumb-link">
              {item.label}
            </a>
          ) : (
            <span className={item.isCurrent ? 'breadcrumb-current' : 'breadcrumb-link'}>
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <span className="breadcrumb-separator">/</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;