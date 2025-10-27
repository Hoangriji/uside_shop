import React from 'react';
import './TabNav.css';

interface TabItem {
  id: string;
  label: string;
  active?: boolean;
}

interface TabNavProps {
  tabs: TabItem[];
  onTabChange: (tabId: string) => void;
  className?: string;
}

const TabNav: React.FC<TabNavProps> = ({ tabs, onTabChange, className = '' }) => {
  return (
    <div className={`tab-nav ${className}`.trim()}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-item ${tab.active ? 'active' : 'inactive'}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNav;