'use client';

import { useState } from 'react';
import { FileJson, Copy, Check, Eye } from 'lucide-react';

export default function JsonViewer() {
    const [input, setInput] = useState('');
    const [view, setView] = useState<{ valid: boolean, content: any } | null>(null);
    const [copied, setCopied] = useState(false);

    const parseJson = () => {
        try {
            if (!input.trim()) return;
            const parsed = JSON.parse(input);
            setView({ valid: true, content: parsed });
        } catch (e: any) {
            setView({ valid: false, content: e.message });
        }
    };

    const handleCopy = () => {
        if (!view?.valid) return;
        navigator.clipboard.writeText(JSON.stringify(view.content, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const renderTree = (data: any, depth = 0): any => {
        if (typeof data !== 'object' || data === null) {
            return <span className={`json-val ${typeof data}`}>{JSON.stringify(data)}</span>;
        }

        const isArray = Array.isArray(data);
        const keys = Object.keys(data);
        const indent = 20 * (depth + 1);

        return (
            <div className="json-obj" style={{ marginLeft: depth > 0 ? 20 : 0 }}>
                <span className="bracket">{isArray ? '[' : '{'}</span>
                {keys.map((key, i) => (
                    <div key={key} style={{ marginLeft: 20 }}>
                        {!isArray && <span className="json-key">"{key}": </span>}
                        {renderTree(data[key], depth + 1)}
                        {i < keys.length - 1 && <span className="comma">,</span>}
                    </div>
                ))}
                <span className="bracket">{isArray ? ']' : '}'}</span>
            </div>
        );
    };

    return (
        <div className="tool-ui">
            <div className="viewer-layout">
                <div className="input-panel">
                    <div className="panel-header">
                        <label>Input JSON</label>
                        <button onClick={parseJson} className="action-btn">
                            <Eye size={16} /> View
                        </button>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder='{"key": "value"}'
                    />
                </div>

                <div className="output-panel">
                    <div className="panel-header">
                        <label>Tree View</label>
                        {view?.valid && (
                            <button onClick={handleCopy} className="action-btn">
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        )}
                    </div>
                    <div className="viewer-content">
                        {view ? (
                            view.valid ? (
                                <pre className="json-tree">{renderTree(view.content)}</pre>
                            ) : (
                                <div className="error-message">Invalid JSON: {view.content}</div>
                            )
                        ) : (
                            <div className="placeholder">Parsed JSON will appear here</div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 1200px; margin: 0 auto; }
                .viewer-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; height: 600px; }
                @media(min-width: 768px) { .viewer-layout { grid-template-columns: 1fr 1fr; } }

                .input-panel, .output-panel { display: flex; flex-direction: column; background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; overflow: hidden; }
                .panel-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; background: rgba(0,0,0,0.02); border-bottom: 1px solid var(--border); }
                .panel-header label { font-weight: 800; color: var(--secondary); font-size: 0.9rem; text-transform: uppercase; }
                
                textarea { flex: 1; padding: 1.5rem; border: none; background: transparent; resize: none; font-family: monospace; font-size: 0.9rem; line-height: 1.5; outline: none; }
                .viewer-content { flex: 1; overflow: auto; padding: 1.5rem; background: var(--background); }

                .action-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--primary); color: white; border-radius: 0.5rem; font-weight: 700; font-size: 0.8rem; }
                .action-btn:hover { opacity: 0.9; }

                .json-tree { font-family: monospace; font-size: 0.9rem; line-height: 1.5; }
                .json-key { color: #8b5cf6; font-weight: 600; }
                .json-val.string { color: #10b981; }
                .json-val.number { color: #f59e0b; }
                .json-val.boolean { color: #ef4444; }
                .bracket { color: var(--foreground); opacity: 0.6; }
                .comma { color: var(--foreground); opacity: 0.5; }

                .error-message { color: #ef4444; font-weight: 600; }
                .placeholder { color: var(--secondary); font-style: italic; opacity: 0.7; }
            `}</style>
        </div>
    );
}
