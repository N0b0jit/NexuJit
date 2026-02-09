'use client';

import { useState } from 'react';
import { RefreshCcw, Copy, Check } from 'lucide-react';

export default function ColorGenerator() {
    const [colors, setColors] = useState<string[]>(generatePalette());
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    function generatePalette() {
        return Array.from({ length: 5 }, () =>
            '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
        );
    }

    const refresh = () => setColors(generatePalette());

    const copy = (color: string, index: number) => {
        navigator.clipboard.writeText(color);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1500);
    };

    return (
        <div className="tool-ui">
            <div className="card">
                <div className="colors-grid">
                    {colors.map((color, i) => (
                        <div key={i} className="color-stripe" style={{ backgroundColor: color }} onClick={() => copy(color, i)}>
                            <div className="overlay">
                                <span className="hex">{color}</span>
                                {copiedIndex === i ? <Check size={24} color="white" /> : <Copy size={24} color="white" opacity={0.5} />}
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={refresh} className="gen-btn">
                    <RefreshCcw size={20} /> Generate New Palette
                </button>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); }
                
                .colors-grid { display: grid; grid-template-columns: repeat(5, 1fr); height: 300px; border-radius: 1rem; overflow: hidden; margin-bottom: 2rem; }
                .color-stripe { height: 100%; position: relative; cursor: pointer; transition: transform 0.2s; }
                .color-stripe:hover { transform: scaleY(1.05); z-index: 10; }
                
                .overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; background: rgba(0,0,0,0.2); gap: 1rem; }
                .color-stripe:hover .overlay { opacity: 1; }
                
                .hex { color: white; font-weight: 700; text-transform: uppercase; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }

                .gen-btn { width: 100%; padding: 1.25rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.75rem; font-size: 1.1rem; }
                .gen-btn:hover { background: var(--primary-hover); }

                @media(max-width: 640px) {
                    .colors-grid { grid-template-columns: 1fr; height: 500px; }
                }
            `}</style>
        </div>
    );
}
