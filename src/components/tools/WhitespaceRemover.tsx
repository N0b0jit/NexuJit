'use client';

import { useState } from 'react';
import { Trash2, Copy, Eraser, AlignLeft } from 'lucide-react';

export default function WhitespaceRemover() {
    const [text, setText] = useState('');
    const [stats, setStats] = useState({ before: 0, after: 0 });

    const cleanText = (type: 'all' | 'extra' | 'lines') => {
        let cleaned = text;
        const before = text.length;

        if (type === 'all') {
            cleaned = text.replace(/\s+/g, ' ').trim();
        } else if (type === 'extra') {
            cleaned = text.replace(/[ \t]+/g, ' ').trim();
        } else if (type === 'lines') {
            cleaned = text.split('\n').map(line => line.trim()).filter(line => line !== '').join('\n');
        }

        setText(cleaned);
        setStats({ before, after: cleaned.length });
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="tool-ui">
            <div className="stats-row">
                <div className="stat">
                    <span className="label">Characters Before:</span>
                    <span className="value">{stats.before}</span>
                </div>
                <div className="stat">
                    <span className="label">Characters After:</span>
                    <span className="value">{stats.after}</span>
                </div>
                <div className="stat">
                    <span className="label">Saved:</span>
                    <span className="value success">{Math.max(0, stats.before - stats.after)}</span>
                </div>
            </div>

            <div className="editor-container">
                <textarea
                    placeholder="Paste text with excessive whitespace here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>

            <div className="controls">
                <button onClick={() => cleanText('all')} className="action-btn">
                    <Eraser size={16} /> Remove All Extra Spaces & Newlines
                </button>
                <button onClick={() => cleanText('extra')} className="action-btn">
                    <AlignLeft size={16} /> Simplify Horizontal Spaces
                </button>
                <button onClick={() => cleanText('lines')} className="action-btn">
                    <Trash2 size={16} /> Remove Empty Lines
                </button>
                <button onClick={handleCopy} className="action-btn secondary">
                    <Copy size={16} /> Copy Result
                </button>
            </div>

            <style jsx>{`
                .tool-ui {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .stats-row {
                    display: flex;
                    gap: 2rem;
                    background: var(--card-bg, #f8f9fa);
                    padding: 1rem 1.5rem;
                    border-radius: 0.75rem;
                    border: 1px solid var(--border);
                }
                .stat {
                    display: flex;
                    flex-direction: column;
                }
                .stat .label {
                    font-size: 0.75rem;
                    color: var(--secondary);
                    text-transform: uppercase;
                    font-weight: 600;
                }
                .stat .value {
                    font-size: 1.25rem;
                    font-weight: 700;
                }
                .success { color: #10b981; }
                .editor-container textarea {
                    width: 100%;
                    min-height: 300px;
                    padding: 1.5rem;
                    border-radius: 1rem;
                    border: 2px solid var(--border);
                    background: var(--surface);
                    font-family: monospace;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                .controls {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                }
                .action-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    transition: all 0.2s;
                    background: var(--primary);
                    color: white;
                    font-size: 0.875rem;
                }
                .action-btn.secondary {
                    background: var(--border);
                    color: var(--foreground);
                }
                .action-btn:hover {
                    opacity: 0.9;
                }
            `}</style>
        </div>
    );
}
