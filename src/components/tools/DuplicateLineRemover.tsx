'use client';

import { useState } from 'react';
import { Trash2, Copy, ArrowRight, RotateCcw } from 'lucide-react';

export default function DuplicateLineRemover() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [stats, setStats] = useState({ original: 0, distinct: 0, removed: 0 });
    const [caseSensitive, setCaseSensitive] = useState(false);

    const process = () => {
        if (!input) return;

        const lines = input.split(/\r?\n/);
        const originalCount = lines.length;

        // Filter logic
        let uniqueLines: string[] = [];
        const seen = new Set();

        lines.forEach(line => {
            const key = caseSensitive ? line : line.toLowerCase();
            if (!seen.has(key)) {
                seen.add(key);
                uniqueLines.push(line);
            }
        });

        setOutput(uniqueLines.join('\n'));
        setStats({
            original: originalCount,
            distinct: uniqueLines.length,
            removed: originalCount - uniqueLines.length
        });
    };

    const clear = () => {
        setInput('');
        setOutput('');
        setStats({ original: 0, distinct: 0, removed: 0 });
    };

    return (
        <div className="tool-ui">
            <div className="card">
                <div className="grid-cols">
                    <div className="col">
                        <div className="header">
                            <label>Input List</label>
                            <span className="badge">{stats.original} Lines</span>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste your list here..."
                        />
                    </div>

                    <div className="mid-col">
                        <div className="options">
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    checked={caseSensitive}
                                    onChange={e => setCaseSensitive(e.target.checked)}
                                />
                                Case Sensitive
                            </label>
                        </div>
                        <button onClick={process} className="action-btn">
                            Remove Duplicates <ArrowRight size={20} />
                        </button>
                    </div>

                    <div className="col">
                        <div className="header">
                            <label>Cleaned List</label>
                            <span className="badge success">{stats.distinct} Lines</span>
                        </div>
                        <textarea
                            value={output}
                            readOnly
                            placeholder="Result..."
                        />
                    </div>
                </div>

                {stats.removed > 0 && (
                    <div className="stats-bar">
                        Removed <strong>{stats.removed}</strong> duplicate lines.
                    </div>
                )}

                <div className="footer-actions">
                    <button onClick={() => navigator.clipboard.writeText(output)} className="btn copy"><Copy size={18} /> Copy Result</button>
                    <button onClick={clear} className="btn clear"><Trash2 size={18} /> Clear</button>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 1000px; margin: 0 auto; }
                .card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); }
                
                .grid-cols { display: grid; grid-template-columns: 1fr 200px 1fr; gap: 1.5rem; align-items: start; }
                
                .col { display: flex; flex-direction: column; gap: 0.5rem; }
                .header { display: flex; justify-content: space-between; align-items: center; }
                label { font-weight: 700; color: var(--secondary); font-size: 0.9rem; }
                .badge { background: var(--border); padding: 0.2rem 0.6rem; border-radius: 99px; font-size: 0.8rem; font-weight: 600; }
                .badge.success { background: #dcfce7; color: #166534; }
                
                textarea { height: 400px; padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); resize: none; font-size: 0.95rem; line-height: 1.5; white-space: pre; overflow-x: auto; }
                textarea:focus { border-color: var(--primary); outline: none; }

                .mid-col { padding-top: 100px; display: flex; flex-direction: column; gap: 1rem; align-items: center; }
                
                .action-btn { background: var(--primary); color: white; padding: 1rem 1.5rem; border-radius: 0.75rem; font-weight: 700; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; width: 100%; transition: transform 0.2s; text-align: center; }
                .action-btn:hover { transform: translateY(-2px); box-shadow: var(--shadow); }

                .checkbox { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; user-select: none; }
                
                .stats-bar { margin-top: 2rem; text-align: center; color: var(--secondary); background: var(--background); padding: 0.75rem; border-radius: 0.75rem; }

                .footer-actions { margin-top: 2rem; display: flex; justify-content: flex-end; gap: 1rem; }
                .btn { padding: 0.75rem 1.25rem; border-radius: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; border: none; cursor: pointer; }
                .btn.copy { background: #e0f2fe; color: #0284c7; }
                .btn.copy:hover { background: #bae6fd; }
                .btn.clear { background: #fee2e2; color: #ef4444; }
                .btn.clear:hover { background: #fecaca; }

                @media(max-width: 850px) {
                    .grid-cols { grid-template-columns: 1fr; }
                    .mid-col { padding-top: 0; flex-direction: row; justify-content: space-between; }
                    textarea { height: 200px; }
                }
            `}</style>
        </div>
    );
}
