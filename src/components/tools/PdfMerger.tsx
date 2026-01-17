'use client';

import { useState } from 'react';
import { Upload, FilePlus, Download, Trash2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PdfMerger() {
    const [files, setFiles] = useState<File[]>([]);
    const [isMerging, setIsMerging] = useState(false);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles([...files, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const merge = async () => {
        if (files.length < 2) return;
        setIsMerging(true);

        try {
            const mergedPdf = await PDFDocument.create();

            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'merged-document.pdf';
            link.click();
        } catch (error) {
            console.error(error);
            alert('Error merging PDFs. Ensure they are valid/unprotected.');
        } finally {
            setIsMerging(false);
        }
    };

    return (
        <div className="tool-ui">
            <div className="card">
                <div className="upload-area">
                    <input type="file" multiple accept="application/pdf" onChange={handleUpload} id="pdf-upload" hidden />
                    <label htmlFor="pdf-upload" className="upload-label">
                        <FilePlus size={48} />
                        <p>Click to upload PDF files</p>
                    </label>
                </div>

                {files.length > 0 && (
                    <div className="file-list">
                        {files.map((file, i) => (
                            <div key={i} className="file-item">
                                <span className="name">{i + 1}. {file.name}</span>
                                <button onClick={() => removeFile(i)} className="del-btn"><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    onClick={merge}
                    className="action-btn"
                    disabled={files.length < 2 || isMerging}
                >
                    {isMerging ? 'Merging...' : `Merge ${files.length} PDFs`} <Download size={20} />
                </button>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 600px; margin: 0 auto; }
                .card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); }
                
                .upload-label { border: 2px dashed var(--border); border-radius: 1rem; padding: 3rem; text-align: center; cursor: pointer; display: block; transition: all 0.2s; color: var(--secondary); }
                .upload-label:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-soft); }
                .upload-label p { margin-top: 1rem; font-weight: 600; }

                .file-list { margin: 2rem 0; border: 1px solid var(--border); border-radius: 1rem; overflow: hidden; }
                .file-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: var(--background); border-bottom: 1px solid var(--border); }
                .file-item:last-child { border-bottom: none; }
                .name { font-weight: 500; font-size: 0.9rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80%; }
                .del-btn { color: #ef4444; padding: 0.5rem; border-radius: 0.5rem; }
                .del-btn:hover { background: #fee2e2; }

                .action-btn { width: 100%; padding: 1rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
                .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            `}</style>
        </div>
    );
}
