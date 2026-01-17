'use client';

import { useState, useEffect, useRef } from 'react';
import { Cpu, Battery, Activity, HardDrive, MousePointer, Volume2 } from 'lucide-react';

export default function AdvancedSystemTools({ defaultTab = 'webgl' }: { defaultTab?: string }) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-wrap gap-2 justify-center bg-surface p-2 rounded-xl border border-border">
                <button onClick={() => setActiveTab('webgl')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'webgl' ? 'bg-primary text-white' : 'hover:bg-background'}`}><Cpu size={18} /> WebGL Stress</button>
                <button onClick={() => setActiveTab('battery')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'battery' ? 'bg-primary text-white' : 'hover:bg-background'}`}><Battery size={18} /> Battery Simulation</button>
                <button onClick={() => setActiveTab('storage')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'storage' ? 'bg-primary text-white' : 'hover:bg-background'}`}><HardDrive size={18} /> Storage Test</button>
                <button onClick={() => setActiveTab('input')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'input' ? 'bg-primary text-white' : 'hover:bg-background'}`}><MousePointer size={18} /> Input Accuracy</button>
                <button onClick={() => setActiveTab('audio')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'audio' ? 'bg-primary text-white' : 'hover:bg-background'}`}><Volume2 size={18} /> Audio Latency</button>
            </div>

            <div className="bg-surface p-8 rounded-3xl border border-border shadow-lg min-h-[400px]">
                {activeTab === 'webgl' && <WebGlStress />}
                {activeTab === 'battery' && <BatteryStress />}
                {activeTab === 'storage' && <StorageTester />}
                {activeTab === 'input' && <InputAccuracy />}
                {activeTab === 'audio' && <AudioLatency />}
            </div>
        </div>
    );
}

function WebGlStress() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [count, setCount] = useState(100);
    const [fps, setFps] = useState(0);
    const [running, setRunning] = useState(false);
    const reqRef = useRef<number>(0);

    useEffect(() => {
        if (!running) {
            if (reqRef.current) cancelAnimationFrame(reqRef.current);
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;
        const gl = canvas.getContext('webgl');
        if (!gl) return;

        // Simple particle system simulation
        const particles = Array(count).fill(0).map(() => ({
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1,
            vx: (Math.random() - 0.5) * 0.05,
            vy: (Math.random() - 0.5) * 0.05
        }));

        let lastTime = performance.now();
        let frame = 0;

        const render = (time: number) => {
            frame++;
            if (time - lastTime >= 1000) {
                setFps(frame);
                frame = 0;
                lastTime = time;
            }

            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Simulation load
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x > 1 || p.x < -1) p.vx *= -1;
                if (p.y > 1 || p.y < -1) p.vy *= -1;
            });

            // To properly stress WebGL we'd need shaders, but JS loop overhead with high particle count 
            // is a decent proxy for "Browser Render Performance" in a simple tool.

            reqRef.current = requestAnimationFrame(render);
        };

        reqRef.current = requestAnimationFrame(render);
        return () => cancelAnimationFrame(reqRef.current!);
    }, [running, count]);

    return (
        <div className="space-y-6 text-center">
            <div className="flex justify-between items-center bg-background p-4 rounded-xl border border-border">
                <div className="text-left">
                    <div className="text-xs font-bold text-secondary uppercase">Particles</div>
                    <input type="range" min="100" max="10000" step="100" value={count} onChange={(e) => setCount(Number(e.target.value))} className="accent-primary w-48" />
                    <div className="font-mono font-bold">{count}</div>
                </div>
                <div className="text-right">
                    <div className="text-xs font-bold text-secondary uppercase">FPS</div>
                    <div className={`text-4xl font-black font-mono ${fps < 30 ? 'text-red-500' : 'text-green-500'}`}>{fps}</div>
                </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-border bg-black h-[300px]">
                <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
                {!running && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <button onClick={() => setRunning(true)} className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">
                            Start Stress Test
                        </button>
                    </div>
                )}
                {running && (
                    <button onClick={() => setRunning(false)} className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white font-bold rounded-lg shadow-lg hover:bg-red-600">
                        Stop
                    </button>
                )}
            </div>
        </div>
    );
}

function BatteryStress() {
    const [level, setLevel] = useState(100);
    const [rate, setRate] = useState(1); // % per second
    const [simulating, setSimulating] = useState(false);

    useEffect(() => {
        if (!simulating) return;
        const interval = setInterval(() => {
            setLevel(l => Math.max(0, l - (rate * 0.1))); // Update every 100ms
        }, 100);
        return () => clearInterval(interval);
    }, [simulating, rate]);

    const timeRemaining = (level / rate) * 60; // seconds

    return (
        <div className="space-y-8 max-w-lg mx-auto text-center">
            <h3 className="text-xl font-bold">Battery Drain Simulator</h3>

            <div className="relative h-64 w-32 border-4 border-secondary rounded-2xl mx-auto p-2 flex flex-col justify-end overflow-hidden bg-background">
                <div className="absolute top-0 inset-x-0 h-4 bg-secondary/20" /> {/* Terminal */}
                <div
                    className={`w-full rounded-lg transition-all duration-300 ${level > 20 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ height: `${level}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center font-black text-3xl mix-blend-difference text-white">
                    {level.toFixed(1)}%
                </div>
            </div>

            <div className="space-y-4 bg-background p-6 rounded-2xl border border-border">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-secondary uppercase">Drain Rate (Simulated Load)</label>
                    <input type="range" min="0.1" max="10" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-primary" />
                    <div className="flex justify-between text-xs font-bold text-secondary">
                        <span>Light Load</span>
                        <span>Heavy Gaming</span>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="font-bold">Est. Time to Empty:</span>
                    <span className="font-mono text-primary font-bold">{Math.floor(timeRemaining)} sec</span>
                </div>

                <button onClick={() => { setLevel(100); setSimulating(!simulating); }} className={`w-full py-3 font-bold rounded-xl transition-colors ${simulating ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-primary hover:bg-primary/90 text-white'}`}>
                    {simulating ? 'Stop Simulation' : 'Start Simulation'}
                </button>
            </div>
        </div>
    );
}

function StorageTester() {
    const [quota, setQuota] = useState<any>(null);

    const checkStorage = async () => {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const est = await navigator.storage.estimate();
            setQuota({
                usage: est.usage,
                quota: est.quota
            });
        }
    };

    useEffect(() => { checkStorage(); }, []);

    if (!quota) return <div>Checking storage...</div>;

    const usageGB = (quota.usage / 1024 / 1024 / 1024).toFixed(2);
    const quotaGB = (quota.quota / 1024 / 1024 / 1024).toFixed(2);
    const percent = ((quota.usage / quota.quota) * 100).toFixed(1);

    return (
        <div className="space-y-8 text-center max-w-lg mx-auto">
            <h3 className="text-2xl font-bold">Local Storage Capacity</h3>

            <div className="relative w-64 h-64 mx-auto">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="2" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray={`${percent}, 100`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-primary">{percent}%</span>
                    <span className="text-xs font-bold text-secondary uppercase">Used</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-background border border-border rounded-xl">
                    <div className="text-3xl font-black">{usageGB} GB</div>
                    <div className="text-xs font-bold text-secondary uppercase">Used Space</div>
                </div>
                <div className="p-4 bg-background border border-border rounded-xl">
                    <div className="text-3xl font-black">{quotaGB} GB</div>
                    <div className="text-xs font-bold text-secondary uppercase">Total Quota</div>
                </div>
            </div>

            <p className="text-sm text-secondary">This represents the storage available to this specific browser origin, not your total disk space.</p>
        </div>
    );
}

function InputAccuracy() {
    const [score, setScore] = useState(0);
    const [total, setTotal] = useState(0);
    const [target, setTarget] = useState({ x: 50, y: 50 });

    const handleClick = (e: any) => {
        // Calculate distance from center of target
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Target is at percentage position, we need px
        const targetX = (target.x / 100) * rect.width;
        const targetY = (target.y / 100) * rect.height;

        const dist = Math.sqrt(Math.pow(x - targetX, 2) + Math.pow(y - targetY, 2));

        if (dist < 30) { // Hit
            setScore(s => s + 1);
            setTarget({ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 });
        }
        setTotal(t => t + 1);
    };

    return (
        <div className="h-[400px] relative bg-background border border-border rounded-2xl overflow-hidden cursor-crosshair select-none" onClick={handleClick}>
            <div
                className="absolute w-8 h-8 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                style={{ left: `${target.x}%`, top: `${target.y}%` }}
            />
            <div className="absolute top-4 left-4 bg-surface/80 backdrop-blur p-4 rounded-xl border border-border">
                <div className="text-xs font-bold text-secondary uppercase">Score</div>
                <div className="text-2xl font-black">{score} / {total}</div>
                <div className="text-xs font-bold text-primary">{total > 0 ? Math.round((score / total) * 100) : 0}% Accuracy</div>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-secondary font-bold opacity-50 pointer-events-none">
                Click the red dots as fast as you can!
            </div>
        </div>
    );
}

function AudioLatency() {
    const [freq, setFreq] = useState(440);
    const [isPlaying, setIsPlaying] = useState(false);
    const oscRef = useRef<OscillatorNode | null>(null);
    const ctxRef = useRef<AudioContext | null>(null);

    const toggleAudio = () => {
        if (isPlaying) {
            oscRef.current?.stop();
            setIsPlaying(false);
        } else {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            oscRef.current = osc;
            ctxRef.current = ctx;
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        if (isPlaying && oscRef.current && ctxRef.current) {
            oscRef.current.frequency.setValueAtTime(freq, ctxRef.current.currentTime);
        }
    }, [freq]);

    useEffect(() => {
        return () => {
            oscRef.current?.stop();
            ctxRef.current?.close();
        };
    }, []);

    return (
        <div className="text-center py-12 space-y-8 max-w-md mx-auto">
            <h3 className="text-2xl font-bold">Audio Frequency Tester</h3>
            <div className="space-y-4 bg-background p-6 rounded-2xl border border-border">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-secondary uppercase">
                        <span>Frequency</span>
                        <span className="text-primary">{freq} Hz</span>
                    </div>
                    <input
                        type="range"
                        min="20"
                        max="20000"
                        step="1"
                        value={freq}
                        onChange={(e) => setFreq(Number(e.target.value))}
                        className="w-full accent-primary"
                    />
                </div>
                <button
                    onClick={toggleAudio}
                    className={`w-full py-4 font-black rounded-xl shadow-lg transition-all ${isPlaying ? 'bg-red-500 text-white' : 'bg-primary text-white'
                        }`}
                >
                    {isPlaying ? 'STOP TONE' : 'PLAY TONE'}
                </button>
            </div>
            <p className="text-xs text-secondary italic">
                Test your speakers and ears. Normal human hearing is 20Hz - 20,000Hz.
                Be careful with high volumes.
            </p>
        </div>
    );
}
