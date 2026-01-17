'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Calendar, Clock, DollarSign, Home } from 'lucide-react';

export default function FreelanceRateCalculator() {
    // Inputs
    const [annualGoal, setAnnualGoal] = useState(60000);
    const [expenses, setExpenses] = useState(500); // Monthly
    const [hoursPerWeek, setHoursPerWeek] = useState(40);
    const [weeksOff, setWeeksOff] = useState(4);
    const [billablePercent, setBillablePercent] = useState(75);

    // Calc
    const totalAnnualExpenses = expenses * 12;
    const totalRevenueNeeded = annualGoal + totalAnnualExpenses;

    const workingWeeks = 52 - weeksOff;
    const totalWorkingHours = workingWeeks * hoursPerWeek;
    const billableHours = totalWorkingHours * (billablePercent / 100);

    const minHourlyRate = billableHours > 0 ? (totalRevenueNeeded / billableHours) : 0;

    return (
        <div className="freelance-calc max-w-5xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6 bg-surface p-6 rounded-2xl border border-border shadow-sm">
                    <h3 className="font-bold text-lg border-b border-border pb-4 mb-4">Financial Goals & Costs</h3>

                    <div className="grid grid-cols-1 gap-4">
                        <InputCard
                            label="Target Annual Income ($)"
                            value={annualGoal}
                            onChange={setAnnualGoal}
                            icon={<Target size={18} />}
                        />
                        <InputCard
                            label="Monthly Expenses ($)"
                            value={expenses}
                            onChange={setExpenses}
                            icon={<Home size={18} />}
                            help="Rent, software, insurance, etc."
                        />
                    </div>

                    <h3 className="font-bold text-lg border-b border-border pb-4 mb-4 mt-8">Time Available</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <InputCard
                            label="Hours / Week"
                            value={hoursPerWeek}
                            onChange={setHoursPerWeek}
                            icon={<Clock size={18} />}
                        />
                        <InputCard
                            label="Weeks Off / Year"
                            value={weeksOff}
                            onChange={setWeeksOff}
                            icon={<Calendar size={18} />}
                        />
                    </div>
                    <div className="pt-2">
                        <label className="text-sm font-semibold text-secondary block mb-2">Billable Time Percentage ({billablePercent}%)</label>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={billablePercent}
                            onChange={(e) => setBillablePercent(parseInt(e.target.value))}
                            className="w-full accent-primary h-2 bg-border rounded-lg appearance-none cursor-pointer"
                        />
                        <p className="text-xs text-secondary mt-1">Realistic is 60-75% (rest is admin, marketing, etc.)</p>
                    </div>
                </div>

                {/* Results */}
                <div className="space-y-6">
                    <motion.div
                        layout
                        className="bg-primary text-white p-8 rounded-3xl shadow-xl shadow-primary/20 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] pointer-events-none" />
                        <h3 className="text-primary-foreground/80 font-bold uppercase tracking-widest text-sm mb-2">Minimum Hourly Rate</h3>
                        <div className="text-6xl font-black mb-2">
                            ${Math.ceil(minHourlyRate)}
                        </div>
                        <p className="text-sm opacity-90">To reach your annual goal of ${annualGoal.toLocaleString()}</p>
                    </motion.div>

                    <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-4">
                        <h4 className="font-bold text-secondary text-sm uppercase">Breakdown</h4>
                        <Row label="Total Revenue Needed" value={`$${totalRevenueNeeded.toLocaleString()}`} />
                        <Row label="Total Billable Hours" value={`${Math.floor(billableHours)} hrs / yr`} />
                        <Row label="Weekly Billable Hours" value={`${Math.floor(billableHours / workingWeeks)} hrs / week`} />
                        <div className="border-t border-border pt-4 mt-4">
                            <p className="text-xs text-secondary italic">
                                *This calculation assumes you work {workingWeeks} weeks a year. Expense includes {expenses * 12} annual overhead.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InputCard({ label, value, onChange, icon, help }: any) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-semibold text-secondary flex items-center gap-2">
                {icon} {label}
            </label>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
            />
            {help && <p className="text-xs text-secondary opacity-70">{help}</p>}
        </div>
    );
}

function Row({ label, value }: any) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
            <span className="text-secondary font-medium">{label}</span>
            <span className="font-bold text-foreground">{value}</span>
        </div>
    );
}
