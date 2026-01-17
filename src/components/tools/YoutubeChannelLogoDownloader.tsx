'use client';

import { useState, useEffect } from 'react';
import { Youtube, Search, Download, AlertCircle, Key, Image as ImageIcon } from 'lucide-react';

export default function YoutubeChannelLogoDownloader() {
    const [input, setInput] = useState('');
    const [channelInfo, setChannelInfo] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [showKeyInput, setShowKeyInput] = useState(false);

    useEffect(() => {
        const savedKey = localStorage.getItem('youtube_api_key');
        if (savedKey) setApiKey(savedKey);
    }, []);

    const saveApiKey = (key: string) => {
        setApiKey(key);
        localStorage.setItem('youtube_api_key', key);
    };

    const fetchChannelLogo = async () => {
        setError('');
        setChannelInfo(null);
        if (!input) return;

        // We need an API key for robust channel resolution
        if (!apiKey) {
            setError('This tool requires a YouTube Data API Key to resolve channel logos reliably.');
            setShowKeyInput(true);
            return;
        }

        setLoading(true);

        try {
            // Determine if input is ID or Handle
            let apiUrl = '';

            // Regex for Channel ID (UC...)
            const idMatch = input.match(/(UC[\w-]{21}[AQgw])/);

            // Regex for Handle (@...)
            const handleMatch = input.match(/@([\w\-\.]+)/);

            if (idMatch) {
                apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${idMatch[1]}&key=${apiKey}`;
            } else if (handleMatch) {
                apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&forHandle=${handleMatch[1]}&key=${apiKey}`;
            } else {
                // Try search if not obvious? Or assume username?
                // Let's assume input needs to be reasonably specific or search
                apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(input)}&key=${apiKey}`;
            }

            const res = await fetch(apiUrl);
            const data = await res.json();

            if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch data');
            if (!data.items || data.items.length === 0) throw new Error('Channel not found.');

            const item = data.items[0];
            // If it was a search, the structure is slightly different (item.snippet.thumbnails)
            // But Channel resource also has snippet.thumbnails.

            const title = item.snippet.title || item.snippet.channelTitle;
            const thumb = item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url;

            // Get larger image by hacking the URL? 
            // YouTube avatars usually have s88-c-k-c0x00ffffff-no-rj. 
            // Replacing s88 with s800 gives high res.
            const highResUrl = thumb.replace(/s\d+(-c-k-c0x00ffffff-no-rj)?/, 's800-c-k-c0x00ffffff-no-rj');

            setChannelInfo({
                title,
                url: highResUrl
            });

        } catch (err: any) {
            setError(err.message || 'Error fetching channel data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tool-content">
            <div className="api-section">
                <button className="key-toggle" onClick={() => setShowKeyInput(!showKeyInput)}>
                    <Key size={16} /> {apiKey ? 'Update API Key' : 'Add YouTube API Key (Required)'}
                </button>
                {showKeyInput && (
                    <div className="key-input">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => saveApiKey(e.target.value)}
                            placeholder="Paste YouTube Data API Key..."
                        />
                        <p className="help">Get a free key from Google Cloud Console</p>
                    </div>
                )}
            </div>

            <div className="input-group">
                <label>Channel URL, ID, or Handle (@User)</label>
                <div className="input-row">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g. @MrBeast or UCX6OQ..."
                    />
                    <button onClick={fetchChannelLogo} disabled={loading || !input}>
                        {loading ? 'Searching...' : 'Find Logo'}
                    </button>
                </div>
            </div>

            {error && <div className="error-msg"><AlertCircle size={16} /> {error}</div>}

            {channelInfo && (
                <div className="result-card">
                    <h3>{channelInfo.title}</h3>
                    <div className="preview-img">
                        <img src={channelInfo.url} alt="Channel Logo" />
                    </div>
                    <a href={channelInfo.url} download target="_blank" rel="noreferrer" className="download-btn">
                        <Download size={20} /> Download High-Res Logo
                    </a>
                </div>
            )}

            <style jsx>{`
                .tool-content { max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }
                .api-section { border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
                .key-toggle { background: none; border: none; font-size: 0.9rem; color: var(--primary); font-weight: 600; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
                .key-input { margin-top: 1rem; }
                .key-input input { width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid var(--border); }
                .help { font-size: 0.8rem; color: var(--secondary); margin-top: 0.5rem; }

                .input-group label { display: block; font-weight: 600; margin-bottom: 0.75rem; }
                .input-row { display: flex; gap: 1rem; }
                input[type="text"] { flex: 1; padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); }
                button { padding: 0 2rem; background: var(--primary); color: white; border-radius: 0.75rem; font-weight: 600; }
                button:disabled { opacity: 0.6; }

                .error-msg { background: #fee2e2; color: #dc2626; padding: 1rem; border-radius: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }

                .result-card {
                    background: var(--surface);
                    padding: 2rem;
                    border-radius: 1.5rem;
                    border: 1px solid var(--border);
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                }
                .preview-img { width: 200px; height: 200px; border-radius: 50%; overflow: hidden; border: 4px solid var(--border); }
                .preview-img img { width: 100%; height: 100%; object-fit: cover; }
                .download-btn { padding: 1rem 2rem; background: var(--primary); color: white; border-radius: 0.75rem; display: flex; align-items: center; gap: 0.5rem; font-weight: 600; }
            `}</style>
        </div>
    );
}
