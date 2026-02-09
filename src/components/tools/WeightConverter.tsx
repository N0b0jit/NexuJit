'use client';

import { useState } from 'react';
import { Scale, ArrowRightLeft } from 'lucide-react';

export default function WeightConverter() {
    const [value, setValue] = useState('');
    const [fromUnit, setFromUnit] = useState('kg');
    const [toUnit, setToUnit] = useState('lbs');
    const [result, setResult] = useState<string | null>(null);

    const convert = () => {
        const val = parseFloat(value);
        if (isNaN(val)) return;

        // Convert to grams first
        let grams = 0;
        switch (fromUnit) {
            case 'kg': grams = val * 1000; break;
            case 'g': grams = val; break;
            case 'lbs': grams = val * 453.592; break;
            case 'oz': grams = val * 28.3495; break;
        }

        // Convert from grams to target
        let final = 0;
        switch (toUnit) {
            case 'kg': final = grams / 1000; break;
            case 'g': final = grams; break;
            case 'lbs': final = grams / 453.592; break;
            case 'oz': final = grams / 28.3495; break;
        }

        setResult(final.toLocaleString(undefined, { maximumFractionDigits: 4 }));
    };

    return (
        <div className="tool-ui">
            <div className="converter-card">
                <div className="input-row">
                    <div className="group">
                        <label>Value</label>
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => { setValue(e.target.value); setResult(null); }}
                            placeholder="0"
                        />
                    </div>
                    <div className="group unit">
                        <label>Unit</label>
                        <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                            <option value="kg">Kilograms (kg)</option>
                            <option value="g">Grams (g)</option>
                            <option value="lbs">Pounds (lbs)</option>
                            <option value="oz">Ounces (oz)</option>
                        </select>
                    </div>
                </div>

                <div className="divider">
                    <button className="convert-icon" onClick={convert}><ArrowRightLeft size={20} /></button>
                </div>

                <div className="input-row">
                    <div className="group">
                        <label>Result</label>
                        <div className="result-display">{result || '-'}</div>
                    </div>
                    <div className="group unit">
                        <label>Target</label>
                        <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
                            <option value="kg">Kilograms (kg)</option>
                            <option value="g">Grams (g)</option>
                            <option value="lbs">Pounds (lbs)</option>
                            <option value="oz">Ounces (oz)</option>
                        </select>
                    </div>
                </div>

                <button onClick={convert} className="action-btn">Convert</button>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 500px; margin: 0 auto; }
                .converter-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2rem; box-shadow: var(--shadow-lg); }
                
                .input-row { display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; }
                .group label { display: block; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem; font-size: 0.8rem; text-transform: uppercase; }
                input, select, .result-display { width: 100%; padding: 1rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); font-size: 1.2rem; font-weight: 700; height: 60px; display: flex; align-items: center; }
                .result-display { color: var(--primary); background: rgba(0,0,0,0.02); }

                .divider { display: flex; align-items: center; justify-content: center; margin: 1.5rem 0; position: relative; }
                .divider::before { content: ''; position: absolute; left: 0; right: 0; height: 1px; background: var(--border); }
                .convert-icon { position: relative; background: var(--surface); border: 2px solid var(--border); padding: 0.75rem; border-radius: 50%; color: var(--secondary); transition: all 0.2s; cursor: pointer; }
                .convert-icon:hover { color: var(--primary); border-color: var(--primary); transform: rotate(180deg); }

                .action-btn { width: 100%; margin-top: 2rem; padding: 1rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; font-size: 1.1rem; transition: opacity 0.2s; }
                .action-btn:hover { opacity: 0.9; }
            `}</style>
        </div>
    );
}
