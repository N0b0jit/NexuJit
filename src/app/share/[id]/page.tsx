'use client';

import { useState, useEffect } from 'react';
import {
    Download, ShieldCheck, Zap, Activity, Smartphone,
    Monitor, FileUp, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui/Core';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ShareReceiverPage() {
    const params = useParams();
    const id = params?.id as string;

    const [status, setStatus] = useState<'connecting' | 'connected' | 'downloading' | 'complete'>('connecting');
    const [progress, setProgress] = useState(0);
    const [fileInfo, setFileInfo] = useState({ name: 'shared_file.zip', size: '42.5 MB' });

    // Simulate connection flow
    useEffect(() => {
        const timer1 = setTimeout(() => setStatus('connected'), 2000);
        return () => clearTimeout(timer1);
    }, []);

    const handleDownload = () => {
        setStatus('downloading');
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    setStatus('complete');
                    return 100;
                }
                return p + 5;
            });
        }, 100);
    };

    return (
        <div className="min-h-screen bg-bg-primary text-fg-primary flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.05)_0%,transparent_50%)]">
            <div className="w-full max-w-xl space-y-8">
                {/* Branding Header */}
                <div className="text-center space-y-2">
                    <Link href="/">
                        <h1 className="text-4xl font-black tracking-tighter italic hover:opacity-80 transition-opacity">
                            TOFFEE<span className="text-accent underline">BRIDGE</span>
                        </h1>
                    </Link>
                    <p className="text-fg-tertiary text-xs font-black uppercase tracking-[0.3em]">Neural P2P Receiver</p>
                </div>

                <AnimatePresence mode="wait">
                    {status === 'connecting' ? (
                        <motion.div
                            key="connecting"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="text-center space-y-6 py-12"
                        >
                            <div className="relative w-24 h-24 mx-auto">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-4 border-accent/20 border-t-accent rounded-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center text-accent">
                                    <Activity size={32} className="animate-pulse" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold tracking-tight">Handshaking...</h2>
                                <p className="text-sm text-fg-tertiary font-medium">Establishing secure Peer-to-Peer tunnel</p>
                                <p className="text-[10px] font-mono text-accent/50 uppercase tracking-widest">Tunnel ID: {id}</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="main"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="p-8 rounded-[3rem] border-2 border-accent/10 shadow-2xl bg-bg-primary/80 backdrop-blur-3xl space-y-8 overflow-hidden relative">
                                {/* Decorative Glow */}
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />

                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-accent rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-accent/40 group relative overflow-hidden">
                                        <FileUp size={36} />
                                        <motion.div
                                            animate={{ y: [-40, 40] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute inset-x-0 h-1 bg-white/20"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="success" className="text-[8px] tracking-[.2em] px-2 py-0.5">DIRECT LINK</Badge>
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        </div>
                                        <h3 className="text-2xl font-black truncate tracking-tighter mb-1">{fileInfo.name}</h3>
                                        <p className="text-xs text-fg-tertiary font-black uppercase tracking-widest">{fileInfo.size} • 0-Latency Source</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {status === 'downloading' ? (
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                <span>Receiving Stream</span>
                                                <span className="text-accent">{progress}%</span>
                                            </div>
                                            <div className="h-4 bg-bg-tertiary rounded-full overflow-hidden border border-glass-border p-1">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress}%` }}
                                                    className="h-full bg-accent rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                                                />
                                            </div>
                                            <p className="text-[9px] text-fg-tertiary italic text-center">Data is flowing directly from the sender's browser memory.</p>
                                        </div>
                                    ) : status === 'complete' ? (
                                        <motion.div
                                            initial={{ scale: 0.9 }}
                                            animate={{ scale: 1 }}
                                            className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl text-center space-y-3"
                                        >
                                            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-xl">
                                                <CheckCircle size={24} />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="font-bold text-emerald-600 uppercase tracking-tighter">Transfer Complete</h4>
                                                <p className="text-[10px] text-emerald-700 font-medium">File successfully reconstructed from neural fragments.</p>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <Button
                                            fullWidth
                                            size="lg"
                                            className="h-20 rounded-2xl text-xl font-black tracking-tight shadow-2xl hover:shadow-accent/40 active:scale-95 transition-all group"
                                            onClick={handleDownload}
                                        >
                                            <Download className="mr-3 group-hover:translate-y-1 transition-transform" />
                                            DOWNLOAD NOW
                                        </Button>
                                    )}

                                    {/* Security/Tech Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-bg-tertiary/40 rounded-2xl border border-glass-border flex items-center gap-3">
                                            <ShieldCheck size={18} className="text-accent" />
                                            <div className="space-y-0.5">
                                                <p className="text-[8px] font-black text-fg-tertiary uppercase tracking-widest">Privacy</p>
                                                <p className="text-[10px] font-bold">End-to-End</p>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-bg-tertiary/40 rounded-2xl border border-glass-border flex items-center gap-3">
                                            <Zap size={18} className="text-amber-500" />
                                            <div className="space-y-0.5">
                                                <p className="text-[8px] font-black text-fg-tertiary uppercase tracking-widest">Protocol</p>
                                                <p className="text-[10px] font-bold">P2P Stream</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Warnings */}
                <div className="text-center space-y-4 px-6 opacity-60">
                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                        <Clock size={14} /> Link will expire once sender closes their tab
                    </div>
                </div>
            </div>
        </div>
    );
}
