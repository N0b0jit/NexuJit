'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Animated background with mesh gradient and mouse-following effect
 */
export default function InteractiveBackground() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="mesh-bg pointer-events-none">
            {/* Static Animated Blobs */}
            <div
                className="mesh-circle bg-accent w-[600px] h-[600px] top-[-100px] right-[-100px]"
                style={{ animationDelay: '0s' }}
            />
            <div
                className="mesh-circle bg-accent-secondary w-[500px] h-[500px] bottom-[-100px] left-[-100px]"
                style={{ animationDelay: '-5s' }}
            />
            <div
                className="mesh-circle bg-blue-500 w-[400px] h-[400px] top-[20%] left-[10%]"
                style={{ animationDelay: '-10s' }}
            />

            {/* Mouse Following Glow */}
            <motion.div
                className="fixed top-0 left-0 w-[800px] h-[800px] rounded-full opacity-[0.08] pointer-events-none z-[-1]"
                style={{
                    background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
                    x: mousePos.x - 400,
                    y: mousePos.y - 400,
                }}
                transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.5 }}
            />

            {/* Noise Texture Overlay */}
            <div className="noise-overlay" />
        </div>
    );
}
