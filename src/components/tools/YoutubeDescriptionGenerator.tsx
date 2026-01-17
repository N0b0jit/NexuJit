'use client';

import { useState } from 'react';
import { FileText, Copy, Check, Wand2 } from 'lucide-react';

export default function YoutubeDescriptionGenerator() {
    const [title, setTitle] = useState('');
    const [keywords, setKeywords] = useState('');
    const [links, setLinks] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateDescription = () => {
        setLoading(true);
        setTimeout(() => {
            const template = `In this video, I'm going to show you ${title}. If you're looking for more information on ${keywords.split(',')[0]}, this video is for you!

🔥 TOPICS COVERED:
${keywords.split(',').map(k => `• ${k.trim()}`).join('\n')}

Don't forget to LIKE and SUBSCRIBE for more content like this!

🔗 LINKS MENTIONED:
${links || 'No links'}

📱 FOLLOW ME ON SOCIAL MEDIA:
Instagram: @yourhandle
Twitter: @yourhandle
Facebook: @yourhandle

#${keywords.split(',')[0].replace(/\s/g, '')} #${title.split(' ')[0]} #YouTube`;

            setDescription(template);
            setLoading(false);
        }, 1000);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(description);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="generator-card">
                <div className="inputs-grid">
                    <div className="input-group">
                        <label>Video Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., How to Bake a Cake"
                        />
                    </div>

                    <div className="input-group">
                        <label>Keywords (comma separated)</label>
                        <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="baking, cake, cooking tutorial"
                        />
                    </div>

                    <div className="input-group">
                        <label>Important Links</label>
                        <textarea
                            value={links}
                            onChange={(e) => setLinks(e.target.value)}
                            placeholder="e.g., Recipe: https://..."
                            rows={3}
                        />
                    </div>

                    <button onClick={generateDescription} className="generate-btn" disabled={loading || !title}>
                        {loading ? 'Generating...' : <><Wand2 size={20} /> Generate Description</>}
                    </button>
                </div>

                {description && (
                    <div className="result-section">
                        <div className="panel-header">
                            <span>Generated Description</span>
                            <button className="copy-btn" onClick={handleCopy}>
                                {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
                            </button>
                        </div>
                        <textarea value={description} readOnly rows={15} />
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 1000px; margin: 0 auto; }
                .generator-card { display: grid; grid-template-columns: 1fr; gap: 2rem; }
                @media(min-width: 768px) { .generator-card { grid-template-columns: 1fr 1fr; } }
                
                .inputs-grid { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); height: fit-content; }
                .input-group { margin-bottom: 1.5rem; }
                .input-group label { display: block; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem; font-size: 0.9rem; }
                .input-group input, .input-group textarea { width: 100%; padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); }
                
                .generate-btn { width: 100%; padding: 1rem; background: var(--primary); color: white; border-radius: 0.75rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s; }
                .generate-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 20px var(--primary-soft); }
                .generate-btn:disabled { opacity: 0.7; }

                .result-section { background: var(--background); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); }
                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-weight: 800; color: var(--secondary); }
                .result-section textarea { width: 100%; padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--surface); resize: none; font-family: monospace; }
                .copy-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--primary-soft); color: var(--primary); border-radius: 0.6rem; font-weight: 700; }
            `}</style>
        </div>
    );
}
