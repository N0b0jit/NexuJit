'use client';

import { useState } from 'react';
import { Activity, Info } from 'lucide-react';

export default function TdeeCalculator() {
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [age, setAge] = useState(25);
    const [weight, setWeight] = useState(70);
    const [height, setHeight] = useState(175);
    const [activity, setActivity] = useState(1.2);
    const [result, setResult] = useState<any>(null);

    const ACTIVITY_LEVELS = [
        { val: 1.2, label: 'Sedentary (Office job, little exercise)' },
        { val: 1.375, label: 'Light Exercise (1-2 days/week)' },
        { val: 1.55, label: 'Moderate Exercise (3-5 days/week)' },
        { val: 1.725, label: 'Heavy Exercise (6-7 days/week)' },
        { val: 1.9, label: 'Athlete (2x per day)' },
    ];

    const calculate = () => {
        // Mifflin-St Jeor Equation
        let bmr = (10 * weight) + (6.25 * height) - (5 * age);

        if (gender === 'male') {
            bmr += 5;
        } else {
            bmr -= 161;
        }

        const tdee = Math.round(bmr * activity);

        setResult({
            bmr: Math.round(bmr),
            tdee: tdee,
            cut: Math.round(tdee * 0.80), // -20%
            bulk: Math.round(tdee * 1.15) // +15%
        });
    };

    return (
        <div className="tool-ui">
            <div className="card">
                <div className="form-grid">
                    <div className="grp full">
                        <label>Gender</label>
                        <div className="toggle-gender">
                            <button className={gender === 'male' ? 'active' : ''} onClick={() => setGender('male')}>Male</button>
                            <button className={gender === 'female' ? 'active' : ''} onClick={() => setGender('female')}>Female</button>
                        </div>
                    </div>

                    <div className="grp">
                        <label>Age</label>
                        <input type="number" value={age} onChange={e => setAge(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="grp">
                        <label>Weight (kg)</label>
                        <input type="number" value={weight} onChange={e => setWeight(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="grp">
                        <label>Height (cm)</label>
                        <input type="number" value={height} onChange={e => setHeight(parseFloat(e.target.value) || 0)} />
                    </div>

                    <div className="grp full">
                        <label>Activity Level</label>
                        <select value={activity} onChange={e => setActivity(parseFloat(e.target.value))}>
                            {ACTIVITY_LEVELS.map(a => (
                                <option key={a.val} value={a.val}>{a.label}</option>
                            ))}
                        </select>
                    </div>

                    <button className="calc-btn full" onClick={calculate}>Calculate TDEE</button>
                </div>

                {result && (
                    <div className="results">
                        <div className="res-card main">
                            <div className="lbl">Maintenance Calories (TDEE)</div>
                            <div className="val">{result.tdee}</div>
                            <div className="desc">Calories per day to maintain current weight.</div>
                        </div>

                        <div className="strategies">
                            <div className="strat-card cut">
                                <span className="s-lbl">Weight Loss</span>
                                <span className="s-val">{result.cut}</span>
                                <span className="s-desc">Deficit (-20%)</span>
                            </div>
                            <div className="strat-card bulk">
                                <span className="s-lbl">Weight Gain</span>
                                <span className="s-val">{result.bulk}</span>
                                <span className="s-desc">Surplus (+15%)</span>
                            </div>
                        </div>

                        <div className="bmr-info">
                            <Activity size={16} /> Your <strong>BMR</strong> (Basal Metabolic Rate) is <strong>{result.bmr}</strong> kcal/day.
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 600px; margin: 0 auto; }
                .card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); }
                
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .grp { display: flex; flex-direction: column; gap: 0.5rem; }
                .grp.full { grid-column: span 2; }
                
                label { font-weight: 700; color: var(--secondary); font-size: 0.85rem; text-transform: uppercase; }
                input, select { padding: 0.8rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); font-size: 1rem; }
                
                .toggle-gender { display: flex; background: var(--background); padding: 0.25rem; border-radius: 0.75rem; border: 1px solid var(--border); }
                .toggle-gender button { flex: 1; padding: 0.6rem; border-radius: 0.5rem; font-weight: 600; color: var(--secondary); transition: all 0.2s; }
                .toggle-gender button.active { background: var(--surface); color: var(--primary); box-shadow: var(--shadow-sm); font-weight: 700; }
                
                .calc-btn { grid-column: span 2; background: var(--primary); color: white; padding: 1rem; border-radius: 0.75rem; font-weight: 800; margin-top: 1rem; }
                .calc-btn:hover { background: var(--primary-hover); }

                .results { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border); }
                .res-card.main { text-align: center; background: #e0e7ff; padding: 1.5rem; border-radius: 1rem; border: 1px solid #c7d2fe; color: #3730a3; margin-bottom: 1.5rem; }
                .res-card .lbl { font-size: 0.9rem; font-weight: 700; opacity: 0.7; margin-bottom: 0.5rem; }
                .res-card .val { font-size: 3rem; font-weight: 800; line-height: 1; }
                .res-card .desc { font-size: 0.8rem; margin-top: 0.5rem; opacity: 0.8; }

                .strategies { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .strat-card { padding: 1rem; border-radius: 1rem; display: flex; flex-direction: column; align-items: center; text-align: center; }
                .strat-card.cut { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
                .strat-card.bulk { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
                
                .s-lbl { font-size: 0.8rem; font-weight: 700; margin-bottom: 0.25rem; text-transform: uppercase; }
                .s-val { font-size: 1.8rem; font-weight: 800; }
                .s-desc { font-size: 0.75rem; opacity: 0.8; }

                .bmr-info { margin-top: 1.5rem; font-size: 0.9rem; color: var(--secondary); text-align: center; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
            `}</style>
        </div>
    );
}
