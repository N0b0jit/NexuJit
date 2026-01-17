'use client';

import type { DividerProps } from './types';

/**
 * Divider component for separating content
 */
export const Divider = ({
  orientation = 'horizontal',
  label,
  className = '',
  style,
}: DividerProps) => {
  if (orientation === 'vertical') {
    return (
      <div
        className={`w-px bg-border-subtle ${className}`}
        style={style}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  if (label) {
    return (
      <div
        className={`flex items-center gap-4 ${className}`}
        style={style}
        role="separator"
      >
        <div className="flex-1 h-px bg-border-subtle" />
        <span className="text-sm font-medium text-fg-tertiary uppercase tracking-wider">
          {label}
        </span>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>
    );
  }

  return (
    <div
      className={`h-px bg-border-subtle ${className}`}
      style={style}
      role="separator"
      aria-orientation="horizontal"
    />
  );
};