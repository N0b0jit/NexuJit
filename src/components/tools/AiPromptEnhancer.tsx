'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Copy, RefreshCw, Check, Type, Key, AlertCircle, Wand2, Info } from 'lucide-react';

export default function AiPromptEnhancer() {
    const [rawPrompt, setRawPrompt] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');
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

    const enhancePrompt = async () => {
        if (!rawPrompt.trim()) return;
        setLoading(true);
        setResult('');
        setError('');

        try {
            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic: rawPrompt,
                    type: 'prompt-enhancer',
                    userApiKey: apiKey
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to enhance prompt');
            }

            setResult(data.text);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please check your API key.');
            if (err.message.includes('API Key')) setShowKeyInput(true);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        // Extract just the "Optimized Prompt" part if possible, or copy everything
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="ai-layout">
                <div className="ai-config-panel">
                    <div className="config-group">
                        <label>
                            <div className="label-with-action">
                                <span><Key size={16} /> Gemini API Key (Required)</span>
                                <button
                                    className="text-btn"
                                    onClick={() => setShowKeyInput(!showKeyInput)}
                                >
                                    {showKeyInput ? 'Hide' : 'Change'}
                                </button>
                            </div>
                        </label>
                        {(!apiKey || showKeyInput) ? (
                            <div className="api-key-input-wrapper">
                                <input
                                    type="password"
                                    placeholder="Paste your Gemini API Key here..."
                                    value={apiKey}
                                    onChange={(e) => saveApiKey(e.target.value)}
                                />
                                <p className="input-hint">
                                    Your key is saved locally in your browser and never stored on our servers.
                                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"> Get a free key here.</a>
                                </p>
                            </div>
                        ) : (
                            <div className="api-key-status">
                                <Check size={14} /> Key saved locally
                            </div>
                        )}
                    </div>

                    <div className="config-group">
                        <label><Type size={16} /> Enter your raw prompt</label>
                        <textarea
                            placeholder="e.g., Write a blog post about coffee."
                            value={rawPrompt}
                            onChange={(e) => setRawPrompt(e.target.value)}
                            rows={6}
                        />
                    </div>

                    <button
                        className={`generate-btn ${loading ? 'loading' : ''}`}
                        onClick={enhancePrompt}
                        disabled={loading || !rawPrompt || !apiKey}
                    >
                        {loading ? <RefreshCw className="spin" size={20} /> : <Wand2 size={20} />}
                        {loading ? 'Enhancing...' : 'Enhance Prompt'}
                    </button>

                    {error && (
                        <div className="error-box">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="feature-info">
                        <h4><Info size={16} /> Why use this?</h4>
                        <p>Better prompts lead to better AI results. This tool uses Prompt Engineering principles to add context, structure, and clarity to your simple requests.</p>
                    </div>
                </div>

                <div className="ai-result-panel">
                    <div className="panel-header">
                        <span>Enhanced Result</span>
                        {result && (
                            <button className="copy-btn" onClick={copyToClipboard}>
                                {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy All</>}
                            </button>
                        )}
                    </div>

                    <div className={`result-display ${loading ? 'loading-shimmer' : ''}`}>
                        {loading ? (
                            <div className="empty-state">
                                <RefreshCw size={48} className="spin ghost-icon" />
                                <p>Optimizing your prompt for peak performance...</p>
                            </div>
                        ) : result ? (
                            <div className="formatted-content">
                                {result.split('\n').map((line, i) => {
                                    if (line.trim().startsWith('# ')) return <h1 key={i}>{line.replace('# ', '').replace(/#/g, '')}</h1>;
                                    if (line.trim().startsWith('## ')) return <h2 key={i}>{line.replace('## ', '').replace(/#/g, '')}</h2>;
                                    if (line.trim().startsWith('### ')) return <h3 key={i} style={{ fontSize: '1.25rem', margin: '1.5rem 0 0.75rem', fontWeight: 700 }}>{line.replace('### ', '').replace(/#/g, '')}</h3>;
                                    if (line.match(/^\d\./)) return <p key={i} className="list-item">{line}</p>;
                                    if (line.trim() === '') return <div key={i} style={{ height: '1rem' }} />;
                                    return <p key={i}>{line}</p>;
                                })}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <Sparkles size={48} className="ghost-icon" />
                                <p>Your enhanced prompt will appear here. Enter a draft prompt and click enhance!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { display: flex; flex-direction: column; gap: 2rem; }
                .ai-layout { display: grid; grid-template-columns: 1fr; gap: 3rem; }
                @media (min-width: 1024px) { .ai-layout { grid-template-columns: 400px 1fr; } }
                
                .ai-config-panel {
                    display: flex; flex-direction: column; gap: 1.5rem; padding: 2.5rem;
                    background: var(--surface); border-radius: 1.5rem; border: 1px solid var(--border);
                    height: fit-content; box-shadow: var(--shadow);
                }
                
                .config-group { display: flex; flex-direction: column; gap: 0.85rem; }
                .config-group label {
                    font-weight: 700; font-size: 0.95rem; display: flex; align-items: center;
                    gap: 0.6rem; color: var(--foreground);
                }
                
                .label-with-action { display: flex; justify-content: space-between; align-items: center; width: 100%; }
                .text-btn { font-size: 0.8rem; color: var(--primary); font-weight: 600; text-decoration: underline; }
                
                .config-group textarea, .api-key-input-wrapper input {
                    padding: 1rem; border-radius: 1rem; border: 2px solid var(--border);
                    background: var(--background); font-weight: 500; width: 100%; color: var(--foreground);
                    transition: all 0.2s ease;
                }
                
                .config-group textarea:focus, .api-key-input-wrapper input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-soft); }
                
                .input-hint { font-size: 0.75rem; color: var(--secondary); margin-top: 0.5rem; line-height: 1.4; }
                .input-hint a { color: var(--primary); text-decoration: underline; }
                
                .api-key-status {
                    display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem;
                    color: #10b981; font-weight: 600; background: #ecfdf5; padding: 0.75rem 1rem; border-radius: 0.75rem;
                }
                
                .generate-btn {
                    margin-top: 1rem; padding: 1.15rem; background: var(--primary); color: white;
                    border-radius: 1rem; font-weight: 700; display: flex; align-items: center;
                    justify-content: center; gap: 0.85rem; box-shadow: 0 4px 20px var(--primary-soft);
                    transition: all 0.3s ease;
                }
                
                .generate-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px var(--primary-soft); }
                .generate-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                .error-box {
                    margin-top: 1rem; padding: 1rem; background: #fef2f2; border: 1px solid #fecaca;
                    color: #dc2626; border-radius: 1rem; display: flex; align-items: center; gap: 0.75rem;
                    font-size: 0.9rem; font-weight: 500;
                }

                .feature-info {
                    margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border);
                }
                .feature-info h4 { display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; margin-bottom: 0.75rem; color: var(--foreground); }
                .feature-info p { font-size: 0.9rem; color: var(--secondary); line-height: 1.6; }

                .ai-result-panel { display: flex; flex-direction: column; gap: 1rem; }
                .panel-header {
                    display: flex; justify-content: space-between; align-items: center;
                    font-weight: 800; color: var(--secondary); text-transform: uppercase;
                    font-size: 0.85rem; letter-spacing: 0.05em;
                }
                
                .result-display {
                    background: var(--surface); border: 2px solid var(--border); border-radius: 1.5rem;
                    min-height: 600px; padding: 3rem; position: relative; overflow: auto; box-shadow: var(--shadow-sm);
                }
                
                .empty-state {
                    height: 100%; display: flex; flex-direction: column; align-items: center;
                    justify-content: center; text-align: center; color: var(--secondary); gap: 1.5rem; padding-top: 8rem;
                }
                .ghost-icon { opacity: 0.1; }
                
                .formatted-content h1 { font-size: 2.5rem; margin-bottom: 2rem; color: var(--foreground); font-weight: 800; line-height: 1.1; }
                .formatted-content h2 { font-size: 1.75rem; margin: 2.5rem 0 1rem; color: var(--foreground); font-weight: 700; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
                .formatted-content p { font-size: 1.15rem; line-height: 1.8; color: var(--secondary); margin-bottom: 1.5rem; }
                .list-item { font-weight: 500; color: var(--foreground) !important; padding-left: 1.5rem; position: relative; }
                .list-item::before { content: "•"; position: absolute; left: 0; color: var(--primary); font-weight: bold; }
                
                .copy-btn {
                    display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem 1.25rem;
                    background: var(--primary-soft); color: var(--primary); border-radius: 0.75rem;
                    font-weight: 700; font-size: 0.9rem; transition: all 0.2s ease;
                }
                .copy-btn:hover { background: var(--primary); color: white; }
                
                .loading-shimmer::after {
                    content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(90deg, transparent, var(--primary-soft), transparent);
                    animation: shimmer 2s infinite;
                }
                @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
            `}</style>
        </div>
    );
}
