'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Copy, RefreshCw, Check, Globe, Layout, Search, Zap, AlertCircle, Key } from 'lucide-react';

export default function AiMetaOptimizer() {
    const [url, setUrl] = useState('');
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [copiedType, setCopiedType] = useState('');
    const [error, setError] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [showKeyInput, setShowKeyInput] = useState(false);

    // Load API Key from localStorage
    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) setApiKey(savedKey);
    }, []);

    const saveApiKey = (key: string) => {
        setApiKey(key);
        localStorage.setItem('gemini_api_key', key);
    };

    const generateMeta = async () => {
        if (!url.trim() && !keyword.trim()) return;
        setLoading(true);
        setResult(null);
        setError('');

        try {
            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic: keyword || url,
                    tone: 'Conversion focused',
                    length: 'Meta format',
                    type: 'meta-optimizer',
                    context: { url, keyword },
                    userApiKey: apiKey
                }),
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            // If text is returned instead of structured object (fallback/demo mode)
            if (data.text && !data.title) {
                setResult({
                    title: "Demo: Meta Title Optimization for " + (keyword || "your site"),
                    description: "This is a demonstration of how the AI Meta Optimizer works. Add your GEMINI_API_KEY to see real, optimized results for your domain.",
                    keywords: "seo optimization, meta tags, search marketing",
                    score: 85,
                    isDemo: true
                });
            } else {
                setResult(data);
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopiedType(type);
        setTimeout(() => setCopiedType(''), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="meta-layout">
                <div className="input-panel">
                    <div className="input-group">
                        <label><Globe size={16} /> Website URL (Optional)</label>
                        <input
                            type="text"
                            placeholder="https://example.com/blog-post"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label><Search size={16} /> Target Keyword or Topic</label>
                        <input
                            type="text"
                            placeholder="e.g., Best running shoes for flat feet"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>

                    <button
                        className={`optimize-btn ${loading ? 'loading' : ''}`}
                        onClick={generateMeta}
                        disabled={loading || (!url && !keyword)}
                    >
                        {loading ? <RefreshCw className="spin" size={20} /> : <Zap size={20} />}
                        {loading ? 'Analyzing Content...' : 'Optimize Meta Tags'}
                    </button>

                    {error && (
                        <div className="error-box">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="input-group" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                        <label>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <span><Key size={16} /> API Settings</span>
                                <button
                                    className="text-btn"
                                    onClick={() => setShowKeyInput(!showKeyInput)}
                                    style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}
                                >
                                    {showKeyInput ? 'Hide' : 'Manage Key'}
                                </button>
                            </div>
                        </label>
                        {(!apiKey || showKeyInput) ? (
                            <div className="api-key-input-wrapper">
                                <input
                                    type="password"
                                    placeholder="Gemini API Key..."
                                    value={apiKey}
                                    onChange={(e) => saveApiKey(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                                />
                                <p style={{ fontSize: '0.7rem', color: 'var(--secondary)', marginTop: '0.5rem' }}>
                                    Stored locally in your browser. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Get key</a>
                                </p>
                            </div>
                        ) : (
                            <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Check size={14} /> Custom Key Active
                            </div>
                        )}
                    </div>
                </div>

                <div className="result-panel">
                    {loading ? (
                        <div className="loading-container">
                            <RefreshCw size={48} className="spin ghost-icon" />
                            <p>AI is analyzing your keyword and generating optimized meta tags...</p>
                        </div>
                    ) : result ? (
                        <div className="optimization-results">
                            {result.isDemo && (
                                <div className="demo-alert">
                                    <Sparkles size={16} />
                                    <span>Showing Demo Result - Add API Key for live AI data.</span>
                                </div>
                            )}

                            <div className="score-header">
                                <div className="score-circle">
                                    <span>{result.score}</span>
                                    <label>SEO Score</label>
                                </div>
                                <div className="score-info">
                                    <h3>{result.score > 90 ? 'Perfect Optimization!' : 'Great Results!'}</h3>
                                    <p>Your meta tags are well-structured and highly relevant to the target keyword.</p>
                                </div>
                            </div>

                            <div className="meta-card">
                                <div className="card-header">
                                    <span><Layout size={14} /> Meta Title</span>
                                    <button onClick={() => copyToClipboard(result.title, 'title')}>
                                        {copiedType === 'title' ? <Check size={14} /> : <Copy size={14} />}
                                    </button>
                                </div>
                                <div className="card-content">{result.title}</div>
                                <div className="char-count">{result.title?.length || 0} / 60 chars</div>
                            </div>

                            <div className="meta-card">
                                <div className="card-header">
                                    <span><Globe size={14} /> Meta Description</span>
                                    <button onClick={() => copyToClipboard(result.description, 'desc')}>
                                        {copiedType === 'desc' ? <Check size={14} /> : <Copy size={14} />}
                                    </button>
                                </div>
                                <div className="card-content">{result.description}</div>
                                <div className="char-count">{result.description?.length || 0} / 160 chars</div>
                            </div>

                            {result.keywords && (
                                <div className="meta-card">
                                    <div className="card-header">
                                        <span><Search size={14} /> Suggested Keywords</span>
                                        <button onClick={() => copyToClipboard(result.keywords, 'keywords')}>
                                            {copiedType === 'keywords' ? <Check size={14} /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                    <div className="card-content keywords-list">
                                        {result.keywords.split(',').map((k: string, i: number) => (
                                            <span key={i} className="keyword-tag">{k.trim()}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="google-preview">
                                <label>Google Search Preview</label>
                                <div className="preview-box">
                                    <div className="preview-url">https://{url ? new URL(url.startsWith('http') ? url : 'https://' + url).hostname : 'example.com'} › article</div>
                                    <div className="preview-title">{result.title}</div>
                                    <div className="preview-desc">{result.description}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Search size={48} className="ghost-icon" />
                            <p>Enter your URL or keyword to generate high-converting meta tags.</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        .tool-ui { display: flex; flex-direction: column; gap: 2rem; }
        .meta-layout { display: grid; grid-template-columns: 1fr; gap: 3rem; }
        @media (min-width: 1024px) { .meta-layout { grid-template-columns: 350px 1fr; } }
        
        .input-panel {
          padding: 2rem;
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: 1.25rem;
          display: flex; flex-direction: column; gap: 1.5rem;
          height: fit-content;
        }
        .input-group { display: flex; flex-direction: column; gap: 0.75rem; }
        .input-group label { font-weight: 700; font-size: 0.9rem; color: var(--secondary); display: flex; align-items: center; gap: 0.5rem; }
        .input-group input { padding: 0.85rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--surface); font-weight: 500; }
        .input-group input:focus { border-color: var(--primary); }
        
        .optimize-btn {
          padding: 1rem;
          background: var(--primary);
          color: white;
          border-radius: 0.75rem;
          font-weight: 700;
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          box-shadow: 0 4px 15px var(--primary-soft);
        }
        
        .result-panel { min-height: 500px; }
        .empty-state, .loading-container { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: var(--secondary); gap: 1.5rem; padding-top: 5rem; }
        .ghost-icon { opacity: 0.1; }

        .optimization-results { display: flex; flex-direction: column; gap: 1.5rem; }
        .demo-alert { background: var(--primary-soft); color: var(--primary); padding: 0.75rem; border-radius: 0.5rem; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
        
        .score-header { display: flex; align-items: center; gap: 2rem; padding: 1.5rem; background: var(--surface); border-radius: 1.25rem; border: 1px solid var(--border); }
        .score-circle { width: 80px; height: 80px; border-radius: 50%; border: 4px solid #10b981; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--background); }
        .score-circle span { font-size: 1.5rem; font-weight: 800; color: #10b981; }
        .score-circle label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; color: var(--secondary); }
        .score-info h3 { font-size: 1.25rem; margin-bottom: 0.25rem; color: var(--foreground); }
        .score-info p { font-size: 0.9rem; color: var(--secondary); }

        .meta-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1rem; padding: 1.25rem; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; font-weight: 700; font-size: 0.85rem; color: var(--secondary); text-transform: uppercase; }
        .card-content { font-size: 1.1rem; font-weight: 500; line-height: 1.5; color: var(--foreground); }
        .keywords-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .keyword-tag { background: var(--background); padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.85rem; border: 1px solid var(--border); }
        .char-count { margin-top: 0.75rem; font-size: 0.75rem; font-weight: 600; color: var(--secondary); text-align: right; }

        .google-preview { margin-top: 1rem; }
        .google-preview label { display: block; margin-bottom: 0.75rem; font-weight: 700; font-size: 0.85rem; color: var(--secondary); }
        .preview-box { background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 0.75rem; box-shadow: var(--shadow-sm); text-align: left; }
        [data-theme='dark'] .preview-box { background: #202124; border-color: #3c4043; }
        .preview-url { font-size: 0.85rem; color: #202124; margin-bottom: 0.25rem; }
        [data-theme='dark'] .preview-url { color: #bdc1c6; }
        .preview-title { font-size: 1.25rem; color: #1a0dab; margin-bottom: 0.25rem; font-family: arial, sans-serif; cursor: pointer; }
        [data-theme='dark'] .preview-title { color: #8ab4f8; }
        .preview-desc { font-size: 0.9rem; color: #4d5156; line-height: 1.58; font-family: arial, sans-serif; }
        [data-theme='dark'] .preview-desc { color: #bdc1c6; }

        .error-box { margin-top: 1rem; padding: 1rem; background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; border-radius: 0.75rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}
