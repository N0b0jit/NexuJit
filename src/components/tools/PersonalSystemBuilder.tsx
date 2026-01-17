'use client';

import { useState, useEffect } from 'react';
import {
    Layout,
    Calendar,
    Clock,
    Shield,
    Zap,
    Coffee,
    FastForward,
    Save,
    Download,
    Plus,
    Trash2,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Brain,
    Sunrise,
    Sunset,
    Moon
} from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function PersonalSystemBuilder({ defaultTab = 'routines' }: { defaultTab?: string }) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const tabs = [
        { id: 'routines', label: 'Routine Architect', icon: Layout },
        { id: 'tomorrow', label: 'Tomorrow Setup', icon: Calendar },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-wrap gap-2 justify-center bg-surface p-2 rounded-xl border border-border sticky top-4 z-20 backdrop-blur-md">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'hover:bg-background text-secondary'}`}
                    >
                        <tab.icon size={18} />
                        <span className="hidden md:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="bg-surface p-8 rounded-3xl border border-border shadow-lg min-h-[600px]">
                {activeTab === 'routines' && <RoutineArchitect />}
                {activeTab === 'tomorrow' && <TomorrowSetup />}
            </div>
        </div>
    );
}

// --- Sub-components ---

function RoutineArchitect() {
    const [blocks, setBlocks] = useState([
        { id: 1, phase: 'Morning', activity: 'Hydration & Sun', duration: '15', energy: 'Low', type: 'Health' },
        { id: 2, phase: 'Morning', activity: 'Deep Work Block 1', duration: '90', energy: 'High', type: 'Focus' },
        { id: 3, phase: 'Lunch', activity: 'Nutritious Meal & Walk', duration: '60', energy: 'Medium', type: 'Rest' },
        { id: 4, phase: 'Afternoon', activity: 'Admin & Emails', duration: '45', energy: 'Medium', type: 'Admin' },
    ]);

    const addBlock = (phase: string) => {
        const newBlock = {
            id: Date.now(),
            phase,
            activity: 'New Activity',
            duration: '30',
            energy: 'Medium',
            type: 'Other'
        };
        setBlocks([...blocks, newBlock]);
    };

    const removeBlock = (id: number) => setBlocks(blocks.filter(b => b.id !== id));

    const updateBlock = (id: number, field: string, value: string) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    const phases = ['Early Morning', 'Morning', 'Lunch', 'Afternoon', 'Evening', 'Wind Down'];

    const totalMinutes = blocks.reduce((acc, b) => acc + parseInt(b.duration || '0'), 0);
    const focusTime = blocks.filter(b => b.type === 'Focus').reduce((acc, b) => acc + parseInt(b.duration || '0'), 0);

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black">Routine Architect</h2>
                    <p className="text-secondary font-medium italic">"Don't build habits, build systems that support your goals."</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-primary/10 p-4 rounded-2xl text-center min-w-[120px]">
                        <div className="text-[10px] font-bold uppercase text-primary">Focused Time</div>
                        <div className="text-2xl font-black">{Math.floor(focusTime / 60)}h {focusTime % 60}m</div>
                    </div>
                </div>
            </div>

            <div className="grid gap-8">
                {phases.map(phase => (
                    <div key={phase} className="space-y-4">
                        <div className="flex items-center justify-between border-b border-border pb-2">
                            <h3 className="text-xl font-black flex items-center gap-2">
                                {phase === 'Early Morning' && <Sunrise className="text-orange-500" />}
                                {phase === 'Evening' && <Sunset className="text-orange-400" />}
                                {phase === 'Wind Down' && <Moon className="text-blue-500" />}
                                {phase}
                            </h3>
                            <button onClick={() => addBlock(phase)} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                                <Plus size={14} /> Add Block
                            </button>
                        </div>

                        <div className="grid gap-3">
                            {blocks.filter(b => b.phase === phase).map(block => (
                                <div key={block.id} className="flex flex-wrap md:flex-nowrap items-center gap-4 p-4 bg-background border border-border rounded-2xl group transition-all hover:border-primary/30">
                                    <div className="w-full md:w-1/3">
                                        <input
                                            value={block.activity}
                                            onChange={(e) => updateBlock(block.id, 'activity', e.target.value)}
                                            className="w-full bg-transparent font-bold text-lg outline-none"
                                            placeholder="Activity name..."
                                        />
                                    </div>
                                    <div className="flex-1 flex gap-2">
                                        <select
                                            value={block.type}
                                            onChange={(e) => updateBlock(block.id, 'type', e.target.value)}
                                            className="bg-surface border border-border rounded-lg px-2 py-1 text-xs font-bold"
                                        >
                                            <option>Focus</option>
                                            <option>Rest</option>
                                            <option>Health</option>
                                            <option>Admin</option>
                                            <option>Other</option>
                                        </select>
                                        <select
                                            value={block.energy}
                                            onChange={(e) => updateBlock(block.id, 'energy', e.target.value)}
                                            className="bg-surface border border-border rounded-lg px-2 py-1 text-xs font-bold"
                                        >
                                            <option>High</option>
                                            <option>Medium</option>
                                            <option>Low</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 bg-surface px-3 py-1 rounded-lg border border-border">
                                            <span className="text-xs font-bold opacity-50 uppercase">Mins</span>
                                            <input
                                                type="number"
                                                value={block.duration}
                                                onChange={(e) => updateBlock(block.id, 'duration', e.target.value)}
                                                className="w-12 bg-transparent font-black text-center"
                                            />
                                        </div>
                                        <button onClick={() => removeBlock(block.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {blocks.filter(b => b.phase === phase).length === 0 && (
                                <div className="text-center py-4 text-secondary text-sm italic opacity-50 border-2 border-dashed border-border rounded-2xl">
                                    No activities scheduled for this phase.
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-10 bg-primary/5 rounded-[3rem] text-center space-y-4">
                <Brain className="mx-auto text-primary" size={48} />
                <h4 className="text-xl font-black">Systemic Breakdown</h4>
                <p className="text-secondary max-w-2xl mx-auto">
                    Your current system spans <strong>{Math.floor(totalMinutes / 60)} hours</strong> and
                    is <strong>{((focusTime / totalMinutes) * 100 || 0).toFixed(0)}% focused</strong>.
                    Remember to schedule rest blocks after every high-energy task to maintain longevity.
                </p>
            </div>
        </div>
    );
}

function TomorrowSetup() {
    const hours = Array.from({ length: 18 }, (_, i) => i + 5); // 5 AM to 10 PM
    const [schedule, setSchedule] = useState<Record<number, string>>({});
    const [topGoals, setTopGoals] = useState(['', '', '']);

    const updateDay = (hour: number, text: string) => {
        setSchedule({ ...schedule, [hour]: text });
    };

    const downloadTemplate = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(24);
        doc.setTextColor(40, 40, 40);
        doc.text("Tomorrow's Battle Plan", 20, 30);

        // Date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        doc.setFontSize(12);
        doc.text(`Date: ${tomorrow.toLocaleDateString()}`, 20, 40);

        // Goals
        doc.setFontSize(16);
        doc.text("Top 3 Intentions:", 20, 60);
        doc.setFontSize(12);
        topGoals.forEach((g, i) => {
            doc.text(`${i + 1}. ${g || '___________________'}`, 25, 70 + (i * 10));
        });

        // Timeline
        doc.setFontSize(16);
        doc.text("Time Blocking:", 20, 110);
        doc.setFontSize(10);
        let y = 120;
        hours.forEach(h => {
            const timeLabel = h < 12 ? `${h}:00 AM` : h === 12 ? '12:00 PM' : `${h - 12}:00 PM`;
            doc.text(`${timeLabel}: ${schedule[h] || '-------------------'}`, 25, y);
            y += 8;
        });

        doc.save('tomorrow-setup.pdf');
    };

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black">Tomorrow Setup Tool</h2>
                    <p className="text-secondary font-medium">Capture the next day before you sleep.</p>
                </div>
                <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 bg-primary text-white font-black px-6 py-3 rounded-2xl shadow-xl hover:scale-105 transition-transform"
                >
                    <Download size={20} /> Download PDF
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column: Intention */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-background border border-border p-6 rounded-[2.5rem] shadow-sm space-y-6">
                        <h3 className="text-xl font-black flex items-center gap-2"><CheckCircle2 className="text-green-500" /> Non-Negotiables</h3>
                        {topGoals.map((g, i) => (
                            <div key={i} className="space-y-2">
                                <label className="text-[10px] uppercase font-black opacity-50">Goal #{i + 1}</label>
                                <input
                                    className="w-full bg-surface p-4 rounded-xl border border-border font-bold outline-none focus:ring-2 ring-primary/20"
                                    placeholder="Enter primary intent..."
                                    value={g}
                                    onChange={(e) => {
                                        const n = [...topGoals];
                                        n[i] = e.target.value;
                                        setTopGoals(n);
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="bg-primary/5 p-6 rounded-[2.5rem] border border-primary/10">
                        <h4 className="font-black flex items-center gap-2 mb-2"><AlertCircle size={18} /> Reality Check</h4>
                        <p className="text-xs text-secondary leading-relaxed">
                            Most people over-plan. <span>Pick 1 Focus task</span> and 2 smaller ones. The rest of the time is for reaction and routine.
                        </p>
                    </div>
                </div>

                {/* Right Column: Timeline */}
                <div className="md:col-span-2">
                    <div className="bg-background border border-border rounded-[2.5rem] shadow-sm overflow-hidden">
                        <div className="bg-surface p-4 border-b border-border flex justify-between items-center">
                            <h3 className="font-black uppercase tracking-widest text-xs">Time Blocking Grid</h3>
                            <div className="flex items-center gap-2 text-[10px] font-bold">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> Active</span>
                                <span className="opacity-50">5:00 AM - 10:00 PM</span>
                            </div>
                        </div>
                        <div className="divide-y divide-border h-[600px] overflow-y-auto">
                            {hours.map(h => (
                                <div key={h} className="group flex items-center">
                                    <div className="w-24 p-4 text-center border-r border-border shrink-0">
                                        <div className="text-lg font-black">{h < 12 ? h : h === 12 ? 12 : h - 12}</div>
                                        <div className="text-[10px] font-bold uppercase opacity-50">{h < 12 ? 'AM' : 'PM'}</div>
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            className="w-full p-6 bg-transparent outline-none font-bold text-lg placeholder:opacity-20 hover:bg-surface/50 transition-colors"
                                            placeholder="What's happening?"
                                            value={schedule[h] || ''}
                                            onChange={(e) => updateDay(h, e.target.value)}
                                        />
                                    </div>
                                    <div className="px-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight className="text-primary" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
