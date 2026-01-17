'use client';

import { useState, useRef } from 'react';
import { Play, RotateCcw, Activity, ArrowDown, ArrowUp, Wifi } from 'lucide-react';

export default function InternetSpeedTest() {
    const [status, setStatus] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
    const [ping, setPing] = useState(0);
    const [download, setDownload] = useState(0);
    const [upload, setUpload] = useState(0);
    const [progress, setProgress] = useState(0);

    // Instantaneous values for animation
    const [currentSpeed, setCurrentSpeed] = useState(0);

    const abortController = useRef<AbortController | null>(null);

    const runTest = async () => {
        if (status !== 'idle' && status !== 'complete') return;

        setStatus('ping');
        setPing(0);
        setDownload(0);
        setUpload(0);
        setProgress(0);
        setCurrentSpeed(0);
        abortController.current = new AbortController();

        try {
            // 1. PING TEST
            const pings = [];
            for (let i = 0; i < 5; i++) {
                const start = performance.now();
                await fetch('/api/speedtest?type=ping', {
                    cache: 'no-store',
                    signal: abortController.current.signal
                });
                const end = performance.now();
                pings.push(end - start);
                await new Promise(r => setTimeout(r, 100)); // slight delay
            }
            const avgPing = Math.round(pings.reduce((a, b) => a + b) / pings.length);
            setPing(avgPing);

            // 2. DOWNLOAD TEST
            setStatus('download');
            const downloadSize = 5 * 1024 * 1024; // 5MB
            const downloadStart = performance.now();

            // We'll perform multiple downloads or just one large one. 
            // For better UX, we can do one large one and track progress if we used XHR, 
            // but fetch is simpler. We'll do a few parallel requests to saturate link.
            const dlStart = performance.now();
            await fetch(`/api/speedtest?type=download&size=${downloadSize}`, {
                cache: 'no-store',
                signal: abortController.current.signal
            });
            const dlEnd = performance.now();
            const dlDurationInSeconds = (dlEnd - dlStart) / 1000;
            const dlBits = downloadSize * 8;
            const dlSpeedMbps = (dlBits / dlDurationInSeconds) / (1024 * 1024);

            // Animation simulation from 0 to actual
            let step = 0;
            const interval = setInterval(() => {
                step += dlSpeedMbps / 10;
                if (step >= dlSpeedMbps) {
                    clearInterval(interval);
                    setCurrentSpeed(dlSpeedMbps);
                } else {
                    setCurrentSpeed(step);
                }
            }, 50);

            await new Promise(r => setTimeout(r, 1000)); // Wait for animation
            clearInterval(interval);
            setDownload(parseFloat(dlSpeedMbps.toFixed(2)));


            // 3. UPLOAD TEST
            setStatus('upload');
            setCurrentSpeed(0);
            const uploadSize = 2 * 1024 * 1024; // 2MB payload
            const randomData = new Uint8Array(uploadSize);
            // Fill with randomness to prevent compression if any
            for (let i = 0; i < uploadSize; i++) randomData[i] = Math.random() * 255;

            const ulStart = performance.now();
            await fetch('/api/speedtest', {
                method: 'POST',
                body: randomData,
                signal: abortController.current.signal
            });
            const ulEnd = performance.now();

            const ulDurationInSeconds = (ulEnd - ulStart) / 1000;
            const ulBits = uploadSize * 8;
            const ulSpeedMbps = (ulBits / ulDurationInSeconds) / (1024 * 1024);

            setUpload(parseFloat(ulSpeedMbps.toFixed(2)));
            setCurrentSpeed(ulSpeedMbps);

            setStatus('complete');

        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Test aborted');
            } else {
                console.error('Speed test error:', error);
                alert('An error occurred during the speed test. Please try again.');
            }
            setStatus('idle');
        }
    };

    const getGaugeRotation = () => {
        // Map 0-100+ Mbps to 0-180 degrees
        const maxSpeed = 100;
        const val = Math.min(currentSpeed, maxSpeed);
        return (val / maxSpeed) * 180;
    };

    return (
        <div className="speed-test-tool">
            <div className="gauge-container">
                <div className="gauge-bg"></div>
                <div
                    className="gauge-fill"
                    style={{ transform: `rotate(${getGaugeRotation()}deg)` }}
                ></div>
                <div className="gauge-cover">
                    <div className="speed-value">
                        {status === 'idle' || status === 'ping' ? (status === 'ping' ? 'PING' : 'GO') : currentSpeed.toFixed(1)}
                    </div>
                    <div className="speed-unit">
                        {status === 'idle' || status === 'ping' ? '' : 'Mbps'}
                    </div>
                </div>
            </div>

            <div className="status-grid">
                <div className={`status-item ${status === 'ping' ? 'active' : ''}`}>
                    <div className="label"><Activity size={16} /> Ping</div>
                    <div className="value">{ping > 0 ? `${ping} ms` : '-'}</div>
                </div>
                <div className={`status-item ${status === 'download' ? 'active' : ''}`}>
                    <div className="label"><ArrowDown size={16} /> Download</div>
                    <div className="value">{download > 0 ? `${download} Mbps` : '-'}</div>
                </div>
                <div className={`status-item ${status === 'upload' ? 'active' : ''}`}>
                    <div className="label"><ArrowUp size={16} /> Upload</div>
                    <div className="value">{upload > 0 ? `${upload} Mbps` : '-'}</div>
                </div>
            </div>

            <div className="controls">
                {status === 'idle' || status === 'complete' ? (
                    <button className="start-btn" onClick={runTest}>
                        {status === 'complete' ? <><RotateCcw size={20} /> Test Again</> : <><Play size={20} /> Start Test</>}
                    </button>
                ) : (
                    <div className="testing-indicator">
                        <Wifi className="pulse" size={24} /> Testing {status}...
                    </div>
                )}
            </div>

            <style jsx>{`
                .speed-test-tool { max-width: 600px; margin: 0 auto; background: var(--surface); padding: 3rem; border-radius: 2rem; border: 1px solid var(--border); box-shadow: var(--shadow-lg); text-align: center; }
                
                .gauge-container { position: relative; width: 300px; height: 150px; margin: 0 auto 3rem; overflow: hidden; }
                .gauge-bg { position: absolute; top: 0; left: 0; width: 300px; height: 300px; border-radius: 50%; background: var(--border); clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%); }
                .gauge-fill { position: absolute; top: 0; left: 0; width: 300px; height: 300px; border-radius: 50%; background: var(--primary); clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%); transform-origin: center; transition: transform 0.2s ease-out; transform: rotate(0deg); opacity: 0.5; }
                .gauge-cover { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 260px; height: 130px; background: var(--surface); border-radius: 150px 150px 0 0; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; padding-bottom: 2rem; }
                
                .speed-value { font-size: 3.5rem; font-weight: 800; color: var(--foreground); line-height: 1; }
                .speed-unit { color: var(--secondary); font-weight: 600; text-transform: uppercase; margin-top: 0.5rem; }

                .status-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 3rem; }
                .status-item { padding: 1rem; border-radius: 1rem; background: var(--background); border: 2px solid transparent; transition: 0.3s; }
                .status-item.active { border-color: var(--primary); background: var(--primary-soft); }
                .label { display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.9rem; color: var(--secondary); font-weight: 600; margin-bottom: 0.5rem; }
                .value { font-size: 1.5rem; font-weight: 800; color: var(--foreground); }

                .controls { height: 60px; display: flex; align-items: center; justify-content: center; }
                .start-btn { padding: 1rem 3rem; background: var(--primary); color: white; font-weight: 700; font-size: 1.1rem; border-radius: 1rem; display: flex; align-items: center; gap: 0.75rem; transition: 0.2s; }
                .start-btn:hover { background: var(--primary-hover); transform: scale(1.05); box-shadow: 0 10px 20px var(--primary-soft); }

                .testing-indicator { color: var(--primary); font-weight: 700; display: flex; align-items: center; gap: 0.75rem; font-size: 1.1rem; }
                .pulse { animation: pulse 1.5s infinite; }
                @keyframes pulse { 0% { opacity: 0.5; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.5; transform: scale(0.9); } }
            `}</style>
        </div>
    );
}
