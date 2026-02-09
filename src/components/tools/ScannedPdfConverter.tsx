'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, Download, Sliders, RefreshCw } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function ScannedPdfConverter() {
    const [image, setImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [settings, setSettings] = useState({
        tilt: 0.5,
        noise: 15,
        blur: 0.3,
        contrast: 1.2,
        brightness: 1.0,
    });
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const processImage = (img: HTMLImageElement, apply: boolean = false) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;

        // 1. Clear and Background
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Slight Tilt
        ctx.save();
        const angle = (Math.random() - 0.5) * settings.tilt * (Math.PI / 180);
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle);

        // 3. Draw Image with Contrast/Brightness
        ctx.filter = `contrast(${settings.contrast}) brightness(${settings.brightness}) blur(${settings.blur}px)`;
        ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2);
        ctx.restore();

        // 4. Add Noise
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * settings.noise;
            data[i] += noise;
            data[i + 1] += noise;
            data[i + 2] += noise;
        }
        ctx.putImageData(imageData, 0, 0);

        if (apply) {
            const doc = new jsPDF({
                orientation: img.width > img.height ? 'l' : 'p',
                unit: 'px',
                format: [img.width, img.height]
            });
            doc.addImage(canvas.toDataURL('image/jpeg', 0.8), 'JPEG', 0, 0, img.width, img.height);
            doc.save('scanned_document.pdf');
        }
    };

    const handleDownload = () => {
        if (!image) return;
        setIsProcessing(true);
        const img = new Image();
        img.src = image;
        img.onload = () => {
            processImage(img, true);
            setIsProcessing(false);
        };
    };

    return (
        <div className="tool-ui">
            <div className="editor-grid">
                <div className="preview-section">
                    {!image ? (
                        <label className="upload-zone">
                            <Upload size={48} />
                            <h3>Choose a document image</h3>
                            <p>Upload JPG/PNG of your document to transform it</p>
                            <input type="file" hidden accept="image/*" onChange={handleUpload} />
                        </label>
                    ) : (
                        <div className="live-preview">
                            <img src={image} alt="Preview" style={{
                                transform: `rotate(${(Math.random() - 0.5) * settings.tilt}deg)`,
                                filter: `contrast(${settings.contrast}) brightness(${settings.brightness}) blur(${settings.blur}px)`,
                                opacity: 0.9
                            }} />
                            <div className="processing-overlay">Real-time simulation</div>
                        </div>
                    )}
                </div>

                <div className="controls-section">
                    <div className="control-card">
                        <h3><Sliders size={18} /> Scanned Effect Adjustment</h3>

                        <div className="setting">
                            <label>Random Tilt: {settings.tilt}°</label>
                            <input type="range" min="0" max="2" step="0.1" value={settings.tilt} onChange={e => setSettings({ ...settings, tilt: parseFloat(e.target.value) })} />
                        </div>

                        <div className="setting">
                            <label>Grainy Noise: {settings.noise}</label>
                            <input type="range" min="0" max="50" value={settings.noise} onChange={e => setSettings({ ...settings, noise: parseInt(e.target.value) })} />
                        </div>

                        <div className="setting">
                            <label>Lens Blur: {settings.blur}px</label>
                            <input type="range" min="0" max="1" step="0.1" value={settings.blur} onChange={e => setSettings({ ...settings, blur: parseFloat(e.target.value) })} />
                        </div>

                        <div className="setting">
                            <label>Contrast: {settings.contrast}x</label>
                            <input type="range" min="0.5" max="2" step="0.1" value={settings.contrast} onChange={e => setSettings({ ...settings, contrast: parseFloat(e.target.value) })} />
                        </div>

                        <div className="actions">
                            <button onClick={handleDownload} disabled={!image || isProcessing} className="btn-primary">
                                {isProcessing ? <RefreshCw size={18} className="spin" /> : <FileText size={18} />}
                                {isProcessing ? 'Processing...' : 'Save as Scanned PDF'}
                            </button>
                            <button onClick={() => setImage(null)} className="btn-secondary">Start Over</button>
                        </div>
                    </div>
                </div>
            </div>

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <style jsx>{`
                .tool-ui { max-width: 1100px; margin: 0 auto; }
                .editor-grid { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; }
                
                .preview-section { background: #e2e8f0; border-radius: 1.5rem; display: flex; align-items: center; justify-content: center; overflow: hidden; min-height: 500px; position: relative; border: 1px solid var(--border); }
                .upload-zone { display: flex; flex-direction: column; align-items: center; gap: 1rem; cursor: pointer; color: var(--secondary); text-align: center; padding: 3rem; }
                
                .live-preview { width: 100%; height: 100%; padding: 3rem; display: flex; align-items: center; justify-content: center; background: #ccd6e0; box-shadow: inset 0 0 50px rgba(0,0,0,0.1); }
                .live-preview img { max-width: 100%; max-height: 600px; background: var(--surface); box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
                .processing-overlay { position: absolute; top: 1rem; left: 1rem; font-size: 0.7rem; font-weight: 700; color: #475569; text-transform: uppercase; background: rgba(255,255,255,0.8); padding: 0.25rem 0.75rem; border-radius: 1rem; }

                .control-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.25rem; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
                .control-card h3 { font-size: 0.9rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
                
                .setting label { display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.5rem; color: #475569; }
                input[type="range"] { width: 100%; }
                
                .actions { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
                .btn-primary { background: var(--primary); color: white; padding: 0.875rem; border-radius: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
                .btn-secondary { background: var(--background); color: var(--foreground); border: 1px solid var(--border); padding: 0.75rem; border-radius: 0.75rem; font-weight: 600; text-align: center; }
                
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                
                @media (max-width: 850px) {
                    .editor-grid { grid-template-columns: 1fr; }
                    .preview-section { min-height: 350px; }
                }
            `}</style>
        </div>
    );
}
