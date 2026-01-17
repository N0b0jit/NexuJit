'use client';

import { useState } from 'react';
import { Copy, Square, Circle, Moon, Sun } from 'lucide-react';

export default function ShadowVisualizer() {
    const [hOffset, setHOffset] = useState(0);
    const [vOffset, setVOffset] = useState(10);
    const [blur, setBlur] = useState(20);
    const [spread, setSpread] = useState(-5);
    const [color, setColor] = useState('#000000');
    const [opacity, setOpacity] = useState(0.2);
    const [inset, setInset] = useState(false);
    const [bgColor, setBgColor] = useState('#ffffff');
    const [boxColor, setBoxColor] = useState('#ffffff');

    // Convert hex to rgba for css
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    };

    const rgb = hexToRgb(color);
    const rgbaColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;

    const shadowCSS = `${inset ? 'inset ' : ''}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${rgbaColor}`;
    const code = `box-shadow: ${shadowCSS};`;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls */}
                <div className="bg-surface p-6 rounded-3xl border border-border shadow-lg space-y-6 lg:col-span-1">
                    <h3 className="font-bold text-lg border-b border-border pb-4">Shadow Settings</h3>

                    <Control label="Horizontal Offset" value={hOffset} min={-100} max={100} onChange={setHOffset} unit="px" />
                    <Control label="Vertical Offset" value={vOffset} min={-100} max={100} onChange={setVOffset} unit="px" />
                    <Control label="Blur Radius" value={blur} min={0} max={100} onChange={setBlur} unit="px" />
                    <Control label="Spread Radius" value={spread} min={-50} max={50} onChange={setSpread} unit="px" />

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary uppercase">Shadow Opacity ({Math.round(opacity * 100)}%)</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={opacity}
                            onChange={(e) => setOpacity(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={inset}
                            onChange={(e) => setInset(e.target.checked)}
                            className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="font-bold">Inset Shadow</span>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-border">
                        <div className="flex-1 space-y-2">
                            <label className="text-xs font-bold text-secondary uppercase">Shadow Color</label>
                            <div className="flex gap-2">
                                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-8 w-8 rounded cursor-pointer" />
                                <span className="text-sm font-mono">{color}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="lg:col-span-2 space-y-6">
                    <div
                        className="h-[500px] rounded-3xl border border-border shadow-inner flex items-center justify-center transition-colors relative"
                        style={{ backgroundColor: bgColor }}
                    >
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button onClick={() => setBgColor('#ffffff')} className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm"><Sun size={16} className="text-gray-600" /></button>
                            <button onClick={() => setBgColor('#f3f4f6')} className="p-2 rounded-lg bg-gray-100 border border-gray-200 shadow-sm"><Square size={16} className="text-gray-400" /></button>
                            <button onClick={() => setBgColor('#1f2937')} className="p-2 rounded-lg bg-gray-800 border border-gray-700 shadow-sm"><Moon size={16} className="text-gray-400" /></button>
                        </div>

                        <div
                            className="w-64 h-64 rounded-2xl flex items-center justify-center transition-all duration-200"
                            style={{
                                boxShadow: shadowCSS,
                                backgroundColor: boxColor
                            }}
                        >
                            <span className="font-bold opacity-30 select-none pointer-events-none">Preview Box</span>
                        </div>
                    </div>

                    <div className="relative group">
                        <code className="block p-6 bg-surface border border-border rounded-2xl font-mono text-sm shadow-sm overflow-x-auto text-primary">
                            {code}
                        </code>
                        <button
                            onClick={() => navigator.clipboard.writeText(code)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background hover:bg-primary hover:text-white rounded-lg border border-border transition-colors shadow-sm"
                        >
                            <Copy size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Control({ label, value, min, max, onChange, unit }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between">
                <label className="text-xs font-bold text-secondary uppercase">{label}</label>
                <span className="text-xs font-bold text-primary">{value}{unit}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full accent-primary"
            />
        </div>
    );
}
