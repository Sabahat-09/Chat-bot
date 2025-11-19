import { useCallback } from 'react';

interface UseButtonProps {
  onClick?: () => void;
  variant: 'primary' | 'secondary' | 'danger';
  disabled: boolean;
  className: string;
}

export const useButton = ({ onClick, variant, disabled, className }: UseButtonProps) => {
  const handleClick = useCallback(() => {
    if (!disabled && onClick) {
      onClick();
    }
  }, [disabled, onClick]);

  const buttonClasses = `btn btn-${variant} ${className}`.trim();

  return {
    handleClick,
    buttonClasses,
  };
};

