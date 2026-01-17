'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Copy, RefreshCw, Check, Search, BarChart3, TrendingUp, Filter, AlertCircle, Key } from 'lucide-react';

export default function AiKeywordSuggester() {
    const [seedKeyword, setSeedKeyword] = useState('');
    const [difficulty, setDifficulty] = useState('All');
    const [loading, setLoading] = useState(false);
    const [keywords, setKeywords] = useState<any[]>([]);
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
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

    const suggestKeywords = async () => {
        if (!seedKeyword.trim()) return;
        setLoading(true);
        setKeywords([]);
        setError('');

        try {
            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic: seedKeyword,
                    type: 'keyword-suggester',
                    context: { difficulty },
                    userApiKey: apiKey
                }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            // Expecting data.keywords as an array or parse a text fallback
            if (Array.isArray(data.keywords)) {
                setKeywords(data.keywords);
            } else if (data.text) {
                // Try to parse markdown table or list if AI didn't return JSON
                const lines = data.text.split('\n').filter((l: string) => l.includes('|')).slice(2);
                const parsed = lines.map((l: string) => {
                    const parts = l.split('|').map(p => p.trim()).filter(Boolean);
                    return { term: parts[0], volume: parts[1] || 'N/A', difficulty: parts[2] || 'Medium', cpc: parts[3] || 'N/A' };
                }).filter((k: any) => k.term);

                if (parsed.length > 0) setKeywords(parsed);
                else setError('AI returned unstructured data. Try again.');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch suggestions.');
        } finally {
            setLoading(false);
        }
    };

    const copyKeyword = (text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="keyword-layout">
                <div className="config-panel">
                    <div className="config-group">
                        <label><Search size={16} /> Seed Keyword</label>
                        <input
                            type="text"
                            placeholder="e.g., Digital Marketing"
                            value={seedKeyword}
                            onChange={(e) => setSeedKeyword(e.target.value)}
                        />
                    </div>

                    <div className="config-group">
                        <label><Filter size={16} /> Targeted Difficulty</label>
                        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                            <option>All Difficulties</option>
                            <option>Easy (Low Competition)</option>
                            <option>Medium</option>
                            <option>Hard (High Competition)</option>
                        </select>
                    </div>

                    <button
                        className={`generate-btn ${loading ? 'loading' : ''}`}
                        onClick={suggestKeywords}
                        disabled={loading || !seedKeyword}
                    >
                        {loading ? <RefreshCw className="spin" size={20} /> : <TrendingUp size={20} />}
                        {loading ? 'Finding Keywords...' : 'Suggest Keywords'}
                    </button>
                </div>

                <div className="results-panel">
                    {loading ? (
                        <div className="loading-grid">
                            {[1, 2, 3, 4].map(i => <div key={i} className="shimmer-row"></div>)}
                        </div>
                    ) : keywords.length > 0 ? (
                        <div className="keywords-table-wrapper">
                            <table className="keywords-table">
                                <thead>
                                    <tr>
                                        <th>Keyword Idea</th>
                                        <th>Vol (mo)</th>
                                        <th>Difficulty</th>
                                        <th>CPC</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {keywords.map((kw, i) => (
                                        <tr key={i}>
                                            <td className="term-cell">{kw.term}</td>
                                            <td>{kw.volume}</td>
                                            <td>
                                                <span className={`diff-badge ${kw.difficulty.toLowerCase()}`}>
                                                    {kw.difficulty}
                                                </span>
                                            </td>
                                            <td>{kw.cpc}</td>
                                            <td>
                                                <button className="copy-icon-btn" onClick={() => copyKeyword(kw.term, i)}>
                                                    {copiedIdx === i ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state-wrapper">
                            {error ? (
                                <div className="error-box">
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <BarChart3 size={48} className="ghost-icon" />
                                    <p>Enter a seed keyword to discover high-value opportunities and competition analysis.</p>
                                </div>
                            )}

                            <div className="api-config-footer" style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--secondary)' }}>
                                        <Key size={16} /> API Settings
                                    </span>
                                    <button
                                        className="text-btn"
                                        onClick={() => setShowKeyInput(!showKeyInput)}
                                        style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}
                                    >
                                        {showKeyInput ? 'Hide' : 'Manage Key'}
                                    </button>
                                </label>
                                {(!apiKey || showKeyInput) ? (
                                    <div className="api-key-input-wrapper">
                                        <input
                                            type="password"
                                            placeholder="Paste your Gemini API Key here..."
                                            value={apiKey}
                                            onChange={(e) => saveApiKey(e.target.value)}
                                            style={{ width: '100%', padding: '0.85rem', borderRadius: '0.75rem', border: '2px solid var(--border)', background: 'var(--surface)' }}
                                        />
                                    </div>
                                ) : (
                                    <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Check size={14} /> Custom Key Active
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        .tool-ui { display: flex; flex-direction: column; gap: 2rem; }
        .keyword-layout { display: grid; grid-template-columns: 1fr; gap: 3rem; }
        @media (min-width: 1024px) { .keyword-layout { grid-template-columns: 350px 1fr; } }

        .config-panel {
          padding: 2rem;
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: 1.25rem;
          display: flex; flex-direction: column; gap: 1.5rem;
          height: fit-content;
        }
        .config-group { display: flex; flex-direction: column; gap: 0.75rem; }
        .config-group label { font-weight: 700; font-size: 0.9rem; color: var(--secondary); display: flex; align-items: center; gap: 0.5rem; }
        .config-group input, .config-group select { padding: 0.85rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--surface); font-weight: 500; }
        
        .generate-btn {
          padding: 1rem;
          background: var(--primary);
          color: white;
          border-radius: 0.75rem;
          font-weight: 700;
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          box-shadow: 0 4px 15px var(--primary-soft);
        }

        .results-panel { min-height: 400px; }
        .keywords-table-wrapper { background: var(--surface); border: 1px solid var(--border); border-radius: 1.25rem; overflow: hidden; }
        .keywords-table { width: 100%; border-collapse: collapse; text-align: left; }
        .keywords-table th { padding: 1.25rem; background: var(--background); border-bottom: 1px solid var(--border); font-size: 0.85rem; text-transform: uppercase; color: var(--secondary); font-weight: 700; }
        .keywords-table td { padding: 1.25rem; border-bottom: 1px solid var(--border); font-size: 0.95rem; }
        .term-cell { font-weight: 600; color: var(--foreground); }
        
        .diff-badge { padding: 0.25rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; }
        .diff-badge.easy { background: #dcfce7; color: #166534; }
        .diff-badge.medium { background: #fef9c3; color: #854d0e; }
        .diff-badge.hard { background: #fee2e2; color: #991b1b; }

        .copy-icon-btn { color: var(--secondary); transition: color 0.2s; }
        .copy-icon-btn:hover { color: var(--primary); }

        .empty-state { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: var(--secondary); gap: 1.5rem; padding-top: 5rem; }
        .ghost-icon { opacity: 0.1; }
        
        .shimmer-row { height: 60px; background: linear-gradient(90deg, var(--background), var(--surface), var(--background)); background-size: 200% 100%; animation: shimmer 1.5s infinite; margin-bottom: 1px; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}
