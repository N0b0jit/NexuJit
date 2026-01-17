'use client';

import { useState, useEffect } from 'react';
import { Link as LinkIcon, Copy, Check, Hash } from 'lucide-react';

export default function TextToSlug() {
    const [text, setText] = useState('');
    const [slug, setSlug] = useState('');
    const [separator, setSeparator] = useState('-');
    const [lowercase, setLowercase] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        generateSlug();
    }, [text, separator, lowercase]);

    const generateSlug = () => {
        if (!text) {
            setSlug('');
            return;
        }

        let result = text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .trim()
            .replace(/\s+/g, separator) // Replace spaces with separator
            .replace(new RegExp(`${separator}+`, 'g'), separator); // Remove duplicate separators

        if (lowercase) {
            result = result.toLowerCase();
        }

        setSlug(result);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(slug);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="slug-card">
                <div className="input-section">
                    <label><LinkIcon size={18} /> Text to Convert</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter your text here..."
                        rows={4}
                    />
                </div>

                <div className="options-section">
                    <div className="option-group">
                        <label>Separator</label>
                        <select value={separator} onChange={(e) => setSeparator(e.target.value)}>
                            <option value="-">Hyphen (-)</option>
                            <option value="_">Underscore (_)</option>
                            <option value=".">Dot (.)</option>
                        </select>
                    </div>

                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={lowercase}
                            onChange={(e) => setLowercase(e.target.checked)}
                        />
                        <span>Convert to lowercase</span>
                    </label>
                </div>

                <div className="result-section">
                    <div className="panel-header">
                        <span>URL-Friendly Slug</span>
                        {slug && (
                            <button className="copy-btn" onClick={handleCopy}>
                                {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
                            </button>
                        )}
                    </div>
                    <div className="slug-display">
                        {slug || 'your-url-slug-will-appear-here'}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .slug-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 3rem; box-shadow: var(--shadow-lg); }
                
                .input-section { margin-bottom: 2rem; }
                .input-section label { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; color: var(--secondary); margin-bottom: 1rem; font-size: 0.9rem; }
                .input-section textarea { width: 100%; padding: 1.25rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); font-size: 1rem; line-height: 1.6; resize: none; color: var(--foreground); }

                .options-section { display: flex; align-items: center; gap: 2rem; margin-bottom: 2.5rem; padding: 1.5rem; background: var(--background); border-radius: 1rem; }
                .option-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .option-group label { font-size: 0.75rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; }
                .option-group select { padding: 0.75rem; border-radius: 0.5rem; border: 1px solid var(--border); background: var(--surface); font-weight: 600; }
                
                .checkbox-item { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; font-weight: 600; color: var(--secondary); }
                .checkbox-item input { width: 18px; height: 18px; accent-color: var(--primary); }

                .result-section { background: var(--background); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2rem; }
                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; font-size: 0.75rem; font-weight: 800; color: var(--secondary); text-transform: uppercase; }
                .slug-display { font-family: 'Courier New', monospace; font-size: 1.25rem; font-weight: 700; color: var(--primary); word-break: break-all; line-height: 1.6; padding: 1rem; background: var(--surface); border-radius: 0.75rem; }

                .copy-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--primary-soft); color: var(--primary); border-radius: 0.6rem; font-weight: 700; }
            `}</style>
        </div>
    );
}
