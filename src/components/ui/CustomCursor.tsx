'use client';

import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Custom cursor component with interactive effects
 * Shows different states on hover over interactive elements
 */
export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            const target = e.target as HTMLElement;
            setIsHovering(
                !!target.closest('a') ||
                !!target.closest('button') ||
                !!target.closest('.interactive') ||
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.tagName === 'SELECT'
            );
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[99999] hidden lg:block">
            {/* Outer Glow / Trail */}
            <motion.div
                className="absolute w-8 h-8 rounded-full border border-accent/30 flex items-center justify-center"
                style={{
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: isHovering ? 2.5 : 1,
                    backgroundColor: isHovering ? 'var(--accent-glow)' : 'transparent',
                    borderWidth: isHovering ? '0px' : '1px',
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            />

            {/* Inner Dot */}
            <motion.div
                className="absolute w-1.5 h-1.5 bg-accent rounded-full"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: isClicking ? 0.8 : 1,
                }}
            />

            {/* Crosshair lines on hover */}
            {isHovering && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    className="absolute w-px h-12 bg-accent"
                    style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%', top: -24 }}
                />
            )}
        </div>
    );
}
