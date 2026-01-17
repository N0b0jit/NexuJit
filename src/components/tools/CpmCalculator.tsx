'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Calculator, TrendingUp } from 'lucide-react';

export default function CpmCalculator() {
    const [impressions, setImpressions] = useState('10000');
    const [cost, setCost] = useState('50');
    const [cpm, setCpm] = useState(0);

    useEffect(() => {
        calculate();
    }, [impressions, cost]);

    const calculate = () => {
        const imp = parseFloat(impressions) || 0;
        const c = parseFloat(cost) || 0;

        if (imp > 0) {
            const calculatedCpm = (c / imp) * 1000;
            setCpm(calculatedCpm);
        } else {
            setCpm(0);
        }
    };

    return (
        <div className="tool-ui">
            <div className="calculator-card">
                <div className="input-section">
                    <div className="input-group">
                        <label><TrendingUp size={16} /> Total Impressions</label>
                        <input
                            type="number"
                            value={impressions}
                            onChange={(e) => setImpressions(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label><DollarSign size={16} /> Total Cost ($)</label>
                        <input
                            type="number"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            step="0.01"
                        />
                    </div>
                </div>

                <div className="result-section">
                    <div className="result-label">Cost Per Thousand (CPM)</div>
                    <div className="result-value">${cpm.toFixed(2)}</div>
                    <p className="hint">This is how much you pay for every 1,000 impressions</p>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 600px; margin: 0 auto; }
                .calculator-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 3rem; box-shadow: var(--shadow-lg); }
                
                .input-section { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2.5rem; }
                .input-group { display: flex; flex-direction: column; gap: 0.75rem; }
                .input-group label { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: var(--secondary); font-size: 0.9rem; }
                .input-group input { padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); font-weight: 700; font-size: 1.1rem; }

                .result-section { background: linear-gradient(135deg, var(--primary), #4f46e5); color: white; border-radius: 1.5rem; padding: 2.5rem; text-align: center; }
                .result-label { font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; opacity: 0.9; }
                .result-value { font-size: 3.5rem; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
                .hint { font-size: 0.85rem; opacity: 0.8; }
            `}</style>
        </div>
    );
}
