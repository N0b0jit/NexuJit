'use client';

import { useState } from 'react';
import { Copy, Check, Settings2, RefreshCw, Layers } from 'lucide-react';

export default function CssGradientGenerator() {
    const [type, setType] = useState<'linear' | 'radial'>('linear');
    const [angle, setAngle] = useState(135);
    const [color1, setColor1] = useState('#6366f1');
    const [color2, setColor2] = useState('#a855f7');
    const [copied, setCopied] = useState(false);

    const gradient = type === 'linear'
        ? `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`
        : `radial-gradient(circle, ${color1} 0%, ${color2} 100%)`;

    const cssCode = `background: ${color1};
background: ${gradient};`;

    const handleCopy = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const randomize = () => {
        const rc = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        setColor1(rc());
        setColor2(rc());
        setAngle(Math.floor(Math.random() * 360));
    };

    return (
        <div className="tool-ui">
            <div className="layout">
                <div className="preview-panel" style={{ background: gradient }}>
                    <div className="overlay-info">
                        <h2>Smooth Gradients</h2>
                        <button onClick={randomize} className="rand-btn"><RefreshCw size={16} /> Randomize</button>
                    </div>
                </div>

                <div className="controls">
                    <div className="card">
                        <div className="card-header"><Settings2 size={16} /> Gradient Options</div>

                        <div className="type-toggle">
                            <button className={type === 'linear' ? 'active' : ''} onClick={() => setType('linear')}>Linear</button>
                            <button className={type === 'radial' ? 'active' : ''} onClick={() => setType('radial')}>Radial</button>
                        </div>

                        {type === 'linear' && (
                            <div className="input-group">
                                <label>Angle: {angle}°</label>
                                <input type="range" min="0" max="360" value={angle} onChange={e => setAngle(parseInt(e.target.value))} />
                            </div>
                        )}

                        <div className="colors-row">
                            <div className="input-group">
                                <label>Color 1</label>
                                <input type="color" value={color1} onChange={e => setColor1(e.target.value)} />
                                <input type="text" value={color1} onChange={e => setColor1(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Color 2</label>
                                <input type="color" value={color2} onChange={e => setColor2(e.target.value)} />
                                <input type="text" value={color2} onChange={e => setColor2(e.target.value)} />
                            </div>
                        </div>

                        <div className="code-display">
                            <div className="code-header">
                                <span>CSS Export</span>
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
                
                .preview-panel { height: 500px; border-radius: 2rem; position: relative; border: 1px solid var(--border); overflow: hidden; display: flex; align-items: center; justify-content: center; transition: background 0.3s; }
                .overlay-info { text-align: center; color: white; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }
                .overlay-info h2 { font-size: 2rem; font-weight: 800; margin-bottom: 1.5rem; }
                .rand-btn { background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); padding: 0.6rem 1.2rem; border-radius: 2rem; color: white; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; margin: 0 auto; border: 1px solid rgba(255,255,255,0.3); }
                
                .card { background: white; border: 1px solid var(--border); border-radius: 1.5rem; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
                .card-header { font-size: 0.8rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
                
                .type-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; background: var(--background); padding: 0.3rem; border-radius: 0.75rem; }
                .type-toggle button { padding: 0.5rem; border-radius: 0.5rem; font-weight: 700; font-size: 0.85rem; }
                .type-toggle button.active { background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.05); color: var(--primary); }
                
                .colors-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .input-group label { display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.5rem; }
                input[type="range"] { width: 100%; }
                input[type="color"] { width: 100%; height: 40px; border: none; cursor: pointer; border-radius: 0.5rem; }
                input[type="text"] { width: 100%; padding: 0.4rem; font-family: monospace; font-size: 0.8rem; margin-top: 0.5rem; border-radius: 0.4rem; border: 1px solid var(--border); }
                
                .code-display { background: #1e293b; border-radius: 1rem; overflow: hidden; }
                .code-header { background: #0f172a; padding: 0.5rem 1rem; display: flex; justify-content: space-between; align-items: center; color: #94a3b8; font-size: 0.7rem; font-weight: 700; }
                pre { padding: 1rem; margin: 0; overflow-x: auto; color: #38bdf8; font-family: monospace; font-size: 0.75rem; line-height: 1.5; }
                
                @media (max-width: 850px) {
                    .layout { grid-template-columns: 1fr; }
                    .preview-panel { height: 300px; }
                }
            `}</style>
        </div>
    );
}
