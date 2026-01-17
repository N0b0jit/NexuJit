'use client';

import { useState } from 'react';
import { Tag, Calculator, ArrowRight } from 'lucide-react';

export default function DiscountCalculator() {
    const [originalPrice, setOriginalPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        const price = parseFloat(originalPrice);
        const disc = parseFloat(discount);

        if (price && !isNaN(disc)) {
            const savings = (price * disc) / 100;
            const final = price - savings;
            setResult({
                final: final.toFixed(2),
                savings: savings.toFixed(2)
            });
        }
    };

    return (
        <div className="tool-ui">
            <div className="calculator-card">
                <div className="input-section">
                    <div className="input-group">
                        <label>Original Price</label>
                        <div className="input-wrapper">
                            <span className="prefix">$</span>
                            <input
                                type="number"
                                value={originalPrice}
                                onChange={(e) => { setOriginalPrice(e.target.value); if (result) calculate(); }}
                                placeholder="100.00"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Discount</label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                value={discount}
                                onChange={(e) => { setDiscount(e.target.value); if (result) calculate(); }}
                                placeholder="20"
                            />
                            <span className="suffix">%</span>
                        </div>
                    </div>
                </div>

                <button onClick={calculate} className="calc-btn">
                    Calculate <ArrowRight size={18} />
                </button>
            </div>

            {result && (
                <div className="result-card">
                    <div className="result-box">
                        <span className="label">Final Price</span>
                        <span className="value final">${result.final}</span>
                    </div>

                    <div className="divider"></div>

                    <div className="result-box">
                        <span className="label">You Save</span>
                        <span className="value saving">${result.savings}</span>
                    </div>
                </div>
            )}

            <style jsx>{`
                .tool-ui { max-width: 500px; margin: 0 auto; }
                .calculator-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2rem; box-shadow: var(--shadow-lg); }
                
                .input-section { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
                .input-group label { display: block; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem; font-size: 0.9rem; }
                .input-wrapper { display: flex; align-items: center; background: var(--background); border: 2px solid var(--border); border-radius: 0.75rem; overflow: hidden; }
                .input-wrapper input { flex: 1; padding: 1rem; border: none; background: transparent; font-size: 1.1rem; outline: none; width: 100%; }
                .prefix, .suffix { padding: 0 1rem; font-weight: 700; color: var(--secondary); background: rgba(0,0,0,0.02); height: 100%; display: flex; align-items: center; }

                .calc-btn { width: 100%; padding: 1rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: transform 0.2s; }
                .calc-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px var(--primary-soft); }

                .result-card { margin-top: 2rem; background: var(--background); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
                
                .result-box { display: flex; flex-direction: column; gap: 0.25rem; }
                .result-box .label { font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: var(--secondary); }
                .value { font-size: 2rem; font-weight: 800; }
                .value.final { color: var(--foreground); }
                .value.saving { color: #10b981; }

                .divider { width: 1px; height: 50px; background: var(--border); }
            `}</style>
        </div>
    );
}
