import React from 'react';
import { useInput } from './Input.ts';
import './Input.css';

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  className = '',
  label,
  error,
}) => {
  const { handleChange, inputClasses } = useInput({ onChange, className, error });

  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={inputClasses}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default Input;

