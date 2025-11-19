interface UseLoadingProps {
  size: 'small' | 'medium' | 'large';
  className: string;
}

export const useLoading = ({ size, className }: UseLoadingProps) => {
  const spinnerClasses = `spinner spinner-${size} ${className}`.trim();

  return {
    spinnerClasses,
  };
};

