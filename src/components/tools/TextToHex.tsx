'use client';

import { useState } from 'react';
import { Hash, Copy, Check } from 'lucide-react';

export default function TextToHex() {
    const [text, setText] = useState('');
    const [hex, setHex] = useState('');
    const [copied, setCopied] = useState(false);

    const convertToHex = () => {
        if (!text) {
            setHex('');
            return;
        }

        const hexResult = text
            .split('')
            .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
            .join(' ');

        setHex(hexResult.toUpperCase());
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(hex);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="converter-layout">
                <div className="input-panel">
                    <div className="panel-header">
                        <label>Plain Text Input</label>
                    </div>
                    <textarea
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value);
                            convertToHex();
                        }}
                        placeholder="Enter text to convert to HEX..."
                        rows={8}
                    />
                    <button onClick={convertToHex} className="convert-btn">
                        <Hash size={18} /> Convert to HEX
                    </button>
                </div>

                <div className="output-panel">
                    <div className="panel-header">
                        <label>Hexadecimal Output</label>
                        {hex && (
                            <button className="copy-btn" onClick={handleCopy}>
                                {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
                            </button>
                        )}
                    </div>
                    <textarea
                        value={hex}
                        readOnly
                        placeholder="HEX code will appear here..."
                        rows={8}
                    />
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 1000px; margin: 0 auto; }
                .converter-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; }
                @media (min-width: 768px) { .converter-layout { grid-template-columns: 1fr 1fr; } }

                .input-panel, .output-panel { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow); }
                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                .panel-header label { font-weight: 800; color: var(--secondary); font-size: 0.85rem; text-transform: uppercase; }

                textarea { width: 100%; padding: 1.25rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); font-family: 'Courier New', monospace; font-size: 0.95rem; line-height: 1.6; resize: none; color: var(--foreground); }
                textarea:focus { border-color: var(--primary); outline: none; }

                .convert-btn { width: 100%; margin-top: 1rem; padding: 1rem; background: var(--primary); color: white; border-radius: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
                .copy-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: var(--primary-soft); color: var(--primary); border-radius: 0.5rem; font-weight: 700; font-size: 0.8rem; }
            `}</style>
        </div>
    );
}
