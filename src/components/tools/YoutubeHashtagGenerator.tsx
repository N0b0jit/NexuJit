'use client';

import { useState } from 'react';
import { Hash, Copy, Check, Wand2 } from 'lucide-react';

export default function YoutubeHashtagGenerator() {
    const [keyword, setKeyword] = useState('');
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateHashtags = async () => {
        if (!keyword.trim()) return;
        setLoading(true);

        // Simulating API call or logic to generate relevant hashtags
        // In a real app with AI integration, this would call the AI endpoint.
        // For now, we'll use a local logic based on the keyword.

        setTimeout(() => {
            const baseTags = [
                `#${keyword.replace(/\s+/g, '')}`,
                `#${keyword.replace(/\s+/g, '')}Tutorial`,
                `#${keyword.replace(/\s+/g, '')}Tips`,
                `#${keyword.replace(/\s+/g, '')}2026`,
                `#Best${keyword.replace(/\s+/g, '')}`,
                `#${keyword.replace(/\s+/g, '')}Guide`,
                `#${keyword.replace(/\s+/g, '')}ForBeginners`,
                `#HowTo${keyword.replace(/\s+/g, '')}`,
                `#${keyword.replace(/\s+/g, '')}Review`,
                `#${keyword.replace(/\s+/g, '')}Skills`
            ];
            setHashtags(baseTags);
            setLoading(false);
        }, 1000);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(hashtags.join(' '));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="generator-card">
                <div className="input-section">
                    <label><Hash size={18} /> Main Keyword / Topic</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && generateHashtags()}
                            placeholder="e.g., Digital Marketing"
                        />
                        <button onClick={generateHashtags} className="generate-btn" disabled={loading || !keyword}>
                            {loading ? <div className="spinner" /> : <Wand2 size={20} />}
                            {loading ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                </div>

                {hashtags.length > 0 && (
                    <div className="result-section">
                        <div className="panel-header">
                            <span>Generated Hashtags</span>
                            <button className="copy-btn" onClick={handleCopy}>
                                {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy All</>}
                            </button>
                        </div>
                        <div className="tags-container">
                            {hashtags.map((tag, i) => (
                                <span key={i} className="tag-chip">{tag}</span>
                            ))}
                        </div>
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
                .generate-btn { padding: 1.25rem 2rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; justify-content: center; min-width: 160px; }
                .generate-btn:disabled { opacity: 0.7; }

                .result-section { background: var(--background); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2rem; margin-top: 2rem; }
                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .tags-container { display: flex; flex-wrap: wrap; gap: 0.75rem; }
                .tag-chip { padding: 0.75rem 1.25rem; background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; font-weight: 600; color: var(--foreground); cursor: pointer; transition: all 0.2s; }
                .tag-chip:hover { border-color: var(--primary); color: var(--primary); transform: translateY(-2px); }
                .copy-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--primary-soft); color: var(--primary); border-radius: 0.6rem; font-weight: 700; }
                
                .spinner { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
