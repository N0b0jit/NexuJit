'use client';

import { useState } from 'react';
import { Copy, Check, Settings2, Loader2, RefreshCw } from 'lucide-react';

const LOADERS = [
    {
        name: 'Spinner',
        html: '<div className="loader-spinner"></div>',
        css: (color: string, size: number) => `
.loader-spinner {
  width: ${size}px;
  height: ${size}px;
  border: ${size / 8}px solid #f3f3f3;
  border-top: ${size / 8}px solid ${color};
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`
    },
    {
        name: 'Pulse',
        html: '<div className="loader-pulse"></div>',
        css: (color: string, size: number) => `
.loader-pulse {
  width: ${size}px;
  height: ${size}px;
  background-color: ${color};
  border-radius: 50%;
  animation: pulse 1.2s ease-in-out infinite;
}
@keyframes pulse {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
}`
    },
    {
        name: 'Dots',
        html: '<div className="loader-dots"><span></span><span></span><span></span></div>',
        css: (color: string, size: number) => `
.loader-dots {
  display: flex;
  gap: ${size / 4}px;
}
.loader-dots span {
  width: ${size / 3}px;
  height: ${size / 3}px;
  background-color: ${color};
  border-radius: 50%;
  animation: bounce 0.6s infinite alternate;
}
.loader-dots span:nth-child(2) { animation-delay: 0.2s; }
.loader-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce {
  to { transform: translateY(-${size / 2}px); }
}`
    }
];

export default function CssLoaderGenerator() {
    const [selected, setSelected] = useState(LOADERS[0]);
    const [color, setColor] = useState('#2563eb');
    const [size, setSize] = useState(48);
    const [copied, setCopied] = useState(false);

    const activeCss = selected.css(color, size);

    const handleCopy = () => {
        const fullCode = `/* CSS */\n${activeCss}\n\n/* HTML */\n${selected.html}`;
        navigator.clipboard.writeText(fullCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="layout">
                <div className="preview-card">
                    <div className="preview-header">Live Preview</div>
                    <div className="preview-render">
                        <style>{activeCss}</style>
                        <div key={selected.name} dangerouslySetInnerHTML={{ __html: selected.html.replace('className', 'class') }} />
                    </div>
                    <div className="loader-selector">
                        {LOADERS.map(l => (
                            <button
                                key={l.name}
                                className={selected.name === l.name ? 'active' : ''}
                                onClick={() => setSelected(l)}
                            >
                                {l.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="controls">
                    <div className="card">
                        <div className="card-title"><Settings2 size={18} /> Configuration</div>

                        <div className="input-group">
                            <label>Loader Color</label>
                            <input type="color" value={color} onChange={e => setColor(e.target.value)} />
                        </div>

                        <div className="input-group">
                            <label>Size: {size}px</label>
                            <input type="range" min="16" max="120" value={size} onChange={e => setSize(parseInt(e.target.value))} />
                        </div>

                        <div className="code-display">
                            <div className="code-header">
                                <span>CSS Code</span>
                                <button onClick={handleCopy}>
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied' : 'Copy Code'}
                                </button>
                            </div>
                            <pre><code>{activeCss}</code></pre>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 1000px; margin: 0 auto; }
                .layout { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; }
                
                .preview-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; display: flex; flex-direction: column; overflow: hidden; }
                .preview-header { padding: 1rem; background: var(--background); border-bottom: 1px solid var(--border); text-align: center; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--secondary); letter-spacing: 0.05em; }
                .preview-render { flex: 1; display: flex; align-items: center; justify-content: center; min-height: 300px; background-image: radial-gradient(var(--border) 1px, transparent 1px); background-size: 20px 20px; }
                
                .loader-selector { display: flex; gap: 0.5rem; justify-content: center; padding: 1.5rem; border-top: 1px solid var(--border); }
                .loader-selector button { padding: 0.6rem 1.2rem; border-radius: 0.75rem; border: 1px solid var(--border); font-weight: 600; transition: all 0.2s; }
                .loader-selector button.active { background: var(--primary); color: white; border-color: var(--primary); }
                
                .controls { display: flex; flex-direction: column; gap: 1.5rem; }
                .card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; padding: 1.5rem; }
                .card-title { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; margin-bottom: 1.5rem; font-size: 0.9rem; color: var(--secondary); text-transform: uppercase; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
                
                .input-group label { display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.5rem; }
                .input-group { margin-bottom: 1.25rem; }
                input[type="color"] { width: 100%; height: 35px; border: none; cursor: pointer; }
                input[type="range"] { width: 100%; }
                
                .code-display { background: #1e293b; border-radius: 1rem; margin-top: 2rem; overflow: hidden; }
                .code-header { background: #0f172a; padding: 0.5rem 1rem; display: flex; justify-content: space-between; align-items: center; color: #94a3b8; font-size: 0.7rem; font-weight: 700; }
                pre { padding: 1rem; margin: 0; overflow-x: auto; color: #38bdf8; font-family: monospace; font-size: 0.75rem; line-height: 1.5; }
                
                @media (max-width: 850px) {
                    .layout { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
