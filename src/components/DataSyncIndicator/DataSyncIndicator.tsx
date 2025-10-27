import React from 'react';
import './DataSyncIndicator.css';

interface DataSyncIndicatorProps {
  isValidating: boolean;
}

export const DataSyncIndicator: React.FC<DataSyncIndicatorProps> = ({ isValidating }) => {
  if (!isValidating) return null;

  return (
    <div className="data-sync-indicator">
      <div className="sync-icon">
        <i className="fas fa-sync-alt"></i>
      </div>
      <span>Đang cập nhật dữ liệu...</span>
    </div>
  );
};
