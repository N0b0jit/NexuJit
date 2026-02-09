'use client';

import { useState } from 'react';
import { Plus, Trash2, Trophy, Calculator } from 'lucide-react';

interface Criteria {
    id: string;
    name: string;
    weight: number;
}

interface Option {
    id: string;
    name: string;
    scores: Record<string, number>;
}

export default function DecisionMatrix() {
    const [criteria, setCriteria] = useState<Criteria[]>([
        { id: 'c1', name: 'Cost', weight: 5 },
        { id: 'c2', name: 'Impact', weight: 4 },
        { id: 'c3', name: 'Effort', weight: 3 },
    ]);

    const [options, setOptions] = useState<Option[]>([
        { id: 'o1', name: 'Option A', scores: { c1: 3, c2: 4, c3: 2 } },
        { id: 'o2', name: 'Option B', scores: { c1: 2, c2: 5, c3: 4 } },
    ]);

    const addCriteria = () => {
        const id = `c${Date.now()}`;
        setCriteria([...criteria, { id, name: 'New Criteria', weight: 1 }]);
        setOptions(options.map(o => ({ ...o, scores: { ...o.scores, [id]: 1 } })));
    };

    const addOption = () => {
        const id = `o${Date.now()}`;
        const defaultScores = criteria.reduce((acc, c) => ({ ...acc, [c.id]: 1 }), {});
        setOptions([...options, { id, name: 'New Option', scores: defaultScores }]);
    };

    const removeCriteria = (id: string) => {
        setCriteria(criteria.filter(c => c.id !== id));
        setOptions(options.map(o => {
            const { [id]: _, ...rest } = o.scores;
            return { ...o, scores: rest };
        }));
    };

    const updateScore = (optionId: string, criteriaId: string, score: number) => {
        setOptions(options.map(o =>
            o.id === optionId
                ? { ...o, scores: { ...o.scores, [criteriaId]: Math.min(10, Math.max(1, score)) } }
                : o
        ));
    };

    const calculateTotal = (option: Option) => {
        return criteria.reduce((sum, c) => sum + (option.scores[c.id] || 0) * c.weight, 0);
    };

    const rankedOptions = [...options].sort((a, b) => calculateTotal(b) - calculateTotal(a));
    const winner = rankedOptions[0];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead>
                        <tr>
                            <th className="p-4 text-left min-w-[200px]">
                                <div className="font-black text-lg text-primary">Options</div>
                            </th>
                            {criteria.map(c => (
                                <th key={c.id} className="p-2 min-w-[120px]">
                                    <div className="bg-background p-3 rounded-xl border border-border relative group">
                                        <input
                                            value={c.name}
                                            onChange={(e) => setCriteria(criteria.map(i => i.id === c.id ? { ...i, name: e.target.value } : i))}
                                            className="w-full bg-transparent font-bold text-center outline-none mb-1 text-sm"
                                        />
                                        <div className="flex items-center justify-center gap-1 text-xs text-secondary">
                                            <span>Weight:</span>
                                            <input
                                                type="number"
                                                value={c.weight}
                                                onChange={(e) => setCriteria(criteria.map(i => i.id === c.id ? { ...i, weight: Number(e.target.value) } : i))}
                                                className="w-10 bg-surface border border-border rounded px-1 text-center font-bold"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeCriteria(c.id)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </th>
                            ))}
                            <th className="p-4 w-[100px]">
                                <button onClick={addCriteria} className="w-full h-full flex items-center justify-center bg-primary/10 hover:bg-primary/20 text-primary rounded-xl border border-dashed border-primary/30 transition-colors">
                                    <Plus size={20} />
                                </button>
                            </th>
                            <th className="p-4 text-right min-w-[100px] font-black text-lg">Score</th>
                        </tr>
                    </thead>
                    <tbody className="space-y-2">
                        {options.map(option => (
                            <tr key={option.id} className="group hover:bg-background/30 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setOptions(options.filter(o => o.id !== option.id))} className="text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={16} />
                                        </button>
                                        <input
                                            value={option.name}
                                            onChange={(e) => setOptions(options.map(o => o.id === option.id ? { ...o, name: e.target.value } : o))}
                                            className="w-full bg-transparent font-semibold outline-none border-b border-transparent focus:border-primary transition-colors py-1"
                                        />
                                    </div>
                                </td>
                                {criteria.map(c => (
                                    <td key={c.id} className="p-2 text-center">
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={option.scores[c.id]}
                                            onChange={(e) => updateScore(option.id, c.id, Number(e.target.value))}
                                            className="w-16 p-2 text-center bg-background border border-border rounded-lg font-bold outline-none focus:border-primary transition-colors"
                                        />
                                    </td>
                                ))}
                                <td className="p-2 text-center"></td>
                                <td className="p-4 text-right">
                                    <span className="text-xl font-black text-primary">
                                        {calculateTotal(option)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td className="p-4" colSpan={criteria.length + 3}>
                                <button onClick={addOption} className="flex items-center gap-2 px-4 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-lg font-bold transition-colors">
                                    <Plus size={16} /> Add Option
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-8 rounded-2xl border border-yellow-500/20 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 bg-yellow-500/20 blur-[60px] rounded-full pointer-events-none" />
                    <Trophy size={48} className="mx-auto text-yellow-600 mb-4" />
                    <h3 className="text-sm font-bold uppercase text-yellow-700 tracking-wider mb-2">Recommended Winner</h3>
                    <div className="text-4xl font-black text-foreground mb-1">{winner?.name || 'Create an Option'}</div>
                    <div className="text-lg font-bold text-yellow-600">{winner ? calculateTotal(winner) : 0} Points</div>
                </div>

                <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Info size={18} /> How to Use
                    </h3>
                    <ul className="space-y-2 text-sm text-secondary">
                        <li>• <strong>Criteria:</strong> Factors that matter (e.g., Cost, Time). Assign a weight (1-5) to prioritize them.</li>
                        <li>• <strong>Options:</strong> The choices you are comparing.</li>
                        <li>• <strong>Score:</strong> Rate each option for each criteria (1-10).</li>
                        <li>• The tool automatically multiplies Score × Weight to find the best option.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

function Info(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>;
}
