'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Download, Play, RefreshCw, Circle, Pause, Volume2 } from 'lucide-react';

export default function VoiceRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [timer, setTimer] = useState(0);
    const [waveform, setWaveform] = useState<number[]>([]);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setIsPaused(false);
            setTimer(0);
            setWaveform([]);

            timerRef.current = setInterval(() => {
                setTimer(t => t + 1);
                setWaveform(prev => [...prev.slice(-40), Math.random() * 100]);
            }, 100);
        } catch (err) {
            console.error(err);
            alert('Could not access microphone.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const togglePause = () => {
        if (mediaRecorderRef.current) {
            if (isPaused) {
                mediaRecorderRef.current.resume();
                setIsPaused(false);
            } else {
                mediaRecorderRef.current.pause();
                setIsPaused(true);
            }
        }
    };

    const formatTime = (ms: number) => {
        const s = Math.floor(ms / 10);
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}.${ms % 10}`;
    };

    return (
        <div className="tool-ui">
            <div className="voice-card">
                <div className="header">
                    <Volume2 size={24} className="text-primary" />
                    <h2>Studio Voice Recorder</h2>
                </div>

                <div className="visualizer">
                    {isRecording ? (
                        <div className="wave-container">
                            {waveform.map((h, i) => (
                                <div
                                    key={i}
                                    className="bar"
                                    style={{ height: `${h}%`, opacity: (i / waveform.length) }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="idle-wave">
                            <Mic size={48} className={isRecording ? 'pulse' : ''} />
                        </div>
                    )}
                    <div className="timer">{formatTime(timer)}</div>
                </div>

                <div className="controls">
                    {!isRecording ? (
                        <button onClick={startRecording} className="btn-rec">
                            <Circle size={24} fill="currentColor" />
                            Record Audio
                        </button>
                    ) : (
                        <div className="recording-actions">
                            <button onClick={togglePause} className="btn-circle">
                                {isPaused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />}
                            </button>
                            <button onClick={stopRecording} className="btn-stop-rect">
                                <Square size={24} fill="currentColor" />
                            </button>
                        </div>
                    )}

                    {audioUrl && !isRecording && (
                        <div className="result-island animate-pop">
                            <audio src={audioUrl} controls />
                            <div className="final-actions">
                                <a href={audioUrl} download="recording.wav" className="btn-download">
                                    <Download size={18} /> Download
                                </a>
                                <button onClick={() => setAudioUrl(null)} className="btn-reset">Discard</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 600px; margin: 0 auto; }
                .voice-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2.5rem; padding: 3rem; box-shadow: var(--shadow-lg); text-align: center; }
                .header { display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 3rem; }
                .header h2 { font-size: 1.5rem; font-weight: 800; }

                .visualizer { height: 200px; background: var(--background); border-radius: 2rem; margin-bottom: 3rem; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid var(--border); }
                .wave-container { display: flex; align-items: center; gap: 4px; height: 60%; width: 90%; }
                .bar { flex: 1; background: var(--primary); border-radius: 4px; transition: height 0.1s; }
                .idle-wave { color: var(--border); }
                .timer { position: absolute; bottom: 1.5rem; font-family: monospace; font-size: 1.25rem; font-weight: 700; color: var(--secondary); }

                .controls { display: flex; flex-direction: column; align-items: center; gap: 2rem; }
                .btn-rec { padding: 1.25rem 3rem; border-radius: 3rem; background: #f43f5e; color: white; font-weight: 800; display: flex; align-items: center; gap: 1rem; font-size: 1.1rem; box-shadow: 0 10px 25px rgba(244, 63, 94, 0.3); transition: all 0.3s; }
                .btn-rec:hover { transform: scale(1.05); }

                .recording-actions { display: flex; gap: 1.5rem; }
                .btn-circle { width: 64px; height: 64px; border-radius: 50%; background: var(--background); color: var(--foreground); display: flex; align-items: center; justify-content: center; border: 2px solid var(--border); }
                .btn-stop-rect { width: 64px; height: 64px; border-radius: 1.5rem; background: #f43f5e; color: white; display: flex; align-items: center; justify-content: center; }

                .result-island { width: 100%; border-top: 2px solid var(--border); pt: 2rem; mt: 1rem; }
                audio { width: 100%; margin-bottom: 1.5rem; }
                .final-actions { display: flex; gap: 1rem; justify-content: center; }
                .btn-download { padding: 0.75rem 1.5rem; border-radius: 0.75rem; background: #10b981; color: white; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }
                .btn-reset { font-weight: 700; color: var(--secondary); font-size: 0.9rem; }

                .pulse { animation: pulse 1s infinite; }
                @keyframes pulse { 0% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); opacity: 0.5; } }
                .animate-pop { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                @keyframes pop { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
