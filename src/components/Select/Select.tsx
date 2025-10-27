import React from 'react';
import './Select.css';

interface SelectProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  className?: string;
  name?: string;
  id?: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  disabled = false,
  className = '',
  name,
  id,
  children,
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`select ${className}`.trim()}
      name={name}
      id={id}
    >
      {children}
    </select>
  );
};

export default Select;