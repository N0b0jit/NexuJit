'use client';

import { motion } from 'framer-motion';
import type { SwitchProps } from './types';

/**
 * Toggle switch component
 */
export const Switch = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
}: SwitchProps) => {
  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`
            w-11 h-6 rounded-full transition-colors duration-200
            ${checked ? 'bg-accent' : 'bg-border-strong'}
          `}
        >
          <motion.div
            className="w-5 h-5 bg-white rounded-full shadow-md"
            initial={false}
            animate={{
              x: checked ? 22 : 2,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            style={{ y: 2 }}
          />
        </div>
      </div>
      {label && (
        <span className="text-sm font-medium text-fg-primary">{label}</span>
      )}
    </label>
  );
};