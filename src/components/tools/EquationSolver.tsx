'use client';

import { useState } from 'react';
import { Sigma, ArrowRight } from 'lucide-react';

export default function EquationSolver() {
    const [mode, setMode] = useState<'linear' | 'quadratic'>('linear');

    // Linear: ax + b = 0
    const [linA, setLinA] = useState(2);
    const [linB, setLinB] = useState(-4);

    // Quadratic: ax^2 + bx + c = 0
    const [quadA, setQuadA] = useState(1);
    const [quadB, setQuadB] = useState(-3);
    const [quadC, setQuadC] = useState(2);

    const [solution, setSolution] = useState<string>('');

    const solveLinear = () => {
        if (linA === 0) {
            setSolution(linB === 0 ? "Infinite solutions (0 = 0)" : "No solution (a = 0)");
            return;
        }
        const x = -linB / linA;
        setSolution(`x = ${x}`);
    };

    const solveQuadratic = () => {
        if (quadA === 0) {
            // Treat as linear bx + c = 0
            if (quadB === 0) {
                setSolution(quadC === 0 ? "Infinite solutions" : "No solution");
            } else {
                setSolution(`Reduces to linear: x = ${-quadC / quadB}`);
            }
            return;
        }

        const disc = (quadB * quadB) - (4 * quadA * quadC);

        if (disc > 0) {
            const x1 = (-quadB + Math.sqrt(disc)) / (2 * quadA);
            const x2 = (-quadB - Math.sqrt(disc)) / (2 * quadA);
            setSolution(`x₁ = ${x1}, x₂ = ${x2}`);
        } else if (disc === 0) {
            const x = -quadB / (2 * quadA);
            setSolution(`x = ${x} (Double Root)`);
        } else {
            const real = (-quadB / (2 * quadA)).toFixed(2);
            const imag = (Math.sqrt(-disc) / (2 * quadA)).toFixed(2);
            setSolution(`x₁ = ${real} + ${imag}i, x₂ = ${real} - ${imag}i (Complex)`);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-lg space-y-8">
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => { setMode('linear'); setSolution(''); }}
                        className={`px-6 py-2 rounded-lg font-bold transition-all ${mode === 'linear' ? 'bg-primary text-white shadow-lg' : 'hover:bg-background border border-transparent'}`}
                    >
                        Linear (ax + b = 0)
                    </button>
                    <button
                        onClick={() => { setMode('quadratic'); setSolution(''); }}
                        className={`px-6 py-2 rounded-lg font-bold transition-all ${mode === 'quadratic' ? 'bg-primary text-white shadow-lg' : 'hover:bg-background border border-transparent'}`}
                    >
                        Quadratic (ax² + bx + c = 0)
                    </button>
                </div>

                <div className="p-8 bg-background rounded-xl border border-border flex flex-col items-center gap-8">
                    {mode === 'linear' ? (
                        <div className="flex items-center gap-2 text-2xl font-bold font-mono">
                            <input type="number" value={linA} onChange={(e) => setLinA(parseFloat(e.target.value))} className="w-20 p-2 text-center bg-surface border border-border rounded-lg" />
                            <span>x</span>
                            <span>+</span>
                            <input type="number" value={linB} onChange={(e) => setLinB(parseFloat(e.target.value))} className="w-20 p-2 text-center bg-surface border border-border rounded-lg" />
                            <span>= 0</span>
                        </div>
                    ) : (
                        <div className="flex flex-wrap justify-center items-center gap-2 text-xl md:text-2xl font-bold font-mono">
                            <input type="number" value={quadA} onChange={(e) => setQuadA(parseFloat(e.target.value))} className="w-16 md:w-20 p-2 text-center bg-surface border border-border rounded-lg" />
                            <span>x²</span>
                            <span>+</span>
                            <input type="number" value={quadB} onChange={(e) => setQuadB(parseFloat(e.target.value))} className="w-16 md:w-20 p-2 text-center bg-surface border border-border rounded-lg" />
                            <span>x</span>
                            <span>+</span>
                            <input type="number" value={quadC} onChange={(e) => setQuadC(parseFloat(e.target.value))} className="w-16 md:w-20 p-2 text-center bg-surface border border-border rounded-lg" />
                            <span>= 0</span>
                        </div>
                    )}

                    <button
                        onClick={mode === 'linear' ? solveLinear : solveQuadratic}
                        className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <Sigma size={20} /> Solve
                    </button>
                </div>

                {solution && (
                    <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl text-center animate-in slide-in-from-bottom-2">
                        <div className="text-secondary text-xs uppercase font-bold mb-2">Solution</div>
                        <div className="text-2xl font-black text-green-600 font-mono tracking-wider">{solution}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
