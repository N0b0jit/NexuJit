'use client';

import { useState } from 'react';
import { Youtube, Tag, Copy, Check, Sparkles, TrendingUp } from 'lucide-react';

export default function YoutubeTagGenerator() {
    const [topic, setTopic] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    const generateTags = () => {
        if (!topic.trim()) return;

        // Generate relevant tags based on the topic
        const baseTags = [
            topic.toLowerCase(),
            `${topic} tutorial`,
            `how to ${topic}`,
            `${topic} tips`,
            `${topic} guide`,
            `${topic} for beginners`,
            `best ${topic}`,
            `${topic} 2026`,
            `${topic} explained`,
            `${topic} review`,
            `learn ${topic}`,
            `${topic} step by step`,
            `${topic} tricks`,
            `${topic} hacks`,
            `${topic} secrets`
        ];

        setTags(baseTags);
    };

    const handleCopy = () => {
        const tagString = tags.join(', ');
        navigator.clipboard.writeText(tagString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="tag-layout">
                <div className="input-panel">
                    <div className="input-group">
                        <label><Youtube size={16} /> Video Topic / Keyword</label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., Digital Marketing"
                            onKeyPress={(e) => e.key === 'Enter' && generateTags()}
                        />
                    </div>
                    <button onClick={generateTags} className="generate-btn" disabled={!topic}>
                        <Sparkles size={18} /> Generate Tags
                    </button>
                </div>

                <div className="results-panel">
                    <div className="panel-header">
                        <span><Tag size={16} /> Generated Tags ({tags.length})</span>
                        {tags.length > 0 && (
                            <button className="copy-btn" onClick={handleCopy}>
                                {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy All</>}
                            </button>
                        )}
                    </div>

                    {tags.length > 0 ? (
                        <div className="tags-container">
                            {tags.map((tag, index) => (
                                <div key={index} className="tag-chip">
                                    {tag}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <TrendingUp size={48} className="ghost-icon" />
                            <p>Enter a topic to generate SEO-optimized YouTube tags</p>
                        </div>
                    )}

                    {tags.length > 0 && (
                        <div className="copy-area">
                            <label>Comma-Separated (Ready to Paste)</label>
                            <textarea
                                value={tags.join(', ')}
                                readOnly
                                rows={4}
                            />
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .tool-ui { display: flex; flex-direction: column; gap: 2rem; }
                .tag-layout { display: grid; grid-template-columns: 1fr; gap: 2.5rem; }
                @media (min-width: 1024px) { .tag-layout { grid-template-columns: 350px 1fr; } }

                .input-panel { background: var(--surface); padding: 2.5rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 1.5rem; height: fit-content; }
                .input-group { display: flex; flex-direction: column; gap: 0.75rem; }
                .input-group label { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: var(--secondary); font-size: 0.9rem; }
                .input-group input { padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); font-weight: 500; font-size: 1rem; }

                .generate-btn { padding: 1.25rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: all 0.2s; }
                .generate-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 10px 25px var(--primary-soft); }
                .generate-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; font-weight: 800; color: var(--secondary); font-size: 0.85rem; text-transform: uppercase; }
                .panel-header span { display: flex; align-items: center; gap: 0.5rem; }
                .copy-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--primary-soft); color: var(--primary); border-radius: 0.6rem; font-weight: 700; font-size: 0.85rem; }

                .tags-container { display: flex; flex-wrap: wrap; gap: 0.75rem; padding: 2rem; background: var(--background); border: 1px solid var(--border); border-radius: 1.25rem; min-height: 200px; }
                .tag-chip { padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: 9999px; font-size: 0.85rem; font-weight: 600; color: var(--foreground); transition: all 0.2s; }
                .tag-chip:hover { background: var(--primary-soft); color: var(--primary); border-color: var(--primary); }

                .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: var(--secondary); gap: 1.5rem; padding: 5rem 2rem; }
                .ghost-icon { opacity: 0.1; }

                .copy-area { margin-top: 2rem; }
                .copy-area label { display: block; font-size: 0.75rem; font-weight: 800; color: var(--secondary); margin-bottom: 0.75rem; text-transform: uppercase; }
                .copy-area textarea { width: 100%; padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--surface); font-family: monospace; font-size: 0.9rem; resize: none; }
            `}</style>
        </div>
    );
}
