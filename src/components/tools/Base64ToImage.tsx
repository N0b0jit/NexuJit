'use client';

import { useState } from 'react';
import { Image as ImageIcon, Download, Upload } from 'lucide-react';

export default function Base64ToImage() {
    const [base64, setBase64] = useState('');
    const [error, setError] = useState('');

    const handleDownload = () => {
        if (!base64) return;
        try {
            const link = document.createElement('a');
            link.href = base64;
            // Try to guess extension or default to png
            const match = base64.match(/data:image\/(\w+);base64/);
            const ext = match ? match[1] : 'png';
            link.download = `image.${ext}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            setError('Invalid Base64 string');
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setBase64(text);
        } catch (err) {
            console.error('Failed to read clipboard');
        }
    };

    return (
        <div className="tool-content">
            <div className="input-section">
                <label>Paste Base64 String</label>
                <textarea
                    value={base64}
                    onChange={(e) => {
                        setBase64(e.target.value);
                        setError('');
                    }}
                    placeholder="data:image/png;base64,iVBORw0KGgo..."
                    className="base64-input"
                />
                <button onClick={handlePaste} className="paste-btn">Paste from Clipboard</button>
            </div>

            {error && <div className="error">{error}</div>}

            {base64 && (
                <div className="preview-section">
                    <h3>Image Preview</h3>
                    <div className="image-container">
                        <img src={base64} alt="Preview" onError={() => setError('Invalid image data')} />
                    </div>
                    <button onClick={handleDownload} className="download-btn">
                        <Download size={20} /> Download Image
                    </button>
                </div>
            )}

            <style jsx>{`
                .tool-content { display: flex; flex-direction: column; gap: 2rem; }
                .input-section { display: flex; flex-direction: column; gap: 1rem; }
                .base64-input {
                    width: 100%;
                    height: 200px;
                    padding: 1rem;
                    border: 2px solid var(--border);
                    border-radius: 1rem;
                    background: var(--background);
                    font-family: monospace;
                    resize: vertical;
                }
                .paste-btn {
                    align-self: flex-start;
                    padding: 0.5rem 1rem;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-weight: 500;
                }
                .error { color: #dc2626; padding: 1rem; background: #fef2f2; border-radius: 0.5rem; }
                .preview-section {
                    background: var(--surface);
                    padding: 2rem;
                    border-radius: 1.5rem;
                    border: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                }
                .image-container img {
                    max-width: 100%;
                    max-height: 500px;
                    border-radius: 0.5rem;
                    box-shadow: var(--shadow-md);
                }
                .download-btn {
                    padding: 1rem 2rem;
                    background: var(--primary);
                    color: white;
                    border-radius: 0.75rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
