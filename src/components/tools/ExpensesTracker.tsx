'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Download, Upload, PieChart as PieIcon, DollarSign, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Expense {
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
}

const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other'];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

export default function ExpensesTracker() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const reportRef = useRef<HTMLDivElement>(null);

    const addExpense = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount) return;

        const newExpense: Expense = {
            id: Date.now().toString(),
            description,
            amount: parseFloat(amount),
            category,
            date
        };

        setExpenses([...expenses, newExpense]);
        setDescription('');
        setAmount('');
    };

    const removeExpense = (id: string) => {
        setExpenses(expenses.filter(exp => exp.id !== id));
    };

    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

    const chartData = CATEGORIES.map((cat) => {
        const value = expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
        return { name: cat, value };
    }).filter(d => d.value > 0);

    const exportPDF = async () => {
        if (!reportRef.current) return;
        const canvas = await html2canvas(reportRef.current);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('expenses-report.pdf');
    };

    const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target?.result as string);
                if (Array.isArray(imported)) setExpenses(imported);
            } catch (err) {
                alert('Invalid JSON file');
            }
        };
        reader.readAsText(file);
    };

    const exportJSON = () => {
        const blob = new Blob([JSON.stringify(expenses, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'expenses.json';
        a.click();
    };

    return (
        <div className="expenses-tracker max-w-6xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="md:col-span-1 bg-surface p-6 rounded-2xl border border-border shadow-sm h-fit">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Plus className="text-primary" /> Add Expense</h3>
                    <form onSubmit={addExpense} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-secondary text-xs uppercase font-bold">Description</label>
                            <input
                                className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:border-primary"
                                placeholder="Lunch, Taxi, etc."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-secondary text-xs uppercase font-bold">Amount ($)</label>
                            <input
                                type="number"
                                className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:border-primary"
                                placeholder="0.00"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-secondary text-xs uppercase font-bold">Category</label>
                            <select
                                className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:border-primary"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-secondary text-xs uppercase font-bold">Date</label>
                            <input
                                type="date"
                                className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:border-primary"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover shadow-lg">
                            Add Transaction
                        </button>
                    </form>

                    <div className="mt-8 border-t border-border pt-6 space-y-3">
                        <h4 className="font-bold text-sm text-secondary uppercase">Data Management</h4>
                        <div className="flex gap-2">
                            <input type="file" id="import-json" className="hidden" accept=".json" onChange={importData} />
                            <label htmlFor="import-json" className="flex-1 py-2 border border-border rounded-lg text-center cursor-pointer hover:bg-surface-hover text-sm flex items-center justify-center gap-2">
                                <Upload size={14} /> Import JSON
                            </label>
                            <button onClick={exportJSON} className="flex-1 py-2 border border-border rounded-lg hover:bg-surface-hover text-sm">
                                Export JSON
                            </button>
                        </div>
                        <button onClick={exportPDF} className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center justify-center gap-2">
                            <Download size={14} /> Export Report PDF
                        </button>
                    </div>
                </div>

                {/* Report Section */}
                <div className="md:col-span-2 space-y-6">
                    <div ref={reportRef} className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">Expense Report</h2>
                                <p className="text-secondary text-sm">Overview of your spending habits.</p>
                            </div>
                            <div className="text-right">
                                <span className="block text-secondary text-xs uppercase font-bold">Total Spent</span>
                                <span className="text-3xl font-black text-primary">${totalExpenses.toFixed(2)}</span>
                            </div>
                        </div>

                        {expenses.length > 0 ? (
                            <>
                                <div className="h-64 w-full mb-8">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: any) => `$${Number(value).toFixed(2)}`} />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="font-bold text-sm text-secondary uppercase border-b border-border pb-2">Transaction History</h3>
                                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                        {expenses.map((expense) => (
                                            <motion.div
                                                key={expense.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex justify-between items-center p-3 bg-background rounded-lg border border-border"
                                            >
                                                <div className="flex gap-4 items-center">
                                                    <div className={`w-2 h-8 rounded-full`} style={{ backgroundColor: COLORS[CATEGORIES.indexOf(expense.category) % COLORS.length] }} />
                                                    <div>
                                                        <div className="font-bold text-foreground">{expense.description}</div>
                                                        <div className="text-xs text-secondary flex gap-2">
                                                            <span>{expense.date}</span>
                                                            <span className="px-2 py-0.5 bg-secondary/10 rounded-full text-[10px]">{expense.category}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-bold text-foreground">${expense.amount.toFixed(2)}</span>
                                                    <button onClick={() => removeExpense(expense.id)} className="text-red-400 hover:text-red-500">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12 text-secondary">
                                <PieIcon size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No expenses added yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
