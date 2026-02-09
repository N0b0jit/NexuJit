'use client';

import { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Download, Sliders } from 'lucide-react';

export default function ImageCompressor() {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [compressedImage, setCompressedImage] = useState<string | null>(null);
    const [quality, setQuality] = useState(0.8);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const [fileName, setFileName] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setOriginalSize(file.size);
            const reader = new FileReader();
            reader.onload = (ev) => {
                setOriginalImage(ev.target?.result as string);
                setCompressedImage(null); // Reset prev result
            };
            reader.readAsDataURL(file);
        }
    };

    const compress = () => {
        if (!originalImage || !canvasRef.current) return;

        const img = new Image();
        img.src = originalImage;
        img.onload = () => {
            const canvas = canvasRef.current!;
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);

            // Compress
            canvas.toBlob((blob) => {
                if (blob) {
                    setCompressedSize(blob.size);
                    const url = URL.createObjectURL(blob);
                    setCompressedImage(url);
                }
            }, 'image/jpeg', quality);
        };
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="tool-ui">
            <div className="compressor-card">
                <div className="upload-section">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        id="img-upload"
                        className="hidden"
                    />
                    <label htmlFor="img-upload" className="upload-btn">
                        <Upload size={24} /> Upload Image
                    </label>
                    {fileName && <span className="file-name">{fileName} ({formatSize(originalSize)})</span>}
                </div>

                {originalImage && (
                    <div className="interface">
                        <div className="controls">
                            <label><Sliders size={18} /> Compression Quality: {Math.round(quality * 100)}%</label>
                            <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.1"
                                value={quality}
                                onChange={(e) => setQuality(parseFloat(e.target.value))}
                            />
                            <button onClick={compress} className="action-btn">Compress Image</button>
                        </div>

                        <div className="preview-area">
                            <div className="preview-box">
                                <h3>Original</h3>
                                <img src={originalImage} alt="Original" />
                            </div>
                            <div className="preview-box">
                                <h3>Compressed</h3>
                                {compressedImage ? (
                                    <>
                                        <img src={compressedImage} alt="Compressed" />
                                        <div className="stats">
                                            <span>Size: {formatSize(compressedSize)}</span>
                                            <span className="save">Saved {Math.round((1 - compressedSize / originalSize) * 100)}%</span>
                                        </div>
                                        <a href={compressedImage} download={`compressed-${fileName}`} className="download-btn">
                                            <Download size={18} /> Download
                                        </a>
                                    </>
                                ) : (
                                    <div className="placeholder">Click Compress to see result</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 900px; margin: 0 auto; }
                .compressor-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2rem; box-shadow: var(--shadow-lg); }
                
                .upload-section { display: flex; flex-direction: column; align-items: center; gap: 1rem; margin-bottom: 2rem; padding: 2rem; border: 2px dashed var(--border); border-radius: 1rem; background: var(--background); }
                .hidden { display: none; }
                .upload-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: var(--primary); color: white; border-radius: 99px; font-weight: 700; cursor: pointer; transition: transform 0.2s; }
                .upload-btn:hover { transform: translateY(-2px); }
                .file-name { font-size: 0.9rem; color: var(--secondary); font-weight: 600; }

                .controls { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; padding: 1.5rem; background: var(--background); border-radius: 1rem; }
                .controls label { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: var(--foreground); }
                input[type="range"] { width: 100%; accent-color: var(--primary); }
                .action-btn { padding: 1rem; background: var(--primary); color: white; border-radius: 0.75rem; font-weight: 800; }

                .preview-area { display: grid; grid-template-columns: 1fr; gap: 2rem; }
                @media(min-width: 768px) { .preview-area { grid-template-columns: 1fr 1fr; } }
                
                .preview-box { display: flex; flex-direction: column; gap: 1rem; align-items: center; background: var(--background); padding: 1rem; border-radius: 1rem; border: 1px solid var(--border); }
                .preview-box h3 { font-size: 1rem; text-transform: uppercase; color: var(--secondary); }
                .preview-box img { max-width: 100%; max-height: 300px; object-fit: contain; border-radius: 0.5rem; }
                
                .stats { display: flex; gap: 1rem; font-weight: 700; font-size: 0.9rem; }
                .save { color: #10b981; }
                
                .download-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #10b981; color: white; border-radius: 0.75rem; font-weight: 700; text-decoration: none; transition: transform 0.2s; }
                .download-btn:hover { transform: translateY(-2px); }
                
                .placeholder { height: 200px; display: flex; align-items: center; justify-content: center; color: var(--secondary); font-style: italic; }
            `}</style>
        </div>
    );
}
