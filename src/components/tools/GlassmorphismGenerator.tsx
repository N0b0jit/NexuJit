'use client';

import { useState } from 'react';
import { Copy, Check, Settings2, Eye } from 'lucide-react';

export default function GlassmorphismGenerator() {
    const [blur, setBlur] = useState(10);
    const [opacity, setOpacity] = useState(0.2);
    const [saturation, setSaturation] = useState(100);
    const [color, setColor] = useState('#ffffff');
    const [copied, setCopied] = useState(false);

    const glassStyle = {
        backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
        backgroundColor: `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
        border: '1px solid rgba(255, 255, 255, 0.125)',
        borderRadius: '1.5rem',
    };

    const cssCode = `background: rgba(${hexToRgb(color).r}, ${hexToRgb(color).g}, ${hexToRgb(color).b}, ${opacity});
border-radius: 24px;
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border: 1px solid rgba(${hexToRgb(color).r}, ${hexToRgb(color).g}, ${hexToRgb(color).b}, 0.3);`;

    const handleCopy = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="layout">
                <div className="preview-area">
                    <div className="bg-dots"></div>
                    <div className="bg-circle c1"></div>
                    <div className="bg-circle c2"></div>
                    <div className="glass-card" style={glassStyle}>
                        <h2>Glassmorphism</h2>
                        <p>Adjust the sliders to create a beautiful frosted glass effect for your modern UI components.</p>
                        <button className="glass-btn">Action Button</button>
                    </div>
                </div>

                <div className="controls">
                    <div className="card">
                        <div className="card-header"><Settings2 size={18} /> Adjust Effect</div>

                        <div className="input-group">
                            <label>Blur: {blur}px</label>
                            <input type="range" min="0" max="25" value={blur} onChange={e => setBlur(parseInt(e.target.value))} />
                        </div>

                        <div className="input-group">
                            <label>Opacity: {Math.round(opacity * 100)}%</label>
                            <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={e => setOpacity(parseFloat(e.target.value))} />
                        </div>

                        <div className="input-group">
                            <label>Saturation: {saturation}%</label>
                            <input type="range" min="0" max="200" value={saturation} onChange={e => setSaturation(parseInt(e.target.value))} />
                        </div>

                        <div className="input-group">
                            <label>Base Color</label>
                            <input type="color" value={color} onChange={e => setColor(e.target.value)} />
                        </div>

                        <div className="code-box">
                            <div className="code-header">
                                <span>CSS Output</span>
                                <button onClick={handleCopy}>
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                            <pre><code>{cssCode}</code></pre>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 1000px; margin: 0 auto; }
                .layout { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; }
                
                .preview-area { 
                    height: 500px; background: #0f172a; border-radius: 2rem; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border);
                }
                .bg-dots { position: absolute; inset: 0; background-image: radial-gradient(#334155 1px, transparent 1px); background-size: 30px 30px; }
                .bg-circle { position: absolute; border-radius: 50%; filter: blur(50px); }
                .c1 { width: 15rem; height: 15rem; background: #3b82f6; top: 10%; left: 15%; }
                .c2 { width: 12rem; height: 12rem; background: #8b5cf6; bottom: 15%; right: 20%; }
                
                .glass-card { width: 320px; padding: 2.5rem; color: white; position: relative; z-index: 10; display: flex; flex-direction: column; gap: 1rem; }
                .glass-card h2 { margin: 0; font-size: 1.5rem; font-weight: 800; }
                .glass-card p { font-size: 0.9rem; line-height: 1.6; opacity: 0.9; }
                .glass-btn { background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4); color: white; padding: 0.75rem; border-radius: 0.75rem; font-weight: 700; margin-top: 1rem; }
                
                .controls { display: flex; flex-direction: column; gap: 1.5rem; }
                .card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; padding: 1.5rem; }
                .card-header { font-weight: 700; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; text-transform: uppercase; font-size: 0.8rem; color: var(--secondary); border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
                
                .input-group label { display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.5rem; }
                .input-group { margin-bottom: 1.25rem; }
                input[type="range"] { width: 100%; }
                input[type="color"] { width: 100%; height: 35px; border: none; cursor: pointer; }
                
                .code-box { background: #1e293b; border-radius: 1rem; margin-top: 1.5rem; overflow: hidden; }
                .code-header { background: #0f172a; padding: 0.5rem 1rem; display: flex; justify-content: space-between; align-items: center; color: #94a3b8; font-size: 0.7rem; font-weight: 700; }
                .code-header button { display: flex; align-items: center; gap: 0.3rem; }
                pre { padding: 1rem; margin: 0; overflow-x: auto; color: #38bdf8; font-family: monospace; font-size: 0.75rem; line-height: 1.5; }
                
                @media (max-width: 850px) {
                    .layout { grid-template-columns: 1fr; }
                    .preview-area { height: 350px; }
                }
            `}</style>
        </div>
    );
}

function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}
