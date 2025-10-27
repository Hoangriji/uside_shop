import React from 'react';
import './Navbar.css';

interface NavbarProps {
  brand: string;
  children: React.ReactNode;
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ brand, children, className = '' }) => {
  return (
    <nav className={`navbar ${className}`.trim()}>
      <div className="navbar-brand">{brand}</div>
      <div className="navbar-nav">
        {children}
      </div>
    </nav>
  );
};

export default Navbar;