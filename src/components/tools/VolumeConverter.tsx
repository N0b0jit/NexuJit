'use client';

import { useState } from 'react';
import { Beaker, ArrowRightLeft } from 'lucide-react';

export default function VolumeConverter() {
    const [value, setValue] = useState('');
    const [from, setFrom] = useState('l');
    const [to, setTo] = useState('ml');
    const [result, setResult] = useState<string>('-');

    const convert = () => {
        const val = parseFloat(value);
        if (isNaN(val)) return;

        // Base unit: Milliliters (ml)
        let ml = 0;
        switch (from) {
            case 'l': ml = val * 1000; break;
            case 'ml': ml = val; break;
            case 'gal': ml = val * 3785.41; break; // US Gallon
            case 'floz': ml = val * 29.5735; break;
            case 'cup': ml = val * 240; break; // Metric cup roughly
        }

        let final = 0;
        switch (to) {
            case 'l': final = ml / 1000; break;
            case 'ml': final = ml; break;
            case 'gal': final = ml / 3785.41; break;
            case 'floz': final = ml / 29.5735; break;
            case 'cup': final = ml / 240; break;
        }

        setResult(final.toLocaleString(undefined, { maximumFractionDigits: 4 }));
    };

    return (
        <div className="tool-ui">
            <div className="converter-card">
                <div className="inputs">
                    <div className="group">
                        <label>Value</label>
                        <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="0" />
                    </div>
                    <div className="group">
                        <label>From</label>
                        <select value={from} onChange={e => setFrom(e.target.value)}>
                            <option value="l">Liters (L)</option>
                            <option value="ml">Milliliters (ml)</option>
                            <option value="gal">Gallons (US)</option>
                            <option value="floz">Fluid Ounces</option>
                            <option value="cup">Cups</option>
                        </select>
                    </div>
                </div>

                <div className="divider">
                    <button onClick={convert}><ArrowRightLeft size={20} /></button>
                </div>

                <div className="inputs">
                    <div className="group">
                        <label>Result</label>
                        <div className="res-box">{result}</div>
                    </div>
                    <div className="group">
                        <label>To</label>
                        <select value={to} onChange={e => setTo(e.target.value)}>
                            <option value="l">Liters (L)</option>
                            <option value="ml">Milliliters (ml)</option>
                            <option value="gal">Gallons (US)</option>
                            <option value="floz">Fluid Ounces</option>
                            <option value="cup">Cups</option>
                        </select>
                    </div>
                </div>

                <button onClick={convert} className="action-btn">Convert</button>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 500px; margin: 0 auto; }
                .converter-card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); }
                .inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .group label { display: block; font-weight: 700; font-size: 0.8rem; margin-bottom: 0.5rem; color: var(--secondary); text-transform: uppercase; }
                input, select, .res-box { width: 100%; padding: 1rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); font-size: 1.2rem; height: 60px; font-weight: 700; }
                .res-box { display: flex; align-items: center; color: var(--primary); background: rgba(0,0,0,0.02); }
                
                .divider { display: flex; justify-content: center; margin: 1.5rem 0; }
                .divider button { padding: 0.8rem; border-radius: 50%; background: var(--surface); border: 2px solid var(--border); color: var(--secondary); cursor: pointer; transition: all 0.2s; }
                .divider button:hover { border-color: var(--primary); color: var(--primary); transform: rotate(180deg); }
                
                .action-btn { width: 100%; margin-top: 2rem; padding: 1rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; font-size: 1.1rem; }
            `}</style>
        </div>
    );
}
