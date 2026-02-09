'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef, useState, useEffect } from 'react';
import { Sparkles, Activity, ShieldCheck, Zap } from 'lucide-react';
import type {
    RevealProps,
    CardProps,
    BadgeProps,
    ButtonProps,
    InputProps,
    TextareaProps,
    SelectProps,
    TabsProps,
    ToolShellProps
} from './types';

/**
 * Animated reveal container with fade-in and slide-up effect
 */
export const Reveal = ({ children, delay = 0, className = '', style }: RevealProps) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
            duration: 0.15,
            delay,
            ease: [0.23, 1, 0.32, 1]
        }}
        className={className}
        style={style}
    >
        {children}
    </motion.div>
);

/**
 * Magnetic component for high-end interactive physics
 */
export const Magnetic = ({ children }: { children: ReactNode }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current!.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;

    return (
        <motion.div
            style={{ position: "relative" }}
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 1000, damping: 30, mass: 0.05 }}
        >
            {children}
        </motion.div>
    );
};

/**
 * Card component with optional hover effects
 */
export const Card = ({
    children,
    className = '',
    padding = 'p-10',
    hover = true,
    style,
}: CardProps) => (
    <div
        className={`bg-bg-secondary glass rounded-[3rem] ${padding} ${hover ? 'premium-card' : ''} transition-all duration-150 flex flex-col items-stretch ${className}`}
        style={style}
    >
        {children}
    </div>
);

/**
 * Badge component for labels and tags
 */
export const Badge = ({
    children,
    variant = 'neutral',
    className = '',
    style,
}: BadgeProps) => {
    const variants: Record<string, string> = {
        accent: 'bg-accent/10 text-accent border-accent/20',
        success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        danger: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
        neutral: 'glass text-fg-secondary border-accent/10',
        info: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        outline: 'bg-transparent text-fg-secondary border-glass-border',
    };

    return (
        <span
            className={`
                inline-flex items-center rounded-xl border px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all
                ${variants[variant]} ${className}
            `}
            style={style}
        >
            {children}
        </span>
    );
};

/**
 * Button component with multiple variants and sizes
 */
export const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    type = 'button',
    fullWidth = false,
    style,
}: ButtonProps) => {
    const variants: Record<string, string> = {
        primary: 'bg-accent text-white hover:bg-accent shadow-2xl shadow-accent/40 active:shadow-inner text-white border border-white/20',
        secondary: 'glass text-fg-primary border border-accent/10 hover:border-accent hover:text-accent font-black shadow-xl backdrop-blur-3xl',
        outline: 'bg-transparent border-2 border-glass-border text-fg-primary hover:bg-bg-tertiary focus:ring-8 focus:ring-accent/5',
        ghost: 'bg-transparent text-fg-secondary hover:bg-bg-secondary hover:text-accent focus:bg-accent/5',
        danger: 'bg-danger text-white hover:opacity-90 shadow-xl shadow-rose-200/50',
    };

    const sizes = {
        xs: 'px-5 py-2.5 text-[10px] h-10 tracking-[0.3em] uppercase',
        sm: 'px-6 py-3.5 text-xs h-12 tracking-widest uppercase',
        md: 'px-10 py-5 text-sm h-16 tracking-tighter',
        lg: 'px-12 py-6 text-base h-20 tracking-tighter',
        xl: 'px-16 py-8 text-2xl h-28 tracking-tighter',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                inline-flex items-center justify-center rounded-2xl font-black transition-all duration-100
                ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} 
                ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer active:scale-95'}
                ${className}
            `}
            style={style}
        >
            {loading ? (
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                </div>
            ) : children}
        </button>
    );
};

/**
 * Input field component with label and error support
 */
export const Input = ({ label, error, helperText, className = '', ...props }: InputProps) => (
    <div className="w-full space-y-4">
        {label && <label className="block text-[11px] font-black text-fg-primary ml-1 uppercase tracking-[0.4em] opacity-60">{label}</label>}
        <div className="relative group">
            <input
                className={`
                    flex h-20 w-full rounded-[1.5rem] md:rounded-[2rem] border-2 border-transparent bg-bg-tertiary/50 dark:bg-bg-tertiary/20 backdrop-blur-xl px-10 py-5 text-xl transition-all duration-100
                    placeholder:text-fg-tertiary/60 focus:outline-none focus:ring-[16px] focus:ring-accent/5 focus:border-accent/40
                    disabled:cursor-not-allowed disabled:opacity-50 font-black tracking-tight
                    ${error ? 'border-danger/50 focus:ring-rose-500/10 shadow-lg' : 'shadow-inner hover:bg-bg-primary'}
                    ${className}
                `}
                {...props}
            />
        </div>
        {helperText && !error && <p className="text-[10px] text-fg-tertiary ml-3 font-black uppercase tracking-widest opacity-60">{helperText}</p>}
        {error && <p className="text-[11px] text-danger font-black ml-3 uppercase tracking-widest">{error}</p>}
    </div>
);

/**
 * Textarea component with label and error support
 */
export const Textarea = ({ label, error, helperText, className = '', ...props }: TextareaProps) => (
    <div className="w-full space-y-4">
        {label && <label className="block text-[11px] font-black text-fg-primary ml-1 uppercase tracking-[0.4em] opacity-60">{label}</label>}
        <textarea
            className={`
                flex min-h-[250px] w-full rounded-[1.5rem] md:rounded-[2rem] border-2 border-transparent bg-bg-tertiary/50 dark:bg-bg-tertiary/20 backdrop-blur-xl px-10 py-7 text-xl transition-all duration-100
                placeholder:text-fg-tertiary/60 focus:outline-none focus:ring-[16px] focus:ring-accent/5 focus:border-accent/40
                disabled:cursor-not-allowed disabled:opacity-50 font-black tracking-tight
                ${error ? 'border-danger/50 focus:ring-rose-500/10 shadow-lg' : 'shadow-inner hover:bg-bg-primary'}
                ${className}
            `}
            {...props}
        />
        {helperText && !error && <p className="text-[10px] text-fg-tertiary ml-3 font-black uppercase tracking-widest opacity-60">{helperText}</p>}
        {error && <p className="text-[11px] text-danger font-black ml-3 uppercase tracking-widest">{error}</p>}
    </div>
);

/**
 * Select dropdown component with label and error support
 */
export const Select = ({ label, error, helperText, options, className = '', ...props }: SelectProps) => (
    <div className="w-full space-y-4">
        {label && <label className="block text-[11px] font-black text-fg-primary ml-1 uppercase tracking-[0.4em] opacity-60">{label}</label>}
        <div className="relative">
            <select
                className={`
                    flex h-20 w-full rounded-[1.5rem] md:rounded-[2rem] border-2 border-transparent bg-bg-tertiary/50 dark:bg-bg-tertiary/20 backdrop-blur-xl px-10 py-5 text-lg transition-all duration-100
                    appearance-none focus:outline-none focus:ring-[16px] focus:ring-accent/5 focus:border-accent/40
                    ${error ? 'border-danger/50 shadow-lg' : 'shadow-inner hover:bg-bg-primary'}
                    ${className}
                    font-black tracking-tight
                `}
                {...props}
            >
                {options?.map((option) => (
                    <option key={option.value} value={option.value} className="bg-bg-primary text-fg-primary font-bold">
                        {option.label}
                    </option>
                ))}
                {props.children}
            </select>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
        {error && <p className="mt-1 text-[11px] text-danger font-black ml-3 uppercase tracking-widest">{error}</p>}
    </div>
);

// Tool page shell with proper seostudio design
export const ToolShell = ({
    title,
    description,
    children,
    secondaryArea
}: {
    title: string,
    description: string,
    children: ReactNode,
    secondaryArea?: ReactNode
}) => (
    <div className="min-h-screen neural-grid">
        <div className="page-container py-32 md:py-56 relative">
            <Reveal>
                <div className="mb-40 text-center max-w-6xl mx-auto space-y-16">
                    <div className="inline-flex items-center gap-4 px-6 py-2 rounded-2xl glass border border-accent/20 animate-float shadow-2xl">
                        <Sparkles size={20} className="text-accent" />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-fg-secondary">Registry Module • Active</span>
                    </div>
                    <h1 className="text-7xl md:text-[10rem] font-black mb-16 tracking-[-0.08em] text-fg-primary leading-[0.8] font-heading drop-shadow-2xl">
                        {title}
                    </h1>
                    <p className="text-2xl md:text-4xl text-fg-secondary font-medium leading-relaxed max-w-4xl mx-auto opacity-80 tracking-tight italic">
                        {description}
                    </p>
                    <div className="h-1.5 w-40 bg-accent/20 rounded-full mx-auto" />
                </div>
            </Reveal>

            <div className="max-w-[1400px] mx-auto">
                <Reveal delay={0.1}>
                    <div className="glass rounded-[4rem] border-2 border-accent/10 shadow-[0_80px_160px_-40px_rgba(37,99,235,0.15)] overflow-hidden relative">
                        <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-transparent via-accent/40 to-transparent" />
                        <div className="p-10 md:p-24 relative z-10 w-full">
                            {children}
                        </div>
                    </div>
                </Reveal>
            </div>
        </div>
    </div>
);

/**
 * Tab navigation component
 */
export const Tabs = ({ tabs, activeTab, setTab }: TabsProps) => (
    <div className="flex flex-wrap gap-4 p-3 glass rounded-[2rem] mb-12 w-fit border border-accent/10 shadow-2xl">
        {tabs.map((tab: any) => (
            <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={`
                    px-10 py-4.5 text-xs font-black uppercase tracking-widest rounded-[1.25rem] transition-all duration-150
                    ${activeTab === tab.id
                        ? 'bg-accent text-white shadow-2xl shadow-accent/40 scale-105 rotate-1'
                        : 'text-fg-tertiary hover:text-accent hover:bg-accent/5'}
                `}
            >
                {tab.label}
            </button>
        ))}
    </div>
);
