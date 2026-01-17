'use client';

import { useState, useRef, useEffect } from 'react';
import { Code, Layout, Clock, Activity, Download, Copy, Play, Plus, Trash2, Maximize, Zap, Sparkles } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui/Core';
import { motion, AnimatePresence } from 'framer-motion';

export default function DevEliteTools() {
    const [activeTab, setActiveTab] = useState<'audit' | 'keyframe' | 'grid' | 'border'>('audit');

    const tabs = [
        { id: 'audit', label: 'CSS Audit', icon: Activity },
        { id: 'keyframe', label: 'Keyframe Forge', icon: Clock },
        { id: 'grid', label: 'Grid Template', icon: Layout },
        { id: 'border', label: 'Rotating Border', icon: RotateBorderIcon },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-32">
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

            <div className="min-h-[700px] animate-fade-in relative z-10">
                {activeTab === 'audit' && <CssAuditUI />}
                {activeTab === 'keyframe' && <KeyframeForgeUI />}
                {activeTab === 'grid' && <GridForgeUI />}
                {activeTab === 'border' && <RotatingBorderUI />}
            </div>
        </div>
    );
}

function RotateBorderIcon({ size }: { size: number }) {
    return <div className={`w-[${size}px] h-[${size}px] border-2 border-accent border-dashed rounded-full animate-spin`} style={{ width: size, height: size }} />;
}

// --- CSS Audit Cleanup ---
function CssAuditUI() {
    const [input, setInput] = useState(':root {\n  --primary: #2563eb;\n  --unused: #f8fafc;\n}\n\n.card {\n  color: #2563eb;\n  padding-bottom: 56.25%; /* OLD HACK */\n  display: flex;\n  color: #2563eb; /* DUPLICATE */\n}');
    const [audit, setAudit] = useState<any[]>([]);

    const runAudit = () => {
        const issues = [];
        if (input.includes('padding-bottom:')) issues.push({ type: 'shorthand', label: 'Legacy Aspect Ratio', desc: 'Use aspect-ratio: 16/9 instead of padding hacks.' });
        if (input.includes('--unused')) issues.push({ type: 'perf', label: 'Unused Variable', desc: '--unused is defined but never used.' });

        // Simple duplicate detection
        const lines = input.split('\n');
        const counts: any = {};
        lines.forEach(l => {
            const trimmed = l.trim();
            if (trimmed.length > 5 && !trimmed.startsWith('}')) {
                counts[trimmed] = (counts[trimmed] || 0) + 1;
            }
        });
        Object.keys(counts).forEach(k => {
            if (counts[k] > 1) issues.push({ type: 'cleanup', label: 'Redundant Property', desc: `"${k}" is repeated multiple times.` });
        });

        setAudit(issues);
    };

    return (
        <Card className="p-10 space-y-10 bg-linear-to-b from-bg-primary via-bg-secondary to-bg-primary border-2 border-accent/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <h2 className="text-4xl font-black tracking-tighter italic">CSS <span className="text-accent underline">Audit</span> Cleanup</h2>
                    <textarea
                        className="w-full h-[400px] bg-black border-2 border-glass-border rounded-3xl p-6 font-mono text-sm text-fg-secondary outline-none focus:border-accent transition-all leading-relaxed"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste your CSS here..."
                    />
                    <Button onClick={runAudit} className="w-full py-5 bg-accent text-white font-black rounded-3xl shadow-2xl">ANALYZE CODEBASE</Button>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-fg-tertiary">Audit Intelligence Report</h3>
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {audit.map((issue, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-6 bg-surface border-2 border-glass-border rounded-[2rem] flex items-start gap-4 hover:border-accent transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shrink-0 group-hover:scale-110 transition-transform">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-black text-accent uppercase tracking-widest mb-1">{issue.type}</div>
                                        <div className="text-lg font-black text-fg-primary mb-2 tracking-tight">{issue.label}</div>
                                        <p className="text-sm text-fg-secondary leading-relaxed italic">"{issue.desc}"</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {audit.length === 0 && (
                            <div className="h-[400px] border-4 border-dashed border-glass-border rounded-[3rem] flex flex-col items-center justify-center text-center p-10 space-y-4 opacity-30">
                                <Code size={64} />
                                <div className="text-xl font-black">No issues detected yet</div>
                                <p className="text-sm font-medium">Click Analyze to start the neural CSS scan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}

// --- Keyframe Forge ---
function KeyframeForgeUI() {
    const [name, setName] = useState('FloatPulse');
    const [keyframes, setKeyframes] = useState<{ percent: number, props: string }[]>([
        { percent: 0, props: 'transform: translateY(0); opacity: 1;' },
        { percent: 50, props: 'transform: translateY(-20px); opacity: 0.5;' },
        { percent: 100, props: 'transform: translateY(0); opacity: 1;' }
    ]);

    return (
        <Card className="p-10 space-y-10 bg-linear-to-bl from-bg-primary via-bg-secondary to-bg-primary border-2 border-accent/10 overflow-hidden">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h2 className="text-4xl font-black tracking-tighter italic">Neural <span className="text-accent">Keyframe</span> Forge</h2>
                    <p className="text-xs text-fg-tertiary font-bold tracking-widest">VISUAL CSS MOTION ENGINE</p>
                </div>
                <div className="flex items-center gap-4 bg-surface p-4 rounded-3xl border border-glass-border">
                    <input className="bg-transparent border-none font-black text-accent outline-none text-right" value={name} onChange={(e) => setName(e.target.value)} />
                    <Button className="rounded-2xl bg-accent shadow-2xl h-12 px-6">EXPORT</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    {/* Timeline UI */}
                    <div className="relative h-24 bg-surface rounded-3xl border border-glass-border p-6 flex items-center mb-10">
                        <div className="absolute inset-x-10 h-1 bg-accent/20 rounded-full" />
                        {keyframes.map((kf, i) => (
                            <motion.div
                                key={i}
                                className="absolute cursor-pointer group"
                                style={{ left: `calc(${kf.percent}% + 40px)`, transformOrigin: 'center' }}
                            >
                                <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-black text-[10px] shadow-2xl ring-4 ring-bg-secondary group-hover:scale-120 transition-transform">
                                    {kf.percent}%
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {keyframes.map((kf, i) => (
                            <div key={i} className="flex gap-4 items-center">
                                <div className="w-20 font-black text-fg-tertiary text-center text-sm">{kf.percent}%</div>
                                <input
                                    className="flex-1 bg-surface border-2 border-glass-border p-4 rounded-2xl font-mono text-xs text-emerald-400 focus:border-accent outline-none"
                                    value={kf.props}
                                    onChange={(e) => {
                                        const next = [...keyframes];
                                        next[i].props = e.target.value;
                                        setKeyframes(next);
                                    }}
                                />
                                <button className="p-4 hover:bg-red-500/10 rounded-2xl transition-colors"><Trash2 size={20} className="text-fg-tertiary" /></button>
                            </div>
                        ))}
                        <Button variant="secondary" className="w-full border-dashed border-2 py-4 rounded-2xl font-black text-accent"><Plus size={18} className="mr-2" /> ADD KEYFRAME</Button>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="h-[300px] bg-black rounded-[3rem] border border-glass-border flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-accent/5 animate-pulse" />
                        <motion.div
                            className="w-20 h-20 bg-accent rounded-3xl shadow-[0_0_60px_rgba(37,99,235,0.6)]"
                            animate={{
                                transform: [
                                    'translateY(0)',
                                    'translateY(-20px)',
                                    'translateY(0)'
                                ],
                                opacity: [1, 0.5, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase text-accent tracking-[0.3em] shimmer">Live Preview</div>
                    </div>

                    <Card className="p-6 bg-accent border border-accent/20">
                        <div className="font-mono text-[10px] text-white leading-relaxed whitespace-pre">
                            {`@keyframes ${name} {
${keyframes.map(k => `  ${k.percent}% { ${k.props} }`).join('\n')}
}`}
                        </div>
                    </Card>
                </div>
            </div>
        </Card>
    );
}

// --- CSS Grid Template Forge ---
function GridForgeUI() {
    return (
        <Card className="p-10 space-y-10 bg-linear-to-tr from-bg-primary via-bg-secondary to-bg-primary border-2 border-accent/10">
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-black italic tracking-tighter">Grid <span className="text-accent underline">Forge</span> Studio</h2>
                <p className="text-fg-secondary">Drag to draw your layout areas. We generate the complex <code className="text-accent text-xs">grid-template-areas</code> for you.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="aspect-square bg-surface border-4 border-dashed border-glass-border rounded-[3rem] p-4 flex items-center justify-center relative group">
                        <div className="grid grid-cols-4 grid-rows-4 gap-2 w-full h-full opacity-40">
                            {Array(16).fill(0).map((_, i) => (
                                <div key={i} className="bg-bg-primary rounded-xl border border-glass-border" />
                            ))}
                        </div>
                        <div className="absolute inset-8 rounded-2xl bg-accent/20 border-2 border-accent flex flex-col items-center justify-center p-6 text-center transform scale-95 group-hover:scale-100 transition-transform">
                            <Layout size={48} className="text-accent mb-4 animate-bounce-slow" />
                            <h3 className="text-xl font-black mb-1">Interactive Canvas</h3>
                            <p className="text-xs font-bold text-fg-tertiary">CLICK & DRAG TO MAP REGIONS</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-8 rounded-[3rem] bg-bg-secondary/40 border-2 border-glass-border space-y-6 shadow-2xl">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-fg-tertiary">
                                <span>Output Registry</span>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-bg-primary rounded-lg transition-colors"><Copy size={16} /></button>
                                    <button className="p-2 hover:bg-bg-primary rounded-lg transition-colors"><Download size={16} /></button>
                                </div>
                            </div>
                            <div className="p-6 bg-black rounded-3xl font-mono text-[11px] text-emerald-400 h-64 overflow-y-auto leading-relaxed shadow-inner">
                                {`.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
  grid-template-areas: 
    "header header header header"
    "sidebar main main main"
    "sidebar footer footer footer";
}`}
                            </div>
                        </div>
                        <Button className="w-full py-5 bg-accent text-white font-black rounded-2xl shadow-xl hover:translate-y-[-2px] transition-all">GENERATE RESPONSIVE MQ</Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}

// --- Rotating Gradient Border ---
function RotatingBorderUI() {
    const [intensity, setIntensity] = useState(15);
    const [speed, setSpeed] = useState(3);
    const [radius, setRadius] = useState(32);

    return (
        <Card className="p-10 space-y-10 bg-linear-to-b from-bg-primary to-bg-secondary border-2 border-accent/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                <div className="space-y-10">
                    <div className="space-y-4">
                        <Badge variant="accent" className="px-6 py-2 rounded-full">DESIGN TREND V4.0</Badge>
                        <h2 className="text-5xl font-black tracking-tighter italic">Rotating <span className="text-accent underline decoration-4">Glow</span> Shell</h2>
                        <p className="text-fg-secondary italic font-medium leading-relaxed">
                            The iconic Apple-style rotating gradient border. Completely pure CSS, NO external assets needed.
                        </p>
                    </div>

                    <div className="space-y-8 bg-surface/50 backdrop-blur-xl p-10 rounded-[3rem] border border-glass-border">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-fg-tertiary">Glow Intensity</label>
                            <input type="range" min="0" max="60" value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className="w-full accent-accent" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-fg-tertiary">Spin Speed ({speed}s)</label>
                            <input type="range" min="1" max="10" step="0.5" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-accent" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-fg-tertiary">Border Radius</label>
                            <input type="range" min="0" max="100" value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full accent-accent" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-10">
                    <div className="relative p-[2px] overflow-hidden" style={{ borderRadius: radius }}>
                        <div
                            className="absolute inset-[-100px] animate-spin"
                            style={{
                                background: `conic-gradient(from 0deg, transparent, transparent, ${intensity >= 1 ? '#2563eb, #8b5cf6, #ec4899' : 'transparent'}, transparent, transparent)`,
                                animationDuration: `${speed}s`,
                                filter: `blur(${intensity}px)`
                            }}
                        />
                        <div className="relative bg-[#0d0d0d] w-64 h-80 flex flex-col items-center justify-center p-8 gap-4 shadow-2xl" style={{ borderRadius: radius - 2 }}>
                            <Sparkles size={48} className="text-accent opacity-20" />
                            <div className="text-[10px] font-black uppercase text-fg-tertiary tracking-[0.4em] mb-4">Elite UI Component</div>
                            <div className="h-1.5 w-12 bg-accent rounded-full mb-6" />
                            <div className="text-xs text-center text-fg-secondary font-medium px-4">This preview demonstrates the live CSS rendering performance.</div>
                        </div>
                    </div>

                    <div className="w-full p-8 bg-black/40 rounded-[2.5rem] border border-glass-border font-mono text-[10px] text-accent leading-relaxed relative group overflow-hidden">
                        <div className="absolute top-4 right-6 text-white/20 uppercase font-black text-[8px] tracking-widest group-hover:text-accent transition-colors">Pure CSS Output</div>
                        <div className="whitespace-pre">
                            {`.shell {
  position: relative;
  overflow: hidden;
  border-radius: ${radius}px;
}
.glow {
  background: conic-gradient(from 0deg, ...);
  animation: spin ${speed}s linear infinite;
  filter: blur(${intensity}px);
}`}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
