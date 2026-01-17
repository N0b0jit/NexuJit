'use client';

import { useState } from 'react';
import { Copy, Trash2, Check } from 'lucide-react';

export default function CaseConverter() {
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);

    const convertCase = (type: string) => {
        let result = '';
        switch (type) {
            case 'upper': result = text.toUpperCase(); break;
            case 'lower': result = text.toLowerCase(); break;
            case 'sentence': result = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(); break;
            case 'title': result = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()); break;
            case 'inverse': result = text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''); break;
        }
        setText(result);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="input-area">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter or paste your text here..."
                />

                <div className="controls-row">
                    <div className="action-buttons">
                        <button onClick={() => convertCase('upper')} className="btn">UPPER CASE</button>
                        <button onClick={() => convertCase('lower')} className="btn">lower case</button>
                        <button onClick={() => convertCase('sentence')} className="btn">Sentence case</button>
                        <button onClick={() => convertCase('title')} className="btn">Title Case</button>
                        <button onClick={() => convertCase('inverse')} className="btn">iNVERSE cASE</button>
                    </div>

                    <div className="utility-buttons">
                        <button onClick={copyToClipboard} className="icon-btn" title="Copy">
                            {copied ? <Check size={20} color="#10b981" /> : <Copy size={20} />}
                        </button>
                        <button onClick={() => setText('')} className="icon-btn delete" title="Clear">
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .tool-ui {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        textarea {
          width: 100%;
          min-height: 300px;
          padding: 1.5rem;
          background: var(--background);
          border: 2px solid var(--border);
          border-radius: 0.75rem;
          font-size: 1rem;
          line-height: 1.6;
          resize: vertical;
        }
        textarea:focus {
          border-color: var(--primary);
        }
        .controls-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }
        .action-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .btn {
          padding: 0.625rem 1.25rem;
          background: var(--primary);
          color: white;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
        }
        .btn:hover {
          background: var(--primary-hover);
        }
        .utility-buttons {
          display: flex;
          gap: 0.75rem;
        }
        .icon-btn {
          padding: 0.625rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          color: var(--secondary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-btn:hover {
          color: var(--primary);
          border-color: var(--primary);
        }
        .icon-btn.delete:hover {
          color: #ef4444;
          border-color: #ef4444;
        }
      `}</style>
        </div>
    );
}
