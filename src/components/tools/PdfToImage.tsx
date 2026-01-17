'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Download, RefreshCw, FileText } from 'lucide-react';

export default function PdfToImage() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [images, setImages] = useState<{ url: string, name: string }[]>([]);
    const [progress, setProgress] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // We use a CDN version of PDF.js since it's not in package.json
    const loadPdfJs = () => {
        return new Promise<any>((resolve) => {
            if ((window as any).pdfjsLib) {
                resolve((window as any).pdfjsLib);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => {
                const pdfjsLib = (window as any).pdfjsLib;
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                resolve(pdfjsLib);
            };
            document.head.appendChild(script);
        });
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setImages([]);
            setProgress(0);
        }
    };

    const convert = async (format: 'jpg' | 'png') => {
        if (!file) return;
        setIsProcessing(true);
        setImages([]);

        try {
            const pdfjsLib: any = await loadPdfJs();
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const results = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                setProgress(Math.round((i / pdf.numPages) * 100));
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2 });
                const canvas = canvasRef.current;
                if (!canvas) continue;

                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport }).promise;

                const url = canvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : 'png'}`, 0.8);
                results.push({
                    url,
                    name: `page_${i}.${format}`
                });
            }
            setImages(results);
        } catch (err) {
            console.error(err);
            alert('Failed to convert PDF to images.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="tool-ui">
            {!file ? (
                <label className="uploader">
                    <Upload size={64} />
                    <h2>PDF to Image Converter</h2>
                    <p>Extract pages as high-quality JPG or PNG images</p>
                    <input type="file" hidden accept="application/pdf" onChange={handleUpload} />
                </label>
            ) : (
                <div className="converter-card">
                    <div className="file-preview">
                        <FileText size={48} className="icon" />
                        <div className="meta">
                            <strong>{file.name}</strong>
                            <span>Ready for conversion</span>
                        </div>
                        <button onClick={() => setFile(null)} className="btn-txt">Change</button>
                    </div>

                    <div className="actions">
                        <button onClick={() => convert('jpg')} disabled={isProcessing} className="btn-main">
                            {isProcessing ? <RefreshCw className="spin" size={18} /> : <ImageIcon size={18} />}
                            {isProcessing ? `Processing ${progress}%` : 'Convert to JPG'}
                        </button>
                        <button onClick={() => convert('png')} disabled={isProcessing} className="btn-main sec">
                            Convert to PNG
                        </button>
                    </div>

                    {images.length > 0 && (
                        <div className="results">
                            <h3>Extracted Images ({images.length})</h3>
                            <div className="image-grid">
                                {images.map((img, i) => (
                                    <div key={i} className="image-item">
                                        <img src={img.url} alt={img.name} />
                                        <a href={img.url} download={img.name} className="dl-btn">
                                            <Download size={14} />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <style jsx>{`
                .tool-ui { max-width: 900px; margin: 0 auto; }
                .uploader { background: var(--card-bg, #f8f9fa); border: 2px dashed var(--border); border-radius: 2rem; padding: 5rem 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; cursor: pointer; color: var(--secondary); margin-top: 2rem; }
                
                .converter-card { background: white; border: 1px solid var(--border); border-radius: 2rem; padding: 2rem; }
                .file-preview { display: flex; align-items: center; gap: 1.5rem; background: var(--background); padding: 1.5rem; border-radius: 1.5rem; margin-bottom: 2rem; }
                .file-preview .icon { color: #ef4444; }
                .meta { flex: 1; display: flex; flex-direction: column; }
                .meta strong { font-size: 1.1rem; }
                .btn-txt { font-weight: 700; color: #f43f5e; }
                
                .actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
                .btn-main { padding: 1rem; border-radius: 1rem; background: var(--primary); color: white; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.5rem; border: none; }
                .btn-main.sec { background: var(--foreground); }
                .btn-main:disabled { opacity: 0.5; }
                
                .results { border-top: 1px solid var(--border); padding-top: 2rem; }
                .results h3 { font-size: 1rem; font-weight: 700; margin-bottom: 1.5rem; }
                .image-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1.5rem; }
                .image-item { position: relative; border: 1px solid var(--border); border-radius: 0.5rem; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
                .image-item img { width: 100%; aspect-ratio: 1/1.4; object-fit: cover; }
                .dl-btn { position: absolute; bottom: 0.5rem; right: 0.5rem; background: var(--primary); color: white; padding: 0.4rem; border-radius: 0.4rem; }
                
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
