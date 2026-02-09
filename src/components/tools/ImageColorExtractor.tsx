'use client';

import { useState, useRef } from 'react';
import { Upload, Copy, Check, Palette } from 'lucide-react';

export default function ImageColorExtractor() {
    const [image, setImage] = useState<string | null>(null);
    const [colors, setColors] = useState<string[]>([]);
    const [isExtracting, setIsExtracting] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setImage(result);
                extractColors(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const extractColors = (dataUrl: string) => {
        setIsExtracting(true);
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = dataUrl;
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;

            canvas.width = 150;
            canvas.height = 150;
            ctx.drawImage(img, 0, 0, 150, 150);

            const imageData = ctx.getImageData(0, 0, 150, 150).data;
            const colorCounts: { [key: string]: number } = {};

            for (let i = 0; i < imageData.length; i += 4) {
                // Ignore transparent pixels
                if (imageData[i + 3] < 128) continue;

                // Reduce color space slightly to group similar colors
                const r = Math.round(imageData[i] / 5) * 5;
                const g = Math.round(imageData[i + 1] / 5) * 5;
                const b = Math.round(imageData[i + 2] / 5) * 5;
                const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                colorCounts[hex] = (colorCounts[hex] || 0) + 1;
            }

            const sortedColors = Object.entries(colorCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 24) // Top 24 colors
                .map(entry => entry[0]);

            setColors(sortedColors);
            setIsExtracting(false);
        };
    };

    const handleCopy = (color: string) => {
        navigator.clipboard.writeText(color);
        setCopied(color);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="layout">
                <div className="upload-side">
                    {!image ? (
                        <label className="uploader">
                            <Upload size={48} />
                            <p>Upload image to extract palette</p>
                            <input type="file" hidden accept="image/*" onChange={handleUpload} />
                        </label>
                    ) : (
                        <div className="image-preview">
                            <img src={image} alt="Source" />
                            <button onClick={() => setImage(null)} className="change-btn">Upload Another</button>
                        </div>
                    )}
                </div>

                <div className="results-side">
                    <div className="results-header">
                        <Palette size={20} />
                        <h3>Extracted Color Palette</h3>
                    </div>

                    {isExtracting ? (
                        <div className="loader">Analyzing image...</div>
                    ) : colors.length > 0 ? (
                        <div className="color-grid">
                            {colors.map(color => (
                                <div key={color} className="color-item">
                                    <div
                                        className="color-block"
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleCopy(color)}
                                    >
                                        <div className="hover-icon">
                                            {copied === color ? <Check size={16} /> : <Copy size={16} />}
                                        </div>
                                    </div>
                                    <span className="color-hex">{color}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">Upload an image to see the color breakdown.</div>
                    )}
                </div>
            </div>

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <style jsx>{`
                .tool-ui { max-width: 1000px; margin: 0 auto; }
                .layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
                .upload-side { background: var(--card-bg, #f8f9fa); border-radius: 1.5rem; border: 2px dashed var(--border); overflow: hidden; display: flex; align-items: center; justify-content: center; min-height: 400px; }
                .uploader { display: flex; flex-direction: column; align-items: center; gap: 1rem; cursor: pointer; color: var(--secondary); padding: 2rem; }
                .image-preview { width: 100%; height: 100%; padding: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
                .image-preview img { max-width: 100%; max-height: 300px; border-radius: 0.75rem; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
                .change-btn { font-size: 0.75rem; font-weight: 700; color: var(--primary); text-transform: uppercase; }
                
                .results-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
                .results-header h3 { font-size: 1.125rem; font-weight: 700; }
                
                .color-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 1.5rem; }
                .color-item { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
                .color-block { width: 100%; aspect-ratio: 1; border-radius: 0.75rem; border: 1px solid var(--border); cursor: pointer; position: relative; transition: transform 0.2s; overflow: hidden; }
                .color-block:hover { transform: scale(1.05); }
                .hover-icon { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.2); opacity: 0; transition: opacity 0.2s; color: white; }
                .color-block:hover .hover-icon { opacity: 1; }
                .color-hex { font-family: monospace; font-size: 0.75rem; font-weight: 600; color: var(--secondary); }
                
                .loader, .empty-state { padding: 4rem 2rem; text-align: center; color: var(--secondary); font-weight: 500; }
                
                @media (max-width: 768px) {
                    .layout { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
