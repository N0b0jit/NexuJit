'use client';

import { useState } from 'react';
import { Percent, ArrowRight, RefreshCw, Calculator } from 'lucide-react';

export default function PercentageCalculator() {
    const [mode, setMode] = useState<'whatIs' | 'isWhat' | 'increase'>('whatIs');
    const [val1, setVal1] = useState<string>('');
    const [val2, setVal2] = useState<string>('');
    const [result, setResult] = useState<number | null>(null);

    const calculate = () => {
        const v1 = parseFloat(val1);
        const v2 = parseFloat(val2);
        if (isNaN(v1) || isNaN(v2)) {
            setResult(null);
            return;
        }

        switch (mode) {
            case 'whatIs':
                // What is X% of Y?
                setResult((v1 / 100) * v2);
                break;
            case 'isWhat':
                // X is what % of Y?
                setResult((v1 / v2) * 100);
                break;
            case 'increase':
                // Percentage increase/decrease from X to Y
                setResult(((v2 - v1) / v1) * 100);
                break;
        }
    };

    const handleReset = () => {
        setVal1('');
        setVal2('');
        setResult(null);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-surface p-8 rounded-2xl border border-border shadow-lg backdrop-blur-sm bg-opacity-80">

                {/* Mode Selection */}
                <div className="flex flex-wrap gap-4 mb-8 justify-center">
                    <button
                        onClick={() => { setMode('whatIs'); setResult(null); }}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 border ${mode === 'whatIs' ? 'bg-primary text-white border-primary shadow-lg scale-105' : 'bg-background text-secondary border-border hover:border-primary/50'}`}
                    >
                        What is X% of Y?
                    </button>
                    <button
                        onClick={() => { setMode('isWhat'); setResult(null); }}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 border ${mode === 'isWhat' ? 'bg-primary text-white border-primary shadow-lg scale-105' : 'bg-background text-secondary border-border hover:border-primary/50'}`}
                    >
                        X is what % of Y?
                    </button>
                    <button
                        onClick={() => { setMode('increase'); setResult(null); }}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 border ${mode === 'increase' ? 'bg-primary text-white border-primary shadow-lg scale-105' : 'bg-background text-secondary border-border hover:border-primary/50'}`}
                    >
                        Increase/Decrease
                    </button>
                </div>

                {/* Calculator Inputs */}
                <div className="flex flex-col md:flex-row items-center gap-6 justify-center bg-background/50 p-6 rounded-xl border border-border/50">

                    {mode === 'whatIs' && (
                        <>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-lg">What is</span>
                                <input type="number" value={val1} onChange={e => setVal1(e.target.value)} className="w-24 p-3 rounded-lg border border-border bg-background font-bold text-center outline-none focus:border-primary" placeholder="X" />
                                <span className="font-bold text-lg">% of</span>
                            </div>
                            <input type="number" value={val2} onChange={e => setVal2(e.target.value)} className="w-24 p-3 rounded-lg border border-border bg-background font-bold text-center outline-none focus:border-primary" placeholder="Y" />
                        </>
                    )}

                    {mode === 'isWhat' && (
                        <>
                            <input type="number" value={val1} onChange={e => setVal1(e.target.value)} className="w-24 p-3 rounded-lg border border-border bg-background font-bold text-center outline-none focus:border-primary" placeholder="X" />
                            <span className="font-bold text-lg">is what % of</span>
                            <input type="number" value={val2} onChange={e => setVal2(e.target.value)} className="w-24 p-3 rounded-lg border border-border bg-background font-bold text-center outline-none focus:border-primary" placeholder="Y" />
                        </>
                    )}

                    {mode === 'increase' && (
                        <>
                            <span className="font-bold text-lg">From</span>
                            <input type="number" value={val1} onChange={e => setVal1(e.target.value)} className="w-24 p-3 rounded-lg border border-border bg-background font-bold text-center outline-none focus:border-primary" placeholder="Start" />
                            <span className="font-bold text-lg">to</span>
                            <input type="number" value={val2} onChange={e => setVal2(e.target.value)} className="w-24 p-3 rounded-lg border border-border bg-background font-bold text-center outline-none focus:border-primary" placeholder="End" />
                        </>
                    )}

                    <button
                        onClick={calculate}
                        className="p-3 bg-primary text-white rounded-full hover:bg-primary-hover shadow-lg transition-transform active:scale-95"
                    >
                        <ArrowRight size={24} />
                    </button>
                </div>

                {/* Result */}
                {result !== null && (
                    <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-secondary font-medium uppercase tracking-wide mb-2">Result</div>
                        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                            {result.toFixed(2)}%
                        </div>
                    </div>
                )}
            </div>

            <div className="text-center">
                <button onClick={handleReset} className="text-secondary hover:text-primary flex items-center gap-2 mx-auto text-sm font-medium transition-colors">
                    <RefreshCw size={16} /> Reset Calculator
                </button>
            </div>
        </div>
    );
}
