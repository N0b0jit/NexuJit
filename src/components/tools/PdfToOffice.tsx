'use client';

import { useState } from 'react';
import { Upload, FileText, Download, RefreshCw, FileCode, Table, Presentation } from 'lucide-react';

type ExportFormat = 'word' | 'excel' | 'ppt' | 'html';

export default function PdfToOffice() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const loadPdfJs = () => {
        return new Promise<any>((resolve) => {
            if ((window as any).pdfjsLib) resolve((window as any).pdfjsLib);
            else {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
                script.onload = () => {
                    (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                    resolve((window as any).pdfjsLib);
                };
                document.head.appendChild(script);
            }
        });
    };

    const convert = async (target: ExportFormat) => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(0);

        try {
            const pdfjsLib: any = await loadPdfJs();
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';
            let htmlContent = '<html><body>';

            for (let i = 1; i <= pdf.numPages; i++) {
                setProgress(Math.round((i / pdf.numPages) * 100));
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const strings = textContent.items.map((item: any) => item.str);
                const pageText = strings.join(' ');
                fullText += pageText + '\n\n';
                htmlContent += `<div><h2>Page ${i}</h2><p>${pageText}</p></div>`;
            }
            htmlContent += '</body></html>';

            let blob;
            let ext = '';
            let mime = '';

            if (target === 'word') {
                // Simplest trick: Word opens HTML files as docs
                blob = new Blob([htmlContent], { type: 'application/msword' });
                ext = 'doc';
            } else if (target === 'excel') {
                // Tab separated values for excel
                const rows = fullText.split('\n').map(r => r.split(' ').join('\t')).join('\n');
                blob = new Blob([rows], { type: 'application/vnd.ms-excel' });
                ext = 'xls';
            } else if (target === 'html') {
                blob = new Blob([htmlContent], { type: 'text/html' });
                ext = 'html';
            } else if (target === 'ppt') {
                // PPT is hard, so we just give the text in a text-like format for now
                blob = new Blob([fullText], { type: 'text/plain' });
                ext = 'txt';
                alert('High-fidelity PPT conversion requires server-side processing. Downloading extracted text.');
            }

            if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `converted_${file.name.split('.')[0]}.${ext}`;
                link.click();
            }
        } catch (err) {
            console.error(err);
            alert('Error during conversion.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="tool-ui">
            {!file ? (
                <label className="uploader">
                    <Upload size={64} />
                    <h2>PDF to Office Converter</h2>
                    <p>Convert PDF to Word, Excel, PPT or HTML</p>
                    <input type="file" hidden accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
                </label>
            ) : (
                <div className="converter-setup">
                    <div className="file-header">
                        <FileText size={40} className="text-red-500" />
                        <div className="info">
                            <strong>{file.name}</strong>
                            <span>PDF Document</span>
                        </div>
                        <button onClick={() => setFile(null)} className="btn-txt">Change</button>
                    </div>

                    <div className="options-grid">
                        <button onClick={() => convert('word')} disabled={isProcessing} className="opt-btn">
                            <FileText size={24} />
                            <span>Convert to Word</span>
                        </button>
                        <button onClick={() => convert('excel')} disabled={isProcessing} className="opt-btn">
                            <Table size={24} />
                            <span>Convert to Excel</span>
                        </button>
                        <button onClick={() => convert('ppt')} disabled={isProcessing} className="opt-btn">
                            <Presentation size={24} />
                            <span>Convert to PPT</span>
                        </button>
                        <button onClick={() => convert('html')} disabled={isProcessing} className="opt-btn">
                            <FileCode size={24} />
                            <span>Convert to HTML</span>
                        </button>
                    </div>

                    {isProcessing && (
                        <div className="progress-bar">
                            <div className="fill" style={{ width: `${progress}%` }} />
                            <span>Processing {progress}%...</span>
                        </div>
                    )}
                </div>
            )}

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .uploader { background: var(--card-bg, #f8f9fa); border: 2px dashed var(--border); border-radius: 2rem; padding: 5rem 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; cursor: pointer; color: var(--secondary); margin-top: 2rem; }
                
                .converter-setup { background: white; border: 1px solid var(--border); border-radius: 2rem; padding: 2rem; }
                .file-header { display: flex; align-items: center; gap: 1rem; background: var(--background); padding: 1.5rem; border-radius: 1.5rem; margin-bottom: 2rem; }
                .info { flex: 1; display: flex; flex-direction: column; }
                .btn-txt { font-weight: 700; color: #f43f5e; }
                
                .options-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
                .opt-btn { background: white; border: 1px solid var(--border); padding: 2rem; border-radius: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; transition: all 0.2s; }
                .opt-btn:hover { border-color: var(--primary); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
                .opt-btn span { font-weight: 700; font-size: 0.9rem; }
                
                .progress-bar { margin-top: 2rem; height: 1.5rem; background: var(--background); border-radius: 2rem; overflow: hidden; position: relative; }
                .fill { height: 100%; background: var(--primary); transition: width 0.3s; }
                .progress-bar span { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; color: #444; mix-blend-mode: difference; }
                
                @media (max-width: 600px) {
                    .options-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
