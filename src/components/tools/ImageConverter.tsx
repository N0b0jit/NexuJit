'use client';

import { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, Image as ImageIcon, Check, Settings2 } from 'lucide-react';

export default function ImageConverter() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [targetFormat, setTargetFormat] = useState('png');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<{ url: string, name: string } | null>(null);

    const formats = ['png', 'jpg', 'webp', 'bmp', 'ico'];

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setResult(null);
            const reader = new FileReader();
            reader.onload = (ev) => setPreview(ev.target?.result as string);
            reader.readAsDataURL(selected);
        }
    };

    const convert = async () => {
        if (!file || !preview) return;
        setIsProcessing(true);

        try {
            const img = new Image();
            img.src = preview;
            await new Promise((resolve) => (img.onload = resolve));

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            // Handle background for JPG (it doesn't support transparency)
            if (targetFormat === 'jpg') {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0);

            let mimeType = `image/${targetFormat}`;
            if (targetFormat === 'jpg') mimeType = 'image/jpeg';
            if (targetFormat === 'ico') mimeType = 'image/x-icon';

            const dataUrl = canvas.toDataURL(mimeType, 0.92);
            setResult({
                url: dataUrl,
                name: `${file.name.split('.')[0]}.${targetFormat}`
            });
        } catch (err) {
            console.error(err);
            alert('Failed to convert image.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="tool-ui">
            <div className="main-card">
                {!file ? (
                    <label className="uploader">
                        <Upload size={48} />
                        <h2>Convert Image Format</h2>
                        <p>PNG, JPG, WebP, BMP, and ICO supported</p>
                        <input type="file" hidden accept="image/*" onChange={handleUpload} />
                    </label>
                ) : (
                    <div className="stage">
                        <div className="preview-row">
                            <div className="img-box">
                                <img src={preview!} alt="Original" />
                            </div>
                            <div className="file-meta">
                                <strong>{file.name}</strong>
                                <span>{(file.size / 1024).toFixed(1)} KB • Original</span>
                                <button onClick={() => setFile(null)} className="btn-link">Change File</button>
                            </div>
                        </div>

                        <div className="config">
                            <label><Settings2 size={16} /> Convert to:</label>
                            <div className="format-picker">
                                {formats.map(fmt => (
                                    <button
                                        key={fmt}
                                        className={targetFormat === fmt ? 'active' : ''}
                                        onClick={() => setTargetFormat(fmt)}
                                    >
                                        {fmt.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {!result ? (
                            <button onClick={convert} disabled={isProcessing} className="btn-action">
                                {isProcessing ? 'Processing...' : `Convert to ${targetFormat.toUpperCase()}`}
                                <RefreshCw size={20} className={isProcessing ? 'spin' : ''} />
                            </button>
                        ) : (
                            <div className="result-island animate-pop">
                                <div className="success">
                                    <Check size={20} /> Success! Image is ready.
                                </div>
                                <a href={result.url} download={result.name} className="btn-download">
                                    <Download size={20} />
                                    Download {result.name}
                                </a>
                                <button onClick={() => { setFile(null); setResult(null); }} className="btn-text">
                                    Convert Another Image
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 700px; margin: 0 auto; }
                .main-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; overflow: hidden; box-shadow: var(--shadow-lg); transition: all 0.3s; }
                
                .uploader { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5rem 2rem; cursor: pointer; color: var(--secondary); gap: 1rem; text-align: center; border: 2px dashed var(--border); margin: 1rem; border-radius: 1.5rem; }
                .uploader:hover { background: var(--primary-soft); color: var(--primary); border-color: var(--primary); }
                
                .stage { padding: 2.5rem; display: flex; flex-direction: column; gap: 2rem; }
                
                .preview-row { display: flex; align-items: center; gap: 1.5rem; background: var(--background); padding: 1rem; border-radius: 1.5rem; border: 1px solid var(--border); }
                .img-box { width: 80px; height: 80px; border-radius: 1rem; overflow: hidden; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                .img-box img { width: 100%; height: 100%; object-fit: cover; }
                .file-meta { flex: 1; display: flex; flex-direction: column; gap: 0.2rem; }
                .file-meta strong { font-size: 1rem; }
                .file-meta span { font-size: 0.8rem; color: var(--secondary); }
                .btn-link { align-self: flex-start; margin-top: 0.5rem; color: var(--primary); font-weight: 700; font-size: 0.85rem; }

                .config label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: var(--secondary); margin-bottom: 1rem; }
                .format-picker { display: flex; gap: 0.5rem; flex-wrap: wrap; }
                .format-picker button { padding: 0.6rem 1.25rem; border-radius: 0.75rem; border: 1px solid var(--border); font-weight: 700; font-size: 0.85rem; background: var(--background); color: var(--secondary); transition: all 0.2s; }
                .format-picker button.active { background: var(--primary); color: white; border-color: var(--primary); box-shadow: 0 4px 12px var(--primary-soft); }
                .format-picker button:hover:not(.active) { border-color: var(--primary); color: var(--primary); }

                .btn-action { width: 100%; padding: 1.25rem; border-radius: 1rem; background: var(--primary); color: white; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: all 0.3s; }
                .btn-action:hover { transform: translateY(-3px); box-shadow: 0 10px 20px var(--primary-soft); }
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                .result-island { display: flex; flex-direction: column; gap: 1rem; padding: 1.5rem; background: #ecfdf5; border-radius: 1.5rem; border: 1.5px solid #10b981; }
                .success { display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: #059669; font-weight: 700; }
                .btn-download { width: 100%; padding: 1rem; border-radius: 0.75rem; background: #10b981; color: white; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
                .btn-text { font-weight: 700; color: var(--secondary); font-size: 0.85rem; }

                .animate-pop { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                @keyframes pop { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
}
