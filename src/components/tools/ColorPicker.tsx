'use client';

import { useState } from 'react';
import { Palette, Copy, Check } from 'lucide-react';

export default function ColorPicker() {
    const [color, setColor] = useState('#2563eb');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(color);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : '';
    };

    return (
        <div className="tool-ui">
            <div className="card">
                <div className="picker-area">
                    <input type="color" value={color} onChange={e => setColor(e.target.value)} />
                    <div className="preview" style={{ backgroundColor: color }}></div>
                </div>

                <div className="values">
                    <div className="val-group">
                        <label>HEX</label>
                        <div className="input-wrap">
                            <input type="text" value={color} readOnly />
                            <button onClick={handleCopy}>{copied ? <Check size={16} /> : <Copy size={16} />}</button>
                        </div>
                    </div>

                    <div className="val-group">
                        <label>RGB</label>
                        <div className="input-wrap">
                            <input type="text" value={hexToRgb(color)} readOnly />
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 500px; margin: 0 auto; }
                .card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); }
                
                .picker-area { display: flex; gap: 1rem; height: 150px; margin-bottom: 2rem; }
                input[type="color"] { width: 100px; height: 100%; border: none; cursor: pointer; padding: 0; background: none; }
                .preview { flex: 1; border-radius: 1rem; border: 1px solid var(--border); transition: background-color 0.1s; }

                .values { display: flex; flex-direction: column; gap: 1rem; }
                .val-group label { display: block; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem; font-size: 0.8rem; }
                .input-wrap { display: flex; gap: 0.5rem; }
                .input-wrap input { flex: 1; padding: 1rem; border-radius: 0.8rem; border: 2px solid var(--border); background: var(--background); font-family: monospace; font-size: 1.1rem; }
                .input-wrap button { padding: 0 1rem; background: var(--surface); border: 2px solid var(--border); border-radius: 0.8rem; color: var(--secondary); }
                .input-wrap button:hover { border-color: var(--primary); color: var(--primary); }
            `}</style>
        </div>
    );
}
