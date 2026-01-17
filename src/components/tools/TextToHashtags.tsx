'use client';

import { useState } from 'react';
import { Hash, Copy, Check } from 'lucide-react';

export default function TextToHashtags() {
    const [text, setText] = useState('');
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    const generateHashtags = () => {
        if (!text.trim()) {
            setHashtags([]);
            return;
        }

        const words = text
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2);

        const uniqueWords = [...new Set(words)];
        const tags = uniqueWords.map(word => `#${word}`);

        setHashtags(tags);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(hashtags.join(' '));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="hashtag-layout">
                <div className="input-panel">
                    <label>Enter Text</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter your text here..."
                        rows={6}
                    />
                    <button onClick={generateHashtags} className="generate-btn">
                        Generate Hashtags
                    </button>
                </div>

                <div className="result-panel">
                    <div className="panel-header">
                        <span>Generated Hashtags ({hashtags.length})</span>
                        {hashtags.length > 0 && (
                            <button className="copy-btn" onClick={handleCopy}>
                                {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy All</>}
                            </button>
                        )}
                    </div>
                    <div className="hashtags-container">
                        {hashtags.map((tag, i) => (
                            <span key={i} className="hashtag">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 900px; margin: 0 auto; }
                .hashtag-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; }
                @media (min-width: 768px) { .hashtag-layout { grid-template-columns: 1fr 1fr; } }

                .input-panel { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); }
                .input-panel label { display: block; font-weight: 700; color: var(--secondary); margin-bottom: 1rem; }
                textarea { width: 100%; padding: 1.25rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); resize: none; }
                .generate-btn { width: 100%; margin-top: 1rem; padding: 1rem; background: var(--primary); color: white; border-radius: 0.75rem; font-weight: 700; }

                .result-panel { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); }
                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; font-weight: 800; color: var(--secondary); font-size: 0.85rem; }
                .hashtags-container { display: flex; flex-wrap: wrap; gap: 0.75rem; min-height: 200px; }
                .hashtag { padding: 0.5rem 1rem; background: var(--primary-soft); color: var(--primary); border-radius: 9999px; font-weight: 700; font-size: 0.9rem; }
                .copy-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--primary-soft); color: var(--primary); border-radius: 0.5rem; font-weight: 700; font-size: 0.85rem; }
            `}</style>
        </div>
    );
}
