'use client';

import { useState, useRef, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Flag } from 'lucide-react';

export default function Stopwatch() {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (running) {
            timerRef.current = setInterval(() => {
                setTime(prev => prev + 10);
            }, 10);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [running]);

    const formatTime = (ms: number) => {
        const mins = Math.floor(ms / 60000);
        const secs = Math.floor((ms % 60000) / 1000);
        const centis = Math.floor((ms % 1000) / 10);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
    };

    const toggle = () => setRunning(!running);

    const reset = () => {
        setRunning(false);
        setTime(0);
        setLaps([]);
    };

    const lap = () => {
        setLaps(prev => [time, ...prev]);
    };

    return (
        <div className="tool-ui">
            <div className="stopwatch-card">
                <div className="display-area">
                    <div className="main-time">{formatTime(time)}</div>
                </div>

                <div className="controls">
                    <button onClick={toggle} className={`ctrl-btn ${running ? 'pause' : 'play'}`}>
                        {running ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                    </button>

                    <button onClick={lap} className="ctrl-btn secondary" disabled={!running}>
                        <Flag size={24} />
                    </button>

                    <button onClick={reset} className="ctrl-btn secondary">
                        <RotateCcw size={24} />
                    </button>
                </div>

                {laps.length > 0 && (
                    <div className="laps-list">
                        <h3>Laps</h3>
                        <div className="laps-scroll">
                            {laps.map((lapTime, i) => (
                                <div key={i} className="lap-item">
                                    <span className="lap-num">Lap {laps.length - i}</span>
                                    <span className="lap-time">{formatTime(lapTime)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 500px; margin: 0 auto; }
                .stopwatch-card { background: var(--surface); padding: 3rem; border-radius: 2rem; border: 1px solid var(--border); box-shadow: var(--shadow-lg); text-align: center; }
                
                .display-area { margin-bottom: 3rem; }
                .main-time { font-size: 5rem; font-weight: 200; font-variant-numeric: tabular-nums; line-height: 1; letter-spacing: -2px; }

                .controls { display: flex; justify-content: center; gap: 1.5rem; margin-bottom: 2rem; align-items: center; }
                .ctrl-btn { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: all 0.2s; }
                
                .ctrl-btn.play { background: #10b981; color: white; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3); }
                .ctrl-btn.play:hover { transform: scale(1.05); }
                
                .ctrl-btn.pause { background: #ef4444; color: white; box-shadow: 0 10px 20px rgba(239, 68, 68, 0.3); }
                .ctrl-btn.pause:hover { transform: scale(1.05); }

                .ctrl-btn.secondary { width: 60px; height: 60px; background: var(--background); color: var(--foreground); border: 2px solid var(--border); }
                .ctrl-btn.secondary:hover { border-color: var(--primary); color: var(--primary); }
                .ctrl-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .ml-1 { margin-left: 4px; }

                .laps-list { text-align: left; background: var(--background); padding: 1.5rem; border-radius: 1.5rem; }
                .laps-list h3 { margin-top: 0; font-size: 0.9rem; text-transform: uppercase; color: var(--secondary); margin-bottom: 1rem; }
                .laps-scroll { max-height: 200px; overflow-y: auto; padding-right: 0.5rem; }
                .lap-item { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border); }
                .lap-item:last-child { border-bottom: none; }
                .lap-num { color: var(--secondary); font-weight: 600; }
                .lap-time { font-family: monospace; font-weight: 700; font-size: 1.1rem; }
            `}</style>
        </div>
    );
}
