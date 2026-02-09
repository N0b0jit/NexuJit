'use client';

import { useState } from 'react';
import { Download, Copy, Check, Grid, Settings2, RefreshCw } from 'lucide-react';

const PATTERNS = [
    {
        name: 'Polka Dots', fn: (color: string, size: number) => `
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 4}" fill="${color}" />
    `},
    {
        name: 'Grid', fn: (color: string, size: number) => `
        <path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="${color}" stroke-width="1" />
    `},
    {
        name: 'Diagonal Lines', fn: (color: string, size: number) => `
        <path d="M 0 ${size} L ${size} 0 M -${size / 4} ${size / 4} L ${size / 4} -${size / 4} M ${size * 0.75} ${size * 1.25} L ${size * 1.25} ${size * 0.75}" fill="none" stroke="${color}" stroke-width="1" />
    `},
    {
        name: 'Triangles', fn: (color: string, size: number) => `
        <path d="M 0 ${size} L ${size / 2} 0 L ${size} ${size} Z" fill="${color}" fill-opacity="0.3" />
    `},
    {
        name: 'Checkered', fn: (color: string, size: number) => `
        <rect x="0" y="0" width="${size / 2}" height="${size / 2}" fill="${color}" />
        <rect x="${size / 2}" y="${size / 2}" width="${size / 2}" height="${size / 2}" fill="${color}" />
    `}
];

export default function SvgPatternGenerator() {
    const [selectedPattern, setSelectedPattern] = useState(PATTERNS[0]);
    const [color, setColor] = useState('#6366f1');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [size, setSize] = useState(40);
    const [opacity, setOpacity] = useState(0.2);
    const [copied, setCopied] = useState(false);

    const patternInner = selectedPattern.fn(color, size);

    const svgCode = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="pattern" x="0" y="0" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
      ${patternInner}
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="${bgColor}" />
  <rect width="100%" height="100%" fill="url(#pattern)" fill-opacity="${opacity}" />
</svg>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(svgCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([svgCode], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pattern.svg';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="tool-ui">
            <div className="layout">
                <div className="preview-area" style={{ backgroundColor: bgColor }}>
                    <div className="pattern-fill" style={{
                        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svgCode)}")`,
                        width: '100%',
                        height: '100%'
                    }}></div>
                    <div className="zoom-hint">Previewing Repeatable Pattern</div>
                </div>

                <div className="sidebar">
                    <div className="card">
                        <div className="card-title"><Grid size={18} /> Choose Pattern</div>
                        <div className="pattern-list">
                            {PATTERNS.map(p => (
                                <button
                                    key={p.name}
                                    className={`pattern-btn ${selectedPattern.name === p.name ? 'active' : ''}`}
                                    onClick={() => setSelectedPattern(p)}
                                >
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-title"><Settings2 size={18} /> Customization</div>

                        <div className="input-row">
                            <div className="input-group">
                                <label>Size</label>
                                <input type="range" min="10" max="100" value={size} onChange={e => setSize(parseInt(e.target.value))} />
                            </div>
                            <div className="input-group">
                                <label>Opacity</label>
                                <input type="range" min="0" max="1" step="0.1" value={opacity} onChange={e => setOpacity(parseFloat(e.target.value))} />
                            </div>
                        </div>

                        <div className="input-row">
                            <div className="input-group">
                                <label>Pattern Color</label>
                                <input type="color" value={color} onChange={e => setColor(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Background</label>
                                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} />
                            </div>
                        </div>

                        <div className="actions">
                            <button onClick={handleDownload} className="main-btn">
                                <Download size={18} /> Download SVG
                            </button>
                            <button onClick={handleCopy} className="sec-btn">
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                {copied ? 'Copied' : 'Copy Code'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 1000px; margin: 0 auto; }
                .layout { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; }
                .preview-area { 
                    height: 500px; border-radius: 1.5rem; border: 1px solid var(--border); overflow: hidden; position: relative; box-shadow: inset 0 0 20px rgba(0,0,0,0.05);
                }
                .zoom-hint { position: absolute; bottom: 1rem; right: 1rem; background: rgba(255,255,255,0.8); padding: 0.25rem 0.75rem; border-radius: 2rem; font-size: 0.7rem; font-weight: 700; color: #444; border: 1px solid rgba(0,0,0,0.05); }
                
                .sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
                .card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.25rem; padding: 1.5rem; }
                .card-title { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; margin-bottom: 1.25rem; font-size: 0.95rem; text-transform: uppercase; color: var(--secondary); letter-spacing: 0.05em; }
                
                .pattern-list { display: flex; flex-direction: column; gap: 0.5rem; }
                .pattern-btn { text-align: left; padding: 0.75rem 1rem; border-radius: 0.75rem; background: var(--background); font-weight: 600; font-size: 0.9rem; transition: all 0.2s; }
                .pattern-btn:hover { background: var(--border); }
                .pattern-btn.active { background: var(--primary); color: white; }
                
                .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
                .input-group label { display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--secondary); }
                input[type="range"] { width: 100%; }
                input[type="color"] { width: 100%; height: 35px; border: none; background: none; cursor: pointer; }
                
                .actions { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
                .main-btn { background: var(--primary); color: white; padding: 0.875rem; border-radius: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s; }
                .sec-btn { background: var(--background); color: var(--foreground); padding: 0.875rem; border-radius: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.5rem; border: 1px solid var(--border); transition: all 0.2s; }
                .main-btn:hover { opacity: 0.9; }
                
                @media (max-width: 800px) {
                    .layout { grid-template-columns: 1fr; }
                    .preview-area { height: 300px; }
                }
            `}</style>
        </div>
    );
}
