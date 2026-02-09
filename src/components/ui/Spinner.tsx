'use client';

import type { SpinnerProps } from './types';

/**
 * Loading spinner component
 */
export const Spinner = ({
  size = 'md',
  variant = 'default',
  className = '',
  style,
}: SpinnerProps) => {
  const sizes = {
    xs: 'w-3 h-3 border-2',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  const variants = {
    default: 'border-fg-tertiary border-t-transparent',
    accent: 'border-accent/20 border-t-accent',
  };

  return (
    <div
      className={`
        ${sizes[size]} ${variants[variant]}
        rounded-full animate-spin
        ${className}
      `}
      style={style}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};