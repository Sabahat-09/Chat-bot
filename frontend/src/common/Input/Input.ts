import { useCallback } from 'react';

interface UseInputProps {
  onChange: (value: string) => void;
  className: string;
  error?: string;
}

export const useInput = ({ onChange, className, error }: UseInputProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const inputClasses = `input ${error ? 'input-error-state' : ''} ${className}`.trim();

  return {
    handleChange,
    inputClasses,
  };
};

