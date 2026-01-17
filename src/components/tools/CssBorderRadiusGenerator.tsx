'use client';

import { useState } from 'react';
import { Copy, Check, Settings2, Maximize } from 'lucide-react';

export default function CssBorderRadiusGenerator() {
    const [tl, setTl] = useState(20);
    const [tr, setTr] = useState(20);
    const [br, setBr] = useState(20);
    const [bl, setBl] = useState(20);
    const [all, setAll] = useState(20);
    const [sync, setSync] = useState(true);
    const [copied, setCopied] = useState(false);

    const radius = sync ? `${all}%` : `${tl}% ${tr}% ${br}% ${bl}%`;
    const cssCode = `border-radius: ${radius};
-webkit-border-radius: ${radius};
-moz-border-radius: ${radius};`;

    const handleCopy = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="layout">
                <div className="preview-stage">
                    <div className="shape-preview" style={{ borderRadius: radius }}>
                        SHAPE PREVIEW
                    </div>
                </div>

                <div className="controls">
                    <div className="card">
                        <div className="card-header">
                            <Settings2 size={16} /> Radius Settings
                            <button className={`sync-toggle ${sync ? 'active' : ''}`} onClick={() => setSync(!sync)}>
                                <Maximize size={14} /> {sync ? 'Split' : 'Link'}
                            </button>
                        </div>

                        {sync ? (
                            <div className="input-group">
                                <label>All Corners: {all}%</label>
                                <input type="range" min="0" max="100" value={all} onChange={e => setAll(parseInt(e.target.value))} />
                            </div>
                        ) : (
                            <div className="corners-grid">
                                <div className="input-group">
                                    <label>Top Left: {tl}%</label>
                                    <input type="range" min="0" max="100" value={tl} onChange={e => setTl(parseInt(e.target.value))} />
                                </div>
                                <div className="input-group">
                                    <label>Top Right: {tr}%</label>
                                    <input type="range" min="0" max="100" value={tr} onChange={e => setTr(parseInt(e.target.value))} />
                                </div>
                                <div className="input-group">
                                    <label>Bottom Right: {br}%</label>
                                    <input type="range" min="0" max="100" value={br} onChange={e => setBr(parseInt(e.target.value))} />
                                </div>
                                <div className="input-group">
                                    <label>Bottom Left: {bl}%</label>
                                    <input type="range" min="0" max="100" value={bl} onChange={e => setBl(parseInt(e.target.value))} />
                                </div>
                            </div>
                        )}

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
                .tool-ui { max-width: 900px; margin: 0 auto; }
                .layout { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; }
                .preview-stage { height: 400px; background: #f8fafc; border-radius: 2rem; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; }
                .shape-preview { width: 250px; height: 250px; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; box-shadow: 0 10px 40px rgba(99, 102, 241, 0.2); }
                
                .card { background: white; border: 1px solid var(--border); border-radius: 1.5rem; padding: 1.5rem; }
                .card-header { display: flex; align-items: center; justify-content: space-between; font-weight: 700; font-size: 0.8rem; color: var(--secondary); text-transform: uppercase; border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1.5rem; }
                
                .sync-toggle { font-size: 0.7rem; padding: 0.3rem 0.6rem; border-radius: 0.5rem; background: var(--background); display: flex; align-items: center; gap: 0.3rem; }
                .sync-toggle.active { background: var(--primary); color: white; }
                
                .input-group label { display: block; font-size: 0.7rem; font-weight: 700; margin-bottom: 0.5rem; }
                .input-group { margin-bottom: 1rem; }
                .corners-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                
                .code-display { background: #1e293b; border-radius: 1rem; overflow: hidden; margin-top: 1rem; }
                .code-header { background: #0f172a; padding: 0.5rem 1rem; display: flex; justify-content: space-between; align-items: center; color: #94a3b8; font-size: 0.7rem; font-weight: 700; }
                pre { padding: 1rem; margin: 0; overflow-x: auto; color: #38bdf8; font-family: monospace; font-size: 0.7rem; line-height: 1.5; }

                @media (max-width: 800px) {
                    .layout { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
