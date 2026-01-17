'use client';

import { Check, Minus } from 'lucide-react';
import type { CheckboxProps } from './types';

/**
 * Checkbox component with optional indeterminate state
 */
export const Checkbox = ({
  checked,
  onChange,
  label,
  disabled = false,
  indeterminate = false,
  className = '',
}: CheckboxProps) => {
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
            w-5 h-5 rounded border-2 flex items-center justify-center transition-all
            ${checked || indeterminate 
              ? 'bg-accent border-accent' 
              : 'bg-white dark:bg-bg-tertiary border-border-strong hover:border-accent'
            }
          `}
        >
          {indeterminate ? (
            <Minus size={14} className="text-white" strokeWidth={3} />
          ) : checked ? (
            <Check size={14} className="text-white" strokeWidth={3} />
          ) : null}
        </div>
      </div>
      {label && (
        <span className="text-sm font-medium text-fg-primary">{label}</span>
      )}
    </label>
  );
};