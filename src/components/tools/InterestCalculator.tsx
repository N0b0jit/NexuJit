'use client';

import { useState } from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';

export default function InterestCalculator() {
    const [principal, setPrincipal] = useState('');
    const [rate, setRate] = useState('');
    const [time, setTime] = useState('');
    const [type, setType] = useState('compound'); // simple or compound
    const [frequency, setFrequency] = useState('1'); // Compounding frequency (1=yearly, 12=monthly)
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        const p = parseFloat(principal);
        const r = parseFloat(rate) / 100;
        const t = parseFloat(time);

        if (!p || !r || !t) return;

        let total = 0;
        let interest = 0;

        if (type === 'simple') {
            // A = P(1 + rt)
            interest = p * r * t;
            total = p + interest;
        } else {
            // A = P(1 + r/n)^(nt)
            const n = parseFloat(frequency);
            total = p * Math.pow((1 + r / n), n * t);
            interest = total - p;
        }

        setResult({
            total: total.toFixed(2),
            interest: interest.toFixed(2)
        });
    };

    return (
        <div className="tool-ui">
            <div className="calc-card">
                <div className="calc-type">
                    <button className={type === 'simple' ? 'active' : ''} onClick={() => setType('simple')}>Simple Interest</button>
                    <button className={type === 'compound' ? 'active' : ''} onClick={() => setType('compound')}>Compound Interest</button>
                </div>

                <div className="input-grid">
                    <div className="group">
                        <label>Principal Amount</label>
                        <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="10000" />
                    </div>
                    <div className="group">
                        <label>Annual Rate (%)</label>
                        <input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="5" />
                    </div>
                    <div className="group">
                        <label>Time (Years)</label>
                        <input type="number" value={time} onChange={e => setTime(e.target.value)} placeholder="5" />
                    </div>
                    {type === 'compound' && (
                        <div className="group">
                            <label>Compounding Frequency</label>
                            <select value={frequency} onChange={e => setFrequency(e.target.value)}>
                                <option value="1">Annually</option>
                                <option value="2">Semi-Annually</option>
                                <option value="4">Quarterly</option>
                                <option value="12">Monthly</option>
                                <option value="365">Daily</option>
                            </select>
                        </div>
                    )}
                </div>

                <button onClick={calculate} className="calc-btn">Calculate <ArrowRight size={18} /></button>

                {result && (
                    <div className="results">
                        <div className="res-row main">
                            <span>Total Maturity Value</span>
                            <strong>${result.total}</strong>
                        </div>
                        <div className="res-row sub">
                            <span>Total Interest Earned</span>
                            <strong>${result.interest}</strong>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 600px; margin: 0 auto; }
                .calc-card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); }
                
                .calc-type { display: flex; background: var(--background); padding: 0.5rem; border-radius: 1rem; margin-bottom: 2rem; border: 1px solid var(--border); }
                .calc-type button { flex: 1; padding: 0.75rem; border-radius: 0.75rem; font-weight: 700; color: var(--secondary); transition: all 0.2s; }
                .calc-type button.active { background: var(--surface); color: var(--primary); box-shadow: var(--shadow); }

                .input-grid { display: grid; gap: 1.5rem; grid-template-columns: 1fr 1fr; margin-bottom: 2rem; }
                .group label { display: block; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem; font-size: 0.8rem; }
                input, select { width: 100%; padding: 0.8rem; border-radius: 0.8rem; border: 2px solid var(--border); background: var(--background); font-size: 1rem; }

                .calc-btn { width: 100%; padding: 1rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }

                .results { margin-top: 2rem; }
                .res-row { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; background: var(--background); border-radius: 1rem; margin-bottom: 0.5rem; }
                .res-row.main { background: var(--primary); color: white; }
                .res-row.sub { border: 1px solid var(--border); }
                .res-row span { font-weight: 600; font-size: 0.9rem; }
                .res-row strong { font-size: 1.5rem; font-weight: 900; }
            `}</style>
        </div>
    );
}
