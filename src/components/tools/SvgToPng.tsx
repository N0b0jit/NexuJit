'use client';

import { useState, useRef } from 'react';
import { Upload, Download, FileCode, RefreshCw } from 'lucide-react';

export default function SvgToPng() {
    const [svgData, setSvgData] = useState<string | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [pngUrl, setPngUrl] = useState<string | null>(null);
    const [size, setSize] = useState({ width: 512, height: 512 });
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setSvgData(e.target?.result as string);
            reader.readAsText(file);
        }
    };

    const convert = () => {
        if (!svgData) return;
        setIsConverting(true);

        const img = new Image();
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = size.width;
            canvas.height = size.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, size.width, size.height);

            const png = canvas.toDataURL('image/png');
            setPngUrl(png);
            setIsConverting(false);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    };

    return (
        <div className="tool-ui">
            <div className="layout">
                <div className="input-side">
                    {!svgData ? (
                        <label className="uploader">
                            <Upload size={40} />
                            <h3>Upload SVG File</h3>
                            <input type="file" hidden accept=".svg" onChange={handleUpload} />
                        </label>
                    ) : (
                        <div className="svg-preview">
                            <div className="preview-box" dangerouslySetInnerHTML={{ __html: svgData }} />
                            <div className="actions">
                                <button onClick={() => setSvgData(null)} className="btn-sec">Clear</button>
                                <div className="size-inputs">
                                    <input type="number" value={size.width} onChange={e => setSize({ ...size, width: parseInt(e.target.value) })} placeholder="W" />
                                    <span>×</span>
                                    <input type="number" value={size.height} onChange={e => setSize({ ...size, height: parseInt(e.target.value) })} placeholder="H" />
                                </div>
                                <button onClick={convert} className="btn-pri" disabled={isConverting}>
                                    {isConverting ? <RefreshCw className="spin" size={16} /> : <FileCode size={16} />}
                                    Convert to PNG
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="output-side">
                    {pngUrl ? (
                        <div className="png-result">
                            <img src={pngUrl} alt="PNG Output" />
                            <a href={pngUrl} download="converted.png" className="btn-pri download-link">
                                <Download size={18} /> Download PNG
                            </a>
                        </div>
                    ) : (
                        <div className="placeholder">
                            <p>PNG output will appear here after conversion</p>
                        </div>
                    )}
                </div>
            </div>

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <style jsx>{`
                .tool-ui { max-width: 1000px; margin: 0 auto; }
                .layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
                .input-side, .output-side { background: var(--card-bg, #f8f9fa); border-radius: 1.5rem; border: 1px solid var(--border); min-height: 400px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
                
                .uploader { display: flex; flex-direction: column; align-items: center; gap: 1rem; cursor: pointer; color: var(--secondary); transition: all 0.2s; padding: 2rem; }
                .uploader:hover { color: var(--primary); transform: scale(1.02); }
                
                .svg-preview { width: 100%; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
                .preview-box { background: var(--surface); border-radius: 1rem; padding: 1rem; display: flex; align-items: center; justify-content: center; min-height: 200px; border: 1px solid var(--border); }
                .preview-box :global(svg) { max-width: 100%; max-height: 300px; }
                
                .actions { display: flex; flex-direction: column; gap: 1rem; }
                .size-inputs { display: flex; align-items: center; gap: 0.5rem; justify-content: center; }
                .size-inputs input { width: 80px; padding: 0.5rem; border-radius: 0.5rem; border: 1px solid var(--border); text-align: center; font-weight: 700; }
                
                .btn-pri { background: var(--primary); color: white; padding: 0.8rem 1.5rem; border-radius: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s; }
                .btn-sec { background: var(--background); color: var(--foreground); padding: 0.8rem; border-radius: 0.75rem; border: 1px solid var(--border); font-weight: 600; }
                
                .png-result { display: flex; flex-direction: column; align-items: center; gap: 2rem; padding: 2rem; width: 100%; }
                .png-result img { max-width: 100%; border-radius: 0.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1); background: var(--surface); }
                
                .placeholder { color: var(--secondary); font-size: 0.9rem; text-align: center; padding: 2rem; }
                .spin { animation: rotate 1s linear infinite; }
                @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                
                @media (max-width: 768px) {
                    .layout { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
