'use client';

import { useState } from 'react';
import { RefreshCw, Copy, Trash2, Check, Sparkles } from 'lucide-react';

export default function ArticleRewriter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const rewriteArticle = () => {
        if (!input.trim()) return;
        setLoading(true);
        // Simulate AI processing
        setTimeout(() => {
            const rewritten = input.split(' ').map(word => {
                // Simple mock: slightly alter some common words
                if (word.toLowerCase() === 'good') return 'excellent';
                if (word.toLowerCase() === 'bad') return 'poor';
                if (word.toLowerCase() === 'very') return 'exceptionally';
                return word;
            }).join(' ');

            setOutput("AI Rewritten Content:\n\n" + rewritten + "\n\n(Note: This is a demonstration of the UI flow.)");
            setLoading(false);
        }, 2000);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="panels-container">
                <div className="panel">
                    <label>Original Article</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter your original content here..."
                    />
                </div>

                <div className="center-actions">
                    <button onClick={rewriteArticle} disabled={loading || !input} className="rewrite-btn">
                        {loading ? <RefreshCw size={20} className="spin" /> : <Sparkles size={20} />}
                        {loading ? 'Rewriting...' : 'Rewrite Article'}
                    </button>
                </div>

                <div className="panel">
                    <div className="label-row">
                        <label>Rewritten Article</label>
                        {output && (
                            <button onClick={copyToClipboard} className="text-copy-btn">
                                {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                            </button>
                        )}
                    </div>
                    <div className={`output-display ${loading ? 'loading' : ''}`}>
                        {loading ? (
                            <div className="loading-placeholder">
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                        ) : output ? (
                            <p>{output}</p>
                        ) : (
                            <span className="placeholder-text">Rewritten content will appear here...</span>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .tool-ui {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .panels-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 1024px) {
          .panels-container {
            grid-template-columns: 1fr auto 1fr;
            align-items: stretch;
          }
        }
        .panel {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .panel label {
          font-weight: 700;
          color: var(--foreground);
        }
        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        textarea, .output-display {
          width: 100%;
          min-height: 400px;
          padding: 1.5rem;
          background: var(--background);
          border: 2px solid var(--border);
          border-radius: 0.75rem;
          font-size: 1rem;
          line-height: 1.6;
        }
        textarea:focus {
          border-color: var(--primary);
        }
        .output-display {
          background: var(--surface);
          color: var(--foreground);
          overflow-y: auto;
          white-space: pre-wrap;
        }
        .placeholder-text {
          color: var(--secondary);
        }
        .center-actions {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rewrite-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: var(--primary);
          color: white;
          border-radius: 9999px;
          font-weight: 700;
          box-shadow: 0 4px 15px var(--primary-soft);
          transition: all 0.3s ease;
        }
        .rewrite-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 6px 20px var(--primary-soft);
        }
        .rewrite-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .text-copy-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--primary);
        }
        
        .loading-placeholder {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .loading-placeholder .line {
          height: 1rem;
          background: var(--border);
          border-radius: 0.5rem;
          animation: pulse 1.5s infinite ease-in-out;
        }
        .loading-placeholder .line:nth-child(2) { width: 80%; }
        .loading-placeholder .line:nth-child(3) { width: 60%; }
        
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>
        </div>
    );
}
