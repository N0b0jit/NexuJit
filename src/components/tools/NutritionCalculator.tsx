'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, Apple, Search, Info } from 'lucide-react';
import { motion } from 'framer-motion';

// Interface for Nutrition Data
interface NutritionItem {
    food_name: string;
    serving_qty: number;
    serving_unit: string;
    nf_calories: number;
    nf_total_fat: number;
    nf_protein: number;
    nf_total_carbohydrate: number;
    nf_sugars: number;
    photo: { thumb: string };
}

// Mock Data
const MOCK_NUTRITION: NutritionItem[] = [
    {
        food_name: "apple",
        serving_qty: 1,
        serving_unit: "medium (3\" dia)",
        nf_calories: 95,
        nf_total_fat: 0.3,
        nf_protein: 0.5,
        nf_total_carbohydrate: 25,
        nf_sugars: 19,
        photo: { thumb: "https://nix-tag-images.s3.amazonaws.com/384_thumb.jpg" }
    }
];

export default function NutritionCalculator() {
    const [query, setQuery] = useState('');
    const [appId, setAppId] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [results, setResults] = useState<NutritionItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [useMock, setUseMock] = useState(false);

    const analyzeNutrition = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setResults([]);

        // Demo logic if no keys
        if ((!appId || !apiKey) && !useMock) {
            setUseMock(true);
            setTimeout(() => {
                setResults(MOCK_NUTRITION);
                setLoading(false);
            }, 1000);
            return;
        }

        try {
            const res = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-app-id': appId, // User Provided
                    'x-app-key': apiKey, // User Provided
                },
                body: JSON.stringify({ query: query })
            });

            if (!res.ok) {
                if (res.status === 401) throw new Error('Invalid App ID or API Key.');
                throw new Error('Failed to fetch nutrition data');
            }

            const data = await res.json();
            setResults(data.foods);
        } catch (err: any) {
            setError(err.message);
            if (err.message.includes('Invalid')) {
                setUseMock(true);
                setResults(MOCK_NUTRITION);
            }
        } finally {
            setLoading(false);
        }
    };

    // Calculate Totals
    const totals = results.reduce((acc, item) => ({
        calories: acc.calories + item.nf_calories,
        protein: acc.protein + item.nf_protein,
        carbs: acc.carbs + item.nf_total_carbohydrate,
        fat: acc.fat + item.nf_total_fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const chartData = [
        { name: 'Protein', value: totals.protein, color: '#3b82f6' },
        { name: 'Carbs', value: totals.carbs, color: '#10b981' },
        { name: 'Fat', value: totals.fat, color: '#f59e0b' },
    ].filter(d => d.value > 0);

    return (
        <div className="nutrition-tool max-w-4xl mx-auto space-y-8">
            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
                <h3 className="flex items-center gap-2 font-bold mb-4 text-secondary text-sm uppercase"><Info size={16} /> Nutritionix Configuration</h3>
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        className="p-3 bg-background border border-border rounded-lg text-sm flex-1"
                        placeholder="Nutritionix App ID (Required for real data)"
                        value={appId}
                        onChange={e => setAppId(e.target.value)}
                    />
                    <input
                        className="p-3 bg-background border border-border rounded-lg text-sm flex-1"
                        type="password"
                        placeholder="Nutritionix API Key"
                        value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                    />
                </div>
                <p className="text-xs text-secondary mt-2 opacity-70">Leave empty to view a demo with mock data.</p>
            </div>

            <div className="search-box bg-surface p-8 rounded-2xl border border-secondary/20 shadow-lg text-center">
                <Apple size={48} className="mx-auto text-green-500 mb-4" />
                <h2 className="text-3xl font-bold mb-2">Natural Language Nutrition</h2>
                <p className="text-secondary mb-6">Type typically what you ate, e.g., "1 cup of oatmeal and 2 bananas".</p>

                <form onSubmit={analyzeNutrition} className="max-w-xl mx-auto flex gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Enter meal details..."
                        className="flex-1 px-5 py-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-green-500/20 outline-none text-lg"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 rounded-xl transition-all"
                    >
                        {loading ? 'Analyzing...' : 'Analyze'}
                    </button>
                </form>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>

            {results.length > 0 && (
                <div className="results-grid grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: Summary Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="chart-card bg-surface p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-center"
                    >
                        <h3 className="text-xl font-bold mb-2 text-center">Macro Breakdown</h3>
                        <div className="text-center mb-6">
                            <span className="text-4xl font-black text-foreground">{Math.round(totals.calories)}</span>
                            <span className="text-secondary text-sm block uppercase tracking-wide">Total Calories</span>
                        </div>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Right: Detailed List */}
                    <div className="md:col-span-2 space-y-4">
                        {results.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="food-item bg-surface p-4 rounded-xl border border-border flex items-center gap-4"
                            >
                                <img src={item.photo.thumb} alt={item.food_name} className="w-16 h-16 rounded-lg object-cover bg-background" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-lg capitalize">{item.food_name}</h4>
                                    <p className="text-secondary text-sm">{item.serving_qty} {item.serving_unit}</p>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold block text-lg">{Math.round(item.nf_calories)} kcal</span>
                                    <div className="text-xs text-secondary flex gap-2">
                                        <span className="text-blue-500">P: {item.nf_protein}g</span>
                                        <span className="text-green-500">C: {item.nf_total_carbohydrate}g</span>
                                        <span className="text-orange-500">F: {item.nf_total_fat}g</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
