'use client';

import { useState } from 'react';
import { Copy, Check, Settings2, Plus, Trash2 } from 'lucide-react';

export default function CssBoxShadowGenerator() {
    const [shadows, setShadows] = useState([
        { h: 0, v: 5, blur: 15, spread: 0, color: 'rgba(0,0,0,0.1)', inset: false }
    ]);
    const [theme, setTheme] = useState('#ffffff');
    const [copied, setCopied] = useState(false);

    const activeShadow = shadows.map(s =>
        `${s.inset ? 'inset ' : ''}${s.h}px ${s.v}px ${s.blur}px ${s.spread}px ${s.color}`
    ).join(', ');

    const cssCode = `box-shadow: ${activeShadow};
-webkit-box-shadow: ${activeShadow};
-moz-box-shadow: ${activeShadow};`;

    const handleCopy = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const updateShadow = (index: number, key: string, value: any) => {
        const newShadows = [...shadows];
        newShadows[index] = { ...newShadows[index], [key]: value };
        setShadows(newShadows);
    };

    return (
        <div className="tool-ui">
            <div className="layout">
                <div className="preview-panel" style={{ backgroundColor: theme === '#ffffff' ? '#f0f2f5' : theme }}>
                    <div className="main-box" style={{
                        boxShadow: activeShadow,
                        backgroundColor: '#ffffff'
                    }}>
                        Box Shadow Preview
                    </div>
                </div>

                <div className="controls-panel">
                    <div className="settings-card">
                        <div className="card-header"><Settings2 size={16} /> Global Settings</div>
                        <div className="input-group">
                            <label>Background Color</label>
                            <input type="color" value={theme} onChange={e => setTheme(e.target.value)} />
                        </div>
                    </div>

                    <div className="shadows-list">
                        {shadows.map((s, i) => (
                            <div key={i} className="shadow-item">
                                <div className="item-header">
                                    <span>Layer #{i + 1}</span>
                                    {shadows.length > 1 && (
                                        <button onClick={() => setShadows(shadows.filter((_, idx) => idx !== i))} className="del-btn">
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>

                                <div className="inputs-grid">
                                    <div className="row">
                                        <label>H-Offset</label>
                                        <input type="range" min="-50" max="50" value={s.h} onChange={e => updateShadow(i, 'h', parseInt(e.target.value))} />
                                    </div>
                                    <div className="row">
                                        <label>V-Offset</label>
                                        <input type="range" min="-50" max="50" value={s.v} onChange={e => updateShadow(i, 'v', parseInt(e.target.value))} />
                                    </div>
                                    <div className="row">
                                        <label>Blur</label>
                                        <input type="range" min="0" max="100" value={s.blur} onChange={e => updateShadow(i, 'blur', parseInt(e.target.value))} />
                                    </div>
                                    <div className="row">
                                        <label>Spread</label>
                                        <input type="range" min="-50" max="50" value={s.spread} onChange={e => updateShadow(i, 'spread', parseInt(e.target.value))} />
                                    </div>
                                </div>

                                <div className="row-alt">
                                    <input type="color" value={rgbToHex(s.color)} onChange={e => updateShadow(i, 'color', hexToRgba(e.target.value, 0.2))} />
                                    <label className="toggle">
                                        <input type="checkbox" checked={s.inset} onChange={e => updateShadow(i, 'inset', e.target.checked)} />
                                        <span>Inset</span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="add-btn" onClick={() => setShadows([...shadows, { h: 0, v: 0, blur: 10, spread: 0, color: 'rgba(0,0,0,0.1)', inset: false }])}>
                        <Plus size={16} /> Add Layer
                    </button>

                    <div className="code-card">
                        <div className="code-header">
                            <span>CSS Code</span>
                            <button onClick={handleCopy}>
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                        <pre><code>{cssCode}</code></pre>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 1100px; margin: 0 auto; }
                .layout { display: grid; grid-template-columns: 1fr 360px; gap: 2rem; }
                
                .preview-panel { height: 600px; border-radius: 2rem; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); transition: background-color 0.2s; }
                .main-box { width: 200px; height: 200px; border-radius: 1rem; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #64748b; font-size: 0.8rem; text-transform: uppercase; }
                
                .controls-panel { display: flex; flex-direction: column; gap: 1rem; }
                .settings-card, .shadow-item, .code-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.25rem; padding: 1.25rem; }
                
                .card-header, .item-header { display: flex; justify-content: space-between; align-items: center; font-weight: 700; font-size: 0.8rem; color: var(--secondary); text-transform: uppercase; margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem; }
                
                .inputs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .row label { display: block; font-size: 0.7rem; font-weight: 700; margin-bottom: 0.25rem; }
                input[type="range"] { width: 100%; }
                
                .row-alt { display: flex; align-items: center; gap: 1rem; margin-top: 1rem; }
                .toggle { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
                
                .add-btn { background: var(--background); border: 1px dashed var(--border); padding: 0.75rem; border-radius: 1rem; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
                .del-btn { color: #ef4444; }
                
                .code-card { background: #1e293b; color: #38bdf8; border: none; }
                .code-header { border-color: #334155; color: #94a3b8; }
                pre { margin: 0; font-size: 0.75rem; overflow-x: auto; line-height: 1.5; }
                
                @media (max-width: 900px) {
                    .layout { grid-template-columns: 1fr; }
                    .preview-panel { height: 350px; }
                }
            `}</style>
        </div>
    );
}

function rgbToHex(rgba: string) {
    if (rgba.startsWith('#')) return rgba;
    const match = rgba.match(/\d+/g);
    if (!match) return '#000000';
    const r = parseInt(match[0]);
    const g = parseInt(match[1]);
    const b = parseInt(match[2]);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function hexToRgba(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
