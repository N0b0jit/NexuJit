'use client';

import { useState } from 'react';
import { FileCode, Activity, AlertCircle } from 'lucide-react';

export default function PageSizeChecker() {
    const [url, setUrl] = useState('');
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const checkSize = async () => {
        setError('');
        setStats(null);
        if (!url) return;

        let checkUrl = url;
        if (!checkUrl.startsWith('http')) {
            checkUrl = `https://${checkUrl}`;
        }

        setLoading(true);
        try {
            // Using HEAD request primarily
            const response = await fetch(checkUrl, { method: 'HEAD', mode: 'cors' });

            if (!response.ok) throw new Error('Could not fetch page');

            let size = 0;
            const contentLength = response.headers.get('content-length');

            if (contentLength) {
                size = parseInt(contentLength, 10);
            } else {
                // If HEAD doesn't return size, try GET (if allowed)
                const getRes = await fetch(checkUrl);
                const blob = await getRes.blob();
                size = blob.size;
            }

            setStats({
                bytes: size,
                kb: (size / 1024).toFixed(2),
                mb: (size / (1024 * 1024)).toFixed(2)
            });

        } catch (err) {
            // Fallback for demo or if CORS blocks
            if (!stats) {
                // Since this is client-side only without proxy, most sites block this.
                // We'll show a friendly simulation/demo if it fails due to CORS, or an error.
                // For this project, to ensure "working" feel:
                setError('Could not access page directly due to browser CORS policies. Please try a URL that allows cross-origin access (e.g., API endpoints) or note that this tool requires a backend proxy for arbitrary websites.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tool-ui">
            <div className="checker-card">
                <div className="input-section">
                    <label><FileCode size={18} /> URL to Check</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                        />
                        <button onClick={checkSize} className="check-btn" disabled={loading || !url}>
                            {loading ? 'Checking...' : 'Check Size'}
                        </button>
                    </div>
                </div>

                {error && <div className="error-msg"><AlertCircle size={16} /> {error}</div>}

                {stats && (
                    <div className="result-grid">
                        <div className="stat-card">
                            <span className="label">In Bytes</span>
                            <span className="value">{stats.bytes.toLocaleString()} B</span>
                        </div>
                        <div className="stat-card highlight">
                            <span className="label">In Kilobytes</span>
                            <span className="value">{stats.kb} KB</span>
                        </div>
                        <div className="stat-card">
                            <span className="label">In Megabytes</span>
                            <span className="value">{stats.mb} MB</span>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 700px; margin: 0 auto; }
                .checker-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 3rem; box-shadow: var(--shadow-lg); }
                .input-section label { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; color: var(--secondary); margin-bottom: 1rem; }
                .input-wrapper { display: flex; gap: 1rem; flex-direction: column; }
                @media(min-width: 640px) { .input-wrapper { flex-direction: row; } }
                
                input { flex: 1; padding: 1.25rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); font-size: 1.1rem; }
                .check-btn { padding: 1.25rem 2rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; min-width: 150px; }
                .check-btn:disabled { opacity: 0.7; }

                .error-msg { margin-top: 1.5rem; padding: 1rem; background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; border-radius: 1rem; font-size: 0.9rem; line-height: 1.5; }

                .result-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 2rem; }
                @media(max-width: 640px) { .result-grid { grid-template-columns: 1fr; } }

                .stat-card { background: var(--background); padding: 1.5rem; border-radius: 1rem; border: 1px solid var(--border); text-align: center; }
                .stat-card.highlight { border-color: var(--primary); background: var(--surface); box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
                .label { display: block; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 0.5rem; color: var(--secondary); font-weight: 700; }
                .value { font-size: 1.5rem; font-weight: 800; color: var(--foreground); }
                .stat-card.highlight .value { color: var(--primary); }
            `}</style>
        </div>
    );
}
