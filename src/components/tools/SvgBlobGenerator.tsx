'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Download, Copy, Check, Settings2 } from 'lucide-react';

export default function SvgBlobGenerator() {
    const [blobPath, setBlobPath] = useState('');
    const [color, setColor] = useState('#2563eb');
    const [complexity, setComplexity] = useState(6);
    const [contrast, setContrast] = useState(0.4);
    const [copied, setCopied] = useState(false);

    const generateBlob = () => {
        const size = 400;
        const center = size / 2;
        const radius = size * 0.4;
        const points = [];
        const angleStep = (Math.PI * 2) / complexity;

        for (let i = 0; i < complexity; i++) {
            const theta = i * angleStep;
            const randomRadius = radius + (Math.random() - 0.5) * radius * contrast * 2;
            const x = center + randomRadius * Math.cos(theta);
            const y = center + randomRadius * Math.sin(theta);
            points.push({ x, y });
        }

        // Create smooth path using cubic bezier
        let path = `M ${points[0].x},${points[0].y} `;
        for (let i = 0; i < points.length; i++) {
            const p0 = points[i];
            const p1 = points[(i + 1) % points.length];
            const p2 = points[(i + 2) % points.length];

            const xc = (p0.x + p1.x) / 2;
            const yc = (p0.y + p1.y) / 2;
            const xc2 = (p1.x + p2.x) / 2;
            const yc2 = (p1.y + p2.y) / 2;

            path += `Q ${p1.x},${p1.y} ${xc2},${yc2} `;
        }
        path += 'Z';
        setBlobPath(path);
    };

    useEffect(() => {
        generateBlob();
    }, [complexity, contrast]);

    const svgString = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">\n  <path fill="${color}" d="${blobPath}" />\n</svg>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(svgString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'blob.svg';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="tool-ui">
            <div className="generator-layout">
                <div className="preview-area">
                    <svg viewBox="0 0 400 400" className="blob-svg">
                        <path fill={color} d={blobPath} />
                    </svg>
                    <button onClick={generateBlob} className="regenerate-btn">
                        <RefreshCw size={18} /> Regenerate
                    </button>
                </div>

                <div className="controls-area">
                    <div className="control-card">
                        <h3><Settings2 size={18} /> Customization</h3>

                        <div className="input-group">
                            <label>Complexity: {complexity}</label>
                            <input type="range" min="3" max="15" value={complexity} onChange={e => setComplexity(parseInt(e.target.value))} />
                        </div>

                        <div className="input-group">
                            <label>Contrast: {Math.round(contrast * 100)}%</label>
                            <input type="range" min="0" max="0.9" step="0.1" value={contrast} onChange={e => setContrast(parseFloat(e.target.value))} />
                        </div>

                        <div className="input-group">
                            <label>Color</label>
                            <div className="color-presets">
                                {['#2563eb', '#db2777', '#7c3aed', '#059669', '#ea580c', '#374151'].map(p => (
                                    <button
                                        key={p}
                                        className={`preset ${color === p ? 'active' : ''}`}
                                        style={{ backgroundColor: p }}
                                        onClick={() => setColor(p)}
                                    />
                                ))}
                                <input type="color" value={color} onChange={e => setColor(e.target.value)} className="custom-color" />
                            </div>
                        </div>

                        <div className="actions">
                            <button onClick={handleDownload} className="action-btn">
                                <Download size={18} /> Download SVG
                            </button>
                            <button onClick={handleCopy} className="action-btn secondary">
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                {copied ? 'Copied XML' : 'Copy SVG Code'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 900px; margin: 0 auto; }
                .generator-layout { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; }
                .preview-area { background: var(--card-bg, #f8f9fa); border-radius: 2rem; border: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; position: relative; min-height: 480px; }
                .blob-svg { width: 100%; height: 100%; max-width: 400px; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.1)); }
                .regenerate-btn { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); background: white; padding: 0.75rem 1.5rem; border-radius: 2rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
                
                .control-card { background: white; border: 1px solid var(--border); border-radius: 1.5rem; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
                .control-card h3 { display: flex; align-items: center; gap: 0.5rem; font-size: 1.1rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
                
                .input-group label { display: block; font-size: 0.875rem; font-weight: 600; color: var(--secondary); margin-bottom: 0.75rem; }
                input[type="range"] { width: 100%; }
                
                .color-presets { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }
                .preset { width: 32px; height: 32px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; }
                .preset.active { border-color: #000; transform: scale(1.1); }
                .custom-color { width: 32px; height: 32px; border: none; padding: 0; background: none; cursor: pointer; }
                
                .actions { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }
                .action-btn { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.875rem; border-radius: 0.75rem; font-weight: 700; background: var(--primary); color: white; transition: all 0.2s; }
                .action-btn.secondary { background: var(--background); color: var(--foreground); border: 1px solid var(--border); }
                .action-btn:hover { opacity: 0.9; transform: translateY(-1px); }
                
                @media (max-width: 850px) {
                    .generator-layout { grid-template-columns: 1fr; }
                    .preview-area { min-height: 400px; }
                }
            `}</style>
        </div>
    );
}
