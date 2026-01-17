'use client';

import { useState } from 'react';
import { Activity, ArrowRight } from 'lucide-react';

export default function BmiCalculator() {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [unit, setUnit] = useState('metric'); // metric (kg/cm) or imperial (lbs/in)
    const [bmi, setBmi] = useState<number | null>(null);
    const [status, setStatus] = useState<string>('');

    const calculate = () => {
        const w = parseFloat(weight);
        const h = parseFloat(height);

        if (!w || !h) return;

        let bmiVal = 0;
        if (unit === 'metric') {
            // weight in kg, height in cm
            bmiVal = w / ((h / 100) * (h / 100));
        } else {
            // weight in lbs, height in inches (or feet/inches but simplified to inches for now, or assume height is total inches)
            // Formula: 703 * weight (lbs) / [height (in)]^2
            bmiVal = 703 * w / (h * h);
        }

        setBmi(parseFloat(bmiVal.toFixed(1)));

        if (bmiVal < 18.5) setStatus('Underweight');
        else if (bmiVal < 25) setStatus('Normal weight');
        else if (bmiVal < 30) setStatus('Overweight');
        else setStatus('Obese');
    };

    const getStatusColor = () => {
        if (status === 'Underweight') return '#3b82f6';
        if (status === 'Normal weight') return '#10b981';
        if (status === 'Overweight') return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="tool-ui">
            <div className="bmi-card">
                <div className="unit-toggle">
                    <button className={unit === 'metric' ? 'active' : ''} onClick={() => setUnit('metric')}>Metric (kg/cm)</button>
                    <button className={unit === 'imperial' ? 'active' : ''} onClick={() => setUnit('imperial')}>Imperial (lbs/in)</button>
                </div>

                <div className="input-group">
                    <label>Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
                    <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="0" />
                </div>

                <div className="input-group">
                    <label>Height ({unit === 'metric' ? 'cm' : 'inches'})</label>
                    <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="0" />
                </div>

                <button onClick={calculate} className="calc-btn">
                    Calculate BMI <ArrowRight size={18} />
                </button>

                {bmi !== null && (
                    <div className="result-section" style={{ borderColor: getStatusColor() }}>
                        <div className="bmi-val" style={{ color: getStatusColor() }}>{bmi}</div>
                        <div className="bmi-status">{status}</div>
                        <div className="bmi-scale">
                            <span className="scale-item" style={{ opacity: status === 'Underweight' ? 1 : 0.3 }}>Underweight</span>
                            <span className="scale-item" style={{ opacity: status === 'Normal weight' ? 1 : 0.3 }}>Normal</span>
                            <span className="scale-item" style={{ opacity: status === 'Overweight' ? 1 : 0.3 }}>Overweight</span>
                            <span className="scale-item" style={{ opacity: status === 'Obese' ? 1 : 0.3 }}>Obese</span>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 500px; margin: 0 auto; }
                .bmi-card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow-lg); }
                
                .unit-toggle { display: flex; background: var(--background); padding: 0.5rem; border-radius: 1rem; margin-bottom: 2rem; border: 1px solid var(--border); }
                .unit-toggle button { flex: 1; padding: 0.75rem; border-radius: 0.75rem; font-weight: 700; color: var(--secondary); transition: all 0.2s; }
                .unit-toggle button.active { background: var(--surface); color: var(--primary); box-shadow: var(--shadow); }

                .input-group { margin-bottom: 1.5rem; }
                .input-group label { display: block; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem; }
                .input-group input { width: 100%; padding: 1rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); font-size: 1.1rem; }

                .calc-btn { width: 100%; padding: 1rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }

                .result-section { margin-top: 2rem; padding: 2rem; background: var(--background); border-radius: 1.5rem; border: 2px solid; text-align: center; }
                .bmi-val { font-size: 3rem; font-weight: 900; line-height: 1; margin-bottom: 0.5rem; }
                .bmi-status { font-size: 1.2rem; font-weight: 700; text-transform: uppercase; color: var(--foreground); margin-bottom: 1.5rem; }
                
                .bmi-scale { display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; }
                .scale-item { padding: 0.25rem 0.5rem; background: var(--surface); border-radius: 0.5rem; }
            `}</style>
        </div>
    );
}
