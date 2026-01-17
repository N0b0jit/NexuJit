'use client';

import { useState } from 'react';
import { Calendar, Cake, Clock } from 'lucide-react';

export default function AgeCalculator() {
    const [birthDate, setBirthDate] = useState('');
    const [age, setAge] = useState<any>(null);

    const calculateAge = () => {
        if (!birthDate) return;

        const birth = new Date(birthDate);
        const now = new Date();

        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();
        let days = now.getDate() - birth.getDate();

        if (months < 0 || (months === 0 && days < 0)) {
            years--;
            months += 12;
        }
        if (days < 0) {
            months--;
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
        }

        // Total days
        const diffTime = Math.abs(now.getTime() - birth.getTime());
        const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        setAge({ years, months, days, totalDays });
    };

    return (
        <div className="tool-ui">
            <div className="calculator-card">
                <div className="input-section">
                    <label>Date of Birth</label>
                    <div className="input-wrapper">
                        <Calendar className="icon" size={20} />
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                        />
                    </div>
                </div>

                <button onClick={calculateAge} className="calc-btn" disabled={!birthDate}>
                    <Cake size={20} /> Calculate Age
                </button>
            </div>

            {age && (
                <div className="results-grid">
                    <div className="main-result">
                        <span className="years">{age.years}</span>
                        <span className="label">Years Old</span>
                    </div>

                    <div className="details-card">
                        <div className="detail-row">
                            <span className="val">{age.months}</span>
                            <span className="lbl">Months</span>
                        </div>
                        <div className="detail-row">
                            <span className="val">{age.days}</span>
                            <span className="lbl">Days</span>
                        </div>
                    </div>

                    <div className="total-stats">
                        <Clock size={16} /> Total Days Lived: <strong>{age.totalDays.toLocaleString()}</strong>
                    </div>
                </div>
            )}

            <style jsx>{`
                .tool-ui { max-width: 500px; margin: 0 auto; }
                .calculator-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2rem; box-shadow: var(--shadow-lg); margin-bottom: 2rem; }
                
                .input-section label { display: block; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem; }
                .input-wrapper { display: flex; align-items: center; gap: 1rem; background: var(--background); border: 2px solid var(--border); border-radius: 1rem; padding: 0.5rem 1rem; }
                .input-wrapper input { border: none; background: transparent; font-size: 1.1rem; padding: 0.5rem; flex: 1; outline: none; color: var(--foreground); }
                .icon { color: var(--secondary); }

                .calc-btn { width: 100%; margin-top: 1.5rem; padding: 1rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: transform 0.2s; }
                .calc-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 10px 20px var(--primary-soft); }
                .calc-btn:disabled { opacity: 0.7; }

                .results-grid { display: grid; gap: 1rem; animation: slideUp 0.4s ease; }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

                .main-result { background: linear-gradient(135deg, var(--primary), var(--primary-dark, #4f46e5)); color: white; padding: 2rem; border-radius: 1.5rem; text-align: center; display: flex; flex-direction: column; gap: 0.5rem; }
                .main-result .years { font-size: 4rem; font-weight: 900; line-height: 1; }
                .main-result .label { font-size: 1.2rem; font-weight: 700; opacity: 0.9; }

                .details-card { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .detail-row { background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 1rem; text-align: center; display: flex; flex-direction: column; }
                .detail-row .val { font-size: 2rem; font-weight: 800; color: var(--foreground); }
                .detail-row .lbl { font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: var(--secondary); margin-top: 0.25rem; }

                .total-stats { background: rgba(0,0,0,0.03); padding: 1rem; border-radius: 1rem; text-align: center; color: var(--secondary); font-size: 0.9rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
                .total-stats strong { color: var(--foreground); font-size: 1rem; }
            `}</style>
        </div>
    );
}
