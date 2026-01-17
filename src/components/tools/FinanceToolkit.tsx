'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, PiggyBank, Calculator } from 'lucide-react';

export default function FinanceToolkit() {
    const [mode, setMode] = useState<'loan' | 'savings' | 'profit'>('loan');

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-center gap-4 bg-surface p-2 rounded-xl border border-border w-fit mx-auto">
                <button
                    onClick={() => setMode('loan')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${mode === 'loan' ? 'bg-primary text-white shadow-lg' : 'hover:bg-background text-secondary'}`}
                >
                    <DollarSign size={18} /> Loan
                </button>
                <button
                    onClick={() => setMode('savings')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${mode === 'savings' ? 'bg-green-500 text-white shadow-lg' : 'hover:bg-background text-secondary'}`}
                >
                    <PiggyBank size={18} /> Savings
                </button>
                <button
                    onClick={() => setMode('profit')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${mode === 'profit' ? 'bg-blue-500 text-white shadow-lg' : 'hover:bg-background text-secondary'}`}
                >
                    <TrendingUp size={18} /> Profit
                </button>
            </div>

            <div className="bg-surface p-8 rounded-2xl border border-border shadow-lg">
                {mode === 'loan' && <LoanCalculator />}
                {mode === 'savings' && <SavingsCalculator />}
                {mode === 'profit' && <ProfitLossCalculator />}
            </div>
        </div>
    );
}

function LoanCalculator() {
    const [amount, setAmount] = useState(10000);
    const [rate, setRate] = useState(5);
    const [years, setYears] = useState(5);

    const r = rate / 100 / 12;
    const n = years * 12;
    const monthlyPayment = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) || 0;
    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - amount;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <InputGroup label="Loan Amount" value={amount} onChange={setAmount} prefix="$" />
                <InputGroup label="Interest Rate (%)" value={rate} onChange={setRate} />
                <InputGroup label="Duration (Years)" value={years} onChange={setYears} />
            </div>
            <div className="space-y-4">
                <ResultCard label="Monthly Payment" value={monthlyPayment} color="primary" />
                <ResultCard label="Total Interest" value={totalInterest} color="red" />
                <ResultCard label="Total Cost" value={totalPayment} color="orange" />
            </div>
        </div>
    );
}

function SavingsCalculator() {
    const [initial, setInitial] = useState(1000);
    const [monthly, setMonthly] = useState(100);
    const [rate, setRate] = useState(5);
    const [years, setYears] = useState(10);

    const n = 12; // Monthly
    const t = years;
    const r = rate / 100;

    // Future value of initial + monthly contributions
    // FV = P(1 + r/n)^(nt) + PMT * (((1 + r/n)^(nt) - 1) / (r/n))
    const initialFV = initial * Math.pow(1 + r / n, n * t);
    const monthlyFV = monthly * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
    const total = initialFV + monthlyFV;
    const invested = initial + (monthly * n * t);
    const interest = total - invested;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <InputGroup label="Initial Deposit" value={initial} onChange={setInitial} prefix="$" />
                <InputGroup label="Monthly Contribution" value={monthly} onChange={setMonthly} prefix="$" />
                <InputGroup label="Annual Interest (%)" value={rate} onChange={setRate} />
                <InputGroup label="Duration (Years)" value={years} onChange={setYears} />
            </div>
            <div className="space-y-4">
                <ResultCard label="Future Balance" value={total} color="green" />
                <ResultCard label="Total Invested" value={invested} color="secondary" />
                <ResultCard label="Interest Earned" value={interest} color="blue" />
            </div>
        </div>
    );
}

function ProfitLossCalculator() {
    const [revenue, setRevenue] = useState(50000);
    const [cogs, setCogs] = useState(20000);
    const [expenses, setExpenses] = useState(10000);

    const grossProfit = revenue - cogs;
    const netProfit = grossProfit - expenses;
    const margin = (netProfit / revenue) * 100 || 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <InputGroup label="Revenue" value={revenue} onChange={setRevenue} prefix="$" />
                <InputGroup label="Cost of Goods Sold (COGS)" value={cogs} onChange={setCogs} prefix="$" />
                <InputGroup label="Operating Expenses" value={expenses} onChange={setExpenses} prefix="$" />
            </div>
            <div className="space-y-4">
                <ResultCard label="Net Profit" value={netProfit} color={netProfit >= 0 ? 'green' : 'red'} />
                <ResultCard label="Gross Profit" value={grossProfit} color="blue" />
                <ResultCard label="Net Margin" value={margin} suffix="%" color="purple" />
            </div>
        </div>
    );
}

function InputGroup({ label, value, onChange, prefix }: any) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-bold text-secondary uppercase">{label}</label>
            <div className="relative">
                {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-bold">{prefix}</span>}
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className={`w-full p-3 bg-background border border-border rounded-xl font-bold outline-none focus:border-primary ${prefix ? 'pl-8' : ''}`}
                />
            </div>
        </div>
    );
}

function ResultCard({ label, value, suffix, color }: any) {
    const colors: any = {
        primary: 'text-primary bg-primary/10 border-primary/20',
        green: 'text-green-600 bg-green-500/10 border-green-500/20',
        red: 'text-red-500 bg-red-500/10 border-red-500/20',
        blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
        secondary: 'text-secondary bg-secondary/10 border-secondary/20',
    };

    return (
        <div className={`p-4 rounded-xl border ${colors[color] || colors.primary} flex justify-between items-center`}>
            <span className="font-bold uppercase text-xs opacity-70">{label}</span>
            <span className="font-black text-xl">
                {!suffix && '$'}
                {value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                {suffix}
            </span>
        </div>
    );
}
