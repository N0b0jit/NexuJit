/**
 * Shared TypeScript types for UI components
 */

import { ReactNode, CSSProperties } from 'react';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'info';
export type BadgeVariant = 'neutral' | 'accent' | 'success' | 'danger' | 'warning' | 'info' | 'outline';
export type ColorScheme = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';

export interface BaseComponentProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface RevealProps extends BaseComponentProps {
  delay?: number;
}

export interface CardProps extends BaseComponentProps {
  padding?: string;
  hover?: boolean;
}

export interface BadgeProps extends BaseComponentProps {
  variant?: BadgeVariant;
}

export interface ButtonProps extends BaseComponentProps {
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  helperText?: string;
  options?: Array<{ value: string; label: string }>;
}

export interface TabItem {
  id: string;
  label: string;
  content?: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  setTab: (id: string) => void;
}

export interface ToolShellProps {
  title: string;
  description: string;
  children: ReactNode;
  secondaryArea?: ReactNode;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: Size;
  closeOnOverlay?: boolean;
}

export interface TooltipProps extends BaseComponentProps {
  content: string | ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
}

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  indeterminate?: boolean;
}

export interface RadioProps {
  checked: boolean;
  onChange: (value: string) => void;
  value: string;
  label?: string;
  name: string;
  disabled?: boolean;
  className?: string;
}

export interface ProgressProps extends BaseComponentProps {
  value: number;
  max?: number;
  size?: Size;
  variant?: 'default' | 'accent' | 'success' | 'danger';
  showLabel?: boolean;
}

export interface SpinnerProps extends BaseComponentProps {
  size?: Size;
  variant?: 'default' | 'accent';
}

export interface SkeletonProps extends BaseComponentProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
}

export interface DividerProps extends BaseComponentProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export interface DropdownItem {
  label: string;
  value: string;
  icon?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export interface ToastProps {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose?: () => void;
}