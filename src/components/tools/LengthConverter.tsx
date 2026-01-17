'use client';

import { useState, useEffect } from 'react';
import { Ruler, ArrowRightLeft, Settings } from 'lucide-react';

const units = [
    { label: 'Milliseconds (ms)', factor: 0.001 },
    { label: 'Seconds (s)', factor: 1 },
    { label: 'Minutes (min)', factor: 60 },
    { label: 'Hours (h)', factor: 3600 },
    { label: 'Days (d)', factor: 86400 },
    { label: 'Weeks (wk)', factor: 604800 },
    { label: 'Months (mo)', factor: 2629800 }, // Average month
    { label: 'Years (yr)', factor: 31557600 }
];

const lengthUnits = [
    { label: 'Millimeters (mm)', factor: 0.001 },
    { label: 'Centimeters (cm)', factor: 0.01 },
    { label: 'Meters (m)', factor: 1 },
    { label: 'Kilometers (km)', factor: 1000 },
    { label: 'Inches (in)', factor: 0.0254 },
    { label: 'Feet (ft)', factor: 0.3048 },
    { label: 'Yards (yd)', factor: 0.9144 },
    { label: 'Miles (mi)', factor: 1609.344 }
];

export default function LengthConverter() {
    const [value, setValue] = useState('1');
    const [fromUnit, setFromUnit] = useState('Centimeters (cm)');
    const [toUnit, setToUnit] = useState('Inches (in)');
    const [result, setResult] = useState<string>('');

    useEffect(() => {
        const val = parseFloat(value);
        if (isNaN(val)) {
            setResult('');
            return;
        }

        const fromSide = lengthUnits.find(u => u.label === fromUnit);
        const toSide = lengthUnits.find(u => u.label === toUnit);

        if (fromSide && toSide) {
            const meters = val * fromSide.factor;
            const converted = meters / toSide.factor;
            setResult(converted.toLocaleString(undefined, { maximumFractionDigits: 6 }));
        }
    }, [value, fromUnit, toUnit]);

    const swapUnits = () => {
        const temp = fromUnit;
        setFromUnit(toUnit);
        setToUnit(temp);
    };

    return (
        <div className="tool-ui">
            <div className="converter-card">
                <div className="input-section">
                    <div className="input-group">
                        <label>Value to Convert</label>
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="0"
                        />
                    </div>

                    <div className="unit-selectors">
                        <div className="unit-group">
                            <label>From</label>
                            <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                                {lengthUnits.map(u => <option key={u.label}>{u.label}</option>)}
                            </select>
                        </div>

                        <button className="swap-btn" onClick={swapUnits} title="Swap Units">
                            <ArrowRightLeft size={20} />
                        </button>

                        <div className="unit-group">
                            <label>To</label>
                            <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
                                {lengthUnits.map(u => <option key={u.label}>{u.label}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="result-section">
                    <div className="result-label">Converted Result</div>
                    <div className="result-value">
                        {result || '0'} <span>{toUnit.split('(')[1].replace(')', '')}</span>
                    </div>
                </div>

                <div className="quick-grid">
                    {lengthUnits.filter(u => u.label !== fromUnit).slice(0, 6).map(u => {
                        const fromSide = lengthUnits.find(x => x.label === fromUnit);
                        const val = parseFloat(value) || 0;
                        const meters = val * (fromSide?.factor || 1);
                        const converted = meters / u.factor;
                        return (
                            <div key={u.label} className="quick-item">
                                <span className="label">{u.label.split('(')[0]}</span>
                                <span className="val">{converted.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .converter-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 3rem; box-shadow: var(--shadow-lg); }
                
                .input-section { display: flex; flex-direction: column; gap: 2rem; margin-bottom: 3rem; }
                .input-group label { display: block; font-weight: 700; color: var(--secondary); margin-bottom: 0.75rem; font-size: 0.9rem; }
                .input-group input { width: 100%; padding: 1.25rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); font-size: 1.5rem; font-weight: 800; color: var(--primary); }

                .unit-selectors { display: grid; grid-template-columns: 1fr auto 1fr; gap: 1.5rem; align-items: flex-end; }
                .unit-group { display: flex; flex-direction: column; gap: 0.75rem; }
                .unit-group label { font-weight: 700; color: var(--secondary); font-size: 0.85rem; }
                .unit-group select { padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); font-weight: 600; cursor: pointer; }
                
                .swap-btn { height: 50px; width: 50px; display: flex; align-items: center; justify-content: center; background: var(--primary-soft); color: var(--primary); border-radius: 1rem; transition: all 0.2s; }
                .swap-btn:hover { background: var(--primary); color: white; transform: rotate(180deg); }

                .result-section { background: var(--background); border-radius: 1.5rem; padding: 2.5rem; text-align: center; margin-bottom: 2rem; border: 2px solid var(--primary-soft); }
                .result-label { font-size: 0.85rem; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; }
                .result-value { font-size: 3rem; font-weight: 900; color: var(--foreground); word-break: break-all; }
                .result-value span { font-size: 1.25rem; color: var(--secondary); font-weight: 600; margin-left: 0.5rem; }

                .quick-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
                .quick-item { padding: 1rem; background: var(--background); border: 1px solid var(--border); border-radius: 1rem; display: flex; flex-direction: column; gap: 0.25rem; }
                .quick-item .label { font-size: 0.75rem; font-weight: 700; color: var(--secondary); }
                .quick-item .val { font-size: 1rem; font-weight: 800; color: var(--foreground); }
            `}</style>
        </div>
    );
}
