'use client';

import { useState, useEffect } from 'react';
import { UserCheck, Sparkles } from 'lucide-react';

export default function AiHumanizer() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
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

    const humanize = async () => {
        if (!input.trim()) return;
        setIsProcessing(true);
        setOutput('');

        try {
            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: `Humanize text: ${input.substring(0, 50)}...`, // Topic required by backend check
                    // Although generic, the prompt below works. Actually, let's use the prompt directly if possible or update backend. 
                    // The backend checks for 'topic'. Let's provide a topic.
                    // Actually, the current backend implementation uses 'topic' significantly. 
                    // Let's rely on the generic 'else' block in backend or add a new type. 
                    // For now, I'll pass 'type: custom' (or similar) but the backend logic defaults to blog post if unknown type.
                    // Wait, looking at backend: "if (!topic && type !== 'prompt-enhancer')".
                    // So I MUST provide a topic.
                    // AND if type is not one of specific ones, it generates a blog post.
                    // I should probably UPDATE THE BACKEND to support 'humanize' type, OR hack it by saying "Write a humanized version...".
                    // But the backend prompt is: `Write a high-quality, SEO-optimized blog post about "${topic}"...`
                    // This is BAD for humanizer.
                    // I MUST UPDATE THE BACKEND FIRST to support 'humanizer' type.

                    // Let's assume I will update backend next.
                    type: 'humanizer',
                    userApiKey: apiKey,
                    context: { prompt: input }
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setOutput(data.text);
        } catch (e: any) {
            console.error(e);
            setOutput(e.message || 'Error generating response. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="tool-ui">
            <div className="card">
                <div className="api-config">
                    <label onClick={() => setShowKeyInput(!showKeyInput)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sparkles size={16} className="text-primary" />
                        {apiKey ? <span className="text-success">API Key Active (Click to manage)</span> : <span>Set Gemini API Key (Free)</span>}
                    </label>
                    {showKeyInput && (
                        <div className="key-input-box">
                            <input
                                type="password"
                                placeholder="Paste Gemini API Key here..."
                                value={apiKey}
                                onChange={(e) => saveApiKey(e.target.value)}
                            />
                            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">Get Key</a>
                        </div>
                    )}
                </div>

                <div className="split-view">
                    <div className="pane">
                        <label>AI / Robotic Text</label>
                        <textarea
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Paste your text here..."
                        />
                    </div>
                    <div className="pane">
                        <label>Humanized Result</label>
                        <div className="output-box">
                            {output ? output : <span className="placeholder">Result will appear here...</span>}
                        </div>
                    </div>
                </div>

                <div className="actions">
                    <button
                        onClick={humanize}
                        className="humanize-btn"
                        disabled={!input || isProcessing}
                    >
                        {isProcessing ? 'Humanizing...' : <><UserCheck size={20} /> Humanize Text</>}
                    </button>
                    {!apiKey && <p className="key-warning">Note: You need a free Gemini API Key to use this.</p>}
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 900px; margin: 0 auto; }
                .card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); }
                
                .api-config { margin-bottom: 2rem; padding: 1rem; background: var(--background); border-radius: 1rem; border: 1px solid var(--border); }
                .text-primary { color: var(--primary); }
                .text-success { color: #10b981; font-weight: 600; }
                .key-input-box { margin-top: 1rem; display: flex; gap: 1rem; }
                .key-input-box input { flex: 1; padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid var(--border); background: var(--surface); color: var(--foreground); }
                
                .split-view { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
                .pane { display: flex; flex-direction: column; }
                
                label { font-weight: 700; color: var(--secondary); margin-bottom: 0.75rem; display: block; }
                
                textarea, .output-box { 
                    width: 100%; height: 350px; padding: 1.5rem; border-radius: 1rem; 
                    border: 2px solid var(--border); background: var(--background); 
                    font-size: 1.1rem; line-height: 1.6; resize: none; overflow-y: auto;
                    color: var(--foreground); 
                }
                
                .placeholder { color: var(--secondary); opacity: 0.5; font-style: italic; }

                .actions { margin-top: 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
                .humanize-btn { padding: 1rem 3rem; background: var(--primary); color: white; border-radius: 99px; font-weight: 800; font-size: 1.1rem; display: inline-flex; align-items: center; gap: 0.75rem; transition: transform 0.2s; }
                .humanize-btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
                .humanize-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
                .key-warning { color: #ef4444; font-size: 0.9rem; }

                @media(max-width: 768px) {
                    .split-view { grid-template-columns: 1fr; }
                    textarea, .output-box { height: 250px; }
                }
            `}</style>
        </div>
    );
}
