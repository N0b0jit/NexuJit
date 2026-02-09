'use client';

import { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, Sliders, Image as ImageIcon } from 'lucide-react';

const FILTER_PRESETS = [
    { name: 'Original', filter: 'none' },
    { name: 'Grayscale', filter: 'grayscale(100%)' },
    { name: 'Sepia', filter: 'sepia(100%)' },
    { name: 'Invert', filter: 'invert(100%)' },
    { name: 'Vibrant', filter: 'saturate(200%) brightness(110%)' },
    { name: 'Vintage', filter: 'sepia(50%) hue-rotate(-30deg) saturate(120%)' },
    { name: 'Dramatic', filter: 'contrast(150%) brightness(90%)' },
    { name: 'Dreamy', filter: 'blur(1px) brightness(110%) saturate(130%)' },
    { name: 'Cyberpunk', filter: 'hue-rotate(180deg) saturate(200%) contrast(120%)' }
];

export default function ImageFilters() {
    const [image, setImage] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState(FILTER_PRESETS[0]);
    const [customFilters, setCustomFilters] = useState({
        brightness: 100,
        contrast: 100,
        saturate: 100,
        blur: 0,
        hue: 0
    });
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const getFilterString = () => {
        if (activeFilter.name !== 'Original') return activeFilter.filter;
        return `brightness(${customFilters.brightness}%) contrast(${customFilters.contrast}%) saturate(${customFilters.saturate}%) blur(${customFilters.blur}px) hue-rotate(${customFilters.hue}deg)`;
    };

    const handleDownload = () => {
        if (!image) return;
        const img = new Image();
        img.src = image;
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.filter = getFilterString();
            ctx.drawImage(img, 0, 0);

            const link = document.createElement('a');
            link.download = 'filtered-image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
    };

    return (
        <div className="tool-ui">
            {!image ? (
                <label className="upload-hero">
                    <ImageIcon size={64} />
                    <h2>Upload an Image to Start</h2>
                    <p>Apply stunning filters and adjustments instantly</p>
                    <input type="file" hidden accept="image/*" onChange={handleUpload} />
                </label>
            ) : (
                <div className="editor-layout">
                    <div className="preview-panel">
                        <div className="preview-container">
                            <img
                                src={image}
                                alt="Filtered"
                                style={{ filter: getFilterString() }}
                            />
                        </div>
                        <div className="preview-actions">
                            <button onClick={() => setImage(null)} className="btn-secondary">
                                <RefreshCw size={16} /> Change Image
                            </button>
                            <button onClick={handleDownload} className="btn-primary">
                                <Download size={16} /> Download Result
                            </button>
                        </div>
                    </div>

                    <div className="controls-panel">
                        <div className="tabs">
                            <button className="tab active">Presets</button>
                        </div>

                        <div className="presets-grid">
                            {FILTER_PRESETS.map(f => (
                                <button
                                    key={f.name}
                                    className={`preset-item ${activeFilter.name === f.name ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(f)}
                                >
                                    <div className="mini-preview" style={{ filter: f.filter }}>
                                        <img src={image} alt={f.name} />
                                    </div>
                                    <span>{f.name}</span>
                                </button>
                            ))}
                        </div>

                        <div className="custom-adjustments">
                            <h3><Sliders size={16} /> Fine Tune</h3>
                            {Object.entries(customFilters).map(([key, value]) => (
                                <div key={key} className="range-group">
                                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                    <input
                                        type="range"
                                        min={key === 'blur' ? 0 : 0}
                                        max={key === 'hue' ? 360 : 200}
                                        value={value}
                                        onChange={(e) => {
                                            setActiveFilter(FILTER_PRESETS[0]);
                                            setCustomFilters({ ...customFilters, [key]: parseInt(e.target.value) });
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <style jsx>{`
                .tool-ui { max-width: 1200px; margin: 0 auto; }
                .upload-hero { background: var(--card-bg, #f8f9fa); border: 2px dashed var(--border); border-radius: 2rem; padding: 5rem 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; cursor: pointer; color: var(--secondary); margin-top: 2rem; }
                .upload-hero h2 { color: var(--foreground); }
                
                .editor-layout { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; }
                .preview-panel { background: #1a1a1a; border-radius: 1.5rem; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; justify-content: center; }
                .preview-container { text-align: center; background: #000; border-radius: 1rem; overflow: hidden; display: flex; align-items: center; justify-content: center; min-height: 400px; }
                .preview-container img { max-width: 100%; max-height: 600px; }
                .preview-actions { display: flex; gap: 1rem; justify-content: center; }
                
                .controls-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; padding: 1.5rem; display: flex; flex-direction: column; gap: 2rem; }
                .presets-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .preset-item { display: flex; flex-direction: column; gap: 0.5rem; align-items: center; font-size: 0.75rem; font-weight: 700; color: var(--secondary); }
                .preset-item.active span { color: var(--primary); }
                .mini-preview { width: 100%; aspect-ratio: 4/3; border-radius: 0.5rem; overflow: hidden; border: 2px solid transparent; transition: all 0.2s; }
                .preset-item.active .mini-preview { border-color: var(--primary); transform: scale(1.05); }
                .mini-preview img { width: 100%; height: 100%; object-fit: cover; }
                
                .custom-adjustments { display: flex; flex-direction: column; gap: 1rem; }
                .custom-adjustments h3 { font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; color: var(--secondary); text-transform: uppercase; border-top: 1px solid var(--border); padding-top: 1.5rem; }
                .range-group label { font-size: 0.75rem; font-weight: 600; margin-bottom: 0.25rem; display: block; }
                input[type="range"] { width: 100%; }
                
                .btn-primary { background: var(--primary); color: white; padding: 0.75rem 1.5rem; border-radius: 2rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }
                .btn-secondary { background: rgba(255,255,255,0.1); color: white; padding: 0.75rem 1.5rem; border-radius: 2rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }
                
                @media (max-width: 900px) {
                    .editor-layout { grid-template-columns: 1fr; }
                    .preview-container { min-height: 300px; }
                }
            `}</style>
        </div>
    );
}
