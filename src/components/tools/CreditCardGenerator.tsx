'use client';

import { useState } from 'react';
import { CreditCard, Copy, Check, RefreshCw } from 'lucide-react';

export default function CreditCardGenerator() {
    const [card, setCard] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    const generateCard = () => {
        // Luhn Algorithm compliant dummy numbers (prefixes are standard test prefixes)
        const visaPrefix = '4539';
        const mastercardPrefix = '5539';
        const amexPrefix = '3782';

        const types = ['Visa', 'Mastercard', 'Amex'];
        const type = types[Math.floor(Math.random() * types.length)];

        let prefix = visaPrefix;
        let length = 16;

        if (type === 'Mastercard') { prefix = mastercardPrefix; }
        else if (type === 'Amex') { prefix = amexPrefix; length = 15; }

        let number = prefix;
        while (number.length < length - 1) {
            number += Math.floor(Math.random() * 10).toString();
        }

        // Calculate checksum
        let sum = 0;
        let isSecond = true;
        for (let i = number.length - 1; i >= 0; i--) {
            let d = parseInt(number[i]);
            if (isSecond) {
                d *= 2;
                if (d > 9) d -= 9;
            }
            sum += d;
            isSecond = !isSecond;
        }
        const checkDigit = (10 - (sum % 10)) % 10;
        number += checkDigit;

        // Generate expiry
        const month = Math.floor(Math.random() * 12) + 1;
        const year = new Date().getFullYear() + Math.floor(Math.random() * 5) + 1;

        // Generate CVV
        const cvv = Math.floor(Math.random() * (type === 'Amex' ? 9000 : 900)) + (type === 'Amex' ? 1000 : 100);

        setCard({
            type,
            number: number.match(/.{1,4}/g)?.join(' '),
            expiry: `${month.toString().padStart(2, '0')}/${year}`,
            cvv,
            name: 'JOHN DOE'
        });
    };

    const handleCopy = () => {
        if (!card) return;
        navigator.clipboard.writeText(card.number.replace(/\s/g, ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="generator-card">
                <div className={`card-preview ${card?.type.toLowerCase()}`}>
                    {card ? (
                        <>
                            <div className="card-top">
                                <span className="card-type">{card.type}</span>
                                <CreditCard size={32} />
                            </div>
                            <div className="card-number">{card.number}</div>
                            <div className="card-bottom">
                                <div className="card-info">
                                    <label>Card Holder</label>
                                    <span>{card.name}</span>
                                </div>
                                <div className="card-info">
                                    <label>Expires</label>
                                    <span>{card.expiry}</span>
                                </div>
                                <div className="card-info">
                                    <label>CVV</label>
                                    <span>{card.cvv}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            <CreditCard size={48} className="ghost-icon" />
                            <p>Click generate to create a dummy test card</p>
                        </div>
                    )}
                </div>

                <div className="controls">
                    <button onClick={generateCard} className="generate-btn">
                        <RefreshCw size={20} /> Generate New Card
                    </button>
                    {card && (
                        <button onClick={handleCopy} className="copy-btn">
                            {copied ? <><Check size={20} /> Copied</> : <><Copy size={20} /> Copy Number</>}
                        </button>
                    )}
                </div>

                <p className="disclaimer">
                    <strong>Note:</strong> These are algorithmically valid dummy numbers for testing purposes only.
                    They cannot be used for real purchases.
                </p>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 600px; margin: 0 auto; }
                .generator-card { display: flex; flex-direction: column; gap: 2rem; }
                
                .card-preview { background: linear-gradient(135deg, #1e293b, #0f172a); aspect-ratio: 1.586; border-radius: 1.5rem; padding: 2rem; color: white; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 20px 50px -12px rgba(0,0,0,0.5); position: relative; overflow: hidden; }
                .card-preview::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%); pointer-events: none; }
                
                .card-preview.visa { background: linear-gradient(135deg, #1a1f71, #0055ff); }
                .card-preview.mastercard { background: linear-gradient(135deg, #222, #444); }
                .card-preview.amex { background: linear-gradient(135deg, #447755, #225533); }

                .card-top { display: flex; justify-content: space-between; align-items: flex-start; }
                .card-type { font-weight: 800; font-size: 1.5rem; font-style: italic; opacity: 0.9; }
                
                .card-number { font-family: monospace; font-size: 1.8rem; letter-spacing: 2px; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
                
                .card-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
                .card-info label { display: block; font-size: 0.6rem; text-transform: uppercase; opacity: 0.7; margin-bottom: 0.25rem; }
                .card-info span { font-family: monospace; font-size: 1.1rem; }

                .empty-state { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0.5; gap: 1rem; }
                
                .controls { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .generate-btn, .copy-btn { padding: 1.25rem; border-radius: 1rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: all 0.2s; }
                .generate-btn { background: var(--primary); color: white; }
                .generate-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px var(--primary-soft); }
                .copy-btn { background: var(--surface); border: 2px solid var(--border); color: var(--foreground); }
                .copy-btn:hover { border-color: var(--primary); color: var(--primary); }

                .disclaimer { text-align: center; font-size: 0.85rem; color: var(--secondary); line-height: 1.6; background: var(--surface); padding: 1rem; border-radius: 1rem; border: 1px solid var(--border); }
            `}</style>
        </div>
    );
}
