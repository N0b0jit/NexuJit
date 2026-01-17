'use client';

import { useState, useEffect } from 'react';
import { Database, ArrowRightLeft } from 'lucide-react';

const digitalUnits = [
    { label: 'Bits (b)', factor: 1 / 8 },
    { label: 'Bytes (B)', factor: 1 },
    { label: 'Kilobytes (KB)', factor: 1024 },
    { label: 'Megabytes (MB)', factor: 1024 ** 2 },
    { label: 'Gigabytes (GB)', factor: 1024 ** 3 },
    { label: 'Terabytes (TB)', factor: 1024 ** 4 },
    { label: 'Petabytes (PB)', factor: 1024 ** 5 }
];

export default function DigitalConverter() {
    const [value, setValue] = useState('1');
    const [fromUnit, setFromUnit] = useState('Gigabytes (GB)');
    const [toUnit, setToUnit] = useState('Megabytes (MB)');
    const [result, setResult] = useState<string>('');

    useEffect(() => {
        const val = parseFloat(value);
        if (isNaN(val)) {
            setResult('');
            return;
        }

        const fromSide = digitalUnits.find(u => u.label === fromUnit);
        const toSide = digitalUnits.find(u => u.label === toUnit);

        if (fromSide && toSide) {
            const bytes = val * fromSide.factor;
            const converted = bytes / toSide.factor;
            setResult(converted.toLocaleString(undefined, { maximumFractionDigits: 4 }));
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
                        <label>Size Value</label>
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
                                {digitalUnits.map(u => <option key={u.label}>{u.label}</option>)}
                            </select>
                        </div>

                        <button className="swap-btn" onClick={swapUnits}>
                            <ArrowRightLeft size={20} />
                        </button>

                        <div className="unit-group">
                            <label>To</label>
                            <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
                                {digitalUnits.map(u => <option key={u.label}>{u.label}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="result-section">
                    <div className="result-label">Storage Equivalent</div>
                    <div className="result-value">
                        {result || '0'} <span>{toUnit.split('(')[1].replace(')', '')}</span>
                    </div>
                </div>

                <div className="quick-grid">
                    {digitalUnits.filter(u => u.label !== fromUnit).map(u => {
                        const fromSide = digitalUnits.find(x => x.label === fromUnit);
                        const val = parseFloat(value) || 0;
                        const bytes = val * (fromSide?.factor || 1);
                        const converted = bytes / u.factor;

                        // Human readable format
                        let displayVal = converted.toLocaleString(undefined, {
                            maximumFractionDigits: converted < 0.01 ? 8 : 4
                        });

                        return (
                            <div key={u.label} className="quick-item">
                                <span className="label">{u.label.split('(')[0]}</span>
                                <span className="val">{displayVal} {u.label.split('(')[1].replace(')', '')}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .converter-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 3rem; box-shadow: var(--shadow-lg); }
                
                .input-section { display: flex; flex-direction: column; gap: 2rem; margin-bottom: 3rem; }
                .input-group label { font-weight: 700; color: var(--secondary); margin-bottom: 0.75rem; font-size: 0.9rem; }
                .input-group input { width: 100%; padding: 1.25rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); font-size: 1.5rem; font-weight: 800; color: var(--primary); }

                .unit-selectors { display: grid; grid-template-columns: 1fr auto 1fr; gap: 1.5rem; align-items: flex-end; }
                .unit-group { display: flex; flex-direction: column; gap: 0.75rem; }
                .unit-group label { font-weight: 700; color: var(--secondary); font-size: 0.85rem; }
                .unit-group select { padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); font-weight: 600; cursor: pointer; }
                
                .swap-btn { height: 50px; width: 50px; display: flex; align-items: center; justify-content: center; background: var(--primary-soft); color: var(--primary); border-radius: 1rem; }
                .swap-btn:hover { background: var(--primary); color: white; transform: rotate(180deg); }

                .result-section { background: var(--background); border-radius: 1.5rem; padding: 2.5rem; text-align: center; margin-bottom: 2rem; border: 2px solid var(--primary-soft); }
                .result-label { font-size: 0.85rem; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; }
                .result-value { font-size: 3rem; font-weight: 900; color: var(--foreground); }
                .result-value span { font-size: 1.25rem; color: var(--secondary); font-weight: 600; margin-left: 0.5rem; }

                .quick-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
                .quick-item { padding: 1.25rem; background: var(--background); border: 1px solid var(--border); border-radius: 1.25rem; }
                .quick-item .label { display: block; font-size: 0.75rem; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem; }
                .quick-item .val { font-size: 0.95rem; font-weight: 800; color: var(--foreground); word-break: break-all; }
            `}</style>
        </div>
    );
}
