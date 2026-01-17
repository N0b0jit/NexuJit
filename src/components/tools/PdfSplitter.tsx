'use client';

import { useState } from 'react';
import { Upload, Scissors, Download, FileText, Check } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PdfSplitter() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const [range, setRange] = useState('');
    const [splitResults, setSplitResults] = useState<{ url: string, name: string }[]>([]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            setPageCount(pdfDoc.getPageCount());
            setRange(`1-${pdfDoc.getPageCount()}`);
            setSplitResults([]);
        }
    };

    const splitByRange = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const srcDoc = await PDFDocument.load(arrayBuffer);

            // Basic range parser "1-3, 5, 7-10"
            const ranges = range.split(',').map(r => r.trim());
            const results: { url: string, name: string }[] = [];

            for (let i = 0; i < ranges.length; i++) {
                const r = ranges[i];
                const parts = r.split('-').map(p => parseInt(p));
                const start = parts[0];
                const end = parts.length > 1 ? parts[1] : start;

                if (isNaN(start) || start < 1 || start > pageCount || (parts.length > 1 && (isNaN(end) || end < start || end > pageCount))) {
                    continue;
                }

                const newPdf = await PDFDocument.create();
                const pages = [];
                for (let p = start; p <= end; p++) {
                    pages.push(p - 1);
                }
                const copiedPages = await newPdf.copyPages(srcDoc, pages);
                copiedPages.forEach(p => newPdf.addPage(p));

                const pdfBytes = await newPdf.save();
                const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
                results.push({
                    url: URL.createObjectURL(blob),
                    name: `part_${i + 1}_pages_${start}${end !== start ? '-' + end : ''}.pdf`
                });
            }

            setSplitResults(results);
        } catch (err) {
            console.error(err);
            alert('Failed to split PDF.');
        } finally {
            setIsProcessing(false);
        }
    };

    const splitAll = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const srcDoc = await PDFDocument.load(arrayBuffer);
            const results: { url: string, name: string }[] = [];

            for (let i = 0; i < pageCount; i++) {
                const newPdf = await PDFDocument.create();
                const [copiedPage] = await newPdf.copyPages(srcDoc, [i]);
                newPdf.addPage(copiedPage);

                const pdfBytes = await newPdf.save();
                const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
                results.push({
                    url: URL.createObjectURL(blob),
                    name: `page_${i + 1}.pdf`
                });
            }
            setSplitResults(results);
        } catch (err) {
            console.error(err);
            alert('Failed to split PDF.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="tool-ui">
            {!file ? (
                <label className="upload-hero">
                    <Upload size={64} />
                    <h2>Select PDF File</h2>
                    <p>Split a single PDF into multiple documents</p>
                    <input type="file" hidden accept="application/pdf" onChange={handleUpload} />
                </label>
            ) : (
                <div className="editor-layout">
                    <div className="preview-panel">
                        <div className="file-info-card">
                            <FileText size={40} className="icon" />
                            <div className="details">
                                <h3>{file.name}</h3>
                                <p>{(file.size / 1024 / 1024).toFixed(2)} MB • {pageCount} Pages</p>
                            </div>
                            <button onClick={() => setFile(null)} className="change-btn">Change</button>
                        </div>

                        <div className="split-options">
                            <div className="option-card">
                                <h4>Split by Range</h4>
                                <p>Example: 1-5, 8, 11-15</p>
                                <input
                                    type="text"
                                    value={range}
                                    onChange={e => setRange(e.target.value)}
                                    placeholder="Enter ranges..."
                                />
                                <button onClick={splitByRange} disabled={isProcessing} className="btn-split">
                                    <Scissors size={18} /> Split Pages
                                </button>
                            </div>

                            <div className="option-card">
                                <h4>Split Every Page</h4>
                                <p>Extract every page into a separate PDF file.</p>
                                <button onClick={splitAll} disabled={isProcessing} className="btn-outline">
                                    Extract {pageCount} PDF files
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="results-panel">
                        <h3>Split Results {splitResults.length > 0 && `(${splitResults.length})`}</h3>
                        <div className="results-list">
                            {splitResults.length === 0 ? (
                                <div className="empty-state">
                                    <Scissors size={48} />
                                    <p>Your split documents will appear here.</p>
                                </div>
                            ) : (
                                splitResults.map((res, i) => (
                                    <div key={i} className="result-item">
                                        <div className="name-box">
                                            <Check size={16} className="text-green-500" />
                                            <span>{res.name}</span>
                                        </div>
                                        <a href={res.url} download={res.name} className="download-icon">
                                            <Download size={18} />
                                        </a>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .tool-ui { max-width: 1000px; margin: 0 auto; }
                .upload-hero { background: var(--card-bg, #f8f9fa); border: 2px dashed var(--border); border-radius: 2rem; padding: 5rem 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; cursor: pointer; color: var(--secondary); margin-top: 2rem; }
                .upload-hero h2 { color: var(--foreground); }
                
                .editor-layout { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; }
                
                .file-info-card { background: white; border: 1px solid var(--border); border-radius: 1.5rem; padding: 1.5rem; display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; }
                .file-info-card .icon { color: #f43f5e; }
                .file-info-card .details { flex: 1; }
                .file-info-card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.25rem; }
                .file-info-card p { font-size: 0.85rem; color: var(--secondary); font-weight: 600; }
                
                .change-btn { font-size: 0.8rem; font-weight: 700; color: var(--primary); padding: 0.5rem 1rem; border-radius: 0.5rem; background: var(--background); }
                
                .split-options { display: grid; gap: 1.5rem; }
                .option-card { background: white; border: 1px solid var(--border); border-radius: 1.5rem; padding: 1.5rem; }
                .option-card h4 { font-size: 0.9rem; font-weight: 700; text-transform: uppercase; color: var(--secondary); letter-spacing: 0.05em; margin-bottom: 0.5rem; }
                .option-card p { font-size: 0.8rem; color: #64748b; margin-bottom: 1rem; }
                .option-card input { width: 100%; padding: 0.75rem 1rem; border-radius: 0.75rem; border: 1px solid var(--border); font-weight: 600; margin-bottom: 1rem; }
                
                .btn-split { width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem; border-radius: 0.75rem; background: var(--primary); color: white; font-weight: 700; }
                .btn-outline { width: 100%; padding: 0.75rem; border-radius: 0.75rem; border: 1px solid var(--border); font-weight: 700; transition: all 0.2s; }
                .btn-outline:hover { background: var(--background); }
                
                .results-panel { background: white; border: 1px solid var(--border); border-radius: 1.5rem; display: flex; flex-direction: column; overflow: hidden; }
                .results-panel h3 { padding: 1.25rem; font-size: 1rem; font-weight: 700; border-bottom: 1px solid var(--border); }
                .results-list { flex: 1; min-height: 400px; padding: 1rem; overflow-y: auto; }
                
                .result-item { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; border-radius: 0.75rem; border: 1px solid var(--border); margin-bottom: 0.5rem; }
                .name-box { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 600; }
                .download-icon { color: var(--primary); }
                
                .empty-state { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--border); gap: 1rem; text-align: center; }
                
                @media (max-width: 900px) {
                    .editor-layout { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
