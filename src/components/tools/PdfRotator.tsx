'use client';

import { useState } from 'react';
import { Upload, RotateCw, Download, FileText, Check } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';

export default function PdfRotator() {
    const [file, setFile] = useState<File | null>(null);
    const [pageRotations, setPageRotations] = useState<number[]>([]); // Array of degrees per page
    const [isProcessing, setIsProcessing] = useState(false);
    const [globalRotation, setGlobalRotation] = useState(0);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            const arrayBuffer = await selected.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const count = pdfDoc.getPageCount();
            setPageRotations(new Array(count).fill(0));
            setGlobalRotation(0);
        }
    };

    const rotateAll = () => {
        const next = (globalRotation + 90) % 360;
        setGlobalRotation(next);
        setPageRotations(pageRotations.map(() => next));
    };

    const download = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();

            pages.forEach((page, i) => {
                const rotation = pageRotations[i];
                if (rotation !== 0) {
                    // Note: setRotation adds to existing rotation relative to the doc
                    page.setRotation(degrees(rotation));
                }
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `rotated_${file.name}`;
            link.click();
        } catch (err) {
            console.error(err);
            alert('Failed to rotate PDF.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="tool-ui">
            {!file ? (
                <label className="uploader">
                    <Upload size={64} />
                    <h2>Select PDF to Rotate</h2>
                    <p>Change orientation of pages in your document</p>
                    <input type="file" hidden accept="application/pdf" onChange={handleUpload} />
                </label>
            ) : (
                <div className="workspace">
                    <div className="toolbar">
                        <div className="file-info">
                            <FileText size={20} />
                            <span>{file.name} ({pageRotations.length} pages)</span>
                        </div>
                        <div className="actions">
                            <button onClick={rotateAll} className="btn-secondary">
                                <RotateCw size={18} /> Rotate All
                            </button>
                            <button onClick={download} disabled={isProcessing} className="btn-primary">
                                {isProcessing ? 'Saving...' : 'Download PDF'}
                                <Download size={18} />
                            </button>
                            <button onClick={() => setFile(null)} className="btn-txt">Cancel</button>
                        </div>
                    </div>

                    <div className="page-grid">
                        {pageRotations.map((rot, i) => (
                            <div key={i} className="page-card">
                                <div className="page-preview" style={{ transform: `rotate(${rot}deg)` }}>
                                    <FileText size={48} strokeWidth={1} />
                                    <span>PAGE {i + 1}</span>
                                </div>
                                <button className="rotate-one" onClick={() => {
                                    const newRots = [...pageRotations];
                                    newRots[i] = (newRots[i] + 90) % 360;
                                    setPageRotations(newRots);
                                }}>
                                    <RotateCw size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style jsx>{`
                .tool-ui { max-width: 1000px; margin: 0 auto; }
                .uploader { background: var(--card-bg, #f8f9fa); border: 2px dashed var(--border); border-radius: 2rem; padding: 5rem 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; cursor: pointer; color: var(--secondary); margin-top: 2rem; }
                
                .workspace { background: #f1f5f9; border-radius: 2rem; border: 1px solid var(--border); overflow: hidden; }
                .toolbar { background: white; padding: 1rem 2rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
                
                .file-info { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: var(--secondary); font-size: 0.9rem; }
                .actions { display: flex; items: center; gap: 1rem; }
                
                .btn-primary { background: var(--primary); color: white; padding: 0.6rem 1.2rem; border-radius: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; border: none; }
                .btn-secondary { background: var(--background); color: var(--foreground); padding: 0.6rem 1.2rem; border-radius: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; border: 1px solid var(--border); }
                .btn-txt { font-weight: 700; color: #ef4444; padding: 0 1rem; }

                .page-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1.5rem; padding: 2rem; maxHeight: 600px; overflow-y: auto; }
                .page-card { position: relative; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
                .page-preview { width: 120px; height: 160px; background: white; border: 1px solid var(--border); border-radius: 0.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
                .page-preview span { font-size: 0.6rem; font-weight: 800; color: var(--secondary); margin-top: 0.5rem; }
                
                .rotate-one { position: absolute; bottom: 0; right: 0; background: var(--primary); color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
            `}</style>
        </div>
    );
}
