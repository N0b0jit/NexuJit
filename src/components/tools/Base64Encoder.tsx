'use client';

import { useState } from 'react';
import { Code, Copy, Check } from 'lucide-react';

export default function Base64Encoder() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);

    const encode = () => {
        if (!input) {
            setOutput('');
            return;
        }
        try {
            const encoded = btoa(unescape(encodeURIComponent(input)));
            setOutput(encoded);
        } catch (err) {
            setOutput('Error encoding text');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
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
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            encode();
                        }}
                        placeholder="Enter text to encode..."
                        rows={10}
                    />
                    <button onClick={encode} className="convert-btn">
                        <Code size={18} /> Encode to Base64
                    </button>
                </div>

                <div className="output-panel">
                    <div className="panel-header">
                        <label>Base64 Encoded Output</label>
                        {output && (
                            <button className="copy-btn" onClick={handleCopy}>
                                {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
                            </button>
                        )}
                    </div>
                    <textarea
                        value={output}
                        readOnly
                        placeholder="Encoded text will appear here..."
                        rows={10}
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
