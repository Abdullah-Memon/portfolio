'use client';

import { usePrimaryColor } from '@/hooks/usePrimaryColor';

export default function LoadingSpinner({
  size = 'medium', // small, medium, large
  text = 'Loading...',
  showText = true,
  className = '',
  centered = true
}) {
  const { getSpinnerColorClass, getTextColorClass } = usePrimaryColor();

  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  const spinnerContent = (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 ${getSpinnerColorClass()} ${sizeClasses[size]}`}></div>
      {showText && (
        <span className={`${getTextColorClass()} ${textSizeClasses[size]} font-medium`}>
          {text}
        </span>
      )}
    </div>
  );

  if (centered) {
    return (
      <div className="flex items-center justify-center py-12">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
}
