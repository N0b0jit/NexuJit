'use client';

import { useState, useRef } from 'react';
import { Upload, Download, FileArchive, Check, Settings2, File, Eye, ChevronRight, Folder, RefreshCw } from 'lucide-react';

export default function ArchiveExtractor() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedFiles, setExtractedFiles] = useState<{ name: string, blob: Blob, size: number }[]>([]);

    // Using JSZip via CDN for simplicity in this browser environment
    const loadJSZip = async () => {
        if ((window as any).JSZip) return (window as any).JSZip;
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = () => resolve((window as any).JSZip);
            document.head.appendChild(script);
        });
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setExtractedFiles([]);
            extract(selected);
        }
    };

    const extract = async (selectedFile: File) => {
        setIsProcessing(true);
        try {
            const JSZip = await loadJSZip();
            const zip = new JSZip();
            const content = await zip.loadAsync(selectedFile);

            const files: { name: string, blob: Blob, size: number }[] = [];

            for (const [name, fileObj] of Object.entries(content.files)) {
                const entry = fileObj as any;
                if (!entry.dir) {
                    const blob = await entry.async('blob');
                    files.push({
                        name,
                        blob,
                        size: entry._data.uncompressedSize || 0
                    });
                }
            }

            setExtractedFiles(files);
        } catch (err) {
            console.error(err);
            alert('Failed to extract archive. Is it a valid ZIP file?');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadFile = (f: { name: string, blob: Blob }) => {
        const url = URL.createObjectURL(f.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = f.name;
        a.click();
    };

    return (
        <div className="tool-ui">
            <div className="archive-card">
                {!file ? (
                    <label className="uploader">
                        <FileArchive size={64} className="text-primary icon-float" />
                        <h2>Archive Extractor</h2>
                        <p>Upload ZIP files to extract content instantly</p>
                        <input type="file" hidden accept=".zip" onChange={handleUpload} />
                    </label>
                ) : (
                    <div className="workspace">
                        <div className="top-bar">
                            <div className="archive-info">
                                <Folder size={24} className="text-amber-400" />
                                <div>
                                    <strong>{file.name}</strong>
                                    <span>{extractedFiles.length} files found</span>
                                </div>
                            </div>
                            <button onClick={() => setFile(null)} className="btn-new">Extract New</button>
                        </div>

                        <div className="file-list">
                            {isProcessing ? (
                                <div className="loading-state">
                                    <RefreshCw size={32} className="spin" />
                                    <p>Scanning archive contents...</p>
                                </div>
                            ) : extractedFiles.length === 0 ? (
                                <div className="empty-state">No files found or unsupported format.</div>
                            ) : (
                                extractedFiles.map((f, i) => (
                                    <div key={i} className="list-item animate-in" style={{ animationDelay: `${i * 0.05}s` }}>
                                        <div className="details">
                                            <File size={20} className="text-slate-400" />
                                            <div className="info">
                                                <span className="name">{f.name}</span>
                                                <span className="size">{(f.size / 1024).toFixed(1)} KB</span>
                                            </div>
                                        </div>
                                        <button onClick={() => downloadFile(f)} className="btn-down">
                                            <Download size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {extractedFiles.length > 0 && !isProcessing && (
                            <div className="footer-actions">
                                <p>All extractions happen in your browser. No files are uploaded to any server.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .archive-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2.5rem; overflow: hidden; box-shadow: var(--shadow-lg); }
                
                .uploader { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6rem 2rem; cursor: pointer; gap: 1rem; text-align: center; }
                .uploader:hover { background: var(--primary-soft); }
                .icon-float { animation: float 3s ease-in-out infinite; }
                
                .workspace { height: 600px; display: flex; flex-direction: column; }
                .top-bar { padding: 1.5rem 2.5rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--background); }
                .archive-info { display: flex; align-items: center; gap: 1rem; }
                .archive-info strong { display: block; font-size: 1.1rem; }
                .archive-info span { font-size: 0.85rem; color: var(--secondary); }
                .btn-new { font-weight: 700; color: var(--primary); font-size: 0.9rem; }

                .file-list { flex: 1; overflow-y: auto; padding: 1.5rem 2.5rem; }
                .loading-state { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: var(--secondary); }
                .list-item { display: flex; align-items: center; justify-content: space-between; padding: 1rem; border: 1px solid var(--border); border-radius: 1rem; margin-bottom: 0.75rem; background: var(--surface); transition: all 0.2s; }
                .list-item:hover { border-color: var(--primary); transform: translateX(5px); }
                .list-item .details { display: flex; align-items: center; gap: 1rem; }
                .list-item .info { display: flex; flex-direction: column; }
                .list-item .name { font-size: 0.95rem; font-weight: 600; }
                .list-item .size { font-size: 0.75rem; color: var(--secondary); }
                .btn-down { width: 40px; height: 40px; border-radius: 50%; color: var(--primary); display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
                .btn-down:hover { background: var(--primary); color: white; }

                .footer-actions { padding: 1.5rem; border-top: 1px solid var(--border); text-align: center; }
                .footer-actions p { font-size: 0.75rem; color: var(--secondary); }

                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-in { animation: slideIn 0.3s forwards; opacity: 0; }
                @keyframes slideIn { from { transform: translateX(-10px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            `}</style>
        </div>
    );
}
