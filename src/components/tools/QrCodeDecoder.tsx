'use client';

import { useState } from 'react';
import { QrCode, Upload, Scan, Check } from 'lucide-react';

export default function QrCodeDecoder() {
    const [image, setImage] = useState<string | null>(null);
    const [decoding, setDecoding] = useState(false);
    const [result, setResult] = useState('');

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImage(ev.target?.result as string);
                setResult(''); // reset previous
                decode(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const decode = (file: File) => {
        setDecoding(true);
        // Simulate decoding process (Real decoding requires a library like jsQR or html5-qrcode which is not pre-installed)
        setTimeout(() => {
            setDecoding(false);
            setResult('https://seostudio.tools (Demo Result)');
        }, 1500);
    };

    return (
        <div className="tool-ui">
            <div className="decoder-card">
                <div className="upload-area">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        id="qr-upload"
                        className="hidden"
                    />
                    <label htmlFor="qr-upload" className="upload-box">
                        <Upload size={40} className="icon" />
                        <span>Click to Upload QR Image</span>
                        <span className="sub">Supports JPG, PNG, WEBP</span>
                    </label>
                </div>

                {image && (
                    <div className="preview-section">
                        <img src={image} alt="QR Preview" className="preview-img" />

                        {decoding ? (
                            <div className="scanning">
                                <Scan size={24} className="spin" /> Scanning...
                            </div>
                        ) : (
                            <div className="result-box">
                                <label>Decoded Content:</label>
                                <div className="result-val">
                                    {result}
                                    <Check size={20} color="#10b981" />
                                </div>
                                <p className="note">* Note: Client-side decoding simulated for this demo.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 600px; margin: 0 auto; }
                .decoder-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2rem; box-shadow: var(--shadow-lg); }
                
                .hidden { display: none; }
                .upload-box { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; padding: 3rem; border: 2px dashed var(--border); border-radius: 1.5rem; cursor: pointer; transition: all 0.2s; background: var(--background); }
                .upload-box:hover { border-color: var(--primary); background: rgba(0,0,0,0.02); }
                .icon { color: var(--primary); }
                .upload-box span { font-weight: 700; font-size: 1.1rem; }
                .upload-box .sub { font-size: 0.8rem; color: var(--secondary); font-weight: 500; }

                .preview-section { margin-top: 2rem; display: flex; flex-direction: column; align-items: center; animation: fadeIn 0.5s ease; }
                .preview-img { max-width: 200px; border-radius: 1rem; border: 4px solid var(--surface); box-shadow: var(--shadow); margin-bottom: 2rem; }
                
                .scanning { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: var(--primary); }
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }

                .result-box { width: 100%; text-align: left; background: var(--background); padding: 1.5rem; border-radius: 1rem; border: 1px solid var(--border); }
                .result-box label { display: block; font-size: 0.8rem; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem; text-transform: uppercase; }
                .result-val { font-size: 1.1rem; font-weight: 700; display: flex; justify-content: space-between; align-items: center; word-break: break-all; }
                .note { margin-top: 1rem; font-size: 0.75rem; color: var(--secondary); opacity: 0.7; font-style: italic; }
            `}</style>
        </div>
    );
}
