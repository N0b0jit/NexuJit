'use client';

import { useState } from 'react';
import { QrCode, Download, RefreshCw, Type, Palette, Settings, Image as ImageIcon } from 'lucide-react';

export default function QrCodeGenerator() {
    const [text, setText] = useState('https://seostudio.tools');
    const [size, setSize] = useState('300');
    const [color, setColor] = useState('000000');
    const [bgColor, setBgColor] = useState('ffffff');
    const [format, setFormat] = useState('png');
    const [loading, setLoading] = useState(false);

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=${color.replace('#', '')}&bgcolor=${bgColor.replace('#', '')}&format=${format}`;

    const handleDownload = async () => {
        try {
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `qrcode-${Date.now()}.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (err) {
            console.error('Download failed', err);
        }
    };

    return (
        <div className="tool-ui">
            <div className="qr-layout">
                <div className="config-panel">
                    <div className="config-group">
                        <label><Type size={16} /> QR Content</label>
                        <textarea
                            placeholder="Enter URL or text..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="config-row">
                        <div className="config-group">
                            <label><Settings size={16} /> Size (px)</label>
                            <select value={size} onChange={(e) => setSize(e.target.value)}>
                                <option value="150">150 x 150</option>
                                <option value="200">200 x 200</option>
                                <option value="300">300 x 300</option>
                                <option value="500">500 x 500</option>
                                <option value="1000">1000 x 1000</option>
                            </select>
                        </div>
                        <div className="config-group">
                            <label><ImageIcon size={16} /> Format</label>
                            <select value={format} onChange={(e) => setFormat(e.target.value)}>
                                <option value="png">PNG</option>
                                <option value="jpg">JPG</option>
                                <option value="svg">SVG</option>
                            </select>
                        </div>
                    </div>

                    <div className="config-row">
                        <div className="config-group">
                            <label><Palette size={16} /> Foreground</label>
                            <div className="color-picker-wrapper">
                                <input type="color" value={`#${color}`} onChange={(e) => setColor(e.target.value.replace('#', ''))} />
                                <span>#{color}</span>
                            </div>
                        </div>
                        <div className="config-group">
                            <label><Palette size={16} /> Background</label>
                            <div className="color-picker-wrapper">
                                <input type="color" value={`#${bgColor}`} onChange={(e) => setBgColor(e.target.value.replace('#', ''))} />
                                <span>#{bgColor}</span>
                            </div>
                        </div>
                    </div>

                    <button onClick={handleDownload} className="download-btn shadow-vibrant">
                        <Download size={20} /> Download QR Code
                    </button>
                </div>

                <div className="preview-panel">
                    <div className="qr-container">
                        <img
                            src={qrUrl}
                            alt="QR Code Preview"
                            onLoad={() => setLoading(false)}
                            style={{ width: '100%', maxWidth: '300px', height: 'auto', borderRadius: '1rem' }}
                        />
                    </div>
                    <p className="preview-hint">Real-time preview updated as you type</p>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { display: flex; flex-direction: column; gap: 2rem; }
                .qr-layout { display: grid; grid-template-columns: 1fr; gap: 3rem; }
                @media (min-width: 1024px) { .qr-layout { grid-template-columns: 1fr 400px; } }

                .config-panel { display: flex; flex-direction: column; gap: 1.5rem; padding: 2.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; box-shadow: var(--shadow); }
                .config-group { display: flex; flex-direction: column; gap: 0.75rem; }
                .config-group label { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: var(--secondary); font-size: 0.9rem; }
                .config-group textarea, .config-group select { padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); font-weight: 500; color: var(--foreground); }
                .config-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

                .color-picker-wrapper { display: flex; align-items: center; gap: 1rem; padding: 0.5rem; background: var(--background); border: 2px solid var(--border); border-radius: 0.75rem; }
                .color-picker-wrapper input { width: 40px; height: 40px; border: none; background: none; cursor: pointer; }
                .color-picker-wrapper span { font-family: monospace; font-weight: 700; font-size: 0.9rem; }

                .download-btn { margin-top: 1rem; padding: 1.25rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: all 0.2s; }
                .download-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 25px var(--primary-soft); }

                .preview-panel { display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--background); border: 2px dashed var(--border); border-radius: 2rem; padding: 4rem; text-align: center; }
                .qr-container { padding: 1.5rem; background: var(--surface); border-radius: 1.5rem; box-shadow: var(--shadow-lg); margin-bottom: 2rem; }
                .preview-hint { color: var(--secondary); font-size: 0.9rem; font-weight: 500; }
            `}</style>
        </div>
    );
}
