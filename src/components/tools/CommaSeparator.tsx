'use client';

import { useState, useEffect } from 'react';
import { Hash, Copy, Check } from 'lucide-react';

export default function CommaSeparator() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [separator, setSeparator] = useState(',');
    const [removeEmpty, setRemoveEmpty] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        convertToCommaSeparated();
    }, [input, separator, removeEmpty]);

    const convertToCommaSeparated = () => {
        if (!input.trim()) {
            setOutput('');
            return;
        }

        let lines = input.split('\n');

        if (removeEmpty) {
            lines = lines.filter(line => line.trim() !== '');
        }

        const result = lines.map(line => line.trim()).join(`${separator} `);
        setOutput(result);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="separator-layout">
                <div className="input-panel">
                    <div className="panel-header">
                        <label>List Input (One per line)</label>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Apple&#10;Banana&#10;Orange&#10;Grape"
                        rows={12}
                    />

                    <div className="options">
                        <div className="option-group">
                            <label>Separator</label>
                            <select value={separator} onChange={(e) => setSeparator(e.target.value)}>
                                <option value=",">Comma (,)</option>
                                <option value=";">Semicolon (;)</option>
                                <option value="|">Pipe (|)</option>
                                <option value=" ">Space</option>
                            </select>
                        </div>

                        <label className="checkbox-item">
                            <input
                                type="checkbox"
                                checked={removeEmpty}
                                onChange={(e) => setRemoveEmpty(e.target.checked)}
                            />
                            <span>Remove empty lines</span>
                        </label>
                    </div>
                </div>

                <div className="output-panel">
                    <div className="panel-header">
                        <label>Separated Output</label>
                        {output && (
                            <button className="copy-btn" onClick={handleCopy}>
                                {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
                            </button>
                        )}
                    </div>
                    <textarea
                        value={output}
                        readOnly
                        placeholder="Comma-separated result will appear here..."
                        rows={12}
                    />
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 1000px; margin: 0 auto; }
                .separator-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; }
                @media (min-width: 768px) { .separator-layout { grid-template-columns: 1fr 1fr; } }

                .input-panel, .output-panel { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow); }
                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                .panel-header label { font-weight: 800; color: var(--secondary); font-size: 0.85rem; text-transform: uppercase; }

                textarea { width: 100%; padding: 1.25rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); font-size: 1rem; line-height: 1.6; resize: none; color: var(--foreground); }
                textarea:focus { border-color: var(--primary); outline: none; }

                .options { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem; padding: 1.5rem; background: var(--background); border-radius: 1rem; }
                .option-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .option-group label { font-size: 0.75rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; }
                .option-group select { padding: 0.75rem; border-radius: 0.5rem; border: 1px solid var(--border); background: var(--surface); font-weight: 600; }
                
                .checkbox-item { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; font-weight: 600; color: var(--secondary); }
                .checkbox-item input { width: 18px; height: 18px; accent-color: var(--primary); }

                .copy-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: var(--primary-soft); color: var(--primary); border-radius: 0.5rem; font-weight: 700; font-size: 0.8rem; }
            `}</style>
        </div>
    );
}
