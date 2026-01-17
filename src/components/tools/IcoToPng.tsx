'use client';

import { useState, useRef } from 'react';
import { Image as ImageIcon, Download, Upload, RefreshCw } from 'lucide-react';

export default function IcoToPng() {
    const [image, setImage] = useState<string | null>(null);
    const [fileName, setFileName] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name.replace('.ico', ''));
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (typeof ev.target?.result === 'string') {
                    setImage(ev.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const convertDownload = () => {
        if (!image || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);

            const pngUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = `${fileName}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        img.src = image;
    };

    return (
        <div className="tool-content">
            <div className="upload-container">
                <input
                    type="file"
                    accept=".ico,image/x-icon"
                    onChange={handleUpload}
                    id="ico-upload"
                    hidden
                />
                <label htmlFor="ico-upload" className="upload-label">
                    <Upload size={48} />
                    <span>Click to Upload ICO File</span>
                    <span className="sub">or drag and drop here</span>
                </label>
            </div>

            {image && (
                <div className="preview-container">
                    <h3>Preview</h3>
                    <div className="img-frame">
                        <img src={image} alt="Preview" />
                    </div>
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <button onClick={convertDownload} className="download-btn">
                        <RefreshCw size={18} /> Convert & Download PNG
                    </button>
                </div>
            )}

            <style jsx>{`
                .tool-content { max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }
                .upload-label {
                    border: 2px dashed var(--border);
                    border-radius: 1.5rem;
                    padding: 3rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    cursor: pointer;
                    background: var(--background);
                    transition: border-color 0.2s;
                }
                .upload-label:hover { border-color: var(--primary); }
                .sub { color: var(--secondary); font-size: 0.9rem; }
                
                .preview-container {
                    background: var(--surface);
                    padding: 2rem;
                    border-radius: 1.5rem;
                    border: 1px solid var(--border);
                    text-align: center;
                }
                .img-frame {
                    margin: 1.5rem 0;
                    padding: 1rem;
                    background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGgxMHYxMEgwem0xMCAxMGgxMHYxMEgxMHoiIGZpbGw9IiNlZWUiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==');
                    border-radius: 0.5rem;
                    display: inline-block;
                }
                .download-btn {
                    padding: 1rem 2rem;
                    background: var(--primary);
                    color: white;
                    border-radius: 0.75rem;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin: 0 auto;
                }
            `}</style>
        </div>
    );
}
