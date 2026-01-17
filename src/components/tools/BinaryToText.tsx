'use client';

import { useState } from 'react';
import { Binary, ArrowLeft, Copy, Check } from 'lucide-react';

export default function BinaryToText() {
    const [binary, setBinary] = useState('');
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const convertToText = () => {
        if (!binary.trim()) {
            setText('');
            setError('');
            return;
        }

        try {
            // Remove extra spaces and split by space
            const binaryArray = binary.trim().split(/\s+/);

            const textResult = binaryArray
                .map(bin => {
                    // Validate binary string
                    if (!/^[01]+$/.test(bin)) {
                        throw new Error('Invalid binary format');
                    }
                    return String.fromCharCode(parseInt(bin, 2));
                })
                .join('');

            setText(textResult);
            setError('');
        } catch (err) {
            setError('Invalid binary code. Please enter valid binary (0s and 1s only).');
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
                        <label>Binary Code Input</label>
                    </div>
                    <textarea
                        value={binary}
                        onChange={(e) => {
                            setBinary(e.target.value);
                            convertToText();
                        }}
                        placeholder="01001000 01100101 01101100 01101100 01101111"
                        rows={8}
                    />
                    {error && <div className="error-msg">{error}</div>}
                    <button onClick={convertToText} className="convert-btn">
                        <ArrowLeft size={18} /> Convert to Text
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
                .error-msg { margin-top: 0.5rem; padding: 0.75rem; background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; border-radius: 0.5rem; font-size: 0.85rem; }
            `}</style>
        </div>
    );
}
