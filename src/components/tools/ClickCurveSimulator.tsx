'use client';

import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calculator, TrendingUp, Info } from 'lucide-react';

const DEFAULT_CTR = [0.35, 0.15, 0.10, 0.07, 0.05, 0.04, 0.03, 0.02, 0.015, 0.01];

export default function ClickCurveSimulator() {
    const [ctrs, setCtrs] = useState<number[]>([...DEFAULT_CTR]);
    const [volume, setVolume] = useState<number>(1000);
    const [cpc, setCpc] = useState<number>(2.5);
    const [conversionRate, setConversionRate] = useState<number>(2.0);

    const handleCTRChange = (index: number, val: number) => {
        const newCtrs = [...ctrs];
        newCtrs[index] = val / 100;
        setCtrs(newCtrs);
    };

    const data = useMemo(() => {
        return ctrs.map((ctr, i) => {
            const traffic = Math.round(volume * ctr);
            const value = Math.round(traffic * (conversionRate / 100) * 100); // Dummy value metric
            return {
                position: i + 1,
                ctr: (ctr * 100).toFixed(1),
                traffic,
                value
            };
        });
    }, [ctrs, volume, conversionRate]);

    const totalTraffic = data.reduce((sum, item) => sum + item.traffic, 0);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls */}
                <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-6 lg:col-span-1">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <SlidersHorizontal size={20} /> Parameters
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-secondary uppercase">Monthly Search Volume</label>
                            <input
                                type="number"
                                value={volume}
                                onChange={(e) => setVolume(Number(e.target.value))}
                                className="w-full p-3 bg-background border border-border rounded-xl font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-bold text-secondary uppercase">Conversion Rate (%)</label>
                                <span className="text-sm font-bold text-primary">{conversionRate}%</span>
                            </div>
                            <input
                                type="range"
                                min="0.1"
                                max="10"
                                step="0.1"
                                value={conversionRate}
                                onChange={(e) => setConversionRate(Number(e.target.value))}
                                className="w-full accent-primary"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                        <h4 className="font-bold text-sm text-secondary uppercase">CTR Curve Adjustments</h4>
                        <div className="space-y-3 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {ctrs.map((ctr, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span>Pos #{i + 1}</span>
                                        <span>{(ctr * 100).toFixed(1)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max={i === 0 ? 100 : (ctrs[i - 1] * 100)} // Constraint: can't be higher than prev
                                        step="0.1"
                                        value={ctr * 100}
                                        onChange={(e) => handleCTRChange(i, Number(e.target.value))}
                                        className="w-full accent-blue-500"
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setCtrs([...DEFAULT_CTR])}
                            className="w-full py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary font-bold rounded-lg transition-colors text-sm"
                        >
                            Reset to Average
                        </button>
                    </div>
                </div>

                {/* Visualization */}
                <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm lg:col-span-2 flex flex-col">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 text-center">
                            <div className="text-xs font-bold text-blue-600 uppercase mb-1">Total Traffic</div>
                            <div className="text-2xl font-black text-blue-700">{totalTraffic.toLocaleString()}</div>
                            <div className="text-xs text-blue-600/70">Visits / Mo</div>
                        </div>
                        <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20 text-center">
                            <div className="text-xs font-bold text-green-600 uppercase mb-1">Conversions</div>
                            <div className="text-2xl font-black text-green-700">{Math.round(totalTraffic * (conversionRate / 100))}</div>
                            <div className="text-xs text-green-600/70">Leads / Mo</div>
                        </div>
                        <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20 text-center">
                            <div className="text-xs font-bold text-purple-600 uppercase mb-1">Top 3 Traffic</div>
                            <div className="text-2xl font-black text-purple-700">
                                {data.slice(0, 3).reduce((sum, item) => sum + item.traffic, 0).toLocaleString()}
                            </div>
                            <div className="text-xs text-purple-600/70">{(data.slice(0, 3).reduce((s, i) => s + i.traffic, 0) / totalTraffic * 100).toFixed(0)}% of Total</div>
                        </div>
                        <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/20 text-center">
                            <div className="text-xs font-bold text-orange-600 uppercase mb-1">Opportunity Loss</div>
                            <div className="text-2xl font-black text-orange-700">
                                {(volume - totalTraffic).toLocaleString()}
                            </div>
                            <div className="text-xs text-orange-600/70">Uncaptured Traffic</div>
                        </div>
                    </div>

                    <div className="flex-1 min-h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis dataKey="position" label={{ value: 'Google Ranking Position', position: 'insideBottom', offset: -5 }} />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}
                                    formatter={(value: any) => [value.toLocaleString(), 'Traffic']}
                                />
                                <Area type="monotone" dataKey="traffic" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTraffic)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SlidersHorizontal({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="2" y1="14" x2="6" y2="14"></line>
            <line x1="10" y1="8" x2="14" y2="8"></line>
            <line x1="18" y1="16" x2="22" y2="16"></line>
        </svg>
    );
}
