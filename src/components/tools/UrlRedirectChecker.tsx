'use client';

import { useState } from 'react';
import { GitMerge, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export default function UrlRedirectChecker() {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const checkRedirects = async () => {
        setError('');
        setResult(null);
        if (!url) return;

        let checkUrl = url;
        if (!checkUrl.startsWith('http')) {
            checkUrl = `https://${checkUrl}`;
        }

        setLoading(true);
        try {
            const response = await fetch(checkUrl, { redirect: 'follow' });

            // Browsers handle redirects transparently, so we can only compare start and end URL
            // and check response.redirected flag.

            setResult({
                original: checkUrl,
                final: response.url,
                isRedirected: response.redirected || response.url !== checkUrl,
                status: response.status
            });

        } catch (err) {
            setError('Request failed. This often happens due to CORS policies on the target website preventing client-side analysis.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tool-ui">
            <div className="checker-card">
                <div className="input-section">
                    <label><GitMerge size={18} /> URL to Analyze</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="http://example.com"
                        />
                        <button onClick={checkRedirects} className="check-btn" disabled={loading || !url}>
                            {loading ? 'Analyzing...' : 'Check Redirects'}
                        </button>
                    </div>
                </div>

                {error && <div className="error-msg"><AlertCircle size={16} /> {error}</div>}

                {result && (
                    <div className="result-section">
                        <div className="flow-visual">
                            <div className="url-node start">
                                <span className="label">Start URL</span>
                                <span className="val">{result.original}</span>
                            </div>

                            <div className="connector">
                                {result.isRedirected ? (
                                    <div className="status-badge redirect">Redirects Detected</div>
                                ) : (
                                    <div className="status-badge direct">Direct Link</div>
                                )}
                                <ArrowRight size={24} className="arrow" />
                            </div>

                            <div className="url-node end">
                                <span className="label">Final URL</span>
                                <span className="val">{result.final}</span>
                            </div>
                        </div>

                        <div className={`summary-box ${result.isRedirected ? 'warn' : 'success'}`}>
                            {result.isRedirected ? (
                                <><AlertCircle size={20} /> This URL redirects to a different destination.</>
                            ) : (
                                <><CheckCircle size={20} /> This URL does not redirect.</>
                            )}
                            <span className="status-code">Final Status: {result.status}</span>
                        </div>
                    </div>
                )}

                <div className="limitations">
                    <h4>Technical Limitation</h4>
                    <p>Due to browser security (CORS), checking 301/302 codes precisely requires a server-side proxy. This tool checks if the final URL differs from the input URL.</p>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .checker-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 3rem; box-shadow: var(--shadow-lg); }
                .input-section label { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; color: var(--secondary); margin-bottom: 1rem; }
                .input-wrapper { display: flex; gap: 1rem; flex-direction: column; }
                @media(min-width: 640px) { .input-wrapper { flex-direction: row; } }
                
                input { flex: 1; padding: 1.25rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); font-size: 1.1rem; }
                .check-btn { padding: 1.25rem 2rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; min-width: 160px; }

                .error-msg { margin-top: 1.5rem; padding: 1rem; background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; border-radius: 1rem; }

                .result-section { margin-top: 3rem; animation: slideUp 0.5s ease; }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

                .flow-visual { display: flex; flex-direction: column; gap: 1rem; align-items: center; margin-bottom: 2rem; }
                @media(min-width: 768px) { .flow-visual { flex-direction: row; justify-content: space-between; } }
                
                .url-node { background: var(--background); padding: 1.5rem; border-radius: 1rem; border: 1px solid var(--border); flex: 1; width: 100%; word-break: break-all; }
                .url-node.start { border-left: 4px solid var(--secondary); }
                .url-node.end { border-left: 4px solid var(--primary); }
                
                .url-node .label { display: block; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 0.5rem; color: var(--secondary); font-weight: 700; }
                .url-node .val { font-weight: 600; font-size: 1.1rem; }

                .connector { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 0 1rem; }
                .status-badge { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; padding: 0.4rem 0.8rem; border-radius: 1rem; white-space: nowrap; }
                .status-badge.redirect { background: #fff7ed; color: #ea580c; }
                .status-badge.direct { background: #eff6ff; color: #3b82f6; }
                .arrow { color: var(--secondary); }

                .summary-box { padding: 1rem; border-radius: 1rem; display: flex; align-items: center; gap: 0.75rem; font-weight: 600; justify-content: center; flex-wrap: wrap; }
                .summary-box.warn { background: #fff7ed; color: #c2410c; }
                .summary-box.success { background: #f0fdf4; color: #15803d; }

                .status-code { margin-left: auto; padding-left: 1rem; border-left: 1px solid currentColor; font-weight: 800; }

                .limitations { margin-top: 3rem; padding: 1.5rem; background: var(--background); border-radius: 1rem; opacity: 0.8; }
                .limitations h4 { margin: 0 0 0.5rem 0; font-size: 0.9rem; }
                .limitations p { margin: 0; font-size: 0.85rem; line-height: 1.5; }
            `}</style>
        </div>
    );
}
