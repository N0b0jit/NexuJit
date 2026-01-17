'use client';

import type { RadioProps } from './types';

/**
 * Radio button component
 */
export const Radio = ({
  checked,
  onChange,
  value,
  label,
  name,
  disabled = false,
  className = '',
}: RadioProps) => {
  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
            ${checked 
              ? 'border-accent' 
              : 'border-border-strong hover:border-accent'
            }
          `}
        >
          {checked && (
            <div className="w-2.5 h-2.5 rounded-full bg-accent" />
          )}
        </div>
      </div>
      {label && (
        <span className="text-sm font-medium text-fg-primary">{label}</span>
      )}
    </label>
  );
};