'use client';

import { useState, useEffect } from 'react';
import { Palette, Copy, Check } from 'lucide-react';

export default function ColorConverter() {
    const [hex, setHex] = useState('#6366f1');
    const [rgb, setRgb] = useState('rgb(99, 102, 241)');
    const [hsl, setHsl] = useState('hsl(239, 84%, 67%)');
    const [copied, setCopied] = useState('');

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const rgbToHsl = (r: number, g: number, b: number) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    };

    const handleHexChange = (value: string) => {
        setHex(value);
        if (/^#[0-9A-F]{6}$/i.test(value)) {
            const rgbVal = hexToRgb(value);
            if (rgbVal) {
                setRgb(`rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`);
                const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
                setHsl(`hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`);
            }
        }
    };

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(''), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="converter-card">
                <div className="color-preview" style={{ backgroundColor: hex }}></div>

                <div className="inputs-grid">
                    <div className="input-group">
                        <label>HEX</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                value={hex}
                                onChange={(e) => handleHexChange(e.target.value)}
                                maxLength={7}
                            />
                            <button className="copy-btn" onClick={() => copyToClipboard(hex, 'hex')}>
                                {copied === 'hex' ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>RGB</label>
                        <div className="input-wrapper">
                            <input type="text" value={rgb} readOnly />
                            <button className="copy-btn" onClick={() => copyToClipboard(rgb, 'rgb')}>
                                {copied === 'rgb' ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>HSL</label>
                        <div className="input-wrapper">
                            <input type="text" value={hsl} readOnly />
                            <button className="copy-btn" onClick={() => copyToClipboard(hsl, 'hsl')}>
                                {copied === 'hsl' ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .converter-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 2rem; box-shadow: var(--shadow-lg); display: grid; gap: 2rem; }
                @media(min-width: 640px) { .converter-card { grid-template-columns: 200px 1fr; } }
                
                .color-preview { width: 100%; height: 200px; border-radius: 1.5rem; border: 4px solid var(--background); box-shadow: var(--shadow); }
                @media(min-width: 640px) { .color-preview { height: auto; } }

                .inputs-grid { display: flex; flex-direction: column; gap: 1.5rem; justify-content: center; }
                .input-group label { display: block; font-weight: 800; color: var(--secondary); margin-bottom: 0.5rem; font-size: 0.9rem; }
                .input-wrapper { display: flex; gap: 0.5rem; }
                .input-wrapper input { flex: 1; padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); font-family: monospace; font-size: 1.1rem; }
                .copy-btn { padding: 0 1rem; background: var(--surface); border: 2px solid var(--border); border-radius: 0.75rem; color: var(--secondary); transition: all 0.2s; }
                .copy-btn:hover { border-color: var(--primary); color: var(--primary); }
            `}</style>
        </div>
    );
}
