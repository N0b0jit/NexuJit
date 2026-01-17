import { useState, useEffect } from 'react';
import { Youtube, Globe, AlertCircle, CheckCircle2, XCircle, Key } from 'lucide-react';

export default function YoutubeRegionRestriction() {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState<any>(null);
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

    const checkRestriction = async () => {
        setError('');
        setStatus(null);

        const videoId = extractVideoId(url);
        if (!videoId) {
            setError('Invalid YouTube URL');
            return;
        }

        setLoading(true);

        try {
            if (apiKey) {
                const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`);
                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error?.message || 'Failed to fetch from YouTube API');
                }
                const json = await response.json();
                if (!json.items || json.items.length === 0) throw new Error('Video not found.');

                const details = json.items[0].contentDetails;
                const restriction = details.regionRestriction;

                if (!restriction) {
                    setStatus({
                        isRestricted: false,
                        allowedCountries: 'All Countries',
                        blockedCountries: 'None'
                    });
                } else {
                    setStatus({
                        isRestricted: true,
                        allowedCountries: restriction.allowed ? restriction.allowed : 'All (except blocked)',
                        blockedCountries: restriction.blocked ? restriction.blocked : 'None'
                    });
                }

            } else {
                // Simulation
                setTimeout(() => {
                    const isRestricted = Math.random() > 0.7;
                    setStatus({
                        isRestricted,
                        allowedCountries: isRestricted ? ['US', 'CA', 'GB', 'AU'] : 'All Countries',
                        blockedCountries: isRestricted ? ['DE', 'FR', 'JP'] : 'None',
                        isSimulated: true
                    });
                }, 1000);
            }
        } catch (err: any) {
            setError(err.message || 'Error occurred.');
        } finally {
            // For sync/async mix in simulation
            if (apiKey) setLoading(false);
            else setTimeout(() => setLoading(false), 1000);
        }
    };

    return (
        <div className="tool-ui">
            <div className="checker-card">
                <div className="api-section">
                    <button className="key-toggle" onClick={() => setShowKeyInput(!showKeyInput)}>
                        <Key size={16} /> {apiKey ? 'Update API Key' : 'Add YouTube API Key (Recommended)'}
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

                <div className="input-section">
                    <label><Youtube size={18} /> YouTube Video URL</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                        <button onClick={checkRestriction} className="check-btn" disabled={loading || !url}>
                            {loading ? 'Checking...' : <><Globe size={20} /> Check Restrictions</>}
                        </button>
                    </div>
                </div>

                {error && <div className="error-msg"><AlertCircle size={16} /> {error}</div>}

                {status && (
                    <div className={`result-section ${status.isRestricted ? 'restricted' : 'allowed'}`}>
                        <div className="status-header">
                            {status.isRestricted ? (
                                <><XCircle size={32} /> Region Restricted</>
                            ) : (
                                <><CheckCircle2 size={32} /> Available Worldwide</>
                            )}
                        </div>

                        <div className="details-grid">
                            <div className="detail-box">
                                <span className="label">Allowed</span>
                                <span className="value">
                                    {Array.isArray(status.allowedCountries)
                                        ? status.allowedCountries.join(', ')
                                        : status.allowedCountries || 'All'}
                                </span>
                            </div>
                            <div className="detail-box">
                                <span className="label">Blocked</span>
                                <span className="value">
                                    {Array.isArray(status.blockedCountries)
                                        ? status.blockedCountries.join(', ')
                                        : status.blockedCountries || 'None'}
                                </span>
                            </div>
                        </div>

                        {status.isSimulated && (
                            <p className="demo-note warning">* Note: Simulated result. Add valid API Key for real data.</p>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .checker-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 2rem; box-shadow: var(--shadow-lg); }
                
                .api-section { margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem; }
                .key-toggle { background: none; border: none; font-size: 0.9rem; color: var(--primary); font-weight: 600; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
                .key-input { margin-top: 1rem; }
                .key-input input { width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid var(--border); background: var(--background); }
                .help { font-size: 0.8rem; color: var(--secondary); margin-top: 0.5rem; }

                .input-section label { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; color: var(--secondary); margin-bottom: 1rem; }
                .input-wrapper { display: flex; gap: 1rem; flex-direction: column; }
                @media(min-width: 640px) { .input-wrapper { flex-direction: row; } }
                
                input { flex: 1; padding: 1.25rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); font-size: 1.1rem; }
                .check-btn { padding: 1.25rem 2rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; justify-content: center; min-width: 180px; }
                .check-btn:disabled { opacity: 0.7; }

                .error-msg { margin-top: 1.5rem; padding: 1rem; background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; border-radius: 1rem; display: flex; align-items: center; gap: 0.5rem; }

                .result-section { margin-top: 2rem; padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); text-align: center; }
                .result-section.allowed { background: #ecfdf5; border-color: #6ee7b7; color: #059669; }
                .result-section.restricted { background: #fef2f2; border-color: #fca5a5; color: #dc2626; }
                
                .status-header { display: flex; align-items: center; justify-content: center; gap: 1rem; font-size: 1.5rem; font-weight: 800; margin-bottom: 2rem; }
                
                .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
                .detail-box { background: rgba(255,255,255,0.5); padding: 1rem; border-radius: 1rem; }
                .detail-box .label { display: block; font-size: 0.8rem; text-transform: uppercase; font-weight: 700; margin-bottom: 0.5rem; opacity: 0.8; }
                .detail-box .value { font-weight: 700; font-family: monospace; word-break: break-all; }

                .demo-note { font-size: 0.8rem; font-style: italic; opacity: 0.8; }
                .demo-note.warning { color: #d97706; }
            `}</style>
        </div>
    );
}
