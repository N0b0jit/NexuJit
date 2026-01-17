'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Youtube, Flag } from 'lucide-react';

export default function SocialPopup() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show popup after 5 seconds delay
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const whatsappLink = `https://wa.me/?text=${encodeURIComponent("System Rating: ⭐⭐⭐⭐⭐ - Feedback: NexuJit is an amazing platform!")}`;
    const youtubeLink = "https://www.youtube.com/@NexuJit"; // Replace with actual channel if different

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full"
                >
                    <div className="relative bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/20 dark:border-slate-700 p-6 overflow-hidden glass hover:border-accent/30 transition-colors duration-500 group">

                        {/* Close Button */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-4 right-4 p-2 text-fg-tertiary hover:text-rose-500 transition-colors z-20"
                        >
                            <X size={18} strokeWidth={3} />
                        </button>

                        {/* Content */}
                        <div className="flex gap-5 items-start relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-accent flex shrink-0 items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform duration-500">
                                <Flag className="text-white fill-white" size={24} />
                            </div>
                            <div className="space-y-2 pt-1">
                                <h3 className="font-heading font-black text-xl text-fg-primary leading-none">
                                    Elite Agent?
                                </h3>
                                <p className="text-sm font-medium text-fg-secondary leading-tight">
                                    Join the mission or report your findings. We value your intelligence.
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <a
                                href={youtubeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                            >
                                <Youtube size={16} fill="currentColor" />
                                Follow
                            </a>
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                            >
                                <MessageCircle size={16} />
                                Rate 5★
                            </a>
                        </div>

                        {/* Background effects */}
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/20 blur-3xl rounded-full pointer-events-none" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
