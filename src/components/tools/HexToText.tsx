'use client';

import { useState } from 'react';
import { Hash, Copy, Check, AlertCircle } from 'lucide-react';

export default function HexToText() {
    const [hex, setHex] = useState('');
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const convertToText = () => {
        if (!hex.trim()) {
            setText('');
            setError('');
            return;
        }

        try {
            const hexArray = hex.trim().split(/\s+/);

            const textResult = hexArray
                .map(h => {
                    if (!/^[0-9A-Fa-f]+$/.test(h)) {
                        throw new Error('Invalid HEX format');
                    }
                    return String.fromCharCode(parseInt(h, 16));
                })
                .join('');

            setText(textResult);
            setError('');
        } catch (err) {
            setError('Invalid HEX code. Please enter valid hexadecimal values.');
            setText('');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="converter-layout">
                <div className="input-panel">
                    <div className="panel-header">
                        <label>Hexadecimal Input</label>
                    </div>
                    <textarea
                        value={hex}
                        onChange={(e) => {
                            setHex(e.target.value);
                            convertToText();
                        }}
                        placeholder="48 65 6C 6C 6F"
                        rows={8}
                    />
                    {error && <div className="error-msg"><AlertCircle size={16} /> {error}</div>}
                    <button onClick={convertToText} className="convert-btn">
                        <Hash size={18} /> Convert to Text
                    </button>
                </div>

                <div className="output-panel">
                    <div className="panel-header">
                        <label>Plain Text Output</label>
                        {text && (
                            <button className="copy-btn" onClick={handleCopy}>
                                {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
                            </button>
                        )}
                    </div>
                    <textarea
                        value={text}
                        readOnly
                        placeholder="Decoded text will appear here..."
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
                .error-msg { margin-top: 0.5rem; padding: 0.75rem; background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; border-radius: 0.5rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; }
            `}</style>
        </div>
    );
}
