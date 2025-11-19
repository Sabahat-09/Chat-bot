import React from 'react';
import { useLoading } from './Loading.ts';
import './Loading.css';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  className = '',
  text,
}) => {
  const { spinnerClasses } = useLoading({ size, className });

  return (
    <div className="loading-wrapper">
      <div className={spinnerClasses}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default Loading;

