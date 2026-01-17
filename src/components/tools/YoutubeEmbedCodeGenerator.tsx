'use client';

import { useState } from 'react';
import { Link as LinkIcon, Copy, Check } from 'lucide-react';

export default function YoutubeEmbedCodeGenerator() {
    const [url, setUrl] = useState('');
    const [width, setWidth] = useState('560');
    const [height, setHeight] = useState('315');
    const [embedCode, setEmbedCode] = useState('');
    const [copied, setCopied] = useState(false);

    const extractVideoId = (input: string): string | null => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        ];
        for (const pattern of patterns) {
            const match = input.match(pattern);
            if (match && match[1]) return match[1];
        }
        return null;
    };

    const generateEmbed = () => {
        const videoId = extractVideoId(url);
        if (!videoId) return;

        const code = `<iframe width="${width}" height="${height}" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        setEmbedCode(code);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="generator-card">
                <div className="input-section">
                    <div className="input-group">
                        <label>YouTube Video URL</label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => { setUrl(e.target.value); generateEmbed(); }}
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                    </div>

                    <div className="size-inputs">
                        <div className="input-group">
                            <label>Width (px)</label>
                            <input
                                type="number"
                                value={width}
                                onChange={(e) => { setWidth(e.target.value); generateEmbed(); }}
                            />
                        </div>
                        <div className="input-group">
                            <label>Height (px)</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => { setHeight(e.target.value); generateEmbed(); }}
                            />
                        </div>
                    </div>
                </div>

                {embedCode && (
                    <div className="result-section">
                        <div className="panel-header">
                            <span>Embed Code</span>
                            <button className="copy-btn" onClick={handleCopy}>
                                {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
                            </button>
                        </div>
                        <textarea value={embedCode} readOnly rows={4} />

                        <div className="preview-section">
                            <label>Preview:</label>
                            <div dangerouslySetInnerHTML={{ __html: embedCode }} />
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 900px; margin: 0 auto; }
                .generator-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 3rem; box-shadow: var(--shadow-lg); }
                .input-section { margin-bottom: 2rem; }
                .input-group { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }
                .input-group label { font-weight: 700; color: var(--secondary); font-size: 0.9rem; }
                .input-group input { padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); }
                .size-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .result-section { background: var(--background); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2rem; }
                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-weight: 800; color: var(--secondary); }
                textarea { width: 100%; padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--surface); resize: none; font-family: monospace; font-size: 0.85rem; }
                .copy-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--primary-soft); color: var(--primary); border-radius: 0.6rem; font-weight: 700; }
                .preview-section { margin-top: 2rem; }
                .preview-section label { display: block; font-weight: 700; color: var(--secondary); margin-bottom: 1rem; }
            `}</style>
        </div>
    );
}
