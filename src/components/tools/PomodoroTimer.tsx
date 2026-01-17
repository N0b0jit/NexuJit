'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Briefcase } from 'lucide-react';

export default function PomodoroTimer() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'work' | 'short' | 'long'>('work');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const MODES = {
        work: { time: 25 * 60, label: 'Work', color: '#ef4444' },
        short: { time: 5 * 60, label: 'Short Break', color: '#10b981' },
        long: { time: 15 * 60, label: 'Long Break', color: '#3b82f6' }
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            new Audio('/alarm.mp3').play().catch(() => { }); // Simple alert
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft]);

    const switchMode = (newMode: 'work' | 'short' | 'long') => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(MODES[newMode].time);
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(MODES[mode].time);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((MODES[mode].time - timeLeft) / MODES[mode].time) * 100;

    return (
        <div className="tool-ui">
            <div className="pomo-card">
                <div className="mode-selector">
                    <button
                        className={`mode-btn ${mode === 'work' ? 'active' : ''}`}
                        onClick={() => switchMode('work')}
                    >
                        <Briefcase size={18} /> Work
                    </button>
                    <button
                        className={`mode-btn ${mode === 'short' ? 'active' : ''}`}
                        onClick={() => switchMode('short')}
                    >
                        <Coffee size={18} /> Short Break
                    </button>
                    <button
                        className={`mode-btn ${mode === 'long' ? 'active' : ''}`}
                        onClick={() => switchMode('long')}
                    >
                        <Coffee size={18} /> Long Break
                    </button>
                </div>

                <div className="timer-display">
                    <div className="progress-ring" style={{ background: `conic-gradient(${MODES[mode].color} ${progress}%, transparent 0)` }}>
                        <div className="inner-ring">
                            <span className="time">{formatTime(timeLeft)}</span>
                            <span className="status">{isActive ? 'RUNNING' : 'PAUSED'}</span>
                        </div>
                    </div>
                </div>

                <div className="controls">
                    <button onClick={toggleTimer} className="ctrl-btn main" style={{ background: MODES[mode].color }}>
                        {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                    </button>
                    <button onClick={resetTimer} className="ctrl-btn sec">
                        <RotateCcw size={24} />
                    </button>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 500px; margin: 0 auto; }
                .pomo-card { background: var(--surface); padding: 2rem; border-radius: 2rem; border: 1px solid var(--border); box-shadow: var(--shadow-lg); text-align: center; }
                
                .mode-selector { display: flex; background: var(--background); padding: 0.5rem; border-radius: 1rem; margin-bottom: 3rem; justify-content: space-between; gap: 0.5rem; }
                .mode-btn { flex: 1; padding: 0.75rem; border-radius: 0.75rem; font-weight: 600; color: var(--secondary); display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s; font-size: 0.9rem; }
                .mode-btn.active { background: var(--surface); color: var(--foreground); box-shadow: var(--shadow-sm); }
                .mode-btn:hover:not(.active) { color: var(--foreground); }

                .timer-display { display: flex; justify-content: center; margin-bottom: 3rem; }
                .progress-ring { width: 280px; height: 280px; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; padding: 20px; transition: background 0.2s; background: var(--border); }
                .inner-ring { background: var(--surface); width: 100%; height: 100%; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: inset 0 0 20px rgba(0,0,0,0.05); }
                
                .time { font-size: 5rem; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; letter-spacing: -2px; }
                .status { font-size: 0.8rem; letter-spacing: 0.2em; color: var(--secondary); margin-top: 1rem; font-weight: 700; }

                .controls { display: flex; justify-content: center; gap: 1.5rem; align-items: center; }
                .ctrl-btn { border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; }
                .ctrl-btn:hover { transform: scale(1.05); }
                
                .ctrl-btn.main { width: 80px; height: 80px; color: white; box-shadow: 0 10px 20px rgba(0,0,0,0.15); }
                .ctrl-btn.sec { width: 50px; height: 50px; background: var(--background); color: var(--secondary); }
                .ctrl-btn.sec:hover { color: var(--foreground); background: var(--border); }
                
                .ml-1 { margin-left: 4px; }
            `}</style>
        </div>
    );
}
