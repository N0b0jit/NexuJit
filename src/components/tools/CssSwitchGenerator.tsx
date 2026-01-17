'use client';

import { useState } from 'react';
import { Copy, Check, Settings2 } from 'lucide-react';

export default function CssSwitchGenerator() {
    const [color, setColor] = useState('#2563eb');
    const [size, setSize] = useState(60);
    const [copied, setCopied] = useState(false);

    const w = size;
    const h = size / 2 + 4;
    const r = h / 2;
    const knob = h - 8;

    const cssCode = `
.switch {
  position: relative;
  display: inline-block;
  width: ${w}px;
  height: ${h}px;
}
.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: ${r}px;
}
.slider:before {
  position: absolute;
  content: "";
  height: ${knob}px;
  width: ${knob}px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: ${color};
}
input:checked + .slider:before {
  transform: translateX(${w - knob - 8}px);
}`;

    const htmlCode = `<label class="switch">
  <input type="checkbox">
  <span class="slider"></span>
</label>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(`/* CSS */\n${cssCode}\n\n<!-- HTML -->\n${htmlCode}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="layout">
                <div className="preview-stage">
                    <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                    </label>

                    <style>{`
                        .switch { position: relative; display: inline-block; width: ${w}px; height: ${h}px; }
                        .switch input { opacity: 0; width: 0; height: 0; }
                        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: ${r}px; }
                        .slider:before { position: absolute; content: ""; height: ${knob}px; width: ${knob}px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
                        input:checked + .slider { background-color: ${color}; }
                        input:checked + .slider:before { transform: translateX(${w - knob - 8}px); }
                    `}</style>
                </div>

                <div className="controls">
                    <div className="card">
                        <div className="card-header"><Settings2 size={16} /> Switch Settings</div>

                        <div className="input-group">
                            <label>Active Color</label>
                            <input type="color" value={color} onChange={e => setColor(e.target.value)} />
                        </div>

                        <div className="input-group">
                            <label>Width: {size}px</label>
                            <input type="range" min="40" max="120" value={size} onChange={e => setSize(parseInt(e.target.value))} />
                        </div>

                        <div className="code-display">
                            <div className="code-header">
                                <span>CSS & HTML</span>
                                <button onClick={handleCopy}>
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied Bundle' : 'Copy All'}
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
                .preview-stage { height: 300px; background: white; border-radius: 2rem; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; }
                
                .card { background: white; border: 1px solid var(--border); border-radius: 1.5rem; padding: 1.5rem; }
                .card-header { font-size: 0.8rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
                
                .input-group label { display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.5rem; }
                .input-group { margin-bottom: 1rem; }
                input[type="range"] { width: 100%; }

                .code-display { background: #1e293b; border-radius: 1rem; overflow: hidden; margin-top: 1rem; }
                .code-header { background: #0f172a; padding: 0.5rem 1rem; display: flex; justify-content: space-between; align-items: center; color: #94a3b8; font-size: 0.7rem; font-weight: 700; }
                pre { padding: 1rem; margin: 0; overflow-x: auto; color: #38bdf8; font-family: monospace; font-size: 0.7rem; line-height: 1.5; }
                
                @media (max-width: 800px) {
                    .layout { grid-template-columns: 1fr; }
                    .preview-stage { height: 200px; }
                }
            `}</style>
        </div>
    );
}
