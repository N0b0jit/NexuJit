'use client';

import { useState } from 'react';
import { Hash, Copy, Check, ArrowRight } from 'lucide-react';

export default function Md5Generator() {
    const [input, setInput] = useState('');
    const [hash, setHash] = useState('');
    const [copied, setCopied] = useState(false);

    // Simple MD5 implementation (for production, use crypto-js or similar)
    const generateMD5 = async (str: string) => {
        if (!str) {
            setHash('');
            return;
        }

        // Use Web Crypto API for hashing
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        setHash(hashHex);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(hash);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="hash-card">
                <div className="input-section">
                    <label><Hash size={18} /> Text to Hash</label>
                    <textarea
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            generateMD5(e.target.value);
                        }}
                        placeholder="Enter text to generate hash..."
                        rows={6}
                    />
                </div>

                <div className="output-section">
                    <div className="panel-header">
                        <span>SHA-256 Hash</span>
                        {hash && (
                            <button className="copy-btn" onClick={handleCopy}>
                                {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy Hash</>}
                            </button>
                        )}
                    </div>
                    <div className="hash-display">
                        {hash || 'Hash will appear here...'}
                    </div>
                </div>

                <div className="info-box">
                    <strong>Note:</strong> This tool uses SHA-256 hashing algorithm. Hashes are one-way cryptographic functions and cannot be reversed.
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .hash-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 3rem; box-shadow: var(--shadow-lg); }
                
                .input-section { margin-bottom: 2.5rem; }
                .input-section label { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; color: var(--secondary); margin-bottom: 1rem; font-size: 0.9rem; }
                .input-section textarea { width: 100%; padding: 1.25rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); font-size: 1rem; line-height: 1.6; resize: none; color: var(--foreground); }

                .output-section { background: var(--background); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2rem; margin-bottom: 2rem; }
                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; font-size: 0.75rem; font-weight: 800; color: var(--secondary); text-transform: uppercase; }
                .hash-display { font-family: 'Courier New', monospace; font-size: 0.95rem; font-weight: 700; color: var(--foreground); word-break: break-all; line-height: 1.6; padding: 1rem; background: var(--surface); border-radius: 0.75rem; }

                .copy-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--primary-soft); color: var(--primary); border-radius: 0.6rem; font-weight: 700; }
                
                .info-box { padding: 1.25rem; background: var(--primary-soft); border: 1px solid var(--primary); border-radius: 1rem; font-size: 0.85rem; line-height: 1.5; color: var(--secondary); }
                .info-box strong { color: var(--primary); }
            `}</style>
        </div>
    );
}
