'use client';

import { useState, useEffect } from 'react';
import { Type, Copy, Trash2, Check, RefreshCw, Hash } from 'lucide-react';

const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

function convertToWords(num: number): string {
    if (num === 0) return 'zero';
    if (num < 0) return 'negative ' + convertToWords(Math.abs(num));

    let words = '';

    if (Math.floor(num / 1000000000) > 0) {
        words += convertToWords(Math.floor(num / 1000000000)) + ' billion ';
        num %= 1000000000;
    }

    if (Math.floor(num / 1000000) > 0) {
        words += convertToWords(Math.floor(num / 1000000)) + ' million ';
        num %= 1000000;
    }

    if (Math.floor(num / 1000) > 0) {
        words += convertToWords(Math.floor(num / 1000)) + ' thousand ';
        num %= 1000;
    }

    if (Math.floor(num / 100) > 0) {
        words += convertToWords(Math.floor(num / 100)) + ' hundred ';
        num %= 100;
    }

    if (num > 0) {
        if (words !== '') words += 'and ';
        if (num < 10) words += ones[num];
        else if (num < 20) words += teens[num - 10];
        else {
            words += tens[Math.floor(num / 10)];
            if (num % 10 > 0) words += '-' + ones[num % 10];
        }
    }

    return words.trim();
}

export default function NumberToWord() {
    const [input, setInput] = useState('12345');
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const val = parseInt(input.replace(/,/g, ''));
        if (!isNaN(val)) {
            setResult(convertToWords(val));
        } else {
            setResult('');
        }
    }, [input]);

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="converter-card">
                <div className="input-section">
                    <label><Hash size={18} /> Enter Number</label>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g. 1000"
                    />
                </div>

                <div className="result-section">
                    <div className="panel-header">
                        <span>Spelled Out Version</span>
                        {result && (
                            <button className="copy-btn" onClick={handleCopy}>
                                {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy Text</>}
                            </button>
                        )}
                    </div>
                    <div className="result-display">
                        {result || 'Enter a valid number...'}
                    </div>
                </div>

                <div className="example-chips">
                    <span className="label">Quick Try:</span>
                    <button onClick={() => setInput('1000000')}>1 Million</button>
                    <button onClick={() => setInput('365')}>365</button>
                    <button onClick={() => setInput('9999')}>9999</button>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 700px; margin: 0 auto; }
                .converter-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 3rem; box-shadow: var(--shadow-lg); }
                
                .input-section { margin-bottom: 2.5rem; }
                .input-section label { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; color: var(--secondary); margin-bottom: 1rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; }
                .input-section input { width: 100%; padding: 1.5rem; border-radius: 1.25rem; border: 2px solid var(--border); background: var(--background); font-size: 2rem; font-weight: 800; color: var(--primary); text-align: center; }

                .result-section { background: var(--background); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2rem; }
                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; font-size: 0.75rem; font-weight: 800; color: var(--secondary); text-transform: uppercase; }
                .result-display { font-size: 1.5rem; font-weight: 700; color: var(--foreground); line-height: 1.5; text-transform: capitalize; }

                .copy-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--primary-soft); color: var(--primary); border-radius: 0.6rem; font-weight: 700; }
                
                .example-chips { margin-top: 2rem; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
                .example-chips .label { font-size: 0.8rem; font-weight: 700; color: var(--secondary); }
                .example-chips button { padding: 0.5rem 1rem; background: var(--background); border: 1px solid var(--border); border-radius: 0.5rem; font-size: 0.85rem; font-weight: 600; color: var(--secondary); }
                .example-chips button:hover { border-color: var(--primary); color: var(--primary); }
            `}</style>
        </div>
    );
}
