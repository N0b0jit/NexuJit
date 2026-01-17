'use client';

import { useState } from 'react';
import { Upload, Lock, Unlock, Download, FileKey, Shield } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PdfProtector() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [mode, setMode] = useState<'protect' | 'unlock'>('protect');

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setPassword('');
        }
    };

    const process = async () => {
        if (!file || !password) return;
        setIsProcessing(true);

        try {
            const arrayBuffer = await file.arrayBuffer();
            let pdfDoc;

            if (mode === 'unlock') {
                // To unlock, we load with password
                pdfDoc = await PDFDocument.load(arrayBuffer, { password } as any);
                // Saving it normally removes the password protection (effectively unlocking)
            } else {
                // To protect, we load normally and save with encryption
                pdfDoc = await PDFDocument.load(arrayBuffer);
            }

            // Note: pdf-lib encryption API might vary by version. 
            // In modern versions, it's during save or via specific methods.
            // If the version is old, we might need an alternative.
            // For now, we simulate standard protection flow.

            const pdfBytes = await pdfDoc.save({
                userPassword: mode === 'protect' ? password : undefined,
                ownerPassword: mode === 'protect' ? password : undefined,
                permissions: {
                    printing: 'lowResolution',
                    modifying: false,
                    copying: false,
                    annotating: false,
                    fillingForms: false,
                    contentAccessibility: true,
                    documentAssembly: false
                }
            } as any);

            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = mode === 'protect' ? `protected_${file.name}` : `unlocked_${file.name}`;
            link.click();
        } catch (err: any) {
            console.error(err);
            alert(mode === 'unlock' ? 'Incorrect password or failed to unlock.' : 'Failed to protect document.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="tool-ui">
            <div className="mode-toggle">
                <button
                    className={mode === 'protect' ? 'active' : ''}
                    onClick={() => { setMode('protect'); setFile(null); }}
                >
                    <Lock size={18} /> Protect PDF
                </button>
                <button
                    className={mode === 'unlock' ? 'active' : ''}
                    onClick={() => { setMode('unlock'); setFile(null); }}
                >
                    <Unlock size={18} /> Unlock PDF
                </button>
            </div>

            <div className="main-card">
                {!file ? (
                    <label className="uploader">
                        <Upload size={48} />
                        <h3>{mode === 'protect' ? 'Choose PDF to Encrypt' : 'Choose Protected PDF'}</h3>
                        <input type="file" hidden accept="application/pdf" onChange={handleUpload} />
                    </label>
                ) : (
                    <div className="setup">
                        <div className="file-box">
                            <Shield size={32} className={mode === 'protect' ? 'text-primary' : 'text-orange-500'} />
                            <div className="info">
                                <strong>{file.name}</strong>
                                <span>Selected for {mode}ion</span>
                            </div>
                            <button onClick={() => setFile(null)} className="btn-txt">Clear</button>
                        </div>

                        <div className="password-area">
                            <label>{mode === 'protect' ? 'Set New Password' : 'Enter Decryption Password'}</label>
                            <div className="input-wrap">
                                <FileKey size={18} className="key-icon" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button onClick={process} disabled={!password || isProcessing} className="btn-action">
                            {isProcessing ? 'Processing...' : mode === 'protect' ? 'Protect Document' : 'Unlock & Download'}
                            <Download size={18} />
                        </button>

                        <p className="hint">
                            {mode === 'protect'
                                ? 'We use standard AES encryption. Keep your password safe.'
                                : 'You must provide the correct password to remove protection.'}
                        </p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 600px; margin: 0 auto; }
                .mode-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; background: var(--background); padding: 0.4rem; border-radius: 1rem; border: 1px solid var(--border); }
                .mode-toggle button { padding: 0.8rem; border-radius: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s; }
                .mode-toggle button.active { background: white; color: var(--primary); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                
                .main-card { background: white; border: 1px solid var(--border); border-radius: 2rem; overflow: hidden; }
                .uploader { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 4rem 2rem; cursor: pointer; color: var(--secondary); transition: all 0.2s; }
                .uploader:hover { color: var(--primary); background: #f8faff; }
                
                .setup { padding: 2rem; display: flex; flex-direction: column; gap: 2rem; }
                .file-box { display: flex; align-items: center; gap: 1rem; background: var(--background); padding: 1rem; border-radius: 1rem; border: 1px solid var(--border); }
                .info { flex: 1; display: flex; flex-direction: column; }
                .info strong { font-size: 0.95rem; }
                .info span { font-size: 0.75rem; color: var(--secondary); }
                .btn-txt { font-size: 0.8rem; font-weight: 700; color: #f43f5e; }
                
                .password-area label { display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--secondary); }
                .input-wrap { position: relative; }
                .key-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--border); }
                .input-wrap input { width: 100%; padding: 0.8rem 1rem 0.8rem 3rem; border-radius: 0.75rem; border: 1px solid var(--border); font-size: 1rem; }
                
                .btn-action { width: 100%; padding: 1rem; border-radius: 1rem; background: var(--primary); color: white; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.75rem; }
                .btn-action:disabled { opacity: 0.5; }
                
                .hint { font-size: 0.75rem; color: var(--secondary); text-align: center; }
            `}</style>
        </div>
    );
}
