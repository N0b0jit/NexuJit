'use client';

import { useState } from 'react';
import { Scale, RotateCcw, Copy } from 'lucide-react';

export default function RecipeScaler() {
    const [input, setInput] = useState('2 cups flour\n1/2 tsp salt\n3 large eggs\n1.5 lbs chicken breast');
    const [multiplier, setMultiplier] = useState(2);
    const [scaled, setScaled] = useState<string>('');

    const parseAndScale = () => {
        const lines = input.split('\n');
        const scaledLines = lines.map(line => {
            if (!line.trim()) return '';
            // Match number at start: "1.5", "1/2", "1", "1 1/2"
            // Simple regex for integers, decimals, and basic fractions
            // Regex to capture the leading number part: ^(\d+(?:\s+\d+\/\d+|\s*\/\s*\d+|\.\d+)?|\d*\.\d+|\d+\/\d+)
            // This is complex. Let's simplify: look for the first number-like sequence.

            // Replaces the FIRST number occurrence in the string with scaled value.
            // Handles ints, floats, and simple fractions like "1/2".
            return line.replace(/^([\d.\s/]+)/, (match) => {
                let val = 0;
                const trimmed = match.trim();

                if (trimmed.includes('/')) {
                    if (trimmed.includes(' ')) {
                        // Mixed fraction "1 1/2"
                        const [w, f] = trimmed.split(' ');
                        const [n, d] = f.split('/');
                        val = parseFloat(w) + (parseFloat(n) / parseFloat(d));
                    } else {
                        // Simple fraction "1/2"
                        const [n, d] = trimmed.split('/');
                        val = parseFloat(n) / parseFloat(d);
                    }
                } else {
                    val = parseFloat(trimmed);
                }

                if (isNaN(val)) return match;

                const newVal = val * multiplier;

                // Format nicely: decimals if needed, maybe fractions?
                // For simplicity, just up to 2 decimals.
                return Number.isInteger(newVal) ? newVal.toString() + ' ' : newVal.toFixed(2).replace(/\.00$/, '') + ' ';
            });
        });
        setScaled(scaledLines.join('\n'));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-lg">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-secondary font-bold uppercase text-xs">Original Ingredients</label>
                            <span className="text-xs text-secondary opacity-70">Paste one ingredient per line with quantity at start</span>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full h-80 p-4 bg-background border border-border rounded-xl font-mono text-sm resize-none focus:border-primary outline-none"
                            placeholder="e.g. 2 cups flour"
                        />
                    </div>

                    <div className="w-full md:w-48 space-y-6 flex flex-col justify-center">
                        <div className="text-center space-y-2">
                            <div className="text-xs font-bold text-secondary uppercase">Scaling Factor</div>
                            <div className="flex items-center justify-center gap-2">
                                <button onClick={() => setMultiplier(m => Math.max(0.25, m - 0.25))} className="w-8 h-8 rounded-lg bg-background border border-border hover:border-primary font-bold">-</button>
                                <span className="text-3xl font-black text-primary w-20 text-center">{multiplier}x</span>
                                <button onClick={() => setMultiplier(m => m + 0.25)} className="w-8 h-8 rounded-lg bg-background border border-border hover:border-primary font-bold">+</button>
                            </div>
                        </div>

                        <button
                            onClick={parseAndScale}
                            className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                        >
                            <Scale size={20} />
                            Scale Recipe
                        </button>

                        <button
                            onClick={() => { setMultiplier(1); setInput(''); setScaled(''); }}
                            className="w-full py-2 text-secondary font-bold text-sm hover:text-red-500 transition-colors flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={16} /> Reset
                        </button>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-secondary font-bold uppercase text-xs">Scaled Ingredients</label>
                            {scaled && (
                                <button
                                    onClick={() => navigator.clipboard.writeText(scaled)}
                                    className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                                >
                                    <Copy size={12} /> Copy
                                </button>
                            )}
                        </div>
                        <textarea
                            readOnly
                            value={scaled}
                            className={`w-full h-80 p-4 rounded-xl font-mono text-sm resize-none outline-none transition-colors ${scaled ? 'bg-primary/5 border border-primary/20 text-foreground' : 'bg-background border border-border text-secondary/50'}`}
                            placeholder="Scaled result will appear here..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
