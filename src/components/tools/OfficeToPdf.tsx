'use client';

import { useState } from 'react';
import { Upload, FileText, Download, RefreshCw, Table, Presentation } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function OfficeToPdf() {
    const [file, setFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);

    const loadLib = (url: string, globalName: string) => {
        return new Promise((resolve) => {
            if ((window as any)[globalName]) resolve((window as any)[globalName]);
            else {
                const script = document.createElement('script');
                script.src = url;
                script.onload = () => resolve((window as any)[globalName]);
                document.head.appendChild(script);
            }
        });
    };

    const convert = async () => {
        if (!file) return;
        setIsConverting(true);

        try {
            const doc = new jsPDF();
            const name = file.name.toLowerCase();

            if (name.endsWith('.docx')) {
                const mammoth: any = await loadLib('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js', 'mammoth');
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                doc.text(result.value, 10, 10, { maxWidth: 190 });
            } else if (name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv')) {
                const xlsx: any = await loadLib('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js', 'XLSX');
                const arrayBuffer = await file.arrayBuffer();
                const workbook = xlsx.read(arrayBuffer);
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const data: any[][] = xlsx.utils.sheet_to_json(firstSheet, { header: 1 });

                let y = 10;
                data.forEach(row => {
                    doc.text(row.join(' | '), 10, y);
                    y += 7;
                    if (y > 280) { doc.addPage(); y = 10; }
                });
            } else {
                // For PPTX or others, we just try to extract anything or tell the user
                doc.text(`Conversion for ${name.split('.').pop()} is currently text-only.`, 10, 10);
                doc.text("Full fidelity Office to PDF conversion is best done via local Office software or cloud APIs.", 10, 20);
            }

            doc.save(`converted_${file.name.split('.')[0]}.pdf`);
        } catch (err) {
            console.error(err);
            alert('Failed to convert Office file. Ensure it is not password protected.');
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <div className="tool-ui">
            {!file ? (
                <label className="uploader">
                    <Upload size={64} />
                    <h2>Office to PDF Converter</h2>
                    <p>Convert Word (.docx), Excel (.xlsx), or CSV to PDF</p>
                    <input type="file" hidden accept=".docx,.xlsx,.xls,.csv" onChange={e => setFile(e.target.files?.[0] || null)} />
                </label>
            ) : (
                <div className="converter-card">
                    <div className="file-box">
                        <FileText size={48} className="text-blue-500" />
                        <div className="info">
                            <strong>{file.name}</strong>
                            <span>Ready to be converted to PDF</span>
                        </div>
                        <button onClick={() => setFile(null)} className="btn-txt">Change</button>
                    </div>

                    <button onClick={convert} disabled={isConverting} className="convert-btn">
                        {isConverting ? <RefreshCw size={20} className="spin" /> : <Download size={20} />}
                        {isConverting ? 'Extacting & Rendering...' : 'Convert to PDF'}
                    </button>

                    <div className="limitations-hint">
                        💡 Note: This tool extracts raw text and data for speed and privacy.
                        Complex layouts and images in Office files may not be preserved in the PDF output.
                    </div>
                </div>
            )}

            <style jsx>{`
                .tool-ui { max-width: 600px; margin: 0 auto; }
                .uploader { background: var(--card-bg, #f8f9fa); border: 2px dashed var(--border); border-radius: 2rem; padding: 5rem 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; cursor: pointer; color: var(--secondary); margin-top: 2rem; }
                
                .converter-card { background: white; border: 1px solid var(--border); border-radius: 2rem; padding: 2rem; display: flex; flex-direction: column; gap: 2rem; }
                .file-box { display: flex; align-items: center; gap: 1.5rem; background: var(--background); padding: 1.5rem; border-radius: 1.5rem; }
                .info { flex: 1; display: flex; flex-direction: column; }
                .btn-txt { font-weight: 700; color: #f43f5e; font-size: 0.85rem; }
                
                .convert-btn { width: 100%; padding: 1rem; border-radius: 1rem; background: var(--primary); color: white; border: none; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.75rem; }
                .convert-btn:disabled { opacity: 0.5; }
                
                .limitations-hint { font-size: 0.75rem; color: #64748b; line-height: 1.5; text-align: center; background: #fef9c3; padding: 1rem; border-radius: 1rem; border: 1px solid #fef08a; }
                
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
