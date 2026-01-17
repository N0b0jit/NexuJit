'use client';

import { motion } from 'framer-motion';
import type { ProgressProps } from './types';

/**
 * Progress bar component
 */
export const Progress = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  className = '',
  style,
}: ProgressProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-5',
  };

  const variants = {
    default: 'bg-accent',
    accent: 'bg-accent',
    success: 'bg-emerald-500',
    danger: 'bg-rose-500',
  };

  return (
    <div className={`w-full ${className}`} style={style}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-fg-secondary">Progress</span>
          <span className="text-sm font-bold text-fg-primary">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-bg-tertiary rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          className={`h-full ${variants[variant]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};