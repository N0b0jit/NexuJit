'use client';

import { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Download, Maximize2 } from 'lucide-react';

export default function ImageResizer() {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [resizedImage, setResizedImage] = useState<string | null>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
    const [aspectRatio, setAspectRatio] = useState(0);
    const [originalDimensions, setOriginalDimensions] = useState({ w: 0, h: 0 });
    const [fileName, setFileName] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (ev) => {
                const src = ev.target?.result as string;
                setOriginalImage(src);
                setResizedImage(null);

                const img = new Image();
                img.src = src;
                img.onload = () => {
                    setOriginalDimensions({ w: img.width, h: img.height });
                    setWidth(img.width);
                    setHeight(img.height);
                    setAspectRatio(img.width / img.height);
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const handleWidthChange = (val: number) => {
        setWidth(val);
        if (maintainAspectRatio && aspectRatio) {
            setHeight(Math.round(val / aspectRatio));
        }
    };

    const handleHeightChange = (val: number) => {
        setHeight(val);
        if (maintainAspectRatio && aspectRatio) {
            setWidth(Math.round(val * aspectRatio));
        }
    };

    const resize = () => {
        if (!originalImage || !canvasRef.current) return;

        const img = new Image();
        img.src = originalImage;
        img.onload = () => {
            const canvas = canvasRef.current!;
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            // Better resizing quality step-down could be added, but straightforward drawImage for simplicity
            ctx?.drawImage(img, 0, 0, width, height);

            const url = canvas.toDataURL('image/png'); // Default to PNG for best quality/transparency
            setResizedImage(url);
        };
    };

    return (
        <div className="tool-ui">
            <div className="resizer-card">
                <div className="upload-section">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        id="resize-upload"
                        className="hidden"
                    />
                    <label htmlFor="resize-upload" className="upload-btn">
                        <Upload size={24} /> Upload Image
                    </label>
                    {fileName && <span className="file-name">{fileName} ({originalDimensions.w} x {originalDimensions.h})</span>}
                </div>

                {originalImage && (
                    <div className="interface">
                        <div className="settings-panel">
                            <h3>Resize Settings</h3>
                            <div className="input-row">
                                <div className="input-group">
                                    <label>Width (px)</label>
                                    <input
                                        type="number"
                                        value={width}
                                        onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Height (px)</label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                                    />
                                </div>
                            </div>

                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    id="aspect"
                                    checked={maintainAspectRatio}
                                    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                                />
                                <label htmlFor="aspect">Maintain Aspect Ratio</label>
                            </div>

                            <button onClick={resize} className="action-btn">
                                <Maximize2 size={18} /> Resize Image
                            </button>
                        </div>

                        <div className="preview-area">
                            {resizedImage ? (
                                <div className="preview-box">
                                    <h3>Resized Result</h3>
                                    <img src={resizedImage} alt="Resized" />
                                    <div className="meta">{width} x {height} px</div>
                                    <a href={resizedImage} download={`resized-${fileName}`} className="download-btn">
                                        <Download size={18} /> Download
                                    </a>
                                </div>
                            ) : (
                                <div className="preview-placeholder">
                                    <img src={originalImage} alt="Source" className="source-prev" />
                                    <p>Configure settings and click Resize</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 900px; margin: 0 auto; }
                .resizer-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2rem; box-shadow: var(--shadow-lg); }
                
                .upload-section { display: flex; flex-direction: column; align-items: center; gap: 1rem; margin-bottom: 2rem; padding: 2rem; border: 2px dashed var(--border); border-radius: 1rem; background: var(--background); }
                .hidden { display: none; }
                .upload-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: var(--primary); color: white; border-radius: 99px; font-weight: 700; cursor: pointer; transition: transform 0.2s; }
                .upload-btn:hover { transform: translateY(-2px); }
                .file-name { font-size: 0.9rem; color: var(--secondary); font-weight: 600; }

                .settings-panel { padding: 1.5rem; background: var(--background); border-radius: 1rem; border: 1px solid var(--border); margin-bottom: 2rem; }
                .settings-panel h3 { margin-top: 0; font-size: 1.1rem; margin-bottom: 1.5rem; color: var(--foreground); }
                
                .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
                .input-group label { display: block; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem; font-size: 0.9rem; }
                .input-group input { width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 2px solid var(--border); background: var(--surface); }

                .checkbox-group { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; font-weight: 600; color: var(--secondary); font-size: 0.9rem; }
                .checkbox-group input { width: 18px; height: 18px; accent-color: var(--primary); }

                .action-btn { width: 100%; padding: 1rem; background: var(--primary); color: white; border-radius: 0.75rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }

                .preview-area { background: var(--background); padding: 1.5rem; border-radius: 1rem; border: 1px solid var(--border); text-align: center; }
                .preview-box img { max-width: 100%; max-height: 400px; border-radius: 0.5rem; box-shadow: var(--shadow); margin-bottom: 1rem; }
                .download-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 2rem; background: #10b981; color: white; border-radius: 0.75rem; font-weight: 700; text-decoration: none; }
                
                .preview-placeholder img { max-width: 100%; height: 200px; object-fit: contain; opacity: 0.5; margin-bottom: 1rem; }
                .preview-placeholder p { color: var(--secondary); font-style: italic; }
                .meta { margin-bottom: 1rem; font-family: monospace; font-weight: 700; color: var(--secondary); }
            `}</style>
        </div>
    );
}
