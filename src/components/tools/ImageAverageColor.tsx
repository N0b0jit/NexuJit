'use client';

import { useState, useRef } from 'react';
import { Upload, RefreshCw, Copy, Check } from 'lucide-react';

export default function ImageAverageColor() {
    const [image, setImage] = useState<string | null>(null);
    const [averageColor, setAverageColor] = useState<string | null>(null);
    const [dominantColor, setDominantColor] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setImage(result);
                analyzeImage(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeImage = (dataUrl: string) => {
        setIsAnalyzing(true);
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = dataUrl;
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;

            // Resize for faster processing
            canvas.width = 100;
            canvas.height = 100;
            ctx.drawImage(img, 0, 0, 100, 100);

            const imageData = ctx.getImageData(0, 0, 100, 100).data;
            let r = 0, g = 0, b = 0;
            const colorCounts: { [key: string]: number } = {};

            for (let i = 0; i < imageData.length; i += 4) {
                r += imageData[i];
                g += imageData[i + 1];
                b += imageData[i + 2];

                // For dominant color (rounded to reduce noise)
                const rd = Math.round(imageData[i] / 10) * 10;
                const gd = Math.round(imageData[i + 1] / 10) * 10;
                const bd = Math.round(imageData[i + 2] / 10) * 10;
                const hex = `#${((1 << 24) + (rd << 16) + (gd << 8) + bd).toString(16).slice(1)}`;
                colorCounts[hex] = (colorCounts[hex] || 0) + 1;
            }

            const count = imageData.length / 4;
            const avgR = Math.round(r / count);
            const avgG = Math.round(g / count);
            const avgB = Math.round(b / count);
            setAverageColor(`#${((1 << 24) + (avgR << 16) + (avgG << 8) + avgB).toString(16).slice(1)}`);

            const dominant = Object.entries(colorCounts).sort((a, b) => b[1] - a[1])[0][0];
            setDominantColor(dominant);
            setIsAnalyzing(false);
        };
    };

    const handleCopy = (color: string) => {
        navigator.clipboard.writeText(color);
        setCopied(color);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="upload-container">
                {!image ? (
                    <label className="drop-zone">
                        <Upload size={40} />
                        <p>Upload image to find average color</p>
                        <input type="file" hidden accept="image/*" onChange={handleUpload} />
                    </label>
                ) : (
                    <div className="preview-wrap">
                        <img src={image} alt="Preview" />
                        <button className="reset-btn" onClick={() => { setImage(null); setAverageColor(null); }}>
                            <RefreshCw size={14} /> Upload New
                        </button>
                    </div>
                )}
            </div>

            {isAnalyzing && <div className="loading">Analyzing image pixels...</div>}

            {averageColor && (
                <div className="results-grid">
                    <div className="result-card">
                        <div className="color-preview" style={{ backgroundColor: averageColor }}></div>
                        <div className="color-info">
                            <h3>Average Color</h3>
                            <div className="copy-box">
                                <code>{averageColor}</code>
                                <button onClick={() => handleCopy(averageColor)}>
                                    {copied === averageColor ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="result-card">
                        <div className="color-preview" style={{ backgroundColor: dominantColor || '' }}></div>
                        <div className="color-info">
                            <h3>Dominant Color</h3>
                            <div className="copy-box">
                                <code>{dominantColor}</code>
                                <button onClick={() => handleCopy(dominantColor || '')}>
                                    {copied === dominantColor ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <style jsx>{`
                .tool-ui { display: flex; flex-direction: column; gap: 2rem; }
                .upload-container { 
                    border: 2px dashed var(--border); 
                    border-radius: 1.5rem; 
                    background: var(--card-bg, #f8f9fa);
                    min-height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .drop-zone { 
                    display: flex; flex-direction: column; align-items: center; gap: 1rem; cursor: pointer; color: var(--secondary); padding: 3rem;
                }
                .preview-wrap { position: relative; padding: 1rem; }
                .preview-wrap img { max-width: 100%; max-height: 300px; border-radius: 1rem; }
                .reset-btn { 
                    position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,0.9); padding: 0.5rem 1rem; border-radius: 2rem; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }
                .loading { text-align: center; color: var(--primary); font-weight: 600; }
                .results-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .result-card { 
                    background: var(--surface); border: 1px solid var(--border); border-radius: 1rem; padding: 1.5rem; display: flex; align-items: center; gap: 1.5rem;
                }
                .color-preview { width: 80px; height: 80px; border-radius: 0.75rem; border: 1px solid var(--border); }
                .color-info { flex: 1; }
                .color-info h3 { font-size: 0.875rem; color: var(--secondary); text-transform: uppercase; margin-bottom: 0.5rem; }
                .copy-box { 
                    display: flex; align-items: center; justify-content: space-between; background: var(--background); padding: 0.5rem 1rem; border-radius: 0.5rem;
                }
                code { font-family: monospace; font-weight: 700; font-size: 1.1rem; }
                @media (max-width: 640px) {
                    .results-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
