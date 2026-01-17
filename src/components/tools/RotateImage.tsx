'use client';

import { useState, useRef } from 'react';
import { RotateCw, RotateCcw, Upload, Download, RefreshCw } from 'lucide-react';

export default function RotateImage() {
    const [image, setImage] = useState<string | null>(null);
    const [rotation, setRotation] = useState(0);
    const [fileName, setFileName] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImage(ev.target?.result as string);
                setRotation(0);
            };
            reader.readAsDataURL(file);
        }
    };

    const rotate = (dir: 'left' | 'right') => {
        setRotation(prev => prev + (dir === 'right' ? 90 : -90));
    };

    const processDownload = () => {
        if (!image || !canvasRef.current) return '';

        const img = new Image();
        img.src = image;
        // This needs to be synchronous for immediate return, but img load is async.
        // In React, we usually draw to canvas reactively or on button click before download.
        // Let's rely on the fact that `image` state is a data URL already loaded.

        // Actually, we need to draw the rotated image to canvas to get the blob for download.
        // We can do this on the fly:

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return '';

        // Handle rotation logic for canvas size
        const angle = (rotation % 360) * Math.PI / 180;
        const sin = Math.abs(Math.sin(angle));
        const cos = Math.abs(Math.cos(angle));

        canvas.width = img.width * cos + img.height * sin;
        canvas.height = img.width * sin + img.height * cos;

        // Translate and Rotate
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        return canvas.toDataURL('image/png');
    };

    const download = () => {
        const url = processDownload();
        if (url) {
            const link = document.createElement('a');
            link.download = `rotated-${fileName}`;
            link.href = url;
            link.click();
        }
    };

    return (
        <div className="tool-ui">
            <div className="rotate-card">
                <div className="upload-section">
                    <input type="file" accept="image/*" onChange={handleUpload} id="rot-upload" className="hidden" />
                    <label htmlFor="rot-upload" className="upload-btn"><Upload size={24} /> Upload Image</label>
                </div>

                {image && (
                    <div className="workspace">
                        <div className="toolbar">
                            <button onClick={() => rotate('left')} title="Rotate Left"><RotateCcw size={24} /> -90°</button>
                            <button onClick={() => rotate('right')} title="Rotate Right"><RotateCw size={24} /> +90°</button>
                            <button onClick={download} className="primary download"><Download size={24} /> Download</button>
                        </div>

                        <div className="preview-container">
                            {/* CSS Rotation for preview to be instant */}
                            <img
                                src={image}
                                alt="Preview"
                                style={{ transform: `rotate(${rotation}deg)`, maxWidth: '100%', maxHeight: '400px' }}
                            />
                        </div>
                    </div>
                )}

                {/* Canvas hidden, used for processing */}
                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .rotate-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2rem; }
                .hidden { display: none; }
                
                .upload-section { display: flex; justify-content: center; margin-bottom: 2rem; }
                .upload-btn { padding: 1rem 2rem; background: var(--primary); color: white; border-radius: 99px; font-weight: 700; cursor: pointer; display: flex; gap: 0.5rem; }

                .workspace { display: flex; flex-direction: column; align-items: center; gap: 2rem; }
                .toolbar { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
                .toolbar button { padding: 0.75rem 1.5rem; border-radius: 1rem; background: var(--background); border: 2px solid var(--border); font-weight: 700; display: flex; gap: 0.5rem; cursor: pointer; transition: all 0.2s; }
                .toolbar button:hover { border-color: var(--primary); color: var(--primary); }
                .toolbar button.primary { background: var(--primary); color: white; border: none; }
                .toolbar button.primary:hover { opacity: 0.9; }

                .preview-container { padding: 2rem; border: 1px solid var(--border); border-radius: 1rem; background: #fafafa; overflow: hidden; display: flex; justify-content: center; align-items: center; min-height: 300px; width: 100%; }
                .preview-container img { transition: transform 0.3s ease; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.2); }
            `}</style>
        </div>
    );
}
