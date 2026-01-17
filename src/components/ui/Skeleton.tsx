'use client';

import type { SkeletonProps } from './types';

/**
 * Skeleton loading placeholder component
 */
export const Skeleton = ({
  width,
  height,
  variant = 'rectangular',
  className = '',
  style,
}: SkeletonProps) => {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const defaultSizes = {
    text: { width: '100%', height: '1em' },
    circular: { width: '40px', height: '40px' },
    rectangular: { width: '100%', height: '100px' },
  };

  const computedWidth = width ?? defaultSizes[variant].width;
  const computedHeight = height ?? defaultSizes[variant].height;

  return (
    <div
      className={`
        bg-bg-tertiary animate-pulse
        ${variants[variant]}
        ${className}
      `}
      style={{
        width: computedWidth,
        height: computedHeight,
        ...style,
      }}
      role="status"
      aria-label="Loading content"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};