'use client';

import { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, Trash2, Volume2, Save, Activity, Layers, Sparkles } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui/Core';
import { motion } from 'framer-motion';

export default function AdvancedAudioTools() {
    const [activeTab, setActiveTab] = useState<'spectrogram' | 'beat-studio'>('spectrogram');

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            <div className="flex bg-surface p-2 rounded-2xl border border-glass-border justify-center sticky top-4 z-50 backdrop-blur-xl">
                <button
                    onClick={() => setActiveTab('spectrogram')}
                    className={`flex items-center gap-3 px-8 py-3 rounded-xl font-black transition-all ${activeTab === 'spectrogram' ? 'bg-accent text-white shadow-2xl' : 'hover:bg-bg-primary text-fg-tertiary'}`}
                >
                    <Activity size={18} /> SPECTROGRAM
                </button>
                <button
                    onClick={() => setActiveTab('beat-studio')}
                    className={`flex items-center gap-3 px-8 py-3 rounded-xl font-black transition-all ${activeTab === 'beat-studio' ? 'bg-accent text-white shadow-2xl' : 'hover:bg-bg-primary text-fg-tertiary'}`}
                >
                    <Layers size={18} /> BEAT STUDIO (16-STEP)
                </button>
            </div>

            <div className="min-h-[600px]">
                {activeTab === 'spectrogram' ? <SpectrogramAnalyzerUI /> : <BeatStudioUI />}
            </div>
        </div>
    );
}

// --- Spectrogram Analyzer Component ---
function SpectrogramAnalyzerUI() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const analyzerRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const animationRef = useRef<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setAudioFile(e.target.files[0]);
        }
    };

    const startAnalysis = async () => {
        if (!audioFile) return;

        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const arrayBuffer = await audioFile.arrayBuffer();
        const audioBuffer = await audioCtxRef.current.decodeAudioData(arrayBuffer);

        analyzerRef.current = audioCtxRef.current.createAnalyser();
        analyzerRef.current.fftSize = 2048;

        sourceRef.current = audioCtxRef.current.createBufferSource();
        sourceRef.current.buffer = audioBuffer;

        sourceRef.current.connect(analyzerRef.current);
        analyzerRef.current.connect(audioCtxRef.current.destination);

        sourceRef.current.start(0);
        setIsPlaying(true);
        draw();
    };

    const stopAnalysis = () => {
        sourceRef.current?.stop();
        cancelAnimationFrame(animationRef.current);
        setIsPlaying(false);
    };

    const draw = () => {
        if (!canvasRef.current || !analyzerRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d')!;
        const bufferLength = analyzerRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const renderFrame = () => {
            animationRef.current = requestAnimationFrame(renderFrame);
            analyzerRef.current!.getByteFrequencyData(dataArray);

            // Waterfall effect
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            ctx.putImageData(imageData, 0, 1);

            for (let i = 0; i < canvas.width; i++) {
                const index = Math.floor((i / canvas.width) * bufferLength);
                const value = dataArray[index];

                // Thermal-style color mapping
                const hue = (value / 255) * 300;
                ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
                ctx.fillRect(i, 0, 1, 1);
            }
        };
        renderFrame();
    };

    return (
        <Card className="p-10 space-y-8 bg-linear-to-b from-bg-primary via-bg-secondary to-bg-primary">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-black tracking-tighter italic"><span className="text-accent">Waterfall</span> Spectrogram</h2>
                <p className="text-fg-secondary">Visualize the acoustic DNA of your audio. See frequencies across time in a thermal map.</p>
            </div>

            <div className="relative rounded-3xl overflow-hidden border border-glass-border h-[400px] bg-black">
                <canvas ref={canvasRef} width={1000} height={400} className="w-full h-full opacity-80" />
                {!audioFile && (
                    <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                        <label className="cursor-pointer group">
                            <input type="file" className="hidden" accept="audio/*" onChange={handleFileUpload} />
                            <div className="premium-card p-12 space-y-4 hover:border-accent transition-all">
                                <Music size={48} className="mx-auto text-accent animate-bounce-slow" />
                                <div className="text-xl font-black">Drop Audio to Analyze</div>
                                <div className="text-xs text-fg-tertiary">WAV, MP3, OGG supported</div>
                            </div>
                        </label>
                    </div>
                )}
            </div>

            <div className="flex justify-center gap-6">
                {audioFile && (
                    <Button
                        onClick={isPlaying ? stopAnalysis : startAnalysis}
                        className={`px-12 py-4 font-black rounded-2xl shadow-2xl transition-all ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-accent hover:bg-accent/90'}`}
                    >
                        {isPlaying ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                        {isPlaying ? 'ABORT ANALYSIS' : 'REVEAL SPECTRUM'}
                    </Button>
                )}
                {audioFile && <Button variant="secondary" onClick={() => setAudioFile(null)}>New File</Button>}
            </div>
        </Card>
    );
}

// --- Beat Studio Component ---
function BeatStudioUI() {
    const [bpm, setBpm] = useState(120);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [grid, setGrid] = useState<boolean[][]>(
        Array(4).fill(0).map(() => Array(16).fill(false))
    );
    const audioCtxRef = useRef<AudioContext | null>(null);
    const nextNoteTime = useRef(0);
    const timerID = useRef<number>(0);

    const sounds = ['Kick', 'Snare', 'Hi-Hat', 'Synth'];
    const colors = ['bg-accent', 'bg-emerald-500', 'bg-amber-500', 'bg-indigo-500'];

    const toggleStep = (ri: number, ci: number) => {
        const newGrid = [...grid];
        newGrid[ri][ci] = !newGrid[ri][ci];
        setGrid(newGrid);
    };

    const playSound = (index: number) => {
        if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        if (index === 0) { // Kick
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            gain.gain.setValueAtTime(1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        } else if (index === 1) { // Snare
            osc.type = 'square';
            osc.frequency.setValueAtTime(100, ctx.currentTime);
            gain.gain.setValueAtTime(0.5, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        } else if (index === 2) { // Hi-Hat
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(10000, ctx.currentTime);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        } else { // Synth
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            gain.gain.setValueAtTime(0.4, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
        }

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1);
    };

    const scheduler = () => {
        while (nextNoteTime.current < audioCtxRef.current!.currentTime + 0.1) {
            scheduleNote(currentStep, nextNoteTime.current);
            advanceNote();
        }
        timerID.current = window.setTimeout(scheduler, 25);
    };

    const scheduleNote = (step: number, time: number) => {
        grid.forEach((row, i) => {
            if (row[step]) playSound(i);
        });
    };

    const advanceNote = () => {
        const secondsPerBeat = 60.0 / bpm / 4;
        nextNoteTime.current += secondsPerBeat;
        setCurrentStep(s => (s + 1) % 16);
    };

    const togglePlay = () => {
        if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
        if (isPlaying) {
            clearTimeout(timerID.current);
            setIsPlaying(false);
            setCurrentStep(0);
        } else {
            nextNoteTime.current = audioCtxRef.current.currentTime;
            scheduler();
            setIsPlaying(true);
        }
    };

    return (
        <Card className="p-10 space-y-10 bg-linear-to-r from-bg-primary via-bg-secondary to-bg-primary border-2 border-accent/20 overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-2">
                    <h2 className="text-4xl font-black italic tracking-tighter">Elite <span className="text-accent underline">Beat</span> Studio</h2>
                    <p className="text-xs text-fg-tertiary font-bold tracking-[0.2em] uppercase">16-Step Neural Sequencer</p>
                </div>

                <div className="flex items-center gap-6 bg-surface p-4 rounded-3xl border border-glass-border">
                    <div className="text-center px-4 border-r border-glass-border">
                        <div className="text-[10px] font-black uppercase text-fg-tertiary">TEMPO</div>
                        <input
                            type="number"
                            className="bg-transparent text-3xl font-black w-20 text-center text-accent outline-none"
                            value={bpm}
                            onChange={(e) => setBpm(Number(e.target.value))}
                        />
                    </div>
                    <Button
                        onClick={togglePlay}
                        className={`w-20 h-20 rounded-full flex items-center justify-center p-0 transition-transform hover:scale-110 ${isPlaying ? 'bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]' : 'bg-accent shadow-[0_0_40px_rgba(59,130,246,0.4)]'}`}
                    >
                        {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                    </Button>
                    <button onClick={() => setGrid(Array(4).fill(0).map(() => Array(16).fill(false)))} className="p-4 hover:bg-bg-primary rounded-2xl transition-colors">
                        <Trash2 size={24} className="text-fg-tertiary" />
                    </button>
                </div>
            </div>

            <div className="grid gap-4 overflow-x-auto pb-6 custom-scrollbar">
                {grid.map((row, ri) => (
                    <div key={ri} className="flex gap-2 items-center min-w-max">
                        <div className="w-24 text-sm font-black text-fg-secondary uppercase tracking-widest">{sounds[ri]}</div>
                        <div className="flex gap-2 p-3 bg-bg-secondary/40 rounded-2xl border border-glass-border">
                            {row.map((active, ci) => (
                                <button
                                    key={ci}
                                    onClick={() => toggleStep(ri, ci)}
                                    className={`w-10 h-14 rounded-lg border-2 transition-all duration-300 relative overflow-hidden ${active ? `${colors[ri]} border-transparent shadow-[0_0_20px_rgba(0,0,0,0.2)]` : 'bg-transparent border-glass-border'
                                        } ${currentStep === ci ? 'scale-110 z-10 border-white ring-2 ring-accent' : ''}`}
                                >
                                    {currentStep === ci && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                                    <div className="absolute bottom-1 right-1 text-[8px] font-black opacity-30">{ci + 1}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center text-xs font-black text-fg-tertiary">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><Sparkles size={12} className="text-accent" /> HI-FI ENGINES</span>
                    <span className="flex items-center gap-1"><Volume2 size={12} className="text-accent" /> ZERO LATENCY</span>
                </div>
                <div className="bg-accent/10 text-accent px-4 py-1.5 rounded-full border border-accent/20">
                    BPM SYNCHRONIZED
                </div>
            </div>
        </Card>
    );
}
