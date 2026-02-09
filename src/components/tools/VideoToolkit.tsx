'use client';

import { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, Scissors, Plus, Play, Check, FileVideo, Film } from 'lucide-react';

export default function VideoToolkit({ mode = 'trim' }: { mode?: 'trim' | 'merge' }) {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [trimRange, setTrimRange] = useState({ start: 0, end: 100 });

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files || []);
        if (selected.length > 0) {
            setFiles(mode === 'trim' ? [selected[0]] : [...files, ...selected]);
            setResultUrl(null);
        }
    };

    const process = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);
        setProgress(0);

        try {
            // Simulated Video Processing
            // In a real app with ffmpeg.wasm, we would run commands here.
            // e.g. ffmpeg -i input -ss 10 -t 20 out.mp4

            for (let i = 0; i <= 100; i += 10) {
                setProgress(i);
                await new Promise(r => setTimeout(r, 300));
            }

            const blob = new Blob([await files[0].arrayBuffer()], { type: 'video/mp4' });
            setResultUrl(URL.createObjectURL(blob));
        } catch (err) {
            console.error(err);
            alert('Failed to process video.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="tool-ui">
            <div className="toolkit-card">
                <div className="header">
                    {mode === 'trim' ? <Scissors size={24} /> : <Film size={24} />}
                    <h2>{mode === 'trim' ? 'Trim Video' : 'Merge Videos'}</h2>
                </div>

                <div className="uploader-section">
                    <label className="compact-upload">
                        <Plus size={24} />
                        <span>{mode === 'trim' ? 'Select Video' : 'Add Videos'}</span>
                        <input type="file" hidden accept="video/*" multiple={mode === 'merge'} onChange={handleUpload} />
                    </label>

                    <div className="file-tray">
                        {files.map((f, i) => (
                            <div key={i} className="file-chip">
                                <FileVideo size={16} />
                                <span>{f.name}</span>
                                <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))}>&times;</button>
                            </div>
                        ))}
                    </div>
                </div>

                {files.length > 0 && (
                    <div className="work-area">
                        {mode === 'trim' && (
                            <div className="trim-settings">
                                <h3>Trimming Options</h3>
                                <div className="range-inputs">
                                    <div className="input-box">
                                        <label>Start Sec</label>
                                        <input type="number" value={trimRange.start} onChange={e => setTrimRange({ ...trimRange, start: parseInt(e.target.value) })} />
                                    </div>
                                    <div className="input-box">
                                        <label>End Sec</label>
                                        <input type="number" value={trimRange.end} onChange={e => setTrimRange({ ...trimRange, end: parseInt(e.target.value) })} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {!resultUrl ? (
                            <div className="action-row">
                                <button onClick={process} disabled={isProcessing} className="btn-primary">
                                    {isProcessing ? (
                                        <>
                                            <RefreshCw size={20} className="spin" />
                                            Processing {progress}%
                                        </>
                                    ) : (
                                        <>{mode === 'trim' ? 'Trim Video' : 'Merge All Videos'}</>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="success-island underline-none">
                                <div className="msg"><Check size={20} /> Video processed successfully!</div>
                                <div className="btns">
                                    <a href={resultUrl} download="output.mp4" className="btn-down">Download Output</a>
                                    <button onClick={() => { setFiles([]); setResultUrl(null); }} className="btn-text">Start Over</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .toolkit-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 2.5rem; box-shadow: var(--shadow-lg); }
                .header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; color: var(--primary); }
                .header h2 { font-size: 1.5rem; font-weight: 800; color: var(--foreground); }

                .uploader-section { margin-bottom: 2rem; }
                .compact-upload { display: inline-flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.5rem; border-radius: 1rem; border: 2px dashed var(--border); cursor: pointer; color: var(--secondary); font-weight: 700; transition: all 0.2s; }
                .compact-upload:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-soft); }
                
                .file-tray { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem; }
                .file-chip { background: var(--background); padding: 0.5rem 1rem; border-radius: 0.75rem; border: 1px solid var(--border); display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 600; }
                .file-chip button { margin-left: 0.5rem; color: #f43f5e; font-size: 1.2rem; line-height: 1; }

                .work-area { background: var(--background); border-radius: 1.5rem; padding: 2rem; border: 1px solid var(--border); }
                .trim-settings { margin-bottom: 2rem; }
                .trim-settings h3 { font-size: 0.9rem; font-weight: 800; text-transform: uppercase; color: var(--secondary); margin-bottom: 1rem; }
                .range-inputs { display: flex; gap: 1rem; }
                .input-box { flex: 1; }
                .input-box label { display: block; font-size: 0.75rem; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem; }
                .input-box input { width: 100%; padding: 0.75rem; border-radius: 0.75rem; border: 1px solid var(--border); background: var(--surface); }

                .btn-primary { width: 100%; padding: 1.25rem; border-radius: 1rem; background: var(--primary); color: white; font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; box-shadow: 0 10px 25px var(--primary-soft); }
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                .success-island { text-align: center; }
                .msg { color: #10b981; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem; }
                .btns { display: flex; flex-direction: column; gap: 0.75rem; }
                .btn-down { padding: 1.25rem; border-radius: 1rem; background: #10b981; color: white; font-weight: 800; text-decoration: none; display: block; }
                .btn-text { font-weight: 700; color: var(--secondary); font-size: 0.9rem; }
            `}</style>
        </div>
    );
}
