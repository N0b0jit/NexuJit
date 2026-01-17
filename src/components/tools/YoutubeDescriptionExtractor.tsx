'use client';

import { useState } from 'react';
import { Youtube, Copy, Check, AlertCircle } from 'lucide-react';

export default function YoutubeDescriptionExtractor() {
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const extractVideoId = (input: string): string | null => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
            /youtube\.com\/embed\/([^&\n?#]+)/,
        ];
        for (const pattern of patterns) {
            const match = input.match(pattern);
            if (match && match[1]) return match[1];
        }
        return null;
    };

    const extractDescription = async () => {
        setError('');
        setDescription('');

        const videoId = extractVideoId(url);
        if (!videoId) {
            setError('Invalid YouTube URL');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setDescription(data.author_name + '\n\nNote: Full description requires YouTube Data API. This shows channel name.');
        } catch (err) {
            setError('Could not extract description. Please check the URL.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(description);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="extractor-card">
                <div className="input-section">
                    <label><Youtube size={18} /> YouTube Video URL</label>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                    {error && <div className="error-msg"><AlertCircle size={16} /> {error}</div>}
                    <button onClick={extractDescription} className="extract-btn" disabled={loading || !url}>
                        {loading ? 'Extracting...' : 'Extract Description'}
                    </button>
                </div>

                {description && (
                    <div className="result-section">
                        <div className="panel-header">
                            <span>Channel Info</span>
                            <button className="copy-btn" onClick={handleCopy}>
                                {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
                            </button>
                        </div>
                        <textarea value={description} readOnly rows={8} />
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .extractor-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 3rem; box-shadow: var(--shadow-lg); }
                .input-section label { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; color: var(--secondary); margin-bottom: 1rem; }
                .input-section input { width: 100%; padding: 1.25rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); }
                .extract-btn { width: 100%; margin-top: 1rem; padding: 1.25rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; }
                .extract-btn:disabled { opacity: 0.5; }
                .error-msg { margin-top: 0.75rem; padding: 0.75rem; background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; border-radius: 0.75rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; }
                .result-section { background: var(--background); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2rem; margin-top: 2rem; }
                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-weight: 800; color: var(--secondary); }
                textarea { width: 100%; padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--surface); resize: none; }
                .copy-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--primary-soft); color: var(--primary); border-radius: 0.6rem; font-weight: 700; }
            `}</style>
        </div>
    );
}
