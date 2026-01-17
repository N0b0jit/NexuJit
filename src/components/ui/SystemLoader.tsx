'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Terminal, Shield, Cpu, Zap } from 'lucide-react';

/**
 * Full-screen system loader with progress bar
 * Shown on initial app load
 */
export default function SystemLoader() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setLoading(false), 200);
                    return 100;
                }
                return prev + 5;
            });
        }, 15);

        return () => clearInterval(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="fixed inset-0 z-[999999] bg-[#050507] flex flex-col items-center justify-center p-6"
                >
                    <div className="max-w-md w-full space-y-12">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex flex-col items-center gap-6"
                        >
                            <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 shadow-2xl shadow-accent/20 animate-pulse relative overflow-hidden">
                                <Image
                                    src="/logo.png"
                                    alt="NexuJit System"
                                    width={56}
                                    height={56}
                                    className="object-contain drop-shadow-[0_0_20px_rgba(37,99,235,0.8)]"
                                />
                            </div>
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">NexuJit <span className="text-accent">Nexus</span></h2>
                                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">Initializing Analytics Engine</p>
                            </div>
                        </motion.div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-accent">Kernel Handshake</span>
                                <span className="text-[10px] font-black text-white/40">{progress}%</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-accent shadow-[0_0_15px_rgba(99,102,241,1)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 opacity-30">
                            {[
                                { icon: Shield, label: 'Secure' },
                                { icon: Cpu, label: 'Logic' },
                                { icon: Zap, label: 'Velocity' }
                            ].map((item) => (
                                <div key={item.label} className="flex flex-col items-center gap-2">
                                    <item.icon size={16} className="text-white" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="absolute bottom-10 text-[10px] font-bold text-white/10 uppercase tracking-[1em]">
                        Authorized Access Only
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
