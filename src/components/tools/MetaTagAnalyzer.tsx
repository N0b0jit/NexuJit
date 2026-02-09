'use client';

import { useState } from 'react';
import { Search, Globe, AlertCircle, BarChart2 } from 'lucide-react';

export default function MetaTagAnalyzer() {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const textInputRef = useRef<HTMLTextAreaElement>(null);

    // Since we cannot easily fetch HTML from another domain client-side without a proxy,
    // we will offer two modes: 1. Analyze by URL (simulated/limited) 2. Analyze by pasted HTML.
    // Actually, users prefer URL. We can try to fetch, if CORS fails, ask to paste source?
    // Or just simulate for now as requested "logic that could work".
    // Better yet, let's allow pasting specific meta tags or full HTML.

    const analyzeHtml = (html: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const title = doc.querySelector('title')?.innerText || '';
        const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const keywords = doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
        const robots = doc.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
        const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
        const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

        setResult({
            title: { value: title, length: title.length, valid: title.length > 10 && title.length < 60 },
            description: { value: description, length: description.length, valid: description.length > 50 && description.length < 160 },
            keywords: { value: keywords, count: keywords ? keywords.split(',').length : 0 },
            robots,
            og: { title: ogTitle, image: ogImage, valid: !!(ogTitle && ogImage) }
        });
    };

    const handleAnalyze = async () => {
        if (!url) return;
        setLoading(true);
        setError('');
        setResult(null);

        try {
            // Attempt fetch (will likely fail CORS on many sites, so we fallback or warn)
            const res = await fetch(url);
            const html = await res.text();
            analyzeHtml(html);
        } catch (err) {
            setError('Could not fetch URL directly (CORS restriction). Please paste the page source code below for analysis.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tool-content">
            <div className="card">
                <div className="input-section">
                    <label>Enter URL (May be blocked by CORS)</label>
                    <div className="input-row">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                        />
                        <button onClick={handleAnalyze} disabled={loading || !url}>
                            {loading ? 'Fetching...' : 'Analyze URL'}
                        </button>
                    </div>
                </div>

                <div className="divider">OR</div>

                <div className="input-section">
                    <label>Paste Page Source Code</label>
                    <textarea
                        ref={textInputRef}
                        placeholder="&lt;html&gt;&lt;head&gt;...&lt;/head&gt;..."
                        onChange={(e) => analyzeHtml(e.target.value)}
                        className="source-input"
                    />
                </div>

                {error && <div className="error-note"><AlertCircle size={16} /> {error}</div>}

                {result && (
                    <div className="results-grid">
                        <div className="result-item">
                            <h4>Title Tag</h4>
                            <p className="value">{result.title.value || 'Missing'}</p>
                            <div className={`badge ${result.title.valid ? 'good' : 'bad'}`}>
                                {result.title.length} chars ({result.title.valid ? 'Optimal' : 'Needs Optimization'})
                            </div>
                        </div>

                        <div className="result-item">
                            <h4>Meta Description</h4>
                            <p className="value">{result.description.value || 'Missing'}</p>
                            <div className={`badge ${result.description.valid ? 'good' : 'bad'}`}>
                                {result.description.length} chars ({result.description.valid ? 'Optimal' : 'Needs Optimization'})
                            </div>
                        </div>

                        <div className="result-item">
                            <h4>Open Graph (Social)</h4>
                            <div className="og-preview">
                                {result.og.valid ? (
                                    <>
                                        <div className="og-found"><CheckCircle2 size={16} /> Tags Found</div>
                                        {result.og.image && <img src={result.og.image} alt="OG Preview" className="og-thumb" />}
                                    </>
                                ) : (
                                    <div className="og-missing"><AlertCircle size={16} /> Missing Social Tags</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); }
                .input-row { display: flex; gap: 1rem; margin-bottom: 2rem; }
                input { flex: 1; padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); }
                button { padding: 1rem 2rem; background: var(--primary); color: white; border-radius: 0.75rem; font-weight: 600; white-space: nowrap; }
                .divider { text-align: center; font-weight: bold; color: var(--secondary); margin: 1rem 0; }
                .source-input { width: 100%; height: 150px; padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); }
                .error-note { color: #d97706; margin-top: 1rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; }
                
                .results-grid { display: grid; gap: 1.5rem; margin-top: 2rem; }
                .result-item { padding: 1.5rem; background: var(--background); border-radius: 1rem; border: 1px solid var(--border); }
                .result-item h4 { margin-bottom: 0.5rem; color: var(--secondary); font-size: 0.9rem; text-transform: uppercase; }
                .value { font-weight: 600; font-size: 1.1rem; word-break: break-all; margin-bottom: 1rem; }
                .badge { display: inline-flex; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.8rem; font-weight: 700; }
                .badge.good { background: #dcfce7; color: #166534; }
                .badge.bad { background: #fee2e2; color: #991b1b; }
                .og-thumb { max-width: 200px; border-radius: 0.5rem; margin-top: 0.5rem; }
            `}</style>
        </div>
    );
}
import { useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
