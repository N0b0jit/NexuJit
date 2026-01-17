'use client';

import { useState } from 'react';
import { FileCode, Copy, Trash2, Check, Zap, Info } from 'lucide-react';

export default function CssMinifier() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);
    const [stats, setStats] = useState({ original: 0, minified: 0, savings: 0 });

    const minifyCss = () => {
        if (!input.trim()) return;

        let minified = input
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
            .replace(/\s+/g, ' ') // Collapse whitespace
            .replace(/\s*([{};:>+~])\s*/g, '$1') // Remove spaces around special characters
            .replace(/;}/g, '}') // Remove last semicolon in block
            .trim();

        setOutput(minified);

        const originalSize = new Blob([input]).size;
        const minifiedSize = new Blob([minified]).size;
        const savings = originalSize > 0 ? ((originalSize - minifiedSize) / originalSize * 100).toFixed(2) : 0;

        setStats({
            original: originalSize,
            minified: minifiedSize,
            savings: parseFloat(savings as string)
        });
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setInput('');
        setOutput('');
        setStats({ original: 0, minified: 0, savings: 0 });
    };

    return (
        <div className="tool-ui">
            <div className="minifier-layout">
                <div className="editor-panel">
                    <div className="panel-header">
                        <label><FileCode size={16} /> Paste CSS Styles</label>
                        <button onClick={handleClear} className="text-btn"><Trash2 size={14} /> Clear</button>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder=".class { color: red; }"
                        spellCheck={false}
                    />
                    <button onClick={minifyCss} className="minify-btn" disabled={!input}>
                        <Zap size={18} /> Minify CSS Now
                    </button>
                </div>

                <div className="result-panel">
                    <div className="panel-header">
                        <span>Minified Output</span>
                        {output && (
                            <button className="copy-btn" onClick={handleCopy}>
                                {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy CSS</>}
                            </button>
                        )}
                    </div>
                    <div className="output-wrapper">
                        <textarea
                            value={output}
                            readOnly
                            placeholder="Result will appear here..."
                            spellCheck={false}
                        />
                    </div>

                    {stats.original > 0 && (
                        <div className="stats-grid">
                            <div className="stat-card">
                                <label>Original Size</label>
                                <span>{(stats.original / 1024).toFixed(2)} KB</span>
                            </div>
                            <div className="stat-card">
                                <label>Minified Size</label>
                                <span>{(stats.minified / 1024).toFixed(2)} KB</span>
                            </div>
                            <div className="stat-card savings">
                                <label>Savings</label>
                                <span>{stats.savings}%</span>
                            </div>
                        </div>
                    )}

                    <div className="info-box">
                        <Info size={16} />
                        <p>This tool removes all unnecessary characters from source code without changing its functionality.</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { display: flex; flex-direction: column; gap: 2rem; }
                .minifier-layout { display: grid; grid-template-columns: 1fr; gap: 2.5rem; }
                @media (min-width: 1024px) { .minifier-layout { grid-template-columns: 1fr 1fr; } }
                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-weight: 700; color: var(--secondary); font-size: 0.9rem; }
                .panel-header label { display: flex; align-items: center; gap: 0.5rem; }
                textarea { width: 100%; height: 400px; padding: 1.5rem; border-radius: 1.25rem; border: 2px solid var(--border); background: var(--surface); color: var(--foreground); font-family: 'Fira Code', monospace; font-size: 0.9rem; line-height: 1.6; resize: none; outline: none; transition: border-color 0.2s; }
                textarea:focus { border-color: var(--primary); }
                .minify-btn { width: 100%; margin-top: 1.5rem; padding: 1.25rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: all 0.2s; }
                .minify-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 10px 25px var(--primary-soft); }
                .minify-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .copy-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--primary-soft); color: var(--primary); border-radius: 0.6rem; font-weight: 700; font-size: 0.85rem; }
                .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1.5rem; }
                .stat-card { background: var(--surface); padding: 1.25rem; border-radius: 1rem; border: 1px solid var(--border); display: flex; flex-direction: column; gap: 0.25rem; }
                .stat-card label { font-size: 0.7rem; font-weight: 800; color: var(--secondary); text-transform: uppercase; }
                .stat-card span { font-size: 1rem; font-weight: 800; color: var(--foreground); }
                .stat-card.savings span { color: #10b981; }
                .info-box { margin-top: 2rem; padding: 1.25rem; background: var(--background); border: 1px solid var(--border); border-radius: 1rem; display: flex; gap: 1rem; align-items: center; color: var(--secondary); font-size: 0.85rem; }
                .text-btn { color: var(--secondary); font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 0.3rem; }
                .text-btn:hover { color: #ef4444; }
            `}</style>
        </div>
    );
}
