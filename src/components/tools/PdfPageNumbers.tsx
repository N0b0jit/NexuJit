'use client';

import { useState } from 'react';
import { Upload, Type, Download, Settings2, FileText, Layout } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

type Position = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export default function PdfPageNumbers() {
    const [file, setFile] = useState<File | null>(null);
    const [position, setPosition] = useState<Position>('bottom-center');
    const [startFrom, setStartFrom] = useState(1);
    const [format, setFormat] = useState('Page {n}');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) setFile(selected);
    };

    const apply = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const fontSize = 10;

            pages.forEach((page, i) => {
                const { width, height } = page.getSize();
                const text = format.replace('{n}', (startFrom + i).toString()).replace('{total}', pages.length.toString());
                const textWidth = font.widthOfTextAtSize(text, fontSize);

                let x = 0;
                let y = 0;
                const margin = 20;

                // X positioning
                if (position.includes('left')) x = margin;
                else if (position.includes('center')) x = (width - textWidth) / 2;
                else if (position.includes('right')) x = width - textWidth - margin;

                // Y positioning
                if (position.includes('top')) y = height - margin - fontSize;
                else if (position.includes('bottom')) y = margin;

                page.drawText(text, {
                    x, y, size: fontSize, font, color: rgb(0, 0, 0),
                });
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `numbered_${file.name}`;
            link.click();
        } catch (err) {
            console.error(err);
            alert('Failed to add page numbers.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="tool-ui">
            {!file ? (
                <label className="uploader">
                    <Upload size={64} />
                    <h2>Add Page Numbers to PDF</h2>
                    <p>Format and position sequence numbers automatically</p>
                    <input type="file" hidden accept="application/pdf" onChange={handleUpload} />
                </label>
            ) : (
                <div className="layout">
                    <div className="preview-section">
                        <div className="doc-viz">
                            <div className="page-ghost">
                                {position === 'top-left' && <div className="slot tl">1</div>}
                                {position === 'top-center' && <div className="slot tc">1</div>}
                                {position === 'top-right' && <div className="slot tr">1</div>}
                                {position === 'bottom-left' && <div className="slot bl">1</div>}
                                {position === 'bottom-center' && <div className="slot bc">1</div>}
                                {position === 'bottom-right' && <div className="slot br">1</div>}
                                <div className="content-hint">Document Content Preview</div>
                            </div>
                        </div>
                    </div>

                    <div className="settings-section">
                        <div className="card">
                            <div className="card-header"><Settings2 size={18} /> Settings</div>

                            <div className="group">
                                <label>Position</label>
                                <div className="pos-grid">
                                    {['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'].map(pos => (
                                        <button
                                            key={pos}
                                            className={`pos-btn ${position === pos ? 'active' : ''}`}
                                            onClick={() => setPosition(pos as Position)}
                                        >
                                            <Layout size={14} className={pos} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="group">
                                <label>Starting Number</label>
                                <input type="number" value={startFrom} onChange={e => setStartFrom(parseInt(e.target.value))} />
                            </div>

                            <div className="group">
                                <label>Format (use {'{n}'} for number)</label>
                                <input type="text" value={format} onChange={e => setFormat(e.target.value)} />
                                <span className="hint">Example: Page {'{n}'} of {'{total}'}</span>
                            </div>

                            <div className="actions">
                                <button onClick={apply} disabled={isProcessing} className="btn-apply">
                                    {isProcessing ? 'Processing...' : 'Apply & Download'}
                                    <Download size={18} />
                                </button>
                                <button onClick={() => setFile(null)} className="btn-txt">Change File</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .tool-ui { max-width: 900px; margin: 0 auto; }
                .uploader { background: var(--card-bg, #f8f9fa); border: 2px dashed var(--border); border-radius: 2rem; padding: 5rem 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; cursor: pointer; color: var(--secondary); margin-top: 2rem; }
                
                .layout { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; }
                .preview-section { background: #cbd5e1; border-radius: 2rem; display: flex; align-items: center; justify-content: center; min-height: 500px; }
                
                .page-ghost { width: 250px; height: 350px; background: white; border-radius: 0.5rem; position: relative; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
                .content-hint { height: 100%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: #e2e8f0; text-transform: uppercase; letter-spacing: 0.1em; }
                
                .slot { position: absolute; background: var(--primary); color: white; width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800; font-family: monospace; }
                .tl { top: 1rem; left: 1rem; }
                .tc { top: 1rem; left: 50%; transform: translateX(-50%); }
                .tr { top: 1rem; right: 1rem; }
                .bl { bottom: 1rem; left: 1rem; }
                .bc { bottom: 1rem; left: 50%; transform: translateX(-50%); }
                .br { bottom: 1rem; right: 1rem; }
                
                .group { margin-bottom: 1.5rem; }
                .group label { display: block; font-size: 0.8rem; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem; }
                .group input { width: 100%; padding: 0.75rem; border-radius: 0.75rem; border: 1px solid var(--border); }
                
                .pos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
                .pos-btn { height: 40px; border-radius: 0.5rem; background: var(--background); display: flex; align-items: center; justify-content: center; }
                .pos-btn.active { background: var(--primary); color: white; }
                
                .card { background: white; border: 1px solid var(--border); border-radius: 1.5rem; padding: 1.5rem; }
                .card-header { font-size: 0.9rem; font-weight: 700; border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
                
                .actions { display: flex; flex-direction: column; gap: 0.75rem; border-top: 1px solid var(--border); padding-top: 1.5rem; }
                .btn-apply { padding: 1rem; border-radius: 0.75rem; background: var(--primary); color: white; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
                .btn-txt { font-weight: 700; color: var(--secondary); font-size: 0.85rem; }
                .hint { font-size: 0.65rem; color: #94a3b8; margin-top: 0.25rem; display: block; }

                @media (max-width: 800px) {
                    .layout { grid-template-columns: 1fr; }
                    .preview-section { min-height: 400px; }
                }
            `}</style>
        </div>
    );
}
