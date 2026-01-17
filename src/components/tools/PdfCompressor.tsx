'use client';

import { useState } from 'react';
import { Upload, Zap, Download, FileText, Settings2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PdfCompressor() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [compressionLevel, setCompressionLevel] = useState(50);
    const [stats, setStats] = useState<{ original: number, compressed: number } | null>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setStats(null);
        }
    };

    const compress = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // In browser, the most we can do easily with pdf-lib is removing metadata 
            // and saving with specific settings. 
            // True compression (image re-encoding) requires more complex logic.

            pdfDoc.setTitle('');
            pdfDoc.setAuthor('');
            pdfDoc.setSubject('');
            pdfDoc.setCreator('');
            pdfDoc.setProducer('');

            // Minimal "compression" - mostly stripping metadata and optimizing structure
            const pdfBytes = await pdfDoc.save({ useObjectStreams: true });

            setStats({
                original: file.size,
                compressed: pdfBytes.length
            });

            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `compressed_${file.name}`;
            link.click();
        } catch (err) {
            console.error(err);
            alert('Failed to compress PDF.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="tool-ui">
            {!file ? (
                <label className="uploader">
                    <Upload size={64} />
                    <h2>PDF Compressor</h2>
                    <p>Reduce PDF file size while maintaining quality</p>
                    <input type="file" hidden accept="application/pdf" onChange={handleUpload} />
                </label>
            ) : (
                <div className="compress-card">
                    <div className="file-box">
                        <FileText size={48} className="text-primary" />
                        <div className="info">
                            <strong>{file.name}</strong>
                            <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                        <button onClick={() => setFile(null)} className="btn-txt">Change</button>
                    </div>

                    <div className="settings">
                        <div className="header"><Settings2 size={16} /> Compression Stats</div>
                        {stats ? (
                            <div className="stats-display">
                                <div className="stat">
                                    <span>Original Size</span>
                                    <strong>{(stats.original / 1024).toFixed(1)} KB</strong>
                                </div>
                                <div className="arrow">→</div>
                                <div className="stat">
                                    <span>New Size</span>
                                    <strong>{(stats.compressed / 1024).toFixed(1)} KB</strong>
                                </div>
                                <div className="saving">
                                    {Math.round((1 - stats.compressed / stats.original) * 100)}% Saved
                                </div>
                            </div>
                        ) : (
                            <div className="waiting">
                                <p>Compression will optimize document structure and strip unnecessary metadata.</p>
                                <button onClick={compress} disabled={isProcessing} className="btn-main">
                                    <Zap size={18} /> {isProcessing ? 'Compressing...' : 'Compress PDF'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                .tool-ui { max-width: 600px; margin: 0 auto; }
                .uploader { background: var(--card-bg, #f8f9fa); border: 2px dashed var(--border); border-radius: 2rem; padding: 5rem 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; cursor: pointer; color: var(--secondary); margin-top: 2rem; }
                
                .compress-card { background: white; border: 1px solid var(--border); border-radius: 2rem; padding: 2rem; display: flex; flex-direction: column; gap: 2rem; }
                .file-box { display: flex; align-items: center; gap: 1.5rem; background: var(--background); padding: 1.5rem; border-radius: 1.5rem; }
                .info { flex: 1; display: flex; flex-direction: column; }
                .btn-txt { font-weight: 700; color: #f43f5e; font-size: 0.85rem; }
                
                .settings { border: 1px solid var(--border); border-radius: 1.5rem; padding: 1.5rem; }
                .header { font-size: 0.8rem; font-weight: 800; color: var(--secondary); text-transform: uppercase; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
                
                .stats-display { display: flex; align-items: center; justify-content: space-between; background: var(--background); padding: 1rem; border-radius: 1rem; }
                .stat { display: flex; flex-direction: column; }
                .stat span { font-size: 0.7rem; color: var(--secondary); margin-bottom: 0.2rem; }
                .stat strong { color: var(--primary); }
                .saving { background: #dcfce7; color: #166534; padding: 0.5rem 1rem; border-radius: 2rem; font-weight: 800; font-size: 0.85rem; }
                
                .waiting { text-align: center; }
                .waiting p { font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem; line-height: 1.5; }
                .btn-main { width: 100%; padding: 1rem; border-radius: 1rem; background: var(--primary); color: white; border: none; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
                .btn-main:disabled { opacity: 0.5; }
            `}</style>
        </div>
    );
}
