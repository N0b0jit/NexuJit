/**
 * Design tokens - centralized design system values
 * These map to CSS variables defined in globals.css
 */

export const colors = {
  // Background colors
  bgPrimary: 'var(--bg-primary)',
  bgSecondary: 'var(--bg-secondary)',
  bgTertiary: 'var(--bg-tertiary)',
  
  // Foreground colors
  fgPrimary: 'var(--fg-primary)',
  fgSecondary: 'var(--fg-secondary)',
  fgTertiary: 'var(--fg-tertiary)',
  
  // Accent colors
  accent: 'var(--accent)',
  accentLight: 'var(--accent-light)',
  accentMuted: 'var(--accent-muted)',
  accentFg: 'var(--accent-fg)',
  
  // Border colors
  borderSubtle: 'var(--border-subtle)',
  borderStrong: 'var(--border-strong)',
  
  // Card colors
  cardBg: 'var(--card-bg)',
  
  // Semantic colors
  success: '#10b981',
  successMuted: '#d1fae5',
  danger: '#ef4444',
  dangerMuted: '#fee2e2',
  warning: '#f59e0b',
  warningMuted: '#fef3c7',
  info: '#3b82f6',
  infoMuted: '#dbeafe',
} as const;

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  '3xl': '3rem',    // 48px
  '4xl': '4rem',    // 64px
  '5xl': '6rem',    // 96px
} as const;

export const borderRadius = {
  sm: 'var(--radius-sm)',     // 8px
  md: 'var(--radius-md)',     // 12px
  lg: 'var(--radius-lg)',     // 16px
  xl: 'var(--radius-xl)',     // 24px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: 'var(--card-shadow)',
  lg: 'var(--card-hover-shadow)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  accent: '0 0 20px rgba(37, 99, 235, 0.15)',
  accentLg: '0 10px 40px rgba(37, 99, 235, 0.2)',
} as const;

export const typography = {
  fontFamily: {
    sans: "'Inter', system-ui, sans-serif",
    heading: "'Plus Jakarta Sans', sans-serif",
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
} as const;

export const transitions = {
  default: 'var(--transition)',
  fast: '0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: '0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
  cursor: 99999,
  loader: 999999,
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;