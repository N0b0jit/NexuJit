'use client';

import { useState } from 'react';
import { Link, Copy, Check, ArrowRight, RefreshCw } from 'lucide-react';

export default function UrlDecoder() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    const decode = () => {
        try {
            setResult(decodeURIComponent(input));
        } catch (e) {
            setResult('Error decoding URL: Invalid format');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="card">
                <div className="input-group">
                    <label>String to Decode</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world"
                    />
                </div>

                <div className="action">
                    <button onClick={decode} className="btn"><RefreshCw size={18} /> Decode</button>
                </div>

                <div className="output-group">
                    <div className="head">
                        <label>Decoded Result</label>
                        {result && (
                            <button onClick={handleCopy} className="copy-btn">
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        )}
                    </div>
                    <textarea value={result} readOnly />
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow); }
                
                label { display: block; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem; font-size: 0.9rem; text-transform: uppercase; }
                textarea { width: 100%; height: 150px; padding: 1rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); resize: vertical; font-family: monospace; }
                
                .action { display: flex; justify-content: center; margin: 2rem 0; }
                .btn { padding: 1rem 2.5rem; background: var(--primary); color: white; border-radius: 99px; font-weight: 800; display: flex; gap: 0.5rem; align-items: center; transition: transform 0.2s; }
                .btn:hover { transform: translateY(-2px); }

                .head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
                .copy-btn { padding: 0.5rem; color: var(--secondary); background: transparent; transition: color 0.2s; }
                .copy-btn:hover { color: var(--primary); }
            `}</style>
        </div>
    );
}
