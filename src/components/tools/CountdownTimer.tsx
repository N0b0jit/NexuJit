'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';

export default function CountdownTimer() {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(5);
    const [seconds, setSeconds] = useState(0);

    const [totalSeconds, setTotalSeconds] = useState(300);
    const [running, setRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Store initial value to reset to
    const initialTimeRef = useRef(300);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (running && totalSeconds > 0) {
            interval = setInterval(() => {
                setTotalSeconds((prev) => prev - 1);
            }, 1000);
        } else if (totalSeconds === 0 && running) {
            setRunning(false);
            setIsFinished(true);
            new Audio('/alarm.mp3').play().catch(() => { });
        }

        return () => clearInterval(interval);
    }, [running, totalSeconds]);

    const start = () => {
        if (!running && !isFinished) {
            // Need to set total seconds from inputs if we haven't started yet or adjusted inputs
            // Logic: if totalSeconds matches what's derived from inputs, just resume. 
            // If inputs changed, use inputs.
            // Simplified: Always rebuild totalSeconds from state inputs when starting fresh or resumed?
            // Actually better to have inputs update totalSeconds only when stopped.
        }
        setRunning(true);
        setIsFinished(false);
    };

    const pause = () => setRunning(false);

    const reset = () => {
        setRunning(false);
        setIsFinished(false);
        setTotalSeconds(initialTimeRef.current);
    };

    const handleInputChange = (field: 'h' | 'm' | 's', val: number) => {
        if (running) return;

        let h = hours;
        let m = minutes;
        let s = seconds;

        if (field === 'h') { setHours(val); h = val; }
        if (field === 'm') { setMinutes(val); m = val; }
        if (field === 's') { setSeconds(val); s = val; }

        const total = (h * 3600) + (m * 60) + s;
        setTotalSeconds(total);
        initialTimeRef.current = total;
    };

    // Derived display for countdown
    const displayH = Math.floor(totalSeconds / 3600);
    const displayM = Math.floor((totalSeconds % 3600) / 60);
    const displayS = totalSeconds % 60;

    const format = (n: number) => n.toString().padStart(2, '0');

    return (
        <div className="tool-ui">
            <div className="card">
                <div className={`time-display ${isFinished ? 'blink' : ''}`}>
                    {running || totalSeconds !== initialTimeRef.current ? (
                        <div className="big-time">
                            <span>{format(displayH)}</span>:
                            <span>{format(displayM)}</span>:
                            <span>{format(displayS)}</span>
                        </div>
                    ) : (
                        <div className="inputs">
                            <div className="input-grp">
                                <input
                                    type="number"
                                    value={hours}
                                    onChange={e => handleInputChange('h', parseInt(e.target.value) || 0)}
                                    min={0} max={99}
                                />
                                <label>Hrs</label>
                            </div>
                            <span className="sep">:</span>
                            <div className="input-grp">
                                <input
                                    type="number"
                                    value={minutes}
                                    onChange={e => handleInputChange('m', parseInt(e.target.value) || 0)}
                                    min={0} max={59}
                                />
                                <label>Mins</label>
                            </div>
                            <span className="sep">:</span>
                            <div className="input-grp">
                                <input
                                    type="number"
                                    value={seconds}
                                    onChange={e => handleInputChange('s', parseInt(e.target.value) || 0)}
                                    min={0} max={59}
                                />
                                <label>Secs</label>
                            </div>
                        </div>
                    )}
                </div>

                {isFinished && <div className="finished-msg"><Bell size={20} /> Time's Up!</div>}

                <div className="controls">
                    {!running ? (
                        <button onClick={start} className="ctrl-btn play"><Play size={32} className="ml-1" /></button>
                    ) : (
                        <button onClick={pause} className="ctrl-btn pause"><Pause size={32} /></button>
                    )}

                    <button onClick={reset} className="ctrl-btn sec"><RotateCcw size={24} /></button>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 500px; margin: 0 auto; }
                .card { background: var(--surface); padding: 3rem; border-radius: 2rem; border: 1px solid var(--border); text-align: center; }
                
                .time-display { margin-bottom: 3rem; min-height: 120px; display: flex; align-items: center; justify-content: center; }
                .big-time { font-size: 5rem; font-weight: 200; font-variant-numeric: tabular-nums; line-height: 1; }
                
                .inputs { display: flex; align-items: center; gap: 0.5rem; }
                .input-grp { display: flex; flex-direction: column; gap: 0.5rem; }
                .input-grp input { width: 80px; font-size: 3rem; padding: 0.5rem; text-align: center; border: 2px solid var(--border); border-radius: 1rem; background: var(--background); }
                .input-grp input:focus { border-color: var(--primary); }
                .input-grp label { font-size: 0.8rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; }
                .sep { font-size: 3rem; font-weight: 200; margin-top: -30px; }

                .controls { display: flex; justify-content: center; gap: 1.5rem; }
                .ctrl-btn { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; }
                .ctrl-btn:hover { transform: scale(1.05); }
                
                .ctrl-btn.play { background: #10b981; color: white; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3); }
                .ctrl-btn.pause { background: #ef4444; color: white; box-shadow: 0 10px 20px rgba(239, 68, 68, 0.3); }
                .ctrl-btn.sec { width: 60px; height: 60px; background: var(--background); border: 2px solid var(--border); color: var(--secondary); margin-top: 10px; }
                .ctrl-btn.sec:hover { color: var(--primary); border-color: var(--primary); }

                .ml-1 { margin-left: 4px; }
                
                @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
                .blink { animation: blink 1s infinite; color: #ef4444; }
                .finished-msg { margin-bottom: 1.5rem; font-weight: 700; color: #ef4444; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
            `}</style>
        </div>
    );
}
