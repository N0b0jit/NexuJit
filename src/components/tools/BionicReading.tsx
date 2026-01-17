'use client';

import { useState, useMemo } from 'react';
import { Download, Copy, RefreshCw, Eye } from 'lucide-react';

export default function BionicReading() {
    const [text, setText] = useState('Bionic Reading is a new method facilitating the reading process by guiding the eyes through text with artificial fixation points. With this method, the eye is guided through the text and you can read faster and more focused.');
    const [fixationStrength, setFixationStrength] = useState(0.4);

    const bionicText = useMemo(() => {
        if (!text) return null;

        return text.split('\n').map((paragraph, pIdx) => (
            <p key={pIdx} style={{ marginBottom: '1rem' }}>
                {paragraph.split(' ').map((word, wIdx) => {
                    if (word.length <= 1) return <span key={wIdx}>{word} </span>;

                    const mid = Math.ceil(word.length * fixationStrength);
                    const boldPart = word.substring(0, mid);
                    const restPart = word.substring(mid);

                    return (
                        <span key={wIdx}>
                            <b style={{ fontWeight: 700 }}>{boldPart}</b>
                            <span>{restPart}</span>
                            {' '}
                        </span>
                    );
                })}
            </p>
        ));
    }, [text, fixationStrength]);

    const handleCopy = () => {
        // Copying formatted text is hard, so we just copy plain text or suggest using it
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="tool-ui">
            <div className="controls">
                <div className="control-group">
                    <label>Fixation Strength: {Math.round(fixationStrength * 100)}%</label>
                    <input
                        type="range"
                        min="0.1" max="0.8" step="0.1"
                        value={fixationStrength}
                        onChange={(e) => setFixationStrength(parseFloat(e.target.value))}
                    />
                </div>
            </div>

            <div className="editor-grid">
                <div className="input-side">
                    <div className="label-bar">Input Text</div>
                    <textarea
                        placeholder="Paste your text here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                <div className="output-side">
                    <div className="label-bar"><Eye size={14} /> Bionic Preview</div>
                    <div className="bionic-preview">
                        {bionicText}
                    </div>
                </div>
            </div>

            <div className="actions">
                <button onClick={handleCopy} className="action-btn">
                    <Copy size={16} /> Copy Original Text
                </button>
                <button onClick={() => window.print()} className="action-btn secondary">
                    <Download size={16} /> Print/Save as PDF
                </button>
            </div>

            <style jsx>{`
                .tool-ui {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .controls {
                    background: var(--card-bg, #f8f9fa);
                    padding: 1.5rem;
                    border-radius: 1rem;
                    border: 1px solid var(--border);
                }
                .control-group {
                    max-width: 300px;
                }
                .control-group label {
                    display: block;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }
                .editor-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                    min-height: 400px;
                }
                .label-bar {
                    background: var(--background);
                    padding: 0.5rem 1rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    border-bottom: 1px solid var(--border);
                    border-radius: 0.75rem 0.75rem 0 0;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .input-side textarea {
                    width: 100%;
                    height: calc(100% - 30px);
                    padding: 1.5rem;
                    border: 1px solid var(--border);
                    border-top: none;
                    border-radius: 0 0 0.75rem 0.75rem;
                    resize: none;
                    font-family: inherit;
                    font-size: 1rem;
                    line-height: 1.6;
                }
                .output-side {
                    background: white;
                    border: 1px solid var(--border);
                    border-radius: 0.75rem;
                    display: flex;
                    flex-direction: column;
                }
                .bionic-preview {
                    padding: 1.5rem;
                    flex-grow: 1;
                    overflow-y: auto;
                    font-size: 1.1rem;
                    line-height: 1.8;
                    color: #333;
                }
                .actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }
                .action-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .action-btn:not(.secondary) {
                    background: var(--primary);
                    color: white;
                }
                .action-btn.secondary {
                    background: var(--border);
                    color: var(--foreground);
                }
                @media (max-width: 768px) {
                    .editor-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
