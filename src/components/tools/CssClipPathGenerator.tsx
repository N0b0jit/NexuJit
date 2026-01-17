'use client';

import { useState } from 'react';
import { Copy, Check, MousePointer2, Settings2, Scissors } from 'lucide-react';

const SHAPES = [
    { name: 'Square', path: 'inset(0% 0% 0% 0%)' },
    { name: 'Circle', path: 'circle(50% at 50% 50%)' },
    { name: 'Ellipse', path: 'ellipse(25% 40% at 50% 50%)' },
    { name: 'Triangle', path: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
    { name: 'Pentagon', path: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' },
    { name: 'Hexagon', path: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' },
    { name: 'Star', path: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' },
    { name: 'Message', path: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)' },
    { name: 'Close', path: 'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)' }
];

export default function CssClipPathGenerator() {
    const [selected, setSelected] = useState(SHAPES[3]); // Triangle default
    const [color, setColor] = useState('#6366f1');
    const [copied, setCopied] = useState(false);

    const cssCode = `clip-path: ${selected.path};
-webkit-clip-path: ${selected.path};`;

    const handleCopy = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="layout">
                <div className="preview-stage">
                    <div className="checkerboard"></div>
                    <div className="target-element" style={{
                        clipPath: selected.path,
                        backgroundColor: color
                    }}>
                        <div className="hint">{selected.name}</div>
                    </div>
                </div>

                <div className="sidebar">
                    <div className="card">
                        <div className="card-header"><Scissors size={18} /> Select Shape</div>
                        <div className="shape-grid">
                            {SHAPES.map(s => (
                                <button
                                    key={s.name}
                                    className={`shape-btn ${selected.name === s.name ? 'active' : ''}`}
                                    onClick={() => setSelected(s)}
                                >
                                    <div className="shape-preview" style={{ clipPath: s.path }}></div>
                                    <span>{s.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header"><Settings2 size={18} /> Settings</div>
                        <div className="input-group">
                            <label>Element Color</label>
                            <input type="color" value={color} onChange={e => setColor(e.target.value)} />
                        </div>

                        <div className="code-box">
                            <div className="code-header">
                                <span>CSS Result</span>
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
                
                .preview-stage { height: 500px; background: #e2e8f0; border-radius: 2rem; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); }
                .checkerboard { position: absolute; inset: 0; background-image: linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px; opacity: 0.2; }
                
                .target-element { width: 300px; height: 300px; display: flex; align-items: center; justify-content: center; position: relative; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .hint { color: white; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; background: rgba(0,0,0,0.2); padding: 0.5rem 1rem; border-radius: 2rem; }
                
                .sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
                .card { background: white; border: 1px solid var(--border); border-radius: 1.5rem; padding: 1.5rem; }
                .card-header { font-size: 0.8rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem; }
                
                .shape-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; }
                .shape-btn { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 0.75rem; border-radius: 0.75rem; background: var(--background); transition: all 0.2s; border: 1px solid transparent; }
                .shape-btn:hover { background: var(--border); }
                .shape-btn.active { border-color: var(--primary); background: #f0f7ff; color: var(--primary); }
                .shape-preview { width: 40px; height: 40px; background: currentColor; }
                .shape-btn span { font-size: 0.65rem; font-weight: 700; }
                
                .input-group label { display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.5rem; }
                input[type="color"] { width: 100%; height: 35px; border: none; cursor: pointer; }
                
                .code-box { background: #1e293b; border-radius: 1rem; margin-top: 1.5rem; overflow: hidden; }
                .code-header { background: #0f172a; padding: 0.5rem 1rem; display: flex; justify-content: space-between; align-items: center; color: #94a3b8; font-size: 0.7rem; font-weight: 700; }
                pre { padding: 1rem; margin: 0; overflow-x: auto; color: #38bdf8; font-family: monospace; font-size: 0.75rem; line-height: 1.5; }
                
                @media (max-width: 850px) {
                    .layout { grid-template-columns: 1fr; }
                    .preview-stage { height: 350px; }
                    .target-element { width: 200px; height: 200px; }
                }
            `}</style>
        </div>
    );
}
