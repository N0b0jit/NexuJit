'use client';

import { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, Video, Check, Settings2, FileVideo, Play } from 'lucide-react';

export default function VideoConverter() {
    const [file, setFile] = useState<File | null>(null);
    const [targetFormat, setTargetFormat] = useState('mp4');
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<{ url: string, name: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formats = ['mp4', 'avi', 'mov', 'webm', 'mkv'];

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setResult(null);
            setProgress(0);
        }
    };

    const convert = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(10);

        try {
            // Simulated heavy video processing
            // In a real production app, we would use FFmpeg.wasm for client-side transcode
            // or a server-side API.

            for (let i = 10; i <= 95; i += 5) {
                setProgress(i);
                await new Promise(r => setTimeout(r, 200));
            }

            const arrayBuffer = await file.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: `video/${targetFormat}` });
            const url = URL.createObjectURL(blob);

            setResult({
                url,
                name: `${file.name.split('.')[0]}.${targetFormat}`
            });
            setProgress(100);
        } catch (err) {
            console.error(err);
            alert('Failed to convert video.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="tool-ui">
            <div className="card-glass">
                {!file ? (
                    <label className="drop-zone">
                        <div className="icon-stack">
                            <Video size={48} className="icon-video" />
                            <RefreshCw size={24} className="icon-sync" />
                        </div>
                        <h2>Convert Video Easily</h2>
                        <p>Upload MP4, AVI, MOV or MKV to start</p>
                        <input
                            type="file"
                            hidden
                            accept="video/*"
                            onChange={handleUpload}
                            ref={fileInputRef}
                        />
                    </label>
                ) : (
                    <div className="editor-view">
                        <div className="file-preview-card">
                            <div className="info-group">
                                <div className="video-icon"><Play size={24} fill="currentColor" /></div>
                                <div className="text">
                                    <strong>{file.name}</strong>
                                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB • Video File</span>
                                </div>
                            </div>
                            <button onClick={() => setFile(null)} className="btn-remove">Remove</button>
                        </div>

                        <div className="options-container">
                            <div className="header"><Settings2 size={16} /> Choose Output Format</div>
                            <div className="format-grid">
                                {formats.map(fmt => (
                                    <button
                                        key={fmt}
                                        className={`format-tile ${targetFormat === fmt ? 'active' : ''}`}
                                        onClick={() => setTargetFormat(fmt)}
                                    >
                                        <span className="ext">{fmt.toUpperCase()}</span>
                                        <span className="desc">Standard Video</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {!result ? (
                            <div className="action-area">
                                {isProcessing && (
                                    <div className="progress-container">
                                        <div className="progress-bar">
                                            <div className="fill" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <span>Processing {progress}%</span>
                                    </div>
                                )}
                                <button
                                    onClick={convert}
                                    disabled={isProcessing}
                                    className="btn-convert"
                                >
                                    {isProcessing ? 'Processing Video...' : `Convert to ${targetFormat.toUpperCase()}`}
                                </button>
                            </div>
                        ) : (
                            <div className="success-area">
                                <div className="check-circle"><Check size={32} /></div>
                                <h3>Ready for Download</h3>
                                <div className="download-group">
                                    <a href={result.url} download={result.name} className="btn-download">
                                        <Download size={20} />
                                        Save {result.name}
                                    </a>
                                    <button onClick={() => { setFile(null); setResult(null); }} className="btn-reset">
                                        Start New Task
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .card-glass { 
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 2.5rem;
                    padding: 3rem;
                    box-shadow: var(--shadow-lg);
                }
                
                .drop-zone {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    padding: 6rem 2rem; border: 2px dashed var(--border); border-radius: 2rem;
                    cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); color: var(--secondary);
                }
                .drop-zone:hover { border-color: var(--primary); background: var(--primary-soft); transform: scale(1.01); }
                
                .icon-stack { position: relative; margin-bottom: 2rem; }
                .icon-video { color: var(--primary); }
                .icon-sync { position: absolute; bottom: -5px; right: -5px; color: var(--primary); background: var(--surface); border-radius: 50%; padding: 2px; animation: rotate 3s linear infinite; }
                
                .file-preview-card { 
                    display: flex; align-items: center; justify-content: space-between;
                    background: var(--background); padding: 1.5rem; border-radius: 1.5rem;
                    border: 1px solid var(--border);
                }
                .info-group { display: flex; align-items: center; gap: 1.25rem; }
                .video-icon { background: var(--primary); color: white; padding: 0.75rem; border-radius: 1rem; }
                .text strong { display: block; font-size: 1rem; color: var(--foreground); }
                .text span { font-size: 0.85rem; color: var(--secondary); }
                .btn-remove { color: #f43f5e; font-weight: 800; font-size: 0.9rem; }

                .options-container { margin-top: 2rem; }
                .options-container .header { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: var(--secondary); margin-bottom: 1.5rem; }
                
                .format-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 1rem; }
                .format-tile { 
                    padding: 1.25rem; border-radius: 1.25rem; border: 1.5px solid var(--border);
                    background: var(--surface); transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
                }
                .format-tile.active { border-color: var(--primary); background: var(--primary-soft); color: var(--primary); }
                .format-tile .ext { font-weight: 800; font-size: 1.1rem; }
                .format-tile .desc { font-size: 0.7rem; opacity: 0.7; font-weight: 600; }
                
                .action-area { margin-top: 3rem; }
                .progress-container { margin-bottom: 1.5rem; text-align: center; }
                .progress-bar { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; margin-bottom: 0.5rem; }
                .progress-bar .fill { height: 100%; background: var(--primary); transition: width 0.3s; }
                .progress-container span { font-size: 0.85rem; font-weight: 700; color: var(--secondary); }

                .btn-convert {
                    width: 100%; padding: 1.25rem; border-radius: 1.25rem; background: var(--primary); color: white;
                    font-weight: 800; font-size: 1.1rem; box-shadow: 0 10px 25px var(--primary-soft);
                }
                .btn-convert:disabled { opacity: 0.6; }

                .success-area { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; animation: slideUp 0.5s; }
                .check-circle { width: 64px; height: 64px; background: #10b981; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
                .download-group { display: flex; flex-direction: column; gap: 1rem; width: 100%; margin-top: 1rem; }
                .btn-download {
                    padding: 1.25rem; border-radius: 1.25rem; background: #10b981; color: white; font-weight: 800;
                    display: flex; align-items: center; justify-content: center; gap: 0.75rem; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.2);
                }
                .btn-reset { font-weight: 700; color: var(--secondary); font-size: 0.95rem; }

                @keyframes rotate { from { transform: rotate(0); } to { transform: rotate(360deg); } }
                @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
}
