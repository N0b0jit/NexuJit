'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Copy, Check, MousePointer2 } from 'lucide-react';

export default function ImageColorPicker() {
    const [image, setImage] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState('#2563eb');
    const [copied, setCopied] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        if (!canvasRef.current || !imgRef.current) return;

        const canvas = canvasRef.current;
        const img = imgRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        // Sync canvas size to image display size if needed, but better to use natural size
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        const rect = img.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * img.naturalWidth;
        const y = ((e.clientY - rect.top) / rect.height) * img.naturalHeight;

        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
        setSelectedColor(hex);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(selectedColor);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const rgb = hexToRgb(selectedColor);

    return (
        <div className="tool-ui">
            <div className="upload-section">
                {!image ? (
                    <label className="upload-box">
                        <Upload size={48} />
                        <span>Click to upload an image</span>
                        <input type="file" hidden accept="image/*" onChange={handleUpload} />
                    </label>
                ) : (
                    <div className="image-preview-container">
                        <img
                            ref={imgRef}
                            src={image}
                            alt="Uploaded"
                            onClick={handleImageClick}
                            className="picker-image"
                        />
                        <div className="hint"><MousePointer2 size={14} /> Click anywhere on image to pick color</div>
                        <button className="change-btn" onClick={() => setImage(null)}>Change Image</button>
                    </div>
                )}
            </div>

            <div className="color-inspector">
                <div className="swatch" style={{ backgroundColor: selectedColor }}></div>
                <div className="details">
                    <div className="val-group">
                        <label>HEX</label>
                        <div className="copy-input">
                            <input type="text" value={selectedColor} readOnly />
                            <button onClick={handleCopy}>
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                    <div className="val-group">
                        <label>RGB</label>
                        <input type="text" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} readOnly />
                    </div>
                </div>
            </div>

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <style jsx>{`
                .tool-ui { display: flex; flex-direction: column; gap: 2rem; }
                .upload-section { 
                    background: var(--card-bg, #f8f9fa); 
                    border: 2px dashed var(--border); 
                    border-radius: 1.5rem; 
                    min-height: 400px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    position: relative;
                }
                .upload-box { 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    gap: 1rem; 
                    cursor: pointer;
                    color: var(--secondary);
                }
                .image-preview-container {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 2rem;
                }
                .picker-image {
                    max-width: 100%;
                    max-height: 500px;
                    cursor: crosshair;
                    border-radius: 0.5rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }
                .hint {
                    margin-top: 1rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--secondary);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .change-btn {
                    margin-top: 1rem;
                    font-size: 0.75rem;
                    color: var(--primary);
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .color-inspector {
                    display: flex;
                    gap: 2rem;
                    background: white;
                    padding: 2rem;
                    border-radius: 1.5rem;
                    border: 1px solid var(--border);
                    align-items: center;
                }
                .swatch {
                    width: 100px;
                    height: 100px;
                    border-radius: 1rem;
                    border: 1px solid var(--border);
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
                }
                .details {
                    flex: 1;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .val-group label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: var(--secondary);
                    margin-bottom: 0.5rem;
                }
                input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border-radius: 0.75rem;
                    border: 1px solid var(--border);
                    background: var(--background);
                    font-family: monospace;
                    font-size: 1rem;
                }
                .copy-input {
                    display: flex;
                    gap: 0.5rem;
                }
                .copy-input button {
                    padding: 0 1rem;
                    background: var(--primary);
                    color: white;
                    border-radius: 0.75rem;
                }
                @media (max-width: 640px) {
                    .color-inspector { flex-direction: column; }
                    .details { grid-template-columns: 1fr; }
                    .swatch { width: 100%; }
                }
            `}</style>
        </div>
    );
}

function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}
