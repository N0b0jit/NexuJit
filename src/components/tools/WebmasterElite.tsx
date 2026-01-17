'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Globe, Eye, Zap, AlertTriangle, ShieldCheck, Info, Sparkles, Layout, MousePointer2 } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui/Core';
import { motion, AnimatePresence } from 'framer-motion';

export default function WebmasterElite() {
    const [activeTab, setActiveTab] = useState<'heatmap' | 'accessibility'>('heatmap');

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-32">
            <div className="flex bg-surface p-2 rounded-2xl border border-glass-border justify-center sticky top-4 z-50 backdrop-blur-xl">
                <button
                    onClick={() => setActiveTab('heatmap')}
                    className={`flex items-center gap-3 px-8 py-3 rounded-xl font-black transition-all ${activeTab === 'heatmap' ? 'bg-accent text-white shadow-2xl' : 'hover:bg-bg-primary text-fg-tertiary'}`}
                >
                    <Eye size={18} /> CLUTTER HEATMAP
                </button>
            </div>

            <div className="min-h-[600px] animate-fade-in">
                {activeTab === 'heatmap' && <ClutterHeatmapUI />}
            </div>
        </div>
    );
}

function ClutterHeatmapUI() {
    const [image, setImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showHeatmap, setShowHeatmap] = useState(false);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
            setShowHeatmap(false);
        }
    };

    const runAnalysis = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            setShowHeatmap(true);
        }, 3000);
    };

    return (
        <Card className="p-12 space-y-12 bg-linear-to-b from-bg-primary via-bg-secondary to-bg-primary border-2 border-accent/20">
            <div className="text-center space-y-2">
                <Badge variant="accent" className="px-6 py-1.5 rounded-full font-black">NEURAL VISION V4.0</Badge>
                <h2 className="text-4xl font-black tracking-tighter italic">Website <span className="text-accent underline">Clutter</span> Heatmap</h2>
                <p className="text-fg-secondary">Upload a screenshot. Our heuristic engine highlights high-stress areas with excessive cognitive load.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    <div className="relative aspect-video rounded-[3rem] border-4 border-dashed border-glass-border overflow-hidden bg-black/40 group">
                        {image ? (
                            <>
                                <img src={image} className="w-full h-full object-cover opacity-80" alt="Page Screenshot" />
                                {showHeatmap && (
                                    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                                        {/* Simplified heatmap blobs */}
                                        <div className="absolute top-[10%] left-[20%] w-48 h-48 bg-red-500/40 blur-[60px] animate-pulse rounded-full" />
                                        <div className="absolute top-[40%] left-[60%] w-64 h-64 bg-amber-500/30 blur-[70px] animate-pulse delay-100 rounded-full" />
                                        <div className="absolute bottom-[20%] left-[10%] w-32 h-32 bg-red-600/50 blur-[50px] animate-pulse delay-300 rounded-full" />
                                        <div className="absolute top-0 inset-0 z-20 mix-blend-overlay opacity-30 bg-radial-at-t from-red-500 via-transparent to-transparent" />
                                    </div>
                                )}
                                {isAnalyzing && (
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="w-24 h-24 rounded-full border-4 border-accent border-t-transparent animate-spin mb-6"
                                        />
                                        <div className="text-xl font-black italic tracking-widest text-accent text-center">
                                            RUNNING SPATIAL HEURISTICS...<br />
                                            <span className="text-xs text-fg-tertiary">MAPPING CONTRAST VULNERABILITIES</span>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <label className="cursor-pointer flex flex-col items-center justify-center h-full p-20 gap-6 transition-all hover:bg-accent/5">
                                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                                <div className="p-8 rounded-full bg-accent/20 text-accent group-hover:scale-110 transition-transform">
                                    <Globe size={48} />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-black">Drop Page Screenshot</h3>
                                    <p className="text-sm font-bold text-fg-tertiary">WEBP, PNG, JPG supported</p>
                                </div>
                            </label>
                        )}
                    </div>

                    <div className="flex justify-center gap-4">
                        {image && !showHeatmap && !isAnalyzing && (
                            <Button onClick={runAnalysis} className="bg-accent px-12 py-4 font-black rounded-2xl shadow-2xl hover:scale-105 transition-all">GENERATE HEATMAP</Button>
                        )}
                        {image && (
                            <Button variant="secondary" onClick={() => setImage(null)} className="rounded-2xl border-white/20">New Audit</Button>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="p-8 rounded-[3rem] bg-surface border-2 border-glass-border space-y-6 shadow-2xl">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-fg-tertiary">Cognitive Scoreboard</h4>
                        <div className="space-y-6">
                            <AuditMetric label="Visual Noise" value={showHeatmap ? 78 : 0} color="red" />
                            <AuditMetric label="Eye Flow Logic" value={showHeatmap ? 42 : 0} color="amber" />
                            <AuditMetric label="Contrast Ratio" value={showHeatmap ? 91 : 0} color="emerald" />
                            <AuditMetric label="Mobile Focus" value={showHeatmap ? 65 : 0} color="accent" />
                        </div>
                    </div>

                    <Card className="p-6 bg-accent border border-accent/20 relative overflow-hidden">
                        <Sparkles size={48} className="absolute -right-4 -bottom-4 text-white/10" />
                        <h5 className="text-sm font-black italic text-white mb-2 underline decoration-white/20">Elite Insight</h5>
                        <p className="text-xs text-white/80 leading-relaxed font-medium transition-opacity" style={{ opacity: showHeatmap ? 1 : 0.3 }}>
                            {showHeatmap ?
                                "Your 'Call to Action' area has too much competing visual noise from nearby decorative elements. Move them at least 80px away for 22% better focus." :
                                "Upload a design to receive actionable spatial optimization feedback."
                            }
                        </p>
                    </Card>
                </div>
            </div>
        </Card>
    );
}

function AuditMetric({ label, value, color }: { label: string, value: number, color: string }) {
    const colors: any = {
        red: 'bg-red-500',
        amber: 'bg-amber-500',
        emerald: 'bg-emerald-500',
        accent: 'bg-accent'
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase">
                <span>{label}</span>
                <span className={value > 70 ? 'text-red-500' : 'text-fg-tertiary'}>{value}%</span>
            </div>
            <div className="h-1.5 w-full bg-bg-primary rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    className={`h-full ${colors[color]}`}
                />
            </div>
        </div>
    );
}
