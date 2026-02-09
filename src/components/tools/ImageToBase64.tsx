'use client';

import { useState } from 'react';
import { Upload, Copy, Check, FileCode, ImageIcon } from 'lucide-react';

export default function ImageToBase64() {
    const [base64, setBase64] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewReader = new FileReader();
            previewReader.onload = (e) => setImagePreview(e.target?.result as string);
            previewReader.readAsDataURL(file);

            const base64Reader = new FileReader();
            base64Reader.onload = (e) => setBase64(e.target?.result as string);
            base64Reader.readAsDataURL(file);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(base64);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="upload-container">
                <label className="uploader">
                    <Upload size={48} />
                    <h3>Click or Drag Image to Convert</h3>
                    <p>Supported: JPG, PNG, WEBP, GIF, SVG</p>
                    <input type="file" hidden accept="image/*" onChange={handleUpload} />
                </label>
            </div>

            {base64 && (
                <div className="result-container">
                    <div className="preview-card">
                        <div className="card-header">
                            <ImageIcon size={18} />
                            <span>Preview</span>
                        </div>
                        <div className="image-box">
                            <img src={imagePreview!} alt="Preview" />
                        </div>
                    </div>

                    <div className="base64-card">
                        <div className="card-header">
                            <FileCode size={18} />
                            <span>Base64 String</span>
                            <button onClick={handleCopy} className="copy-btn">
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                        <textarea value={base64} readOnly />
                        <div className="stats">Size: {(base64.length / 1024).toFixed(1)} KB</div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .tool-ui { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }
                .upload-container { background: var(--card-bg, #f8f9fa); border: 2px dashed var(--border); border-radius: 2rem; }
                .uploader { display: flex; flex-direction: column; align-items: center; gap: 1rem; cursor: pointer; color: var(--secondary); padding: 4rem; text-align: center; }
                .uploader h3 { color: var(--foreground); }
                
                .result-container { display: grid; grid-template-columns: 280px 1fr; gap: 2rem; }
                .preview-card, .base64-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; overflow: hidden; display: flex; flex-direction: column; }
                
                .card-header { padding: 1rem 1.5rem; background: var(--background); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 0.75rem; font-weight: 700; font-size: 0.9rem; }
                .image-box { flex: 1; padding: 1.5rem; display: flex; align-items: center; justify-content: center; min-height: 200px; }
                .image-box img { max-width: 100%; max-height: 200px; border-radius: 0.5rem; border: 1px solid var(--border); }
                
                .base64-card textarea { flex: 1; min-height: 300px; padding: 1.5rem; border: none; font-family: monospace; font-size: 0.8rem; line-height: 1.6; resize: none; background: #fafafa; }
                .copy-btn { margin-left: auto; display: flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.8rem; background: var(--primary); color: white; border-radius: 2rem; font-size: 0.75rem; }
                .stats { padding: 0.75rem 1.5rem; font-size: 0.75rem; font-weight: 700; color: var(--secondary); border-top: 1px solid var(--border); }
                
                @media (max-width: 800px) {
                    .result-container { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
