'use client';

import { useState, useEffect } from 'react';
import { Link as LinkIcon, Copy, Trash2, Check, ExternalLink, Info, AlertCircle } from 'lucide-react';

export default function UtmBuilder() {
    const [baseUrl, setBaseUrl] = useState('');
    const [source, setSource] = useState('');
    const [medium, setMedium] = useState('');
    const [campaign, setCampaign] = useState('');
    const [term, setTerm] = useState('');
    const [content, setContent] = useState('');
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!baseUrl) {
            setGeneratedUrl('');
            return;
        }

        try {
            const url = new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
            if (source) url.searchParams.set('utm_source', source);
            if (medium) url.searchParams.set('utm_medium', medium);
            if (campaign) url.searchParams.set('utm_campaign', campaign);
            if (term) url.searchParams.set('utm_term', term);
            if (content) url.searchParams.set('utm_content', content);

            setGeneratedUrl(url.toString());
        } catch (e) {
            setGeneratedUrl('Invalid Base URL');
        }
    }, [baseUrl, source, medium, campaign, term, content]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setBaseUrl('');
        setSource('');
        setMedium('');
        setCampaign('');
        setTerm('');
        setContent('');
    };

    return (
        <div className="tool-ui">
            <div className="utm-layout">
                <div className="form-panel">
                    <div className="input-group full">
                        <label><LinkIcon size={16} /> Website URL *</label>
                        <input
                            type="text"
                            placeholder="https://example.com"
                            value={baseUrl}
                            onChange={(e) => setBaseUrl(e.target.value)}
                        />
                    </div>

                    <div className="config-grid">
                        <div className="input-group">
                            <label>Campaign Source *</label>
                            <input
                                type="text"
                                placeholder="google, newsletter"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                            />
                            <p className="hint">The referrer (e.g. google, facebook)</p>
                        </div>
                        <div className="input-group">
                            <label>Campaign Medium *</label>
                            <input
                                type="text"
                                placeholder="cpc, banner, email"
                                value={medium}
                                onChange={(e) => setMedium(e.target.value)}
                            />
                            <p className="hint">Marketing medium (e.g. email, social)</p>
                        </div>
                        <div className="input-group">
                            <label>Campaign Name *</label>
                            <input
                                type="text"
                                placeholder="summer_sale"
                                value={campaign}
                                onChange={(e) => setCampaign(e.target.value)}
                            />
                            <p className="hint">Product, promo code, or slogan</p>
                        </div>
                        <div className="input-group">
                            <label>Campaign Term</label>
                            <input
                                type="text"
                                placeholder="running+shoes"
                                value={term}
                                onChange={(e) => setTerm(e.target.value)}
                            />
                            <p className="hint">Identify the paid keywords</p>
                        </div>
                        <div className="input-group full">
                            <label>Campaign Content</label>
                            <input
                                type="text"
                                placeholder="logo_button"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <p className="hint">Use to differentiate ads (A/B testing)</p>
                        </div>
                    </div>

                    <div className="actions">
                        <button onClick={handleClear} className="clear-btn"><Trash2 size={16} /> Reset Form</button>
                    </div>
                </div>

                <div className="result-panel">
                    <div className="sticky-content">
                        <div className="panel-header">
                            <span>Generated Campaign URL</span>
                            {generatedUrl && generatedUrl !== 'Invalid Base URL' && (
                                <button className="copy-btn" onClick={handleCopy}>
                                    {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy URL</>}
                                </button>
                            )}
                        </div>

                        <div className={`url-display ${generatedUrl === 'Invalid Base URL' ? 'error' : ''}`}>
                            {generatedUrl || 'Your campaign URL will appear here as you type...'}
                        </div>

                        {generatedUrl && generatedUrl !== 'Invalid Base URL' && (
                            <div className="preview-actions">
                                <a href={generatedUrl} target="_blank" rel="noopener noreferrer" className="preview-link">
                                    <ExternalLink size={16} /> Open in New Tab
                                </a>
                            </div>
                        )}

                        <div className="info-card">
                            <h4><Info size={16} /> UTM Best Practices</h4>
                            <ul>
                                <li>Use dashes instead of spaces.</li>
                                <li>Be consistent with lowercase.</li>
                                <li>Keep parameters short but descriptive.</li>
                                <li>Only source, medium, and name are "best practice" requirements.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { display: flex; flex-direction: column; gap: 2rem; }
                .utm-layout { display: grid; grid-template-columns: 1fr; gap: 3rem; }
                @media (min-width: 1024px) { .utm-layout { grid-template-columns: 1fr 450px; } }

                .form-panel { background: var(--surface); padding: 2.5rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow); }
                .config-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1.5rem; }
                .input-group { display: flex; flex-direction: column; gap: 0.6rem; }
                .input-group.full { grid-column: span 2; }
                .input-group label { font-weight: 700; font-size: 0.9rem; color: var(--foreground); display: flex; align-items: center; gap: 0.5rem; }
                .input-group input { padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); font-weight: 500; font-size: 1rem; }
                .hint { font-size: 0.75rem; color: var(--secondary); margin-top: 0.1rem; }

                .actions { margin-top: 2rem; display: flex; justify-content: flex-end; }
                .clear-btn { display: flex; align-items: center; gap: 0.5rem; color: var(--secondary); font-weight: 600; font-size: 0.9rem; padding: 0.5rem 1rem; border-radius: 0.5rem; }
                .clear-btn:hover { background: #fee2e2; color: #dc2626; }

                .result-panel { position: relative; }
                .sticky-content { position: sticky; top: 100px; }
                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-weight: 800; color: var(--secondary); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
                
                .url-display { 
                    background: var(--background); border: 2px solid var(--border); border-radius: 1.25rem; padding: 1.75rem; 
                    word-break: break-all; font-family: monospace; font-size: 1rem; line-height: 1.6; min-height: 150px;
                    color: var(--secondary); transition: all 0.2s;
                }
                .url-display.error { border-color: #fecaca; color: #dc2626; background: #fff1f1; }
                
                .copy-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--primary-soft); color: var(--primary); border-radius: 0.5rem; font-weight: 700; font-size: 0.85rem; }
                .copy-btn:hover { background: var(--primary); color: white; }

                .preview-actions { margin-top: 1rem; display: flex; justify-content: center; }
                .preview-link { display: flex; align-items: center; gap: 0.5rem; color: var(--primary); font-weight: 700; font-size: 0.9rem; }

                .info-card { margin-top: 2rem; padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 1rem; }
                .info-card h4 { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; font-weight: 800; margin-bottom: 1rem; color: var(--foreground); }
                .info-card ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; }
                .info-card li { font-size: 0.85rem; color: var(--secondary); line-height: 1.4; padding-left: 1.25rem; position: relative; }
                .info-card li::before { content: "•"; position: absolute; left: 0; color: var(--primary); font-weight: bold; }
            `}</style>
        </div>
    );
}
