'use client';
// Build fix: Added motion import


import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Wifi, HardDrive, Monitor, Battery, Activity, Play, RotateCcw, Keyboard, Mouse, Mic, Camera } from 'lucide-react';

export default function SystemDiagnostics() {
    const [systemInfo, setSystemInfo] = useState<any>({});
    const [battery, setBattery] = useState<any>(null);
    const [fps, setFps] = useState(0);
    const [cpuScore, setCpuScore] = useState<number | null>(null);
    const [isBenchmarking, setIsBenchmarking] = useState(false);
    const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
    const [clicks, setClicks] = useState(0);
    const [lastClickTime, setLastClickTime] = useState(0);
    const [micStream, setMicStream] = useState<MediaStream | null>(null);
    const [camStream, setCamStream] = useState<MediaStream | null>(null);
    const [micLevel, setMicLevel] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyzerRef = useRef<AnalyserNode | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number | null>(null);

    // 1. System Info
    useEffect(() => {
        const ua = navigator.userAgent;
        const info = {
            os: getOS(ua),
            browser: getBrowser(ua),
            cores: navigator.hardwareConcurrency || 'Unknown',
            memory: (navigator as any).deviceMemory ? `~${(navigator as any).deviceMemory} GB` : 'Unknown',
            screen: `${window.screen.width}x${window.screen.height}`,
            pixelRatio: window.devicePixelRatio,
            online: navigator.onLine,
            platform: (navigator as any).userAgentData?.platform || navigator.platform,
            touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0
        };
        setSystemInfo(info);

        // Battery
        if ((navigator as any).getBattery) {
            (navigator as any).getBattery().then((batt: any) => {
                const updateBattery = () => {
                    setBattery({
                        level: Math.round(batt.level * 100),
                        charging: batt.charging,
                        time: batt.chargingTime === Infinity // Some browsers return Infinity
                            ? (batt.dischargingTime === Infinity ? 'Unknown' : `${Math.round(batt.dischargingTime / 60)}m left`)
                            : `${Math.round(batt.chargingTime / 60)}m to full`
                    });
                };
                updateBattery();
                batt.addEventListener('levelchange', updateBattery);
                batt.addEventListener('chargingchange', updateBattery);
            });
        }
    }, []);

    // 2. FPS Counter (Simple Graphics Test)
    useEffect(() => {
        if (!isBenchmarking) return;

        let frameCount = 0;
        let lastTime = performance.now();

        const animate = () => {
            frameCount++;
            const now = performance.now();
            if (now - lastTime >= 1000) {
                setFps(frameCount);
                frameCount = 0;
                lastTime = now;
            }

            // Draw garbage to stress GPU slightly
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, 300, 150);
                    for (let i = 0; i < 100; i++) {
                        ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
                        ctx.beginPath();
                        ctx.arc(Math.random() * 300, Math.random() * 150, Math.random() * 20, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(requestRef.current!);
    }, [isBenchmarking]);

    // 3. CPU Benchmark
    const runCpuTest = () => {
        setIsBenchmarking(true);
        setCpuScore(null);

        setTimeout(() => {
            const start = performance.now();
            let result = 0;
            // Heavy loop
            for (let i = 0; i < 50000000; i++) {
                result += Math.sqrt(Math.sin(i) * Math.cos(i));
            }
            const end = performance.now();
            const duration = end - start;
            // Arbitrary score calculation: 10000 / duration (lower duration = higher score)
            setCpuScore(Math.floor(100000 / duration));
            setIsBenchmarking(false);
        }, 100);
    };

    // 4. Input Listeners
    useEffect(() => {
        const handleDown = (e: KeyboardEvent) => setKeysPressed(prev => new Set(prev).add(e.code));
        const handleUp = (e: KeyboardEvent) => setKeysPressed(prev => {
            const next = new Set(prev);
            next.delete(e.code);
            return next;
        });

        window.addEventListener('keydown', handleDown);
        window.addEventListener('keyup', handleUp);
        return () => {
            window.removeEventListener('keydown', handleDown);
            window.removeEventListener('keyup', handleUp);
        };
    }, []);

    const handleMouseTest = () => {
        const now = Date.now();
        if (now - lastClickTime < 300) {
            // Double click detected visually
        }
        setLastClickTime(now);
        setClicks(c => c + 1);
    };

    const startMicTest = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMicStream(stream);

            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 256;

            audioContextRef.current = audioContext;
            analyzerRef.current = analyser;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateMicLevel = () => {
                if (!analyzerRef.current) return;
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                setMicLevel(Math.round((sum / bufferLength) / 2.55));
                requestAnimationFrame(updateMicLevel);
            };
            updateMicLevel();
        } catch (err) {
            console.error("Mic access denied:", err);
            alert("Microphone access was denied or is not available.");
        }
    };

    const stopMicTest = () => {
        micStream?.getTracks().forEach(track => track.stop());
        setMicStream(null);
        setMicLevel(0);
        audioContextRef.current?.close();
    };

    const startCamTest = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setCamStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Cam access denied:", err);
            alert("Camera access was denied or is not available.");
        }
    };

    const stopCamTest = () => {
        camStream?.getTracks().forEach(track => track.stop());
        setCamStream(null);
    };

    useEffect(() => {
        return () => {
            micStream?.getTracks().forEach(track => track.stop());
            camStream?.getTracks().forEach(track => track.stop());
        };
    }, [micStream, camStream]);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* System Info Cards */}
                <div className="bg-surface p-4 rounded-xl border border-border flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg"><Monitor /></div>
                    <div>
                        <div className="text-xs font-bold text-secondary uppercase">OS & Platform</div>
                        <div className="font-bold">{systemInfo.os}</div>
                        <div className="text-xs opacity-70">{systemInfo.platform}</div>
                    </div>
                </div>
                <div className="bg-surface p-4 rounded-xl border border-border flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg"><Cpu /></div>
                    <div>
                        <div className="text-xs font-bold text-secondary uppercase">CPU & Memory</div>
                        <div className="font-bold">{systemInfo.cores} Cores</div>
                        <div className="text-xs opacity-70">RAM: {systemInfo.memory}</div>
                    </div>
                </div>
                <div className="bg-surface p-4 rounded-xl border border-border flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 text-green-500 rounded-lg"><Battery /></div>
                    <div>
                        <div className="text-xs font-bold text-secondary uppercase">Battery</div>
                        {battery ? (
                            <>
                                <div className="font-bold">{battery.level}% {battery.charging ? '(Charging)' : ''}</div>
                                <div className="text-xs opacity-70">{battery.time}</div>
                            </>
                        ) : <div className="text-sm opacity-50">Not Available</div>}
                    </div>
                </div>
                <div className="bg-surface p-4 rounded-xl border border-border flex items-center gap-4">
                    <div className="p-3 bg-orange-500/10 text-orange-500 rounded-lg"><Wifi /></div>
                    <div>
                        <div className="text-xs font-bold text-secondary uppercase">Status</div>
                        <div className="font-bold">{systemInfo.online ? 'Online' : 'Offline'}</div>
                        <div className="text-xs opacity-70">Browser: {systemInfo.browser}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Benchmark Section */}
                <div className="bg-surface p-6 rounded-2xl border border-border space-y-6">
                    <h3 className="font-bold flex items-center gap-2 text-lg border-b border-border pb-2">
                        <Activity size={20} /> Performance Benchmark
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-background rounded-xl border border-border">
                            <div className="text-xs font-bold text-secondary uppercase mb-2">CPU Score</div>
                            <div className="text-3xl font-black text-primary transition-all">
                                {isBenchmarking ? <span className="animate-pulse">Testing...</span> : (cpuScore || '-')}
                            </div>
                        </div>
                        <div className="text-center p-4 bg-background rounded-xl border border-border">
                            <div className="text-xs font-bold text-secondary uppercase mb-2">GPU Test (FPS)</div>
                            <div className="text-3xl font-black text-green-500">
                                {isBenchmarking ? fps : '-'}
                            </div>
                            <canvas ref={canvasRef} width="300" height="150" className="hidden" />
                        </div>
                    </div>

                    <button
                        onClick={runCpuTest}
                        disabled={isBenchmarking}
                        className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                    >
                        {isBenchmarking ? <RotateCcw className="animate-spin" /> : <Play />}
                        {isBenchmarking ? 'Running Tests...' : 'Run Benchmark'}
                    </button>
                    <p className="text-xs text-center text-secondary">
                        Stress tests CPU with floating point math and GPU with Canvas 2D rendering.
                    </p>
                </div>

                {/* Input Testing Section */}
                <div className="bg-surface p-6 rounded-2xl border border-border space-y-6">
                    <h3 className="font-bold flex items-center gap-2 text-lg border-b border-border pb-2">
                        <Keyboard size={20} /> Input Diagnostics
                    </h3>

                    <div className="space-y-4">
                        {/* Keyboard Tester */}
                        <div className="p-4 bg-background rounded-xl border border-border overflow-hidden">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-secondary uppercase">Keyboard</span>
                                <span className="text-xs text-secondary">{keysPressed.size} keys active</span>
                            </div>
                            <div className="flex flex-wrap gap-2 min-h-[40px]">
                                {Array.from(keysPressed).map(key => (
                                    <span key={key} className="px-2 py-1 bg-primary text-white rounded text-sm font-mono font-bold animate-in zoom-in-50">
                                        {key}
                                    </span>
                                ))}
                                {keysPressed.size === 0 && <span className="text-sm opacity-30 italic">Press any key...</span>}
                            </div>
                        </div>

                        {/* Mouse Tester */}
                        <button
                            onMouseDown={handleMouseTest}
                            className="w-full p-6 bg-background rounded-xl border border-border hover:border-primary active:bg-primary/5 transition-all outline-none group"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <Mouse className="text-secondary group-hover:text-primary transition-colors" />
                                <div className="text-center">
                                    <div className="font-bold">Click Area Test</div>
                                    <div className="text-xs text-secondary opacity-70">{clicks} Clicks Registered</div>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Peripheral Tests */}
                <div className={`bg-surface p-6 rounded-xl border border-border transition-all ${micStream ? 'ring-2 ring-primary/20' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Mic className={micStream ? 'text-primary' : 'text-secondary'} />
                            <div>
                                <div className="font-bold">Microphone Test</div>
                                <div className="text-xs text-secondary">Audio input visualization</div>
                            </div>
                        </div>
                        <button
                            onClick={micStream ? stopMicTest : startMicTest}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${micStream ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20' : 'bg-primary/10 text-primary hover:bg-primary/20'
                                }`}
                        >
                            {micStream ? 'Stop Test' : 'Start Test'}
                        </button>
                    </div>
                    {micStream && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                            <div className="h-4 bg-background rounded-full overflow-hidden border border-border">
                                <motion.div
                                    className="h-full bg-primary"
                                    animate={{ width: `${micLevel}%` }}
                                    transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase text-secondary">
                                <span>Silence</span>
                                <span>Input Detected: {micLevel}%</span>
                                <span>Peak</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className={`bg-surface p-6 rounded-xl border border-border transition-all ${camStream ? 'ring-2 ring-emerald-500/20' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Camera className={camStream ? 'text-emerald-500' : 'text-secondary'} />
                            <div>
                                <div className="font-bold">Camera Test</div>
                                <div className="text-xs text-secondary">Hardware video preview</div>
                            </div>
                        </div>
                        <button
                            onClick={camStream ? stopCamTest : startCamTest}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${camStream ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                                }`}
                        >
                            {camStream ? 'Stop Test' : 'Start Test'}
                        </button>
                    </div>
                    {camStream ? (
                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-border animate-in fade-in zoom-in-95">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">LIVE</span>
                            </div>
                        </div>
                    ) : (
                        <div className="aspect-video bg-background/50 rounded-lg border border-dashed border-border flex items-center justify-center">
                            <span className="text-xs text-secondary font-medium italic">Preview inactive</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Helpers
function getOS(ua: string) {
    if (ua.indexOf("Win") !== -1) return "Windows";
    if (ua.indexOf("Mac") !== -1) return "MacOS";
    if (ua.indexOf("Linux") !== -1) return "Linux";
    if (ua.indexOf("Android") !== -1) return "Android";
    if (ua.indexOf("like Mac") !== -1) return "iOS";
    return "Unknown OS";
}

function getBrowser(ua: string) {
    if (ua.indexOf("Chrome") !== -1) return "Chrome";
    if (ua.indexOf("Firefox") !== -1) return "Firefox";
    if (ua.indexOf("Safari") !== -1) return "Safari";
    if (ua.indexOf("Edge") !== -1) return "Edge";
    return "Unknown Browser";
}
