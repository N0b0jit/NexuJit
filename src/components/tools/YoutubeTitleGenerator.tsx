'use client';

import { useState } from 'react';
import { Type, Copy, Check, Wand2 } from 'lucide-react';

export default function YoutubeTitleGenerator() {
    const [topic, setTopic] = useState('');
    const [titles, setTitles] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const generateTitles = () => {
        if (!topic.trim()) return;
        setLoading(true);

        setTimeout(() => {
            const templates = [
                `How to Master ${topic} in 2026`,
                `${topic}: The Ultimate Guide for Beginners`,
                `10 ${topic} Secrets No One Tells You`,
                `Why ${topic} Will Change Your Life`,
                `Stop Making These ${topic} Mistakes!`,
                `${topic} Tutorial: Step-by-Step Walkthrough`,
                `The Truth About ${topic} Revealed`,
                `Best ${topic} Strategies for Fast Results`,
                `I Tried ${topic} for 30 Days (Results)`,
                `${topic} Explained in 5 Minutes`
            ];

            setTitles(templates);
            setLoading(false);
        }, 800);
    };

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="generator-card">
                <div className="input-section">
                    <label><Type size={18} /> Video Topic / Keyword</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && generateTitles()}
                            placeholder="e.g., Python Programming"
                        />
                        <button onClick={generateTitles} className="generate-btn" disabled={loading || !topic}>
                            {loading ? 'Generating...' : <><Wand2 size={18} /> Generate Titles</>}
                        </button>
                    </div>
                </div>

                {titles.length > 0 && (
                    <div className="results-list">
                        <h3>Generated Catchy Titles</h3>
                        {titles.map((title, index) => (
                            <div key={index} className="title-item">
                                <span className="title-text">{title}</span>
                                <button className="copy-icon-btn" onClick={() => handleCopy(title, index)} title="Copy Title">
                                    {copiedIndex === index ? <Check size={18} color="var(--primary)" /> : <Copy size={18} />}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .generator-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 3rem; box-shadow: var(--shadow-lg); }
                .input-section label { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; color: var(--secondary); margin-bottom: 1rem; }
                .input-wrapper { display: flex; gap: 1rem; flex-direction: column; }
                @media(min-width: 640px) { .input-wrapper { flex-direction: row; } }
                input { flex: 1; padding: 1.25rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); font-size: 1.1rem; }
                .generate-btn { padding: 1.25rem 2rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; justify-content: center; min-width: 180px; }
                .generate-btn:disabled { opacity: 0.7; }

                .results-list { margin-top: 2.5rem; }
                .results-list h3 { margin-bottom: 1.5rem; font-size: 1.1rem; color: var(--secondary); border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
                .title-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--background); border-radius: 0.75rem; margin-bottom: 0.75rem; border: 1px solid var(--border); transition: all 0.2s; }
                .title-item:hover { border-color: var(--primary); transform: translateX(5px); }
                .title-text { font-weight: 600; font-size: 1.05rem; color: var(--foreground); }
                .copy-icon-btn { padding: 0.5rem; color: var(--secondary); border-radius: 0.5rem; transition: background 0.2s; }
                .copy-icon-btn:hover { background: var(--surface); color: var(--primary); }
            `}</style>
        </div>
    );
}
