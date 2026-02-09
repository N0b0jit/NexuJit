'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Copy, Trash2, Check, Type, Hash, Settings } from 'lucide-react';

export default function TextRepeater() {
    const [text, setText] = useState('');
    const [count, setCount] = useState('10');
    const [separator, setSeparator] = useState('New Line');
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    const repeatText = () => {
        const num = parseInt(count) || 0;
        if (!text || num <= 0) {
            setResult('');
            return;
        }

        let sep = '';
        if (separator === 'New Line') sep = '\n';
        else if (separator === 'Space') sep = ' ';
        else if (separator === 'Comma') sep = ', ';
        else if (separator === 'None') sep = '';

        const repeated = new Array(num).fill(text).join(sep);
        setResult(repeated);
    };

    useEffect(() => {
        repeatText();
    }, [text, count, separator]);

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="repeater-layout">
                <div className="config-panel">
                    <div className="config-group">
                        <label><Type size={16} /> Text to Repeat</label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter text here..."
                            rows={4}
                        />
                    </div>

                    <div className="config-row">
                        <div className="config-group">
                            <label><Hash size={16} /> Repetitions</label>
                            <input
                                type="number"
                                value={count}
                                onChange={(e) => setCount(e.target.value)}
                                min="1"
                                max="10000"
                            />
                        </div>
                        <div className="config-group">
                            <label><Settings size={16} /> Separator</label>
                            <select value={separator} onChange={(e) => setSeparator(e.target.value)}>
                                <option>New Line</option>
                                <option>Space</option>
                                <option>Comma</option>
                                <option>None</option>
                            </select>
                        </div>
                    </div>

                    <button className="clear-btn" onClick={() => setText('')}>
                        <Trash2 size={16} /> Clear Input
                    </button>
                </div>

                <div className="result-panel">
                    <div className="panel-header">
                        <span>Repeated Text Output</span>
                        {result && (
                            <button className="copy-btn" onClick={handleCopy}>
                                {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy All</>}
                            </button>
                        )}
                    </div>
                    <div className="output-wrapper">
                        <textarea
                            value={result}
                            readOnly
                            placeholder="Your repeated text will appear here..."
                        />
                    </div>
                    <div className="stats-footer">
                        Characters: {result.length} | Lines: {result.split('\n').length}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { display: flex; flex-direction: column; gap: 2rem; }
                .repeater-layout { display: grid; grid-template-columns: 1fr; gap: 2.5rem; }
                @media (min-width: 1024px) { .repeater-layout { grid-template-columns: 350px 1fr; } }

                .config-panel { background: var(--surface); padding: 2.5rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 1.5rem; height: fit-content; }
                .config-group { display: flex; flex-direction: column; gap: 0.75rem; }
                .config-group label { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: var(--secondary); font-size: 0.9rem; }
                .config-group textarea, .config-group input, .config-group select { padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); font-weight: 500; font-size: 1rem; }
                .config-row { display: grid; grid-template-columns: 1fr; gap: 1rem; }

                .clear-btn { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem; color: #ef4444; font-weight: 700; font-size: 0.85rem; border: 2px solid transparent; transition: all 0.2s; margin-top: 1rem; }
                .clear-btn:hover { background: #fef2f2; border-color: #fee2e2; }

                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-weight: 800; color: var(--secondary); font-size: 0.8rem; text-transform: uppercase; }
                .output-wrapper textarea { width: 100%; height: 500px; padding: 1.5rem; border-radius: 1.25rem; border: 2px solid var(--border); background: var(--background); color: var(--foreground); font-size: 1.1rem; line-height: 1.6; resize: none; overflow-y: auto; }
                
                .copy-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--primary-soft); color: var(--primary); border-radius: 0.5rem; font-weight: 700; font-size: 0.85rem; }
                .stats-footer { margin-top: 1rem; font-size: 0.8rem; font-weight: 700; color: var(--secondary); text-align: right; }
            `}</style>
        </div>
    );
}
