'use client';

import { useState, useEffect } from 'react';
import { CreditCard, ArrowRight, ArrowLeft, Info, HelpCircle } from 'lucide-react';

export default function PaypalFeeCalculator() {
    const [amount, setAmount] = useState('100');
    const [rate, setRate] = useState('2.9');
    const [fixedFee, setFixedFee] = useState('0.30');

    const [receiveAmount, setReceiveAmount] = useState(0);
    const [receiveFee, setReceiveFee] = useState(0);
    const [sendAmount, setSendAmount] = useState(0);
    const [sendFee, setSendFee] = useState(0);

    const calculate = () => {
        const amt = parseFloat(amount) || 0;
        const r = parseFloat(rate) / 100 || 0;
        const f = parseFloat(fixedFee) || 0;

        // If you receive $X
        const fee1 = (amt * r) + f;
        setReceiveFee(fee1);
        setReceiveAmount(amt - fee1);

        // If you want to receive exactly $X
        const totalToSend = (amt + f) / (1 - r);
        setSendAmount(totalToSend);
        setSendFee(totalToSend - amt);
    };

    useEffect(() => {
        calculate();
    }, [amount, rate, fixedFee]);

    return (
        <div className="tool-ui">
            <div className="fee-layout">
                <div className="config-panel">
                    <div className="config-group">
                        <label>Transaction Amount ($)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div className="config-row">
                        <div className="config-group">
                            <label>Fee Rate (%)</label>
                            <input
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                                step="0.1"
                            />
                        </div>
                        <div className="config-group">
                            <label>Fixed Fee ($)</label>
                            <input
                                type="number"
                                value={fixedFee}
                                onChange={(e) => setFixedFee(e.target.value)}
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div className="quick-rates">
                        <label>Common Rates:</label>
                        <div className="rate-chips">
                            <button onClick={() => { setRate('2.9'); setFixedFee('0.30'); }}>US Domestics (2.9% + $0.30)</button>
                            <button onClick={() => { setRate('4.4'); setFixedFee('0.30'); }}>International (4.4% + $0.30)</button>
                            <button onClick={() => { setRate('3.49'); setFixedFee('0.49'); }}>Venmo/PayPal Checkout (3.49% + $0.49)</button>
                        </div>
                    </div>
                </div>

                <div className="results-panel">
                    <div className="fee-card">
                        <div className="card-header">
                            <ArrowRight size={20} />
                            <h3>If you receive <span>${parseFloat(amount).toFixed(2)}</span></h3>
                        </div>
                        <div className="card-body">
                            <div className="fee-item">
                                <label>PayPal Fees</label>
                                <span className="value">-${receiveFee.toFixed(2)}</span>
                            </div>
                            <div className="fee-item total">
                                <label>You will receive</label>
                                <span className="value">${receiveAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="fee-card inverse">
                        <div className="card-header">
                            <ArrowLeft size={20} />
                            <h3>To receive exactly <span>${parseFloat(amount).toFixed(2)}</span></h3>
                        </div>
                        <div className="card-body">
                            <div className="fee-item">
                                <label>Sender should send</label>
                                <span className="value">${sendAmount.toFixed(2)}</span>
                            </div>
                            <div className="fee-item total">
                                <label>Total PayPal Fees</label>
                                <span className="value">${sendFee.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { display: flex; flex-direction: column; gap: 2rem; }
                .fee-layout { display: grid; grid-template-columns: 1fr; gap: 3rem; }
                @media (min-width: 1024px) { .fee-layout { grid-template-columns: 350px 1fr; } }

                .config-panel { display: flex; flex-direction: column; gap: 1.5rem; padding: 2.5rem; background: var(--surface); border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow); }
                .config-group { display: flex; flex-direction: column; gap: 0.75rem; }
                .config-group label { font-weight: 700; color: var(--secondary); font-size: 0.85rem; }
                .config-group input { padding: 0.85rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); font-weight: 700; font-size: 1.1rem; color: var(--foreground); }
                .config-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

                .quick-rates { margin-top: 1rem; }
                .quick-rates label { display: block; font-size: 0.75rem; font-weight: 700; color: var(--secondary); margin-bottom: 0.75rem; text-transform: uppercase; }
                .rate-chips { display: flex; flex-direction: column; gap: 0.5rem; }
                .rate-chips button { text-align: left; padding: 0.75rem 1rem; background: var(--background); border: 1px solid var(--border); border-radius: 0.75rem; font-size: 0.85rem; font-weight: 600; color: var(--secondary); transition: all 0.2s; }
                .rate-chips button:hover { background: var(--primary-soft); color: var(--primary); border-color: var(--primary); }

                .results-panel { display: flex; flex-direction: column; gap: 2rem; }
                .fee-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2rem; box-shadow: var(--shadow-sm); }
                .fee-card.inverse { border-left: 4px solid var(--primary); }
                .card-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1.25rem; }
                .card-header h3 { font-size: 1.1rem; color: var(--secondary); font-weight: 600; }
                .card-header h3 span { color: var(--foreground); font-weight: 800; }
                
                .fee-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; font-size: 1rem; color: var(--secondary); }
                .fee-item.total { margin-top: 1rem; padding-top: 1.5rem; border-top: 2px dashed var(--border); }
                .fee-item.total .value { font-size: 2rem; font-weight: 900; color: var(--primary); }
                .fee-item .value { font-weight: 700; color: var(--foreground); }
            `}</style>
        </div>
    );
}
