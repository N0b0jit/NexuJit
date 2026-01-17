'use client';

import { useState } from 'react';
import { Search, Globe, AlertCircle, ExternalLink } from 'lucide-react';

export default function GoogleCacheChecker() {
    const [url, setUrl] = useState('');

    const handleCheck = () => {
        if (!url) return;
        const encodedUrl = encodeURIComponent(url);
        window.open(`http://webcache.googleusercontent.com/search?q=cache:${encodedUrl}`, '_blank');
    };

    return (
        <div className="tool-content">
            <div className="card">
                <div className="input-group">
                    <label>Enter URL to Check Cache</label>
                    <div className="input-row">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                        />
                        <button onClick={handleCheck} disabled={!url}>
                            <Search size={18} /> Check Cache
                        </button>
                    </div>
                </div>

                <div className="info-box">
                    <AlertCircle size={20} />
                    <p>This will open Google's cached version of the URL in a new tab. If the page is not in Google's cache, you will see a 404 error from Google.</p>
                </div>
            </div>

            <style jsx>{`
                .card {
                    background: var(--surface);
                    padding: 2rem;
                    border-radius: 1.5rem;
                    border: 1px solid var(--border);
                    max-width: 600px;
                    margin: 0 auto;
                }
                .input-group { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
                .input-group label { font-weight: 600; color: var(--secondary); }
                .input-row { display: flex; gap: 1rem; }
                input {
                    flex: 1;
                    padding: 1rem;
                    border: 2px solid var(--border);
                    border-radius: 0.75rem;
                    background: var(--background);
                }
                button {
                    padding: 1rem 2rem;
                    background: var(--primary);
                    color: white;
                    border-radius: 0.75rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    white-space: nowrap;
                }
                button:disabled { opacity: 0.6; cursor: not-allowed; }
                .info-box {
                    background: var(--background);
                    padding: 1.5rem;
                    border-radius: 1rem;
                    display: flex;
                    gap: 1rem;
                    align-items: flex-start;
                    color: var(--secondary);
                }
                @media (max-width: 640px) { .input-row { flex-direction: column; } }
            `}</style>
        </div>
    );
}
