'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Square, History, Trash2, Clock, CheckCircle2, Trophy } from 'lucide-react';

interface Session {
    id: number;
    task: string;
    duration: number; // in seconds
    timestamp: number;
    rating: number; // 1-5
}

export default function FocusSessionTracker() {
    const [pageMounted, setPageMounted] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [time, setTime] = useState(0);
    const [task, setTask] = useState('');
    const [sessions, setSessions] = useState<Session[]>([]);

    // Load from local storage only on client
    useEffect(() => {
        setPageMounted(true);
        const stored = localStorage.getItem('focus_sessions');
        if (stored) {
            setSessions(JSON.parse(stored));
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        if (pageMounted) {
            localStorage.setItem('focus_sessions', JSON.stringify(sessions));
        }
    }, [sessions, pageMounted]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            interval = setInterval(() => {
                setTime(t => t + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => {
        if (!task.trim()) {
            alert('Please enter a task name first!');
            return;
        }
        setIsActive(!isActive);
    };

    const stopTimer = () => {
        setIsActive(false);
        if (time > 0) {
            const newSession: Session = {
                id: Date.now(),
                task,
                duration: time,
                timestamp: Date.now(),
                rating: 0
            };
            setSessions([newSession, ...sessions]);
            setTime(0);
            setTask('');
        }
    };

    const rateSession = (id: number, rating: number) => {
        setSessions(sessions.map(s => s.id === id ? { ...s, rating } : s));
    };

    const deleteSession = (id: number) => {
        setSessions(sessions.filter(s => s.id !== id));
    };

    if (!pageMounted) return null;

    const totalFocusTime = sessions.reduce((acc, s) => acc + s.duration, 0);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Active Timer Section */}
            <div className="bg-surface p-8 rounded-2xl border border-border shadow-lg text-center relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

                <div className="mb-8">
                    <input
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        disabled={isActive}
                        placeholder="What are you working on?"
                        className="w-full max-w-xl text-center text-2xl font-bold bg-transparent border-b-2 border-border focus:border-primary outline-none py-2 placeholder:text-secondary/30 transition-colors"
                    />
                </div>

                <div className="text-8xl font-black font-mono mb-10 tracking-wider tabular-nums">
                    {formatTime(time)}
                </div>

                <div className="flex justify-center gap-6">
                    <button
                        onClick={toggleTimer}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-yellow-500/30' : 'bg-primary hover:bg-primary-hover text-white shadow-primary/30'} shadow-lg scale-100 hover:scale-105 active:scale-95`}
                    >
                        {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                    </button>

                    {(isActive || time > 0) && (
                        <button
                            onClick={stopTimer}
                            className="w-20 h-20 rounded-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 scale-100 hover:scale-105 active:scale-95 transition-all"
                        >
                            <Square size={28} fill="currentColor" />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface p-6 rounded-2xl border border-border flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                        <Clock size={24} />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-secondary uppercase">Total Time</div>
                        <div className="text-xl font-black">{Math.floor(totalFocusTime / 3600)}h {Math.floor((totalFocusTime % 3600) / 60)}m</div>
                    </div>
                </div>
                <div className="bg-surface p-6 rounded-2xl border border-border flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-secondary uppercase">Sessions</div>
                        <div className="text-xl font-black">{sessions.length}</div>
                    </div>
                </div>
                <div className="bg-surface p-6 rounded-2xl border border-border flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-secondary uppercase">Avg Rating</div>
                        <div className="text-xl font-black">
                            {sessions.filter(s => s.rating > 0).length > 0
                                ? (sessions.filter(s => s.rating > 0).reduce((acc, s) => acc + s.rating, 0) / sessions.filter(s => s.rating > 0).length).toFixed(1)
                                : '-'}/5
                        </div>
                    </div>
                </div>
            </div>

            {/* History */}
            {sessions.length > 0 && (
                <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border flex items-center gap-2">
                        <History size={20} className="text-secondary" />
                        <h3 className="font-bold">Recent Sessions</h3>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                        {sessions.map(session => (
                            <div key={session.id} className="p-4 border-b border-border last:border-0 hover:bg-background/50 transition-colors flex items-center justify-between group">
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold truncate">{session.task}</h4>
                                    <p className="text-xs text-secondary mt-1 flex gap-2">
                                        <span>{new Date(session.timestamp).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="font-mono font-bold text-lg">{formatTime(session.duration)}</span>

                                    <div className="flex gap-1" title="Rate Focus">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                onClick={() => rateSession(session.id, star)}
                                                className={`w-2 h-2 rounded-full transition-colors ${star <= session.rating ? 'bg-yellow-500' : 'bg-gray-300'}`}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => deleteSession(session.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
