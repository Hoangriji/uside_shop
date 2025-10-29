import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Tổng quan', href: '/dashboard/overview', icon: <i className="fa-solid fa-database"></i> },
    { name: 'Quản lý sản phẩm', href: '/dashboard/products', icon: <i className="fa-solid fa-boxes-stacked"></i> },
    { name: 'Sản phẩm nổi bật', href: '/dashboard/featured', icon: <i className="fa-solid fa-star"></i> },
  ];

  return (
    <div className="dashboard-layout">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Uside Shop Admin</h2>
        </div>
        
        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`nav-item ${location.pathname === item.href ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              {item.icon}
              <span className="nav-text">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn">
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
        </header>
        
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;