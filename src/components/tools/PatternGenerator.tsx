'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, RefreshCw, Grid } from 'lucide-react';

export default function PatternGenerator() {
    const [type, setType] = useState<'dots' | 'lines' | 'grid' | 'waves'>('dots');
    const [color, setColor] = useState('#3b82f6');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [size, setSize] = useState(20);
    const [spacing, setSpacing] = useState(40);
    const [stroke, setStroke] = useState(2);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        drawPattern();
    }, [type, color, bgColor, size, spacing, stroke]);

    const drawPattern = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = 400;
        const h = 400;

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = stroke;

        if (type === 'dots') {
            for (let x = 0; x <= w; x += spacing) {
                for (let y = 0; y <= h; y += spacing) {
                    ctx.beginPath();
                    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        } else if (type === 'lines') {
            for (let x = 0; x <= w + h; x += spacing) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x - w, h); // Diagonal
                ctx.stroke();
            }
        } else if (type === 'grid') {
            for (let x = 0; x <= w; x += spacing) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (let y = 0; y <= h; y += spacing) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
        } else if (type === 'waves') {
            for (let y = 0; y <= h; y += spacing) {
                ctx.beginPath();
                for (let x = 0; x <= w; x += 10) {
                    ctx.lineTo(x, y + Math.sin(x * 0.05) * (size / 2));
                }
                ctx.stroke();
            }
        }
    };

    const downloadPattern = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'pattern.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-surface p-6 rounded-3xl border border-border shadow-lg space-y-6">
                    <h3 className="font-bold flex items-center gap-2 text-lg border-b border-border pb-4">
                        <Grid size={20} /> Pattern Settings
                    </h3>

                    <div className="space-y-4">
                        <label className="text-xs font-bold text-secondary uppercase">Pattern Type</label>
                        <div className="grid grid-cols-4 gap-2">
                            {['dots', 'lines', 'grid', 'waves'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setType(t as any)}
                                    className={`py-2 rounded-lg font-bold text-sm capitalize border ${type === t ? 'bg-primary text-white border-primary' : 'bg-background border-border hover:border-primary'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-secondary uppercase">Color</label>
                            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-secondary uppercase">Background</label>
                            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-xs font-bold text-secondary uppercase">Details</label>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="w-16 text-xs font-bold">Size</span>
                                <input type="range" min="2" max="50" value={size} onChange={(e) => setSize(Number(e.target.value))} className="flex-1 accent-primary" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-16 text-xs font-bold">Spacing</span>
                                <input type="range" min="10" max="100" value={spacing} onChange={(e) => setSpacing(Number(e.target.value))} className="flex-1 accent-primary" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-16 text-xs font-bold">Stroke</span>
                                <input type="range" min="1" max="10" value={stroke} onChange={(e) => setStroke(Number(e.target.value))} className="flex-1 accent-primary" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex-1 rounded-3xl border border-border shadow-inner bg-background overflow-hidden flex items-center justify-center p-4">
                        <canvas ref={canvasRef} width={400} height={400} className="w-full h-auto max-w-[400px] shadow-lg rounded-xl" />
                    </div>
                    <button
                        onClick={downloadPattern}
                        className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        <Download /> Download Pattern
                    </button>
                </div>
            </div>
        </div>
    );
}
