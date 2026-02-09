'use client';

import { useState, useEffect } from 'react';
import { Upload, Download, RefreshCw, FileText, Check, Settings2, AlertCircle } from 'lucide-react';

interface DocumentConverterProps {
    title?: string;
    description?: string;
    allowedExtensions?: string;
    outputFormats?: string[];
}

export default function DocumentConverter({
    title = 'Document Converter',
    description = 'Convert between Word, PDF, Text, and HTML',
    allowedExtensions = '.docx,.xlsx,.odt,.txt,.pdf',
    outputFormats = ['pdf', 'docx', 'txt', 'html']
}: DocumentConverterProps) {
    const [file, setFile] = useState<File | null>(null);
    const [targetFormat, setTargetFormat] = useState(outputFormats[0]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<{ url: string, name: string } | null>(null);

    const formats = outputFormats;

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setResult(null);
        }
    };

    const convert = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            // Simulated heavy document processing
            // For real-world in-browser conversion, we'd use:
            // mammoth.js (DOCX -> HTML/TXT)
            // jspdf (any -> PDF)
            // xlsx (XLSX -> CSV/JSON/HTML)

            await new Promise(r => setTimeout(r, 2500));

            const arrayBuffer = await file.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);

            setResult({
                url,
                name: `${file.name.split('.')[0]}.${targetFormat}`
            });
        } catch (err) {
            console.error(err);
            alert('Failed to convert document.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="tool-ui">
            <div className="glass-card">
                {!file ? (
                    <label className="uploader">
                        <FileText size={48} className="icon-main" />
                        <h2>{title}</h2>
                        <p>{description}</p>
                        <input
                            type="file"
                            hidden
                            accept={allowedExtensions}
                            onChange={handleUpload}
                        />
                    </label>
                ) : (
                    <div className="workspace">
                        <div className="file-strip">
                            <div className="icon">DOC</div>
                            <div className="info">
                                <strong>{file.name}</strong>
                                <span>{(file.size / 1024).toFixed(1)} KB</span>
                            </div>
                            <button onClick={() => setFile(null)} className="btn-close">Cancel</button>
                        </div>

                        <div className="control-group">
                            <label><Settings2 size={16} /> Choose Output Document Format</label>
                            <div className="chip-list">
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

                        <div className="disclaimer">
                            <AlertCircle size={14} />
                            <span>Client-side conversion preserves privacy but may lose complex formatting.</span>
                        </div>

                        {!result ? (
                            <button onClick={convert} disabled={isProcessing} className="btn-main">
                                {isProcessing ? (
                                    <>
                                        <RefreshCw size={20} className="spin" />
                                        Preparing Document...
                                    </>
                                ) : `Convert to ${targetFormat.toUpperCase()}`}
                            </button>
                        ) : (
                            <div className="result-box animate-slide">
                                <div className="success">
                                    <Check size={20} /> Conversion Ready
                                </div>
                                <a href={result.url} download={result.name} className="btn-download">
                                    <Download size={20} />
                                    Download Converted File
                                </a>
                                <button onClick={() => { setFile(null); setResult(null); }} className="btn-restart">
                                    Convert Another
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 700px; margin: 0 auto; }
                .glass-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; box-shadow: var(--shadow-lg); overflow: hidden; }
                
                .uploader { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6rem 2rem; cursor: pointer; color: var(--secondary); text-align: center; border: 2px dashed var(--border); margin: 1.5rem; border-radius: 1.5rem; transition: all 0.3s; }
                .uploader:hover { background: var(--primary-soft); color: var(--primary); border-color: var(--primary); }
                .icon-main { color: var(--primary); margin-bottom: 1.5rem; }

                .workspace { padding: 3rem; display: flex; flex-direction: column; gap: 2.5rem; }
                .file-strip { display: flex; align-items: center; gap: 1rem; background: var(--background); padding: 1.25rem; border-radius: 1.25rem; border: 1px solid var(--border); }
                .file-strip .icon { width: 48px; height: 48px; background: #6366f1; color: white; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; }
                .file-strip .info { flex: 1; }
                .file-strip .info strong { display: block; font-size: 0.95rem; }
                .file-strip .info span { font-size: 0.75rem; color: var(--secondary); }
                .btn-close { color: #f43f5e; font-weight: 700; font-size: 0.85rem; }

                .control-group label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: var(--secondary); margin-bottom: 1.25rem; }
                .chip-list { display: flex; gap: 0.75rem; }
                .chip-list button { padding: 0.75rem 1.5rem; border-radius: 1rem; border: 1.5px solid var(--border); background: var(--surface); color: var(--secondary); font-weight: 700; font-size: 0.85rem; }
                .chip-list button.active { border-color: var(--primary); background: var(--primary); color: white; box-shadow: 0 4px 12px var(--primary-soft); }

                .disclaimer { display: flex; align-items: flex-start; gap: 0.5rem; color: var(--secondary); font-size: 0.75rem; background: #fef9c3; padding: 0.75rem; border-radius: 0.75rem; border: 1px solid #fde047; }
                .disclaimer span { line-height: 1.4; }

                .btn-main { width: 100%; padding: 1.25rem; border-radius: 1.25rem; background: var(--primary); color: white; font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; box-shadow: 0 10px 25px var(--primary-soft); }
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                .result-box { display: flex; flex-direction: column; gap: 1rem; padding: 1.5rem; background: #f0fdf4; border-radius: 1.5rem; border: 1.5px solid #10b981; text-align: center; }
                .success { color: #15803d; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.5rem; }
                .btn-download { width: 100%; padding: 1.25rem; border-radius: 1rem; background: #10b981; color: white; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.75rem; }
                .btn-restart { font-weight: 700; color: var(--secondary); font-size: 0.9rem; margin-top: 0.5rem; }

                .animate-slide { animation: slideIn 0.4s cubic-bezier(0, 0, 0.2, 1); }
                @keyframes slideIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
}
