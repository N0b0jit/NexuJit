'use client';

import { useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

export default function DateCalculator() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        if (!startDate || !endDate) return;

        const start = new Date(startDate);
        const end = new Date(endDate);

        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Calculate years, months, days roughly
        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        let days = end.getDate() - start.getDate();

        // Adjust for negative diffs if end < start logic was needed, but we used abs time for total days.
        // Let's do precise YMD breakdown:
        // If end is before start, swap for calculation
        let d1 = start;
        let d2 = end;
        if (d1 > d2) { [d1, d2] = [d2, d1]; }

        let y = d2.getFullYear() - d1.getFullYear();
        let m = d2.getMonth() - d1.getMonth();
        let d = d2.getDate() - d1.getDate();

        if (d < 0) {
            m--;
            // Days in previous month
            const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
            d += prevMonth.getDate();
        }
        if (m < 0) {
            y--;
            m += 12;
        }

        const weeks = Math.floor(diffDays / 7);
        const remainingDays = diffDays % 7;

        setResult({
            totalDays: diffDays,
            years: y,
            months: m,
            days: d,
            weeks: weeks,
            remDays: remainingDays
        });
    };

    return (
        <div className="tool-ui">
            <div className="calc-card">
                <div className="input-row">
                    <div className="group">
                        <label>Start Date</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div className="group">
                        <label>End Date</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                </div>

                <button onClick={calculate} className="calc-btn">
                    Calculate Duration <ArrowRight size={18} />
                </button>

                {result && (
                    <div className="results">
                        <div className="main-stat">
                            <span className="val">{result.totalDays}</span>
                            <span className="lbl">Total Days</span>
                        </div>

                        <div className="breakdown">
                            <div className="bd-item">
                                <span className="bd-val">{result.years}</span>
                                <span className="bd-lbl">Years</span>
                            </div>
                            <div className="bd-item">
                                <span className="bd-val">{result.months}</span>
                                <span className="bd-lbl">Months</span>
                            </div>
                            <div className="bd-item">
                                <span className="bd-val">{result.days}</span>
                                <span className="bd-lbl">Days</span>
                            </div>
                        </div>

                        <div className="alt-text">
                            Or <strong>{result.weeks} weeks</strong> and <strong>{result.remDays} days</strong>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 500px; margin: 0 auto; }
                .calc-card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow-lg); }
                
                .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
                .group label { display: block; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem; font-size: 0.9rem; }
                input { width: 100%; padding: 1rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); font-size: 1.1rem; }

                .calc-btn { width: 100%; padding: 1rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }

                .results { margin-top: 2rem; text-align: center; }
                .main-stat { background: var(--primary); color: white; padding: 2rem; border-radius: 1.5rem; margin-bottom: 1.5rem; }
                .main-stat .val { font-size: 3rem; font-weight: 900; line-height: 1; display: block; }
                .main-stat .lbl { font-size: 1rem; font-weight: 700; opacity: 0.9; text-transform: uppercase; }

                .breakdown { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
                .bd-item { flex: 1; padding: 1rem; background: var(--background); border-radius: 1rem; border: 1px solid var(--border); }
                .bd-val { display: block; font-size: 1.5rem; font-weight: 800; }
                .bd-lbl { font-size: 0.8rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; }

                .alt-text { color: var(--secondary); font-size: 0.95rem; }
                .alt-text strong { color: var(--foreground); }
            `}</style>
        </div>
    );
}
