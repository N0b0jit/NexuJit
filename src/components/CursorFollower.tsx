'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

export default function CursorFollower() {
    const [isPointer, setIsPointer] = useState(false);
    const [isHidden, setIsHidden] = useState(true);
    const [isClicking, setIsClicking] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth springs for the main follower
    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    // Faster spring for the center dot
    const dotX = useSpring(mouseX, { damping: 40, stiffness: 450 });
    const dotY = useSpring(mouseY, { damping: 40, stiffness: 450 });

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            if (isHidden) setIsHidden(false);

            const target = e.target as HTMLElement;
            const isClickable =
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a');

            setIsPointer(!!isClickable);
        };

        const onMouseDown = () => setIsClicking(true);
        const onMouseUp = () => setIsClicking(false);
        const onMouseLeave = () => setIsHidden(true);
        const onMouseEnter = () => setIsHidden(false);

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('mouseenter', onMouseEnter);

        // Hide default cursor
        document.body.style.cursor = 'none';
        const allButtons = document.querySelectorAll('button, a');
        allButtons.forEach(el => (el as HTMLElement).style.cursor = 'none');

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('mouseenter', onMouseEnter);
            document.body.style.cursor = 'auto';
        };
    }, [mouseX, mouseY, isHidden]);

    // Clean up cursor style on unmount or navigation
    useEffect(() => {
        return () => {
            document.body.style.cursor = 'auto';
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
            <AnimatePresence>
                {!isHidden && (
                    <>
                        {/* Outer Glow / Ring */}
                        <motion.div
                            style={{
                                x: cursorX,
                                y: cursorY,
                                translateX: '-50%',
                                translateY: '-50%',
                            }}
                            className="absolute w-8 h-8 rounded-full border border-accent/30 bg-accent/5 backdrop-blur-[2px]"
                            animate={{
                                scale: isClicking ? 0.8 : isPointer ? 1.5 : 1,
                                opacity: 1,
                                backgroundColor: isPointer ? 'rgba(var(--accent-rgb), 0.15)' : 'rgba(var(--accent-rgb), 0.05)',
                                borderColor: isPointer ? 'rgba(var(--accent-rgb), 0.5)' : 'rgba(var(--accent-rgb), 0.3)',
                            }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 200, mass: 0.5 }}
                        />

                        {/* Trailing Blob */}
                        <motion.div
                            style={{
                                x: cursorX,
                                y: cursorY,
                                translateX: '-50%',
                                translateY: '-50%',
                            }}
                            className="absolute w-12 h-12 rounded-full bg-accent/10 blur-xl mix-blend-screen"
                            animate={{
                                scale: isPointer ? 2 : 1,
                                opacity: isPointer ? 0.6 : 0.3,
                            }}
                        />

                        {/* Center Dot */}
                        <motion.div
                            style={{
                                x: dotX,
                                y: dotY,
                                translateX: '-50%',
                                translateY: '-50%',
                            }}
                            className="absolute w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.8)]"
                            animate={{
                                scale: isClicking ? 2 : isPointer ? 0.5 : 1,
                            }}
                        />
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
