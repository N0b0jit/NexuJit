'use client';

import { useState } from 'react';
import { Droplets, Activity, RefreshCw } from 'lucide-react';

export default function WaterIntakeCalculator() {
    const [weight, setWeight] = useState(70);
    const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
    const [activity, setActivity] = useState(30);
    const [result, setResult] = useState<number | null>(null);

    const calculate = () => {
        // Human basic needs: approx 35ml per kg of body weight
        // Activity: + approx 12ml per minute of exercise

        let weightInKg = weight;
        if (weightUnit === 'lbs') {
            weightInKg = weight * 0.453592;
        }

        const baseIntake = weightInKg * 35; // ml
        const activityIntake = activity * 12; // ml

        setResult(Math.round(baseIntake + activityIntake));
    };

    return (
        <div className="tool-ui">
            <div className="card">
                <div className="inputs">
                    <div className="input-group">
                        <label>Your Weight</label>
                        <div className="row">
                            <input
                                type="number"
                                value={weight}
                                onChange={e => setWeight(parseFloat(e.target.value) || 0)}
                            />
                            <select value={weightUnit} onChange={e => setWeightUnit(e.target.value as any)}>
                                <option value="kg">kg</option>
                                <option value="lbs">lbs</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Daily Activity (Minutes)</label>
                        <div className="row">
                            <input
                                type="number"
                                value={activity}
                                onChange={e => setActivity(parseFloat(e.target.value) || 0)}
                            />
                            <span className="unit">min</span>
                        </div>
                    </div>

                    <button className="calc-btn" onClick={calculate}>Calculate Needs</button>
                </div>

                {result !== null && (
                    <div className="result-box">
                        <Droplets size={48} className="icon" />
                        <div className="res-content">
                            <h3>Recommended Daily Intake</h3>
                            <div className="main-val">{result} ml</div>
                            <div className="sub-val">≈ {(result / 1000).toFixed(1)} Liters</div>
                            <div className="sub-val">≈ {(result / 240).toFixed(0)} Glasses (8oz)</div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 600px; margin: 0 auto; }
                .card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); }
                
                .inputs { display: flex; flex-direction: column; gap: 1.5rem; }
                .input-group label { display: block; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem; }
                .row { display: flex; gap: 0.5rem; align-items: center; }
                
                input { flex: 1; padding: 1rem; border: 2px solid var(--border); border-radius: 0.75rem; background: var(--background); font-size: 1.1rem; }
                select { padding: 1rem; border: 2px solid var(--border); border-radius: 0.75rem; background: var(--background); font-weight: 700; width: 80px; }
                .unit { padding: 1rem; background: var(--surface); font-weight: 700; color: var(--secondary); }

                .calc-btn { background: var(--primary); color: white; padding: 1rem; border-radius: 0.75rem; font-weight: 700; cursor: pointer; transition: transform 0.2s; margin-top: 1rem; }
                .calc-btn:hover { transform: translateY(-2px); }

                .result-box { margin-top: 2rem; background: #e0f2fe; padding: 2rem; border-radius: 1rem; display: flex; align-items: center; gap: 1.5rem; border: 1px solid #bae6fd; color: #0c4a6e; }
                .icon { color: #0284c7; flex-shrink: 0; }
                .main-val { font-size: 3rem; font-weight: 800; line-height: 1; margin: 0.5rem 0; color: #0284c7; }
                .sub-val { opacity: 0.8; font-weight: 600; }
                h3 { margin: 0; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.7; }
            `}</style>
        </div>
    );
}
