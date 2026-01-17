'use client';

import { useState, useEffect } from 'react';
import { Binary, Copy, Check } from 'lucide-react';

export default function DecimalToBinary() {
    const [decimal, setDecimal] = useState('');
    const [binary, setBinary] = useState('');
    const [octal, setOctal] = useState('');
    const [hex, setHex] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        convert();
    }, [decimal]);

    const convert = () => {
        const num = parseInt(decimal);

        if (isNaN(num) || decimal.trim() === '') {
            setBinary('');
            setOctal('');
            setHex('');
            return;
        }

        setBinary(num.toString(2));
        setOctal(num.toString(8));
        setHex(num.toString(16).toUpperCase());
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="converter-card">
                <div className="input-section">
                    <label><Binary size={18} /> Decimal Number</label>
                    <input
                        type="number"
                        value={decimal}
                        onChange={(e) => setDecimal(e.target.value)}
                        placeholder="Enter decimal number (e.g., 255)"
                    />
                </div>

                <div className="results-grid">
                    <div className="result-card">
                        <div className="result-header">
                            <span>Binary (Base 2)</span>
                            {binary && (
                                <button className="copy-btn" onClick={() => handleCopy(binary)}>
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                            )}
                        </div>
                        <div className="result-value">{binary || '0'}</div>
                    </div>

                    <div className="result-card">
                        <div className="result-header">
                            <span>Octal (Base 8)</span>
                            {octal && (
                                <button className="copy-btn" onClick={() => handleCopy(octal)}>
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                            )}
                        </div>
                        <div className="result-value">{octal || '0'}</div>
                    </div>

                    <div className="result-card">
                        <div className="result-header">
                            <span>Hexadecimal (Base 16)</span>
                            {hex && (
                                <button className="copy-btn" onClick={() => handleCopy(hex)}>
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                            )}
                        </div>
                        <div className="result-value">{hex || '0'}</div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .converter-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 3rem; box-shadow: var(--shadow-lg); }
                
                .input-section { margin-bottom: 2.5rem; }
                .input-section label { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; color: var(--secondary); margin-bottom: 1rem; font-size: 0.9rem; }
                .input-section input { width: 100%; padding: 1.5rem; border-radius: 1.25rem; border: 2px solid var(--border); background: var(--background); font-size: 1.5rem; font-weight: 800; color: var(--primary); text-align: center; }

                .results-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
                .result-card { background: var(--background); border: 1px solid var(--border); border-radius: 1.25rem; padding: 1.75rem; }
                .result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                .result-header span { font-size: 0.75rem; font-weight: 800; color: var(--secondary); text-transform: uppercase; }
                .result-value { font-family: 'Courier New', monospace; font-size: 1.5rem; font-weight: 700; color: var(--foreground); word-break: break-all; }

                .copy-btn { padding: 0.4rem; background: var(--primary-soft); color: var(--primary); border-radius: 0.4rem; transition: all 0.2s; }
                .copy-btn:hover { background: var(--primary); color: white; }
            `}</style>
        </div>
    );
}
