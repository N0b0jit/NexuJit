'use client';

import { useState, useRef, useEffect } from 'react';
import { Palette, Share2, Sparkles, Wand2, Search, Globe, Code, Layers, FileCode, Zap } from 'lucide-react';
import { Card, Badge, Button, Magnetic } from '@/components/ui/Core';
import { motion, AnimatePresence } from 'framer-motion';

export default function DesignNeuralTools({ defaultTab = 'psychology' }: { defaultTab?: string }) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const tabs = [
        { id: 'psychology', label: 'Color Psychology', icon: Wand2 },
        { id: 'palette-counter', label: 'Site Palette Scan', icon: Search },
        { id: 'svg-glow', label: 'SVG Glow Tracer', icon: Zap },
        { id: 'skeleton-gen', label: 'Skeleton Generator', icon: Layers },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex flex-wrap bg-surface p-2 rounded-2xl border border-glass-border justify-center gap-2 sticky top-4 z-50 backdrop-blur-xl">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black transition-all text-sm ${activeTab === tab.id ? 'bg-accent text-white shadow-2xl' : 'hover:bg-bg-primary text-fg-tertiary'}`}
                    >
                        <tab.icon size={16} /> {tab.label.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="min-h-[600px] animate-fade-in">
                {activeTab === 'psychology' && <ColorPsychologyUI />}
                {activeTab === 'palette-counter' && <SitePaletteCounterUI />}
                {activeTab === 'svg-glow' && <SvgGlowTracerUI />}
                {activeTab === 'skeleton-gen' && <SkeletonGeneratorUI />}
            </div>
        </div>
    );
}

// --- Brand Color Psychology Auditor ---
function ColorPsychologyUI() {
    const [color, setColor] = useState('#2563eb');

    // Simplified psychology data
    const getPsychology = (hex: string) => {
        // This is a mockup; real logic would convert hex to HSL/category
        return {
            traits: ['Trust', 'Security', 'Intelligence', 'Technology'],
            profile: "This color communicates a sense of professional stability and digital innovation. It's often used by fintech and enterprise SaaS companies to build long-term confidence.",
            industries: ['Enterprise', 'Technology', 'Banking', 'Medical'],
            trustScore: 92,
            luxuryScore: 78,
            energyScore: 65,
        };
    };

    const psychology = getPsychology(color);

    return (
        <Card className="p-10 bg-linear-to-br from-bg-primary to-bg-secondary border-2 border-accent/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <Badge variant="accent" className="px-3 py-1">NEURAL ANALYSIS</Badge>
                        <h2 className="text-4xl font-black italic tracking-tighter">Brand <span className="text-accent underline">Psychology</span> Auditor</h2>
                        <p className="text-fg-secondary text-sm">Input your primary brand color to see what it communicates to your users' subconscious.</p>
                    </div>

                    <div className="space-y-6 bg-surface p-8 rounded-[2.5rem] border border-glass-border">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-black uppercase tracking-widest text-fg-tertiary">Select Brand Color</label>
                            <span className="font-mono font-bold text-accent">{color.toUpperCase()}</span>
                        </div>
                        <div className="flex gap-4">
                            <input
                                type="color"
                                className="w-20 h-20 rounded-2xl bg-transparent border-none cursor-pointer outline-none"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            />
                            <input
                                type="text"
                                className="flex-1 bg-bg-primary border-2 border-glass-border rounded-2xl px-6 font-bold text-lg outline-none focus:border-accent transition-all uppercase"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {psychology.traits.map(trait => (
                            <div key={trait} className="p-4 bg-accent/5 border border-accent/20 rounded-2xl text-center">
                                <Sparkles size={14} className="text-accent mx-auto mb-2" />
                                <div className="text-xs font-black text-fg-primary uppercase">{trait}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="p-8 rounded-[3rem] bg-white text-gray-900 shadow-2xl space-y-6 border-8 border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20" style={{ backgroundColor: color }} />
                        <h4 className="text-2xl font-black italic underline decoration-accent">Subconscious Profile</h4>
                        <p className="text-lg leading-relaxed font-medium opacity-80 italic">"{psychology.profile}"</p>

                        <div className="space-y-4 pt-6 border-t border-gray-100">
                            {[
                                { label: 'Trust & Safety', val: psychology.trustScore },
                                { label: 'Elite Luxury', val: psychology.luxuryScore },
                                { label: 'Market Energy', val: psychology.energyScore }
                            ].map(item => (
                                <div key={item.label} className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-black uppercase">
                                        <span>{item.label}</span>
                                        <span>{item.val}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${item.val}%` }} className="h-full bg-accent" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-accent/10 border border-accent/20 rounded-3xl">
                        <h5 className="text-xs font-black uppercase text-accent mb-3 flex items-center gap-2">
                            <Globe size={14} /> Top Industries
                        </h5>
                        <div className="flex flex-wrap gap-2">
                            {psychology.industries.map(ind => (
                                <span key={ind} className="bg-white/50 px-4 py-1.5 rounded-full text-[10px] font-bold border border-glass-border text-fg-secondary">
                                    {ind}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

// --- Site Palette Counter ---
function SitePaletteCounterUI() {
    const [url, setUrl] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [colors, setColors] = useState<{ hex: string, count: number }[]>([]);

    const startScan = () => {
        setIsScanning(true);
        // Simulated scan results
        setTimeout(() => {
            setColors([
                { hex: '#2563eb', count: 42 },
                { hex: '#1e293b', count: 28 },
                { hex: '#ffffff', count: 156 },
                { hex: '#f8fafc', count: 89 },
                { hex: '#ef4444', count: 2 }, // Outlier example
                { hex: '#10b981', count: 12 },
            ]);
            setIsScanning(false);
        }, 2000);
    };

    return (
        <Card className="p-10 space-y-10 bg-linear-to-b from-bg-primary to-bg-secondary border-2 border-accent/10">
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-black italic tracking-tighter">Site <span className="text-accent">Palette</span> Counter</h2>
                <p className="text-fg-secondary">Enter a URL to deep-scan every HEX code in its production CSS.</p>
            </div>

            <div className="max-w-2xl mx-auto flex gap-4 bg-surface p-3 rounded-[2.5rem] border border-glass-border shadow-2xl">
                <input
                    type="url"
                    className="flex-1 bg-transparent border-none outline-none px-6 font-bold text-fg-primary"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <Button onClick={startScan} disabled={isScanning} className="rounded-[1.8rem] px-8 bg-accent font-black">
                    {isScanning ? 'SCANNING...' : 'DEEP SCAN'}
                </Button>
            </div>

            {colors.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {colors.map((c, i) => (
                        <motion.div
                            key={c.hex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-surface p-6 rounded-[2rem] border border-glass-border group hover:border-accent transition-all"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl shadow-xl ring-4 ring-bg-secondary" style={{ backgroundColor: c.hex }} />
                                <div className="flex-1">
                                    <div className="text-sm font-black uppercase text-fg-tertiary flex justify-between">
                                        {c.hex}
                                        {c.count < 5 && <span className="text-red-500 flex items-center gap-1"><Zap size={10} /> OUTLIER</span>}
                                    </div>
                                    <div className="text-lg font-black text-fg-primary">{c.count} Occurrences</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </Card>
    );
}

// --- SVG Glow Path Tracer ---
function SvgGlowTracerUI() {
    const [speed, setSpeed] = useState(3);
    const [color, setColor] = useState('#2563eb');
    const [glowIntensity, setGlowIntensity] = useState(20);

    return (
        <Card className="p-10 space-y-10 bg-linear-to-br from-bg-primary via-bg-secondary to-bg-primary border-2 border-accent/10 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black tracking-tighter italic">SVG <span className="text-accent underline decoration-4">Neon</span> Tracer</h2>
                        <p className="text-fg-secondary text-sm">Transform standard SVG paths into animated glowing pulses.</p>
                    </div>

                    <div className="space-y-6 bg-surface p-8 rounded-[2.5rem] border border-glass-border">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black tracking-widest uppercase text-fg-tertiary">Trace Speed ({speed}s)</label>
                            <input type="range" min="1" max="10" step="0.5" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-accent" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black tracking-widest uppercase text-fg-tertiary">Glow Intensity</label>
                            <input type="range" min="0" max="50" value={glowIntensity} onChange={(e) => setGlowIntensity(Number(e.target.value))} className="w-full accent-accent" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest uppercase text-fg-tertiary">Pulse Color</label>
                            <div className="flex gap-4">
                                <input type="color" className="w-12 h-12 rounded-lg" value={color} onChange={(e) => setColor(e.target.value)} />
                                <div className="flex-1 bg-bg-primary border-2 border-glass-border rounded-xl px-4 flex items-center font-mono font-bold text-fg-tertiary">{color.toUpperCase()}</div>
                            </div>
                        </div>
                    </div>

                    <Button className="w-full py-5 bg-accent text-white font-black rounded-3xl shadow-2xl hover:scale-[1.02] transition-all">
                        GENERATE CSS SNIPPET
                    </Button>
                </div>

                <div className="flex items-center justify-center p-12 bg-black rounded-[3rem] border border-glass-border shadow-2xl min-h-[400px]">
                    <svg width="200" height="200" viewBox="0 0 100 100" className="drop-shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                        <path
                            d="M20,50 Q50,0 80,50 Q50,100 20,50"
                            fill="none"
                            stroke={color}
                            strokeWidth="2"
                            strokeDasharray="100, 200"
                            style={{
                                filter: `drop-shadow(0 0 ${glowIntensity}px ${color})`,
                                animation: `dash ${speed}s linear infinite`
                            }}
                        />
                        <style>{`
                            @keyframes dash {
                                from { stroke-dashoffset: 300; }
                                to { stroke-dashoffset: 0; }
                            }
                        `}</style>
                    </svg>
                </div>
            </div>
        </Card>
    );
}

// --- Skeleton Generator ---
function SkeletonGeneratorUI() {
    return (
        <Card className="p-10 text-center space-y-8 bg-linear-to-b from-bg-primary to-bg-secondary border-2 border-accent/10">
            <div className="space-y-2">
                <h2 className="text-4xl font-black italic tracking-tighter">SVG <span className="text-accent">Skeleton</span> Gen</h2>
                <p className="text-fg-secondary">Drop a design component SVG to automatically generate its shimmer loading twin.</p>
            </div>

            <div className="border-4 border-dashed border-accent/20 rounded-[3rem] p-16 animate-pulse group hover:border-accent transition-all cursor-pointer">
                <Layers size={64} className="mx-auto text-accent mb-6" />
                <h3 className="text-2xl font-black mb-2">Drop Component SVG Here</h3>
                <p className="text-fg-tertiary">We will strip fills and inject neural shimmer logic.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-fg-tertiary px-4 border-l-2 border-accent">Preview</h4>
                    <div className="p-8 bg-surface rounded-[2rem] border border-glass-border space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-200 animate-pulse" />
                            <div className="space-y-2 flex-1">
                                <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
                                <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse" />
                            </div>
                        </div>
                        <div className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
                        <div className="flex justify-between gap-4">
                            <div className="h-10 bg-slate-200 rounded-xl flex-1 animate-pulse" />
                            <div className="h-10 bg-slate-200 rounded-xl w-24 animate-pulse" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-fg-tertiary px-4 border-l-2 border-emerald-500">Neural JSX</h4>
                    <div className="p-8 bg-black rounded-[2rem] border border-glass-border font-mono text-[10px] text-emerald-400 overflow-x-auto whitespace-pre">
                        {`const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="flex gap-4">
      <div className="rounded-full bg-slate-400/20" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-2 bg-slate-400/20" />
        <div className="h-2 bg-slate-400/20" />
      </div>
    </div>
  </div>
);`}
                    </div>
                </div>
            </div>
        </Card>
    );
}
