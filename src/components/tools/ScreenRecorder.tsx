'use client';

import { useState, useRef, useEffect } from 'react';
import { Monitor, Camera, Mic, Square, Download, Play, RefreshCw, Circle, Settings2 } from 'lucide-react';

export default function ScreenRecorder() {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [timer, setTimer] = useState(0);
    const [options, setOptions] = useState({ screen: true, camera: false, audio: true });

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const videoPreviewRef = useRef<HTMLVideoElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = async () => {
        try {
            const screenStream = options.screen ? await navigator.mediaDevices.getDisplayMedia({ video: true, audio: options.audio }) : null;
            const cameraStream = options.camera ? await navigator.mediaDevices.getUserMedia({ video: true, audio: options.audio }) : null;

            // In a real editor, we'd composite them on a canvas. 
            // For this version, we prioritize the screen or camera.
            const targetStream = screenStream || cameraStream;
            if (!targetStream) return;

            setStream(targetStream);
            if (videoPreviewRef.current) videoPreviewRef.current.srcObject = targetStream;

            const mediaRecorder = new MediaRecorder(targetStream, { mimeType: 'video/webm' });
            mediaRecorderRef.current = mediaRecorder;
            setRecordedChunks([]);

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) setRecordedChunks(prev => [...prev, e.data]);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                setVideoUrl(url);
                setStream(null);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setTimer(0);
            timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
        } catch (err) {
            console.error(err);
            alert('Could not start recording. Permissions denied?');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            stream?.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="tool-ui">
            <div className="recorder-panel">
                <div className="viewport">
                    {isRecording ? (
                        <div className="active-view">
                            <video ref={videoPreviewRef} autoPlay muted />
                            <div className="recording-overlay">
                                <div className="indicator"><Circle size={12} fill="red" className="pulse" /> REC</div>
                                <div className="time">{formatTime(timer)}</div>
                            </div>
                        </div>
                    ) : videoUrl ? (
                        <div className="result-view">
                            <video src={videoUrl} controls />
                            <div className="actions">
                                <a href={videoUrl} download="recording.webm" className="btn-save">
                                    <Download size={20} /> Download Recording
                                </a>
                                <button onClick={() => setVideoUrl(null)} className="btn-grey">Discard</button>
                            </div>
                        </div>
                    ) : (
                        <div className="setup-view">
                            <div className="brand-icon"><Monitor size={64} /></div>
                            <h3>Ready to Record?</h3>
                            <p>Capture your screen, webcam, or both directly from your browser.</p>
                        </div>
                    )}
                </div>

                <div className="controls">
                    {!isRecording ? (
                        <>
                            <div className="option-row">
                                <button
                                    className={options.screen ? 'active' : ''}
                                    onClick={() => setOptions({ ...options, screen: !options.screen })}
                                >
                                    <Monitor size={18} /> Screen
                                </button>
                                <button
                                    className={options.camera ? 'active' : ''}
                                    onClick={() => setOptions({ ...options, camera: !options.camera })}
                                >
                                    <Camera size={18} /> Webcam
                                </button>
                                <button
                                    className={options.audio ? 'active' : ''}
                                    onClick={() => setOptions({ ...options, audio: !options.audio })}
                                >
                                    <Mic size={18} /> Audio
                                </button>
                            </div>
                            <button onClick={startRecording} className="btn-start">
                                Start Recording
                            </button>
                        </>
                    ) : (
                        <button onClick={stopRecording} className="btn-stop">
                            <Square size={20} fill="white" /> Stop Recording
                        </button>
                    )}
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 900px; margin: 0 auto; }
                .recorder-panel { background: #1e293b; border-radius: 2rem; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); }
                
                .viewport { aspect-ratio: 16/9; background: #0f172a; position: relative; display: flex; align-items: center; justify-content: center; }
                .setup-view { text-align: center; color: #94a3b8; padding: 2rem; }
                .brand-icon { color: #6366f1; margin-bottom: 2rem; opacity: 0.5; }
                .setup-view h3 { color: white; margin-bottom: 0.5rem; }
                
                .active-view, .result-view { width: 100%; height: 100%; display: flex; flex-direction: column; }
                video { width: 100%; height: 100%; object-fit: contain; }
                
                .recording-overlay { position: absolute; top: 1.5rem; left: 1.5rem; display: flex; align-items: center; gap: 1rem; }
                .indicator { background: rgba(0,0,0,0.7); color: white; padding: 0.5rem 1rem; border-radius: 2rem; font-weight: 800; font-size: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
                .pulse { animation: pulse 1s infinite; }
                .time { background: rgba(99, 102, 241, 0.9); color: white; padding: 0.5rem 1rem; border-radius: 2rem; font-weight: 800; font-size: 0.8rem; }
                
                .controls { padding: 2rem; background: #0f172a; display: flex; flex-direction: column; gap: 1.5rem; align-items: center; }
                .option-row { display: flex; gap: 1rem; }
                .option-row button { padding: 0.75rem 1.25rem; border-radius: 0.75rem; background: #1e293b; color: #94a3b8; font-weight: 700; font-size: 0.85rem; border: 1.5px solid transparent; display: flex; align-items: center; gap: 0.5rem; }
                .option-row button.active { border-color: #6366f1; color: white; background: rgba(99, 102, 241, 0.1); }
                
                .btn-start { width: 100%; max-width: 400px; padding: 1.25rem; border-radius: 1.25rem; background: #6366f1; color: white; font-weight: 800; font-size: 1.1rem; box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4); }
                .btn-stop { width: 100%; max-width: 400px; padding: 1.25rem; border-radius: 1.25rem; background: #f43f5e; color: white; font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; }
                
                .actions { position: absolute; bottom: 2rem; left: 0; right: 0; display: flex; justify-content: center; gap: 1rem; }
                .btn-save { background: #10b981; color: white; padding: 1rem 2rem; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3); }
                .btn-grey { background: rgba(255,255,255,0.1); color: white; padding: 1rem 2rem; border-radius: 1rem; font-weight: 800; }

                @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
            `}</style>
        </div>
    );
}
