'use client';

import { useState } from 'react';
import { Youtube, Copy, Check, AlertCircle } from 'lucide-react';

export default function YoutubeTitleExtractor() {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const extractVideoId = (input: string): string | null => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
            /youtube\.com\/embed\/([^&\n?#]+)/,
            /youtube\.com\/v\/([^&\n?#]+)/
        ];

        for (const pattern of patterns) {
            const match = input.match(pattern);
            if (match && match[1]) return match[1];
        }
        return null;
    };

    const extractTitle = async () => {
        setError('');
        setTitle('');

        const videoId = extractVideoId(url);
        if (!videoId) {
            setError('Invalid YouTube URL. Please enter a valid video link.');
            return;
        }

        setLoading(true);

        try {
            // Using oEmbed API to get video title
            const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);

            if (!response.ok) {
                throw new Error('Failed to fetch video information');
            }

            const data = await response.json();
            setTitle(data.title);
        } catch (err) {
            setError('Could not extract title. Please check the URL and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(title);
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
                        onKeyPress={(e) => e.key === 'Enter' && extractTitle()}
                    />
                    {error && (
                        <div className="error-msg">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}
                    <button onClick={extractTitle} className="extract-btn" disabled={loading || !url}>
                        {loading ? 'Extracting...' : 'Extract Title'}
                    </button>
                </div>

                {title && (
                    <div className="result-section">
                        <div className="panel-header">
                            <span>Extracted Title</span>
                            <button className="copy-btn" onClick={handleCopy}>
                                {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
                            </button>
                        </div>
                        <div className="title-display">
                            {title}
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .extractor-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 3rem; box-shadow: var(--shadow-lg); }
                
                .input-section { margin-bottom: 2rem; }
                .input-section label { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; color: var(--secondary); margin-bottom: 1rem; font-size: 0.9rem; }
                .input-section input { width: 100%; padding: 1.25rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); font-size: 1rem; }

                .extract-btn { width: 100%; margin-top: 1rem; padding: 1.25rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; transition: all 0.2s; }
                .extract-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 10px 25px var(--primary-soft); }
                .extract-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .error-msg { margin-top: 0.75rem; padding: 0.75rem; background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; border-radius: 0.75rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; }

                .result-section { background: var(--background); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2rem; }
                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; font-size: 0.75rem; font-weight: 800; color: var(--secondary); text-transform: uppercase; }
                .title-display { font-size: 1.25rem; font-weight: 700; color: var(--foreground); line-height: 1.6; }

                .copy-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--primary-soft); color: var(--primary); border-radius: 0.6rem; font-weight: 700; }
            `}</style>
        </div>
    );
}
