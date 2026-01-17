'use client';

import { useState } from 'react';
import { DollarSign, Percent, Clock, ArrowRight } from 'lucide-react';

export default function LoanCalculator() {
    const [amount, setAmount] = useState('');
    const [rate, setRate] = useState('');
    const [term, setTerm] = useState('');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        const p = parseFloat(amount);
        const r = parseFloat(rate) / 100 / 12; // Monthly rate
        const n = parseFloat(term) * 12; // Total months

        if (!p || !r || !n) return;

        // M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
        const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const total = monthly * n;
        const interest = total - p;

        setResult({
            monthly: monthly.toFixed(2),
            total: total.toFixed(2),
            interest: interest.toFixed(2)
        });
    };

    return (
        <div className="tool-ui">
            <div className="calc-card">
                <div className="input-grid">
                    <div className="group">
                        <label><DollarSign size={16} /> Loan Amount</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="10000" />
                    </div>
                    <div className="group">
                        <label><Percent size={16} /> Interest Rate (%)</label>
                        <input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="5.5" />
                    </div>
                    <div className="group">
                        <label><Clock size={16} /> Loan Term (Years)</label>
                        <input type="number" value={term} onChange={e => setTerm(e.target.value)} placeholder="5" />
                    </div>
                </div>

                <button onClick={calculate} className="calc-btn">Calculate Loan</button>

                {result && (
                    <div className="results">
                        <div className="main-res">
                            <span className="lbl">Monthly Payment</span>
                            <span className="val">${result.monthly}</span>
                        </div>
                        <div className="sub-results">
                            <div className="sub-res">
                                <span className="lbl">Total Interest</span>
                                <span className="val">${result.interest}</span>
                            </div>
                            <div className="sub-res">
                                <span className="lbl">Total Payment</span>
                                <span className="val">${result.total}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 600px; margin: 0 auto; }
                .calc-card { background: var(--surface); padding: 2.5rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow-lg); }
                
                .input-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem; }
                @media(min-width: 640px) { .input-grid { grid-template-columns: 1fr 1fr 1fr; } }
                
                .group label { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: var(--secondary); font-size: 0.8rem; margin-bottom: 0.5rem; }
                input { width: 100%; padding: 1rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); font-size: 1.1rem; }

                .calc-btn { width: 100%; padding: 1rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; }

                .results { margin-top: 2rem; background: var(--background); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); }
                .main-res { text-align: center; margin-bottom: 2rem; }
                .main-res .lbl { display: block; font-size: 0.9rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; margin-bottom: 0.5rem; }
                .main-res .val { font-size: 2.5rem; font-weight: 900; color: var(--primary); }

                .sub-results { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top: 1px solid var(--border); padding-top: 1.5rem; }
                .sub-res { text-align: center; }
                .sub-res .lbl { display: block; font-size: 0.8rem; font-weight: 700; color: var(--secondary); margin-bottom: 0.25rem; }
                .sub-res .val { font-size: 1.2rem; font-weight: 700; color: var(--foreground); }
            `}</style>
        </div>
    );
}
