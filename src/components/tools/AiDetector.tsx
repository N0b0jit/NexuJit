'use client';

import { useState } from 'react';
import { Bot, Sparkles, AlertCircle } from 'lucide-react';

export default function AiDetector() {
    const [text, setText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const analyze = async () => {
        if (!text.trim()) return;
        setIsAnalyzing(true);
        setResult(null);

        try {
            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: `Analyze the following text and determine if it appears to be written by AI or a human. Provide a probability percentage (0-100%) that it is AI-generated, and a brief explanation of why.
                    Text: "${text.substring(0, 2000)}" // Limit for safety
                    Format response as JSON: { "aiProbability": number, "explanation": "string", "verdict": "Likely AI" | "Likely Human" | "Mixed" }`
                })
            });

            const data = await response.json();
            // Try to parse the markdown json response
            let jsonString = data.content.replace(/```json/g, '').replace(/```/g, '').trim();
            const json = JSON.parse(jsonString);
            setResult(json);

        } catch (e) {
            console.error(e);
            setResult({ error: 'Failed to analyze. Please try again.' });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="tool-ui">
            <div className="card">
                <div className="input-area">
                    <label>Paste Text to Analyze</label>
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Paste your article or paragraph here..."
                        rows={8}
                    />
                </div>

                <div className="actions">
                    <button
                        onClick={analyze}
                        className="analyze-btn"
                        disabled={!text || isAnalyzing}
                    >
                        {isAnalyzing ? 'Analyzing Patterns...' : <><Bot size={20} /> Detect AI Content</>}
                    </button>
                </div>

                {result && !result.error && (
                    <div className="result-area">
                        <div className="score-ring" style={{
                            background: `conic-gradient(${result.aiProbability > 50 ? '#ef4444' : '#10b981'} ${result.aiProbability}%, #e2e8f0 0)`
                        }}>
                            <div className="inner">
                                <span className="pct">{result.aiProbability}%</span>
                                <span className="lbl">AI Score</span>
                            </div>
                        </div>

                        <div className="verdict">
                            <h3>Verdict: {result.verdict}</h3>
                            <p>{result.explanation}</p>
                        </div>
                    </div>
                )}

                {result?.error && <div className="error-msg"><AlertCircle size={16} /> {result.error}</div>}

                <p className="disclaimer">
                    * This tool uses AI heuristics to estimate origin. Results are not guaranteed to be 100% accurate.
                </p>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 700px; margin: 0 auto; }
                .card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); }
                
                textarea { width: 100%; padding: 1rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); resize: vertical; font-size: 1.1rem; line-height: 1.6; }
                label { display: block; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem; }

                .actions { margin: 1.5rem 0; text-align: right; }
                .analyze-btn { width: 100%; padding: 1rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s; }
                .analyze-btn:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
                .analyze-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

                .result-area { margin-top: 2rem; background: var(--background); padding: 2rem; border-radius: 1.5rem; display: flex; align-items: center; gap: 2rem; }
                
                .score-ring { width: 120px; height: 120px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; }
                .inner { width: 100px; height: 100px; background: var(--background); border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
                .pct { font-size: 2rem; font-weight: 800; color: var(--foreground); }
                .lbl { font-size: 0.7rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; }

                .verdict h3 { margin-bottom: 0.5rem; font-size: 1.5rem; }
                .verdict p { color: var(--secondary); line-height: 1.5; }

                .disclaimer { font-size: 0.8rem; color: var(--secondary); margin-top: 1.5rem; text-align: center; font-style: italic; }
                
                @media(max-width: 600px) {
                    .result-area { flex-direction: column; text-align: center; }
                }
            `}</style>
        </div>
    );
}
