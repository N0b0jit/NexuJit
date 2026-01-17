'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GradientExplorer() {
    const [color1, setColor1] = useState('#3b82f6');
    const [color2, setColor2] = useState('#8b5cf6');
    const [angle, setAngle] = useState(135);
    const [type, setType] = useState<'linear' | 'radial'>('linear');
    const [presets, setPresets] = useState([
        { c1: '#3b82f6', c2: '#8b5cf6' },
        { c1: '#f43f5e', c2: '#fbbf24' },
        { c1: '#10b981', c2: '#3b82f6' },
        { c1: '#8b5cf6', c2: '#ec4899' },
        { c1: '#f59e0b', c2: '#ef4444' },
    ]);

    const gradient = type === 'linear'
        ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
        : `radial-gradient(circle, ${color1}, ${color2})`;

    const cssCode = `background: ${gradient};`;

    const generateRandom = () => {
        const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);
        setColor1(randomColor());
        setColor2(randomColor());
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visualizer */}
                <div
                    className="h-96 rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden text-white transition-all duration-500"
                    style={{ background: gradient }}
                >
                    <div className="text-center p-8 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/20">
                        <h2 className="text-3xl font-black mb-2 shadow-sm">Gradient Explorer</h2>
                        <p className="opacity-80">Beautiful UI Gradients</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-surface p-8 rounded-3xl border border-border shadow-lg space-y-6">
                    <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                            <label className="text-xs font-bold text-secondary uppercase">Color 1</label>
                            <div className="flex gap-2">
                                <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="h-10 w-12 rounded cursor-pointer" />
                                <input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} className="flex-1 p-2 bg-background border border-border rounded-lg uppercase" />
                            </div>
                        </div>
                        <div className="flex-1 space-y-2">
                            <label className="text-xs font-bold text-secondary uppercase">Color 2</label>
                            <div className="flex gap-2">
                                <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="h-10 w-12 rounded cursor-pointer" />
                                <input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} className="flex-1 p-2 bg-background border border-border rounded-lg uppercase" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-xs font-bold text-secondary uppercase">Angle ({angle}°)</label>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={angle}
                            onChange={(e) => setAngle(Number(e.target.value))}
                            className="w-full accent-primary"
                            disabled={type === 'radial'}
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setType('linear')}
                            className={`flex-1 py-2 rounded-lg font-bold border ${type === 'linear' ? 'bg-primary text-white border-primary' : 'border-border hover:bg-background'}`}
                        >
                            Linear
                        </button>
                        <button
                            onClick={() => setType('radial')}
                            className={`flex-1 py-2 rounded-lg font-bold border ${type === 'radial' ? 'bg-primary text-white border-primary' : 'border-border hover:bg-background'}`}
                        >
                            Radial
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {presets.map((p, i) => (
                            <button
                                key={i}
                                onClick={() => { setColor1(p.c1); setColor2(p.c2); }}
                                className="w-8 h-8 rounded-full border border-white/20 shadow-sm"
                                style={{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }}
                            />
                        ))}
                        <button onClick={generateRandom} className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                            <RefreshCw size={14} />
                        </button>
                    </div>

                    <div className="pt-4 border-t border-border">
                        <label className="text-xs font-bold text-secondary uppercase mb-2 block">CSS Output</label>
                        <div className="relative group">
                            <code className="block p-4 bg-background border border-border rounded-xl font-mono text-sm overflow-x-auto text-primary">
                                {cssCode}
                            </code>
                            <button
                                onClick={() => navigator.clipboard.writeText(cssCode)}
                                className="absolute right-2 top-2 p-2 bg-surface hover:bg-primary hover:text-white rounded-lg border border-border transition-colors shadow-sm"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
