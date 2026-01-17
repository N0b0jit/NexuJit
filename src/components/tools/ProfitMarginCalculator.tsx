'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calculator, DollarSign, Wallet } from 'lucide-react';

export default function ProfitMarginCalculator() {
    const [cost, setCost] = useState(50);
    const [revenue, setRevenue] = useState(100);

    const grossProfit = revenue - cost;
    const margin = revenue > 0 ? ((grossProfit / revenue) * 100) : 0;
    const markup = cost > 0 ? ((grossProfit / cost) * 100) : 0;

    return (
        <div className="profit-margin-calculator max-w-4xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface p-6 rounded-2xl border border-border shadow-md space-y-6">
                    <h3 className="font-bold text-lg flex items-center gap-2"><Briefcase className="text-primary" /> Cost & Revenue</h3>

                    <InputGroup
                        label="Cost of Goods Sold (COGS)"
                        value={cost}
                        onChange={setCost}
                        icon={<Wallet size={16} />}
                    />

                    <InputGroup
                        label="Revenue (Selling Price)"
                        value={revenue}
                        onChange={setRevenue}
                        icon={<DollarSign size={16} />}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <ResultCard
                        label="Gross Profit Margin"
                        value={`${margin.toFixed(2)}%`}
                        subtext="Portion of revenue that is profit"
                        color="text-green-500"
                    />
                    <ResultCard
                        label="Markup Percentage"
                        value={`${markup.toFixed(2)}%`}
                        subtext="Percentage added to cost"
                        color="text-blue-500"
                    />
                    <ResultCard
                        label="Gross Profit"
                        value={`$${grossProfit.toFixed(2)}`}
                        subtext="Total profit in currency"
                        color="text-foreground"
                    />
                </div>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-border">
                <h3 className="font-bold mb-4">Understanding the Difference</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-secondary">
                    <p><strong className="text-foreground">Margin</strong> is the percentage of the selling price that is profit. If you sell for $100 and it cost $50, your margin is 50%.</p>
                    <p><strong className="text-foreground">Markup</strong> is the percentage added to the cost to get the selling price. If cost is $50 and you add 100%, you sell for $100.</p>
                </div>
            </div>
        </div>
    );
}

function InputGroup({ label, value, onChange, icon }: any) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-secondary uppercase">{label}</label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">{icon}</div>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-10 px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-mono text-lg transition-all"
                />
            </div>
        </div>
    );
}

function ResultCard({ label, value, subtext, color }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface p-5 rounded-xl border border-border shadow-sm flex justify-between items-center"
        >
            <div>
                <h4 className="font-bold text-sm text-secondary uppercase tracking-wide">{label}</h4>
                <p className="text-xs text-secondary/70 mt-1">{subtext}</p>
            </div>
            <span className={`text-3xl font-black ${color}`}>{value}</span>
        </motion.div>
    );
}
