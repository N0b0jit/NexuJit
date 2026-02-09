'use client';

import { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, MousePointer2, Eye, Info } from 'lucide-react';

export default function AdsenseCalculator() {
    const [pageViews, setPageViews] = useState('10000');
    const [ctr, setCtr] = useState('2');
    const [cpc, setCpc] = useState('0.25');

    const [dailyEarnings, setDailyEarnings] = useState(0);
    const [monthlyEarnings, setMonthlyEarnings] = useState(0);
    const [yearlyEarnings, setYearlyEarnings] = useState(0);

    const calculate = () => {
        const views = parseFloat(pageViews) || 0;
        const ctrVal = parseFloat(ctr) / 100 || 0;
        const cpcVal = parseFloat(cpc) || 0;

        const daily = views * ctrVal * cpcVal;
        setDailyEarnings(daily);
        setMonthlyEarnings(daily * 30);
        setYearlyEarnings(daily * 365);
    };

    useEffect(() => {
        calculate();
    }, [pageViews, ctr, cpc]);

    return (
        <div className="tool-ui">
            <div className="adsense-layout">
                <div className="config-panel">
                    <div className="config-group">
                        <label><Eye size={16} /> Daily Page Views</label>
                        <input
                            type="number"
                            value={pageViews}
                            onChange={(e) => setPageViews(e.target.value)}
                        />
                    </div>

                    <div className="config-group">
                        <label><MousePointer2 size={16} /> Click Through Rate (CTR) %</label>
                        <input
                            type="number"
                            value={ctr}
                            onChange={(e) => setCtr(e.target.value)}
                            step="0.01"
                        />
                    </div>

                    <div className="config-group">
                        <label><DollarSign size={16} /> Cost Per Click (CPC)</label>
                        <input
                            type="number"
                            value={cpc}
                            onChange={(e) => setCpc(e.target.value)}
                            step="0.01"
                        />
                    </div>

                    <div className="info-box">
                        <Info size={16} />
                        <p>These are estimates based on your inputs. Actual Adsense revenue varies by niche, geography, and ad types.</p>
                    </div>
                </div>

                <div className="revenue-panel">
                    <div className="revenue-card daily">
                        <label>Daily Revenue</label>
                        <div className="amount">${dailyEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <TrendingUp size={48} className="card-bg-icon" />
                    </div>

                    <div className="revenue-row">
                        <div className="revenue-card compact">
                            <label>Monthly Revenue</label>
                            <div className="amount">${monthlyEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                        <div className="revenue-card compact">
                            <label>Yearly Revenue</label>
                            <div className="amount">${yearlyEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { display: flex; flex-direction: column; gap: 2rem; }
                .adsense-layout { display: grid; grid-template-columns: 1fr; gap: 3rem; }
                @media (min-width: 1024px) { .adsense-layout { grid-template-columns: 400px 1fr; } }

                .config-panel { display: flex; flex-direction: column; gap: 1.5rem; padding: 2.5rem; background: var(--surface); border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow); }
                .config-group { display: flex; flex-direction: column; gap: 0.75rem; }
                .config-group label { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: var(--secondary); font-size: 0.9rem; }
                .config-group input { padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); font-weight: 700; font-size: 1.1rem; color: var(--primary); }

                .info-box { margin-top: 1rem; padding: 1rem; background: var(--primary-soft); color: var(--primary); border-radius: 0.75rem; display: flex; gap: 0.75rem; font-size: 0.85rem; line-height: 1.4; border: 1px solid var(--primary-soft); }

                .revenue-panel { display: flex; flex-direction: column; gap: 1.5rem; justify-content: center; }
                .revenue-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2.5rem; position: relative; overflow: hidden; box-shadow: var(--shadow-sm); }
                .revenue-card.daily { background: linear-gradient(135deg, var(--primary), #4f46e5); color: white; border: none; }
                .revenue-card label { display: block; font-size: 1rem; font-weight: 700; opacity: 0.9; margin-bottom: 0.5rem; }
                .revenue-card.daily label { color: white; }
                .amount { font-size: 3.5rem; font-weight: 900; letter-spacing: -0.02em; }
                .card-bg-icon { position: absolute; bottom: -10px; right: -10px; opacity: 0.1; color: white; }

                .revenue-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .revenue-card.compact { padding: 1.75rem; }
                .revenue-card.compact .amount { font-size: 2rem; color: var(--foreground); }
            `}</style>
        </div>
    );
}
