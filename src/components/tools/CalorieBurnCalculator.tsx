'use client';

import { useState } from 'react';
import { Flame, Activity, TrendingUp } from 'lucide-react';

export default function CalorieBurnCalculator() {
    const [weight, setWeight] = useState(70);
    const [duration, setDuration] = useState(30);
    const [activityId, setActivityId] = useState('run_5');
    const [result, setResult] = useState<number | null>(null);

    // MET (Metabolic Equivalent of Task) values
    const ACTIVITIES = [
        { id: 'walk_3', name: 'Walking (3 mph)', met: 3.5 },
        { id: 'run_5', name: 'Running (5 mph)', met: 8.3 },
        { id: 'run_8', name: 'Running (8 mph)', met: 11.8 },
        { id: 'cycle_mod', name: 'Cycling (Moderate)', met: 7.5 },
        { id: 'swim_mod', name: 'Swimming (Moderate)', met: 6.0 },
        { id: 'weight_lift', name: 'Weight Lifting', met: 3.5 },
        { id: 'yoga', name: 'Yoga', met: 2.5 },
        { id: 'hiit', name: 'HIIT Workout', met: 8.0 },
        { id: 'clean', name: 'Household Cleaning', met: 3.0 },
        { id: 'sleep', name: 'Sleeping', met: 0.95 },
    ];

    const calculate = () => {
        const act = ACTIVITIES.find(a => a.id === activityId);
        if (!act) return;

        // Formula: Calories = (MET * 3.5 * Weight(kg) / 200) * Minutes
        const weightKg = weight; // Assuming input is kg for simplicity, or handle units
        const burned = (act.met * 3.5 * weightKg / 200) * duration;

        setResult(Math.round(burned));
    };

    return (
        <div className="tool-ui">
            <div className="card">
                <div className="inputs-grid">
                    <div className="input-grp">
                        <label>Your Weight (kg)</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={e => setWeight(parseFloat(e.target.value) || 0)}
                        />
                    </div>

                    <div className="input-grp">
                        <label>Duration (minutes)</label>
                        <input
                            type="number"
                            value={duration}
                            onChange={e => setDuration(parseFloat(e.target.value) || 0)}
                        />
                    </div>

                    <div className="input-grp full">
                        <label>Activity Type</label>
                        <select value={activityId} onChange={e => setActivityId(e.target.value)}>
                            {ACTIVITIES.map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="action">
                    <button onClick={calculate} className="burn-btn">
                        <Flame size={20} className={result ? 'animate-pulse' : ''} /> Calculate Burn
                    </button>
                </div>

                {result !== null && (
                    <div className="result-area">
                        <div className="circle">
                            <span className="val">{result}</span>
                            <span className="lbl">kcal</span>
                        </div>
                        <p className="summary">
                            Burned approx <strong>{result} calories</strong> doing <strong>{duration} mins</strong> of {ACTIVITIES.find(a => a.id === activityId)?.name}.
                        </p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 600px; margin: 0 auto; }
                .card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); }
                
                .inputs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
                .input-grp { display: flex; flex-direction: column; gap: 0.5rem; }
                .input-grp.full { grid-column: span 2; }
                
                label { font-weight: 700; color: var(--secondary); font-size: 0.9rem; }
                input, select { padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); font-size: 1.1rem; }
                
                .action { margin-bottom: 2rem; }
                .burn-btn { width: 100%; background: #fb923c; color: white; padding: 1rem; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: transform 0.2s; }
                .burn-btn:hover { background: #f97316; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3); }

                .result-area { text-align: center; border-top: 1px solid var(--border); padding-top: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
                .circle { width: 150px; height: 150px; background: var(--background); border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 4px solid #fb923c; }
                .val { font-size: 3rem; font-weight: 800; line-height: 1; color: var(--foreground); }
                .lbl { font-size: 0.9rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; }
                .summary { max-width: 80%; line-height: 1.5; color: var(--secondary); }
                strong { color: var(--foreground); }
            `}</style>
        </div>
    );
}
