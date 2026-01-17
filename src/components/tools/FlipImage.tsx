'use client';

import { useState, useRef } from 'react';
import { FlipHorizontal, FlipVertical, Upload, Download } from 'lucide-react';

export default function FlipImage() {
    const [image, setImage] = useState<string | null>(null);
    const [flipH, setFlipH] = useState(false);
    const [flipV, setFlipV] = useState(false);
    const [fileName, setFileName] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImage(ev.target?.result as string);
                setFlipH(false);
                setFlipV(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const processDownload = () => {
        if (!image || !canvasRef.current) return '';

        const img = new Image();
        img.src = image;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return '';

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.save();
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.drawImage(img, flipH ? -img.width : 0, flipV ? -img.height : 0);
        ctx.restore();

        return canvas.toDataURL('image/png');
    };

    const download = () => {
        const url = processDownload();
        if (url) {
            const link = document.createElement('a');
            link.download = `flipped-${fileName}`;
            link.href = url;
            link.click();
        }
    };

    return (
        <div className="tool-ui">
            <div className="flip-card">
                <div className="upload-section">
                    <input type="file" accept="image/*" onChange={handleUpload} id="flip-upload" className="hidden" />
                    <label htmlFor="flip-upload" className="upload-btn"><Upload size={24} /> Upload Image</label>
                </div>

                {image && (
                    <div className="workspace">
                        <div className="toolbar">
                            <button onClick={() => setFlipH(!flipH)} className={flipH ? 'active' : ''}>
                                <FlipHorizontal size={24} /> Horizontal
                            </button>
                            <button onClick={() => setFlipV(!flipV)} className={flipV ? 'active' : ''}>
                                <FlipVertical size={24} /> Vertical
                            </button>
                            <button onClick={download} className="primary download"><Download size={24} /> Download</button>
                        </div>

                        <div className="preview-container">
                            <img
                                src={image}
                                alt="Preview"
                                style={{
                                    transform: `scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
                                    maxWidth: '100%',
                                    maxHeight: '400px'
                                }}
                            />
                        </div>
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .flip-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2rem; }
                .hidden { display: none; }
                
                .upload-section { display: flex; justify-content: center; margin-bottom: 2rem; }
                .upload-btn { padding: 1rem 2rem; background: var(--primary); color: white; border-radius: 99px; font-weight: 700; cursor: pointer; display: flex; gap: 0.5rem; }

                .workspace { display: flex; flex-direction: column; align-items: center; gap: 2rem; }
                .toolbar { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
                .toolbar button { padding: 0.75rem 1.5rem; border-radius: 1rem; background: var(--background); border: 2px solid var(--border); font-weight: 700; display: flex; gap: 0.5rem; cursor: pointer; transition: all 0.2s; }
                .toolbar button:hover { border-color: var(--primary); color: var(--primary); }
                .toolbar button.active { background: var(--primary-soft); color: var(--primary); border-color: var(--primary); }
                .toolbar button.primary { background: var(--primary); color: white; border: none; }
                .toolbar button.primary:hover { opacity: 0.9; }

                .preview-container { padding: 2rem; border: 1px solid var(--border); border-radius: 1rem; background: #fafafa; overflow: hidden; display: flex; justify-content: center; align-items: center; min-height: 300px; width: 100%; }
                .preview-container img { transition: transform 0.3s ease; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.2); }
            `}</style>
        </div>
    );
}
