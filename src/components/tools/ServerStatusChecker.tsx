'use client';

import { useState } from 'react';
import { Server, Activity, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function ServerStatusChecker() {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const checkStatus = async () => {
        setError('');
        setStatus(null);
        if (!url) return;

        // Ensure URL has protocol
        let checkUrl = url;
        if (!checkUrl.startsWith('http')) {
            checkUrl = `https://${checkUrl}`;
        }

        setLoading(true);
        const startTime = Date.now();

        try {
            // Using no-cors mode allows clicking 'opaque' responses which means server is reachable
            // If server is down, fetch usually throws or times out.
            // Note: This isn't perfect status checking (can't see 500 error content) but checks reachability.
            await fetch(checkUrl, { mode: 'no-cors' });

            const endTime = Date.now();
            setStatus({
                isUp: true,
                latency: endTime - startTime
            });
        } catch (err) {
            setStatus({
                isUp: false,
                latency: 0
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tool-ui">
            <div className="checker-card">
                <div className="input-section">
                    <label><Server size={18} /> Website URL</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="example.com"
                            onKeyPress={(e) => e.key === 'Enter' && checkStatus()}
                        />
                        <button onClick={checkStatus} className="check-btn" disabled={loading || !url}>
                            {loading ? <div className="spinner" /> : <Activity size={20} />}
                            {loading ? 'Pinging...' : 'Check Status'}
                        </button>
                    </div>
                </div>

                {status && (
                    <div className={`result-section ${status.isUp ? 'up' : 'down'}`}>
                        <div className="status-header">
                            {status.isUp ? (
                                <><CheckCircle2 size={48} /> Website is UP</>
                            ) : (
                                <><XCircle size={48} /> Website is DOWN (or blocking requests)</>
                            )}
                        </div>

                        {status.isUp && (
                            <div className="latency-box">
                                <span className="label">Response Time</span>
                                <span className="value">{status.latency}ms</span>
                            </div>
                        )}

                        <p className="note">
                            * Note: This tool performs a client-side check. Some sites may block cross-origin requests which might appear as "Down" here.
                        </p>
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
                .check-btn { padding: 1.25rem 2rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; justify-content: center; min-width: 160px; }
                .check-btn:disabled { opacity: 0.7; }

                .spinner { width: 24px; height: 24px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }

                .result-section { margin-top: 2rem; padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); text-align: center; }
                .result-section.up { background: #ecfdf5; border-color: #6ee7b7; color: #059669; }
                .result-section.down { background: #fef2f2; border-color: #fca5a5; color: #dc2626; }
                
                .status-header { display: flex; flex-direction: column; align-items: center; gap: 1rem; font-size: 2rem; font-weight: 800; margin-bottom: 2rem; }
                .latency-box { background: rgba(255,255,255,0.6); display: inline-flex; flex-direction: column; padding: 1rem 2rem; border-radius: 1rem; }
                .latency-box .label { font-size: 0.75rem; text-transform: uppercase; font-weight: 700; opacity: 0.8; margin-bottom: 0.25rem; }
                .latency-box .value { font-size: 1.5rem; font-weight: 800; }

                .note { margin-top: 2rem; font-size: 0.8rem; opacity: 0.7; font-style: italic; max-width: 400px; margin-left: auto; margin-right: auto; }
            `}</style>
        </div>
    );
}
