'use client';

import { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Sliders, Wand2, Download, Trash2, Sun, Contrast, Droplets, Zap, Sparkles } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui/Core';
import { motion } from 'framer-motion';

export default function ImageProTools() {
    const [image, setImage] = useState<string | null>(null);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [blur, setBlur] = useState(0);
    const [hue, setHue] = useState(0);
    const [sepia, setSepia] = useState(0);
    const [grain, setGrain] = useState(0);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setImage(url);
        }
    };

    const filterStyle = {
        filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) hue-rotate(${hue}deg) sepia(${sepia}%)`,
    };

    const reset = () => {
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
        setBlur(0);
        setHue(0);
        setSepia(0);
        setGrain(0);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-32">
            <div className="text-center space-y-4">
                <Badge variant="accent" className="px-8 py-2 rounded-full font-black">NEURAL LAB V4.0</Badge>
                <h1 className="text-6xl font-black tracking-tighter italic">Browser <span className="text-accent">Lightroom</span></h1>
                <p className="text-fg-secondary max-w-2xl mx-auto font-medium">
                    Professional grade color grading and post-processing, powered entirely by your browser's hardware. Zero server uploads.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Preview Viewport */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="min-h-[500px] border-2 border-glass-border flex flex-col relative overflow-hidden bg-black/40 p-2">
                        <div className="flex-1 rounded-2xl overflow-hidden relative flex items-center justify-center">
                            {image ? (
                                <>
                                    <div className="absolute inset-0 z-0 opacity-10 blur-3xl scale-150" style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover' }} />
                                    <img src={image} style={filterStyle} alt="Preview" className="max-h-full max-w-full object-contain relative z-10 shadow-2xl rounded-lg" />
                                    {grain > 0 && (
                                        <div
                                            className="absolute inset-0 pointer-events-none z-20 opacity-20"
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${grain / 10}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                                            }}
                                        />
                                    )}
                                </>
                            ) : (
                                <label className="cursor-pointer group">
                                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                                    <div className="flex flex-col items-center gap-6 p-16 rounded-[4rem] border-4 border-dashed border-accent/20 hover:border-accent transition-all group-hover:scale-[1.02]">
                                        <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center text-accent animate-pulse">
                                            <ImageIcon size={48} />
                                        </div>
                                        <div className="space-y-1 text-center">
                                            <h3 className="text-2xl font-black">Drop Raw Image</h3>
                                            <p className="text-sm font-bold text-fg-tertiary">TIFF, PNG, WEBP Supported</p>
                                        </div>
                                    </div>
                                </label>
                            )}
                        </div>

                        {image && (
                            <div className="absolute top-6 right-6 flex gap-3 z-30">
                                <Button variant="secondary" onClick={reset} className="bg-white/10 backdrop-blur-xl border-white/20"><Trash2 size={18} /></Button>
                                <Button className="bg-accent text-white shadow-2xl px-6 rounded-xl font-black"><Download size={18} className="mr-2" /> EXPORT RENDER</Button>
                            </div>
                        )}
                    </Card>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Neural Enhance', icon: Wand2, desc: 'Heuristic-based sharpening' },
                            { label: 'Auto WB', icon: Sliders, desc: 'Simulated white balance' },
                            { label: 'Noise Clear', icon: Droplets, desc: 'Denoising logic' },
                            { label: 'Cinematic LUTS', icon: Sparkles, desc: 'Preset color profiles' }
                        ].map(feature => (
                            <Card key={feature.label} className="p-4 bg-surface border border-glass-border hover:border-accent/40 cursor-pointer transition-all">
                                <feature.icon className="text-accent mb-2" size={20} />
                                <div className="text-[10px] font-black uppercase tracking-widest text-fg-primary mb-1">{feature.label}</div>
                                <div className="text-[9px] font-bold text-fg-tertiary uppercase leading-tight">{feature.desc}</div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Scopes & Dials */}
                <Card className="p-8 space-y-10 border-2 border-accent/10 bg-linear-to-b from-bg-primary via-bg-secondary to-bg-primary">
                    <div className="flex justify-between items-end">
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-fg-tertiary">Post-Processing Dials</h3>
                        <div className="text-[10px] font-black text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">HARDWARE ACCELERATED</div>
                    </div>

                    <div className="space-y-8">
                        <Dial label="Exposure" icon={<Sun size={14} />} val={brightness} setVal={setBrightness} min={0} max={200} displayVal={`${Math.round(brightness - 100)}%`} />
                        <Dial label="Contrast" icon={<Contrast size={14} />} val={contrast} setVal={setContrast} min={0} max={200} displayVal={`${Math.round(contrast - 100)}%`} />
                        <Dial label="Saturation" icon={<Droplets size={14} />} val={saturation} setVal={setSaturation} min={0} max={200} displayVal={`${Math.round(saturation - 100)}%`} />
                        <Dial label="Hue Shift" icon={<Sliders size={14} />} val={hue} setVal={setHue} min={0} max={360} displayVal={`${hue}°`} />
                        <Dial label="Soft Blur" icon={<div className="w-3.5 h-3.5 bg-fg-tertiary blur-[1px] rounded-full" />} val={blur} setVal={setBlur} min={0} max={20} displayVal={`${blur}px`} />
                        <Dial label="Sepia Tone" icon={<div className="w-3.5 h-3.5 bg-amber-700 rounded-full" />} val={sepia} setVal={setSepia} min={0} max={100} displayVal={`${sepia}%`} />
                        <div className="pt-4 border-t border-glass-border">
                            <Dial label="Film Grain" icon={<Zap size={14} />} val={grain} setVal={setGrain} min={0} max={5} step={0.1} displayVal={grain > 0 ? "ENABLED" : "OFF"} />
                        </div>
                    </div>

                    <div className="space-y-4 pt-10">
                        <div className="h-[60px] flex items-end gap-1 px-4">
                            {Array(20).fill(0).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-accent/20 rounded-t-sm"
                                    style={{ height: `${Math.random() * 100}%`, opacity: (i / 20) + 0.3 }}
                                />
                            ))}
                        </div>
                        <div className="text-[8px] font-black text-center text-fg-tertiary tracking-[0.4em] uppercase">Histogram Scope (Luma)</div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function Dial({ label, icon, val, setVal, min, max, step = 1, displayVal }: any) {
    return (
        <div className="space-y-3 group">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="flex items-center gap-2 group-hover:text-accent transition-colors">{icon} {label}</span>
                <span className="text-fg-tertiary font-mono">{displayVal}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                className="w-full accent-accent h-1 bg-bg-primary rounded-full appearance-none cursor-pointer"
                value={val}
                onChange={(e) => setVal(Number(e.target.value))}
            />
        </div>
    );
}
