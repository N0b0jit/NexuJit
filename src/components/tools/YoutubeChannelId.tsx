'use client';

import { useState } from 'react';
import { Youtube, Copy, Check, AlertCircle, Search } from 'lucide-react';

export default function YoutubeChannelId() {
    const [url, setUrl] = useState('');
    const [channelId, setChannelId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const findChannelId = async () => {
        setError('');
        setChannelId('');
        if (!url.trim()) return;

        setLoading(true);
        // Basic pattern matching first
        if (url.includes('/channel/')) {
            const match = url.match(/\/channel\/([a-zA-Z0-9_-]+)/);
            if (match && match[1]) {
                setChannelId(match[1]);
                setLoading(false);
                return;
            }
        }

        // For custom URLs or handles, we would need API. 
        // For this demo, we'll try to fetch the page or use oEmbed if applicable (oEmbed doesn't give channel ID usually)
        // We'll simulate extraction or return an error stating API limit.
        // Actually, let's try a regex for generic patterns or assume it's a channel URL.

        // Simulated response for handles (since we can't scrape client-side easily due to CORS)
        // If it's a handle like @username
        if (url.includes('@')) {
            // Mocking a successful ID for demonstration if we can't hit an API
            // In production, you'd hit your backend which scrapes or uses YT Data API
            setError('To find ID from Handle (@), we need YouTube API access. If checking a /channel/ URL, we can extract it directly.');
        } else {
            setError('Could not extract Channel ID. Please ensure URL format is https://www.youtube.com/channel/ID');
        }

        setLoading(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(channelId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="finder-card">
                <div className="input-section">
                    <label><Youtube size={18} /> YouTube Channel URL</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://www.youtube.com/channel/..."
                        />
                        <button onClick={findChannelId} className="find-btn" disabled={loading || !url}>
                            {loading ? 'Finding...' : <><Search size={20} /> Find ID</>}
                        </button>
                    </div>
                </div>

                {error && <div className="error-msg"><AlertCircle size={16} /> {error}</div>}

                {channelId ? (
                    <div className="result-section">
                        <div className="id-box">
                            <span className="label">Channel ID:</span>
                            <span className="value">{channelId}</span>
                        </div>
                        <button className="copy-btn" onClick={handleCopy}>
                            {copied ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                    </div>
                ) : (
                    <div className="instructions">
                        <h4>How to find your ID:</h4>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                <span>Paste a direct channel URL: <code>youtube.com/channel/UC...</code></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                <span>For handles (e.g., <code>@username</code>), use the <b>Find ID</b> button to attempt extraction.</span>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .finder-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 3rem; box-shadow: var(--shadow-lg); }
                .input-section label { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; color: var(--secondary); margin-bottom: 1rem; }
                .input-wrapper { display: flex; gap: 1rem; flex-direction: column; }
                @media(min-width: 640px) { .input-wrapper { flex-direction: row; } }
                
                input { flex: 1; padding: 1.25rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); font-size: 1.1rem; }
                .find-btn { padding: 1.25rem 2rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; justify-content: center; min-width: 150px; }
                .find-btn:disabled { opacity: 0.7; }

                .error-msg { margin-top: 1.5rem; padding: 1rem; background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; border-radius: 1rem; display: flex; align-items: center; gap: 0.5rem; }

                .result-section { margin-top: 2rem; padding: 2rem; background: var(--background); border-radius: 1.5rem; border: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
                .id-box { display: flex; flex-direction: column; gap: 0.5rem; }
                .id-box .label { font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: var(--secondary); }
                .id-box .value { font-size: 1.5rem; font-weight: 800; color: var(--primary); font-family: monospace; }
                
                .copy-btn { padding: 1rem; background: var(--surface); border: 2px solid var(--border); border-radius: 1rem; color: var(--secondary); transition: all 0.2s; }
                .copy-btn:hover { border-color: var(--primary); color: var(--primary); }

                .instructions { margin-top: 2rem; padding: 1.5rem; background: var(--background); border-radius: 1rem; }
                .instructions h4 { margin-top: 0; color: var(--secondary); margin-bottom: 1rem; }
                .instructions ul { padding-left: 1.5rem; color: var(--secondary); margin-bottom: 0; }
                .instructions li { marginBottom: 0.5rem; }
            `}</style>
        </div>
    );
}
