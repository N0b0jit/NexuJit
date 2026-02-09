'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Activity, PieChart } from 'lucide-react';

export default function ROICalculator() {
    const [cost, setCost] = useState<number>(1000);
    const [gain, setGain] = useState<number>(1500);

    const netProfit = gain - cost;
    const roi = cost > 0 ? ((netProfit / cost) * 100) : 0;

    return (
        <div className="roi-calculator max-w-4xl mx-auto space-y-8">
            <div className="bg-surface p-8 rounded-2xl border border-border shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h3 className="font-bold text-lg flex items-center gap-2"><Activity className="text-primary" /> Investment Details</h3>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-secondary uppercase">Amount Invested (Cost)</label>
                            <div className="relative">
                                <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                                <input
                                    type="number"
                                    value={cost}
                                    onChange={(e) => setCost(Math.max(0, parseFloat(e.target.value) || 0))}
                                    className="w-full pl-10 px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-mono text-lg"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-secondary uppercase">Amount Returned (Revenue)</label>
                            <div className="relative">
                                <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                                <input
                                    type="number"
                                    value={gain}
                                    onChange={(e) => setGain(Math.max(0, parseFloat(e.target.value) || 0))}
                                    className="w-full pl-10 px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-mono text-lg"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center bg-background rounded-2xl p-6 border border-border">
                        <div className="text-center space-y-2">
                            <span className="text-secondary font-semibold uppercase tracking-wider text-sm">Return on Investment</span>
                            <motion.div
                                key={roi}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`text-6xl font-black ${roi >= 0 ? 'text-green-500' : 'text-red-500'}`}
                            >
                                {roi.toFixed(2)}%
                            </motion.div>
                        </div>

                        <div className="w-full mt-8 pt-8 border-t border-border grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-secondary text-xs uppercase font-bold">Net Profit</p>
                                <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ${netProfit.toLocaleString()}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-secondary text-xs uppercase font-bold">Total Return</p>
                                <p className="text-xl font-bold text-foreground">
                                    ${gain.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Explanation Section */}
            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2"><PieChart size={20} className="text-primary" /> How is ROI Calculated?</h3>
                <p className="text-secondary leading-relaxed mb-4">
                    The Return on Investment (ROI) is a performance measure used to evaluate the efficiency or profitability of an investment.
                </p>
                <div className="bg-background p-4 rounded-lg font-mono text-sm border border-border inline-block">
                    ROI = ((Net Profit) / Cost of Investment) x 100
                </div>
            </div>
        </div>
    );
}
