'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Zap, Share2, Download, Trash2, Maximize, Sparkles, Binary, Terminal } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui/Core';
import { motion } from 'framer-motion';

export default function ViralFunTools() {
    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-32">
            <div className="text-center space-y-4">
                <Badge variant="accent" className="px-6 py-1.5 rounded-full font-black">VIRAL LAB V4.0</Badge>
                <h1 className="text-6xl font-black tracking-tighter italic">ASCII <span className="text-accent underline decoration-4">Webcam</span> Matrix</h1>
                <p className="text-fg-secondary max-w-2xl mx-auto font-medium">
                    Convert your live webcam stream into high-contrast ANSI characters. The ultimate Green Matrix hacker aesthetic for your profile.
                </p>
            </div>

            <AsciiWebcamMatrixUI />
        </div>
    );
}

function AsciiWebcamMatrixUI() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ascii, setAscii] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [resolution, setResolution] = useState(80);
    const animationRef = useRef<number>(0);

    const chars = '@%#*+=-:. ';

    const startStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreaming(true);
                render();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const stopStream = () => {
        const stream = videoRef.current?.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        setIsStreaming(false);
        cancelAnimationFrame(animationRef.current);
    };

    const render = () => {
        const video = videoRef.current!;
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;

        const processFrame = () => {
            if (!isStreaming) return;

            const w = resolution;
            const h = Math.round(w * (video.videoHeight / video.videoWidth) * 0.5);
            canvas.width = w;
            canvas.height = h;

            ctx.drawImage(video, 0, 0, w, h);
            const data = ctx.getImageData(0, 0, w, h).data;

            let frameStr = '';
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    const i = (y * w + x) * 4;
                    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
                    frameStr += chars[charIndex];
                }
                frameStr += '\n';
            }
            setAscii(frameStr);
            animationRef.current = requestAnimationFrame(processFrame);
        };
        processFrame();
    };

    return (
        <Card className="p-10 bg-black border-2 border-accent/20 overflow-hidden relative shadow-[0_0_100px_rgba(37,99,235,0.1)]">
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
                {Array(20).fill(0).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: -100 }}
                        animate={{ y: 1000 }}
                        transition={{ repeat: Infinity, duration: Math.random() * 5 + 2, ease: "linear" }}
                        className="absolute text-accent text-[8px] font-mono leading-none"
                        style={{ left: `${i * 5}%` }}
                    >
                        {Array(50).fill(0).map(() => Math.floor(Math.random() * 2)).join('')}
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
                <div className="space-y-8 bg-black/60 backdrop-blur-xl p-8 rounded-[3rem] border border-accent/10">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black italic flex items-center gap-3">
                            <Terminal className="text-accent" /> SYSTEM_TERMINAL.EXE
                        </h3>
                        <p className="text-xs text-emerald-500/80 font-mono tracking-widest uppercase">Initializing biometric character mapping...</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-fg-tertiary tracking-[0.3em]">Hacker Stream Control</label>
                            <div className="flex gap-4">
                                {!isStreaming ? (
                                    <Button onClick={startStream} className="flex-1 bg-accent text-white font-black py-4 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                                        <Camera className="mr-2" size={18} /> INITIALIZE WEBCAM
                                    </Button>
                                ) : (
                                    <Button onClick={stopStream} className="flex-1 bg-red-600 text-white font-black py-4 rounded-2xl">
                                        TERMINATE CONNECTION
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-glass-border/10">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-fg-tertiary">
                                <span>Density / Resolution</span>
                                <span className="text-accent">{resolution}PX</span>
                            </div>
                            <input
                                type="range"
                                min="40"
                                max="150"
                                step="10"
                                value={resolution}
                                onChange={(e) => setResolution(Number(e.target.value))}
                                className="w-full accent-accent"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="secondary" className="border-glass-border/20 text-fg-secondary">
                                <Download size={16} className="mr-2" /> CAPTURE ANSI
                            </Button>
                            <Button variant="secondary" className="border-glass-border/20 text-fg-secondary">
                                <Share2 size={16} className="mr-2" /> SHARE SNAP
                            </Button>
                        </div>
                    </div>

                    <div className="p-4 bg-accent/5 border border-accent/10 rounded-2xl">
                        <div className="flex items-start gap-3">
                            <Sparkles className="text-accent shrink-0 mt-1" size={16} />
                            <p className="text-[10px] font-medium text-fg-secondary leading-relaxed italic">
                                "Tip: Stand in front of a contrasting background for a cleaner ASCII silhouette. Natural light works best for the character logic."
                            </p>
                        </div>
                    </div>
                </div>

                <div className="aspect-square bg-[#050505] rounded-[3rem] border-2 border-accent/20 flex items-center justify-center p-4 relative overflow-hidden shadow-inner group">
                    <video ref={videoRef} className="hidden" autoPlay playsInline muted />
                    <canvas ref={canvasRef} className="hidden" />

                    <div className="w-full h-full font-mono text-[8px] leading-[7px] text-accent/80 overflow-hidden whitespace-pre flex items-center justify-center select-none group-hover:text-emerald-500 transition-colors duration-700">
                        {isStreaming ? ascii : (
                            <div className="text-center space-y-4 opacity-30">
                                <Camera size={64} className="mx-auto" />
                                <div className="text-sm font-black uppercase tracking-[0.5em] animate-pulse">Waiting for Signal...</div>
                            </div>
                        )}
                    </div>

                    {isStreaming && (
                        <div className="absolute top-6 right-8 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <div className="text-[10px] font-black text-white uppercase tracking-widest">LIVE FEED</div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
