'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Eye, Users, BarChart3 } from 'lucide-react';

export default function YoutubeMoneyCalculator() {
    const [views, setViews] = useState('100000');
    const [cpm, setCpm] = useState('2.5');
    const [engagementRate, setEngagementRate] = useState('5');

    const [dailyEarnings, setDailyEarnings] = useState(0);
    const [monthlyEarnings, setMonthlyEarnings] = useState(0);
    const [yearlyEarnings, setYearlyEarnings] = useState(0);
    const [estimatedSubscribers, setEstimatedSubscribers] = useState(0);

    const calculate = () => {
        const viewCount = parseFloat(views) || 0;
        const cpmValue = parseFloat(cpm) || 0;
        const engagement = parseFloat(engagementRate) / 100 || 0;

        // Calculate earnings (CPM = cost per 1000 views)
        const daily = (viewCount / 1000) * cpmValue;
        setDailyEarnings(daily);
        setMonthlyEarnings(daily * 30);
        setYearlyEarnings(daily * 365);

        // Estimate subscribers based on views and engagement
        const estimatedSubs = viewCount * engagement * 0.1;
        setEstimatedSubscribers(estimatedSubs);
    };

    useEffect(() => {
        calculate();
    }, [views, cpm, engagementRate]);

    return (
        <div className="tool-ui">
            <div className="calculator-layout">
                <div className="config-panel">
                    <div className="config-group">
                        <label><Eye size={16} /> Daily Video Views</label>
                        <input
                            type="number"
                            value={views}
                            onChange={(e) => setViews(e.target.value)}
                        />
                    </div>

                    <div className="config-group">
                        <label><DollarSign size={16} /> CPM (Cost Per 1000 Views)</label>
                        <input
                            type="number"
                            value={cpm}
                            onChange={(e) => setCpm(e.target.value)}
                            step="0.1"
                        />
                        <p className="hint">Average CPM ranges from $0.25 to $4.00</p>
                    </div>

                    <div className="config-group">
                        <label><BarChart3 size={16} /> Engagement Rate (%)</label>
                        <input
                            type="number"
                            value={engagementRate}
                            onChange={(e) => setEngagementRate(e.target.value)}
                            step="0.1"
                        />
                    </div>

                    <div className="preset-buttons">
                        <button onClick={() => { setViews('10000'); setCpm('1.5'); }}>Small Channel</button>
                        <button onClick={() => { setViews('100000'); setCpm('2.5'); }}>Medium Channel</button>
                        <button onClick={() => { setViews('1000000'); setCpm('4'); }}>Large Channel</button>
                    </div>
                </div>

                <div className="results-panel">
                    <div className="revenue-card primary">
                        <TrendingUp size={24} className="card-icon" />
                        <label>Estimated Daily Revenue</label>
                        <div className="amount">${dailyEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>

                    <div className="revenue-grid">
                        <div className="revenue-card">
                            <label>Monthly Revenue</label>
                            <div className="amount">${monthlyEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                        <div className="revenue-card">
                            <label>Yearly Revenue</label>
                            <div className="amount">${yearlyEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                    </div>

                    <div className="stats-card">
                        <Users size={20} />
                        <div>
                            <label>Estimated Subscriber Growth</label>
                            <span>{estimatedSubscribers.toLocaleString(undefined, { maximumFractionDigits: 0 })} / month</span>
                        </div>
                    </div>

                    <div className="disclaimer">
                        <strong>Note:</strong> These are estimates based on industry averages. Actual earnings vary by niche, audience location, ad types, and YouTube's monetization policies.
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { display: flex; flex-direction: column; gap: 2rem; }
                .calculator-layout { display: grid; grid-template-columns: 1fr; gap: 3rem; }
                @media (min-width: 1024px) { .calculator-layout { grid-template-columns: 350px 1fr; } }

                .config-panel { display: flex; flex-direction: column; gap: 1.5rem; padding: 2.5rem; background: var(--surface); border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow); height: fit-content; }
                .config-group { display: flex; flex-direction: column; gap: 0.75rem; }
                .config-group label { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: var(--secondary); font-size: 0.9rem; }
                .config-group input { padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); font-weight: 700; font-size: 1.1rem; color: var(--foreground); }
                .hint { font-size: 0.75rem; color: var(--secondary); margin-top: -0.25rem; }

                .preset-buttons { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
                .preset-buttons button { padding: 0.75rem; background: var(--background); border: 1px solid var(--border); border-radius: 0.75rem; font-weight: 600; font-size: 0.85rem; color: var(--secondary); transition: all 0.2s; }
                .preset-buttons button:hover { background: var(--primary-soft); color: var(--primary); border-color: var(--primary); }

                .results-panel { display: flex; flex-direction: column; gap: 2rem; }
                .revenue-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2rem; position: relative; box-shadow: var(--shadow-sm); }
                .revenue-card.primary { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; }
                .revenue-card label { display: block; font-size: 0.9rem; font-weight: 700; opacity: 0.9; margin-bottom: 0.75rem; }
                .revenue-card.primary label { color: white; }
                .amount { font-size: 2.5rem; font-weight: 900; letter-spacing: -0.02em; color: var(--foreground); }
                .revenue-card.primary .amount { color: white; }
                .card-icon { position: absolute; top: 1.5rem; right: 1.5rem; opacity: 0.2; }

                .revenue-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .revenue-grid .revenue-card { padding: 1.5rem; }
                .revenue-grid .amount { font-size: 1.75rem; }

                .stats-card { display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; background: var(--background); border: 1px solid var(--border); border-radius: 1.25rem; }
                .stats-card label { display: block; font-size: 0.8rem; font-weight: 700; color: var(--secondary); margin-bottom: 0.25rem; }
                .stats-card span { font-size: 1.25rem; font-weight: 800; color: var(--foreground); }

                .disclaimer { padding: 1.5rem; background: var(--primary-soft); border: 1px solid var(--primary); border-radius: 1rem; font-size: 0.85rem; line-height: 1.5; color: var(--secondary); }
                .disclaimer strong { color: var(--primary); }
            `}</style>
        </div>
    );
}
