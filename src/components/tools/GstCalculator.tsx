'use client';

import { useState } from 'react';
import { Percent, ArrowRight, PlusCircle, MinusCircle } from 'lucide-react';

export default function GstCalculator() {
    const [amount, setAmount] = useState('');
    const [gstRate, setGstRate] = useState('18');
    const [type, setType] = useState('exclusive'); // exclusive (add tax) or inclusive (remove tax)
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        const amt = parseFloat(amount);
        const rate = parseFloat(gstRate);

        if (!amt || isNaN(rate)) return;

        let taxAmount = 0;
        let totalAmount = 0;
        let originalAmount = 0;

        if (type === 'exclusive') {
            // Add GST
            taxAmount = (amt * rate) / 100;
            totalAmount = amt + taxAmount;
            originalAmount = amt;
        } else {
            // Remove GST (Inclusive)
            // Total = Original + (Original * Rate / 100)
            // Total = Original * (1 + Rate/100)
            // Original = Total / (1 + Rate/100)
            originalAmount = amt / (1 + rate / 100);
            taxAmount = amt - originalAmount;
            totalAmount = amt;
        }

        setResult({
            original: originalAmount.toFixed(2),
            tax: taxAmount.toFixed(2),
            total: totalAmount.toFixed(2)
        });
    };

    return (
        <div className="tool-ui">
            <div className="calculator-card">
                <div className="input-section">
                    <div className="input-group">
                        <label>Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="1000"
                        />
                    </div>

                    <div className="input-group">
                        <label>GST Rate (%)</label>
                        <select value={gstRate} onChange={(e) => setGstRate(e.target.value)}>
                            <option value="5">5%</option>
                            <option value="12">12%</option>
                            <option value="18">18%</option>
                            <option value="28">28%</option>
                            <option value="0">0% (Nil)</option>
                        </select>
                    </div>
                </div>

                <div className="toggle-bg">
                    <div className="toggle-switch">
                        <button
                            className={`toggle-btn ${type === 'exclusive' ? 'active' : ''}`}
                            onClick={() => setType('exclusive')}
                        >
                            <PlusCircle size={16} /> Add GST
                        </button>
                        <button
                            className={`toggle-btn ${type === 'inclusive' ? 'active' : ''}`}
                            onClick={() => setType('inclusive')}
                        >
                            <MinusCircle size={16} /> Remove GST
                        </button>
                    </div>
                </div>

                <button onClick={calculate} className="calc-btn">
                    Calculate <ArrowRight size={18} />
                </button>
            </div>

            {result && (
                <div className="result-card">
                    <div className="row">
                        <span className="lbl">Net Amount</span>
                        <span className="val">${result.original}</span>
                    </div>
                    <div className="row">
                        <span className="lbl">GST Amount ({gstRate}%)</span>
                        <span className="val highlight">${result.tax}</span>
                    </div>
                    <div className="divider"></div>
                    <div className="row total">
                        <span className="lbl">Total Amount</span>
                        <span className="val">${result.total}</span>
                    </div>
                </div>
            )}

            <style jsx>{`
                .tool-ui { max-width: 500px; margin: 0 auto; }
                .calculator-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2rem; box-shadow: var(--shadow-lg); }
                
                .input-section { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
                .input-group label { display: block; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem; font-size: 0.9rem; }
                .input-group input, .input-group select { width: 100%; padding: 1rem; border: 2px solid var(--border); border-radius: 0.75rem; background: var(--background); font-size: 1.1rem; }

                .toggle-bg { background: var(--background); padding: 0.5rem; border-radius: 1rem; margin-bottom: 2rem; border: 1px solid var(--border); }
                .toggle-switch { display: flex; gap: 0.5rem; }
                .toggle-btn { flex: 1; padding: 0.75rem; border-radius: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s; color: var(--secondary); }
                .toggle-btn.active { background: var(--white); color: var(--primary); box-shadow: var(--shadow); }

                .calc-btn { width: 100%; padding: 1rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }

                .result-card { margin-top: 2rem; background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow); }
                .row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                .lbl { font-weight: 600; color: var(--secondary); }
                .val { font-weight: 800; font-size: 1.2rem; }
                .val.highlight { color: #f59e0b; }
                
                .divider { height: 1px; background: var(--border); margin: 1rem 0; }
                .row.total .lbl { font-size: 1.2rem; color: var(--foreground); }
                .row.total .val { font-size: 2rem; color: var(--primary); }
            `}</style>
        </div>
    );
}
