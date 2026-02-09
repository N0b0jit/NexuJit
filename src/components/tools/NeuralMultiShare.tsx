'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Wifi, Share2, Smartphone, Monitor, Shield, Zap,
    Send, Download, CheckCircle, X, Info, QrCode,
    Copy, Globe, Link as LinkIcon, FileUp, Plus, AlertTriangle,
    MessageSquare, Facebook, Twitter, Mail
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui/Core';
import { motion, AnimatePresence } from 'framer-motion';

export default function NeuralMultiShare() {
    const [file, setFile] = useState<File | null>(null);
    const [isSharing, setIsSharing] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [progress, setProgress] = useState(0);
    const [nearbyEnabled, setNearbyEnabled] = useState(true);
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial State: Pick File
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            startSharing();
        }
    };

    const startSharing = () => {
        setIsSharing(true);
        // Instant P2P Link Simulation
        const roomId = Math.random().toString(36).substring(7);
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://nexujit.app';
        setShareUrl(`${baseUrl}/share/${roomId}`);
    };

    const resetSharing = () => {
        setIsSharing(false);
        setFile(null);
        setShareUrl('');
        setProgress(0);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        // Could add a toast here
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center -mt-12">
            <AnimatePresence mode="wait">
                {!isSharing ? (
                    /* STEP 1: DROP ZONE (TOFFEESHARE STYLE) */
                    <motion.div
                        key="drop"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-2xl px-6"
                    >
                        <div className="text-center space-y-4 mb-12">
                            <h1 className="text-6xl font-black tracking-tighter italic">TOFFEE<span className="text-accent underline">BRIDGE</span></h1>
                            <p className="text-fg-secondary text-xl font-medium">Making sharing sweet. Direct P2P transfer with zero limits.</p>
                        </div>

                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                const droppedFile = e.dataTransfer.files[0];
                                if (droppedFile) {
                                    setFile(droppedFile);
                                    startSharing();
                                }
                            }}
                            onClick={() => fileInputRef.current?.click()}
                            className={`group relative h-80 rounded-[3rem] border-4 border-dashed transition-all flex flex-col items-center justify-center p-12 text-center cursor-pointer overflow-hidden ${isDragging ? 'border-accent bg-accent/5 scale-105 shadow-2xl' : 'border-glass-border hover:border-accent/40 bg-surface/50'
                                }`}
                        >
                            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />

                            {/* Decorative Background Waves */}
                            <div className="absolute inset-0 -z-10 opacity-10">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-accent rounded-full blur-[100px]"
                                />
                            </div>

                            <motion.div
                                animate={isDragging ? { scale: 1.2 } : { scale: 1 }}
                                className="w-24 h-24 bg-accent rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-accent/20 group-hover:rotate-12 transition-transform duration-500"
                            >
                                <Plus size={48} className="text-white" />
                            </motion.div>

                            <h2 className="text-3xl font-black tracking-tight mb-2">PICK A FILE</h2>
                            <p className="text-fg-tertiary text-sm font-bold uppercase tracking-widest">Or drag it here to start instant P2P</p>

                            <div className="absolute bottom-8 flex gap-4 opacity-40 group-hover:opacity-100 transition-opacity">
                                <Badge variant="neutral" className="text-[9px] gap-2"><Shield size={10} /> END-TO-END</Badge>
                                <Badge variant="neutral" className="text-[9px] gap-2"><Zap size={10} /> NO SIZE LIMITS</Badge>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* STEP 2: SHARING STATE (TOFFEESHARE STYLE) */
                    <motion.div
                        key="share"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="w-full max-w-5xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
                    >
                        {/* LEFT SIDE: File Card & QR */}
                        <div className="lg:col-span-5 space-y-6">
                            <Card className="p-8 rounded-[2.5rem] border-2 border-accent/20 shadow-2xl bg-bg-primary/80 backdrop-blur-xl relative overflow-hidden">
                                <button
                                    onClick={resetSharing}
                                    className="absolute top-6 right-6 p-2 hover:bg-bg-tertiary rounded-full transition-colors"
                                >
                                    <X size={20} className="text-fg-secondary" />
                                </button>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                                            <FileUp size={28} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-bold truncate tracking-tight">{file?.name}</h3>
                                            <p className="text-xs text-fg-tertiary font-bold uppercase tracking-widest">
                                                {(file!.size / 1024 / 1024).toFixed(2)} MB • READY TO STREAM
                                            </p>
                                        </div>
                                    </div>

                                    {/* Link & Copy */}
                                    <div className="relative group">
                                        <input
                                            readOnly
                                            value={shareUrl}
                                            className="w-full bg-bg-tertiary border border-glass-border px-6 py-4 rounded-2xl pr-20 font-mono text-sm focus:border-accent outline-none"
                                        />
                                        <button
                                            onClick={handleCopy}
                                            className="absolute right-2 top-2 bottom-2 px-4 bg-accent text-white rounded-xl text-xs font-black uppercase hover:shadow-xl hover:shadow-accent/20 transition-all active:scale-95"
                                        >
                                            COPY
                                        </button>
                                    </div>

                                    {/* QR Code */}
                                    <div className="bg-white p-6 rounded-3xl aspect-square flex items-center justify-center border-4 border-bg-tertiary shadow-inner">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(shareUrl)}`}
                                            alt="Share QR"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    {/* Social Shortcuts */}
                                    <div className="flex justify-between px-2 pt-2">
                                        {[MessageSquare, Facebook, Twitter, Mail].map((Icon, i) => (
                                            <button key={i} className="p-3 bg-bg-tertiary hover:bg-accent hover:text-white rounded-2xl transition-all hover:-translate-y-1">
                                                <Icon size={20} />
                                            </button>
                                        ))}
                                    </div>

                                    {/* Options */}
                                    <div className="pt-4 space-y-3">
                                        <div className="flex items-center justify-between p-4 bg-bg-tertiary/50 rounded-2xl border border-glass-border">
                                            <div className="flex items-center gap-2">
                                                <Smartphone size={16} className="text-accent" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Share with nearby</span>
                                            </div>
                                            <button
                                                onClick={() => setNearbyEnabled(!nearbyEnabled)}
                                                className={`w-10 h-5 rounded-full transition-colors relative ${nearbyEnabled ? 'bg-accent' : 'bg-bg-tertiary border border-glass-border'}`}
                                            >
                                                <motion.div
                                                    animate={{ x: nearbyEnabled ? 22 : 2 }}
                                                    className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* RIGHT SIDE: Pulse & Waiting Message */}
                        <div className="lg:col-span-7 space-y-12">
                            <div className="space-y-6">
                                <motion.h2
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-6xl font-black tracking-tighter leading-tight"
                                >
                                    NOW STREAMING <br />
                                    <span className="text-accent underline decoration-white/20 underline-offset-8">DIRECTLY FROM YOU</span>
                                </motion.h2>

                                <div className="space-y-4 max-w-lg">
                                    <div className="flex items-start gap-4 p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl">
                                        <AlertTriangle className="text-amber-500 shrink-0" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-amber-600">IMPORTANT SECURITY NOTE</p>
                                            <p className="text-xs text-amber-700/80 font-medium leading-relaxed">
                                                Closing this tab will stop the sharing process. This is a Peer-to-Peer connection; the file resides only on your device.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 px-6">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-fg-tertiary">Waiting for connection...</span>
                                    </div>
                                </div>
                            </div>

                            {/* Nearby Broadcast Visualization */}
                            {nearbyEnabled && (
                                <div className="relative h-64 flex items-center justify-center overflow-hidden rounded-[3rem] bg-accent/[0.03] border border-accent/10">
                                    <div className="absolute w-24 h-24 bg-accent rounded-full flex items-center justify-center z-10 shadow-[0_0_50px_rgba(37,99,235,0.3)]">
                                        <Wifi size={32} className="text-white" />
                                    </div>
                                    {[1, 2, 3].map((circle) => (
                                        <motion.div
                                            key={circle}
                                            animate={{ scale: [1, 3], opacity: [0.5, 0] }}
                                            transition={{ duration: 3, repeat: Infinity, delay: circle * 1 }}
                                            className="absolute w-32 h-32 border-2 border-accent/20 rounded-full"
                                        />
                                    ))}
                                    <p className="absolute bottom-6 text-[10px] font-black tracking-[0.5em] text-accent uppercase animate-pulse">Broadcasting Neuro-Link</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
