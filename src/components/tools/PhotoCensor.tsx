'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Download, Eye, EyeOff, Scissors, Trash2 } from 'lucide-react';

export default function PhotoCensor() {
    const [image, setImage] = useState<string | null>(null);
    const [regions, setRegions] = useState<{ x: number, y: number, w: number, h: number, type: 'blur' | 'pixel' | 'black' }[]>([]);
    const [activeType, setActiveType] = useState<'blur' | 'pixel' | 'black'>('blur');
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
    const imgRef = useRef<HTMLImageElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target?.result as string);
            reader.readAsDataURL(file);
            setRegions([]);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!imgRef.current) return;
        const rect = imgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setStartPos({ x, y });
        setCurrentPos({ x, y });
        setIsDrawing(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing || !imgRef.current) return;
        const rect = imgRef.current.getBoundingClientRect();
        setCurrentPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseUp = () => {
        if (!isDrawing) return;
        const x = Math.min(startPos.x, currentPos.x);
        const y = Math.min(startPos.y, currentPos.y);
        const w = Math.abs(currentPos.x - startPos.x);
        const h = Math.abs(currentPos.y - startPos.y);

        if (w > 5 && h > 5) {
            setRegions([...regions, { x, y, w, h, type: activeType }]);
        }
        setIsDrawing(false);
    };

    const handleDownload = () => {
        if (!imgRef.current || !image) return;
        const canvas = document.createElement('canvas');
        const img = new Image();
        img.src = image;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.drawImage(img, 0, 0);

            const scaleX = img.width / imgRef.current!.width;
            const scaleY = img.height / imgRef.current!.height;

            regions.forEach(reg => {
                const x = reg.x * scaleX;
                const y = reg.y * scaleY;
                const w = reg.w * scaleX;
                const h = reg.h * scaleY;

                if (reg.type === 'black') {
                    ctx.fillStyle = 'black';
                    ctx.fillRect(x, y, w, h);
                } else if (reg.type === 'blur') {
                    ctx.filter = 'blur(20px)';
                    ctx.drawImage(canvas, x, y, w, h, x, y, w, h);
                    ctx.filter = 'none';
                } else if (reg.type === 'pixel') {
                    const size = 10;
                    ctx.drawImage(canvas, x, y, w, h, x, y, w / size, h / size);
                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(canvas, x, y, w / size, h / size, x, y, w, h);
                    ctx.imageSmoothingEnabled = true;
                }
            });

            const link = document.createElement('a');
            link.download = 'censored-image.png';
            link.href = canvas.toDataURL();
            link.click();
        };
    };

    return (
        <div className="tool-ui">
            <div className="toolbar">
                <div className="tools">
                    {(['blur', 'pixel', 'black'] as const).map(type => (
                        <button
                            key={type}
                            className={`tool-btn ${activeType === type ? 'active' : ''}`}
                            onClick={() => setActiveType(type)}
                        >
                            {type === 'blur' && <EyeOff size={18} />}
                            {type === 'pixel' && <Scissors size={18} />}
                            {type === 'black' && <div className="black-box" />}
                            <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                        </button>
                    ))}
                </div>
                <div className="actions">
                    <button onClick={() => setRegions([])} className="btn-icon" title="Clear All"><Trash2 size={18} /></button>
                    <button onClick={handleDownload} disabled={!image} className="btn-primary"><Download size={18} /> Download</button>
                </div>
            </div>

            <div className="stage">
                {!image ? (
                    <label className="upload-placeholder">
                        <Upload size={48} />
                        <p>Upload a photo to censor sensitive parts</p>
                        <input type="file" hidden accept="image/*" onChange={handleUpload} />
                    </label>
                ) : (
                    <div
                        className="editor-container"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                    >
                        <img ref={imgRef} src={image} alt="To censor" draggable={false} onDragStart={e => e.preventDefault()} />

                        {regions.map((reg, i) => (
                            <div key={i} className={`region ${reg.type}`} style={{
                                left: reg.x, top: reg.y, width: reg.w, height: reg.h
                            }}>
                                <button className="remove-reg" onClick={(e) => {
                                    e.stopPropagation();
                                    setRegions(regions.filter((_, idx) => idx !== i));
                                }}>×</button>
                            </div>
                        ))}

                        {isDrawing && (
                            <div className="drawing-region" style={{
                                left: Math.min(startPos.x, currentPos.x),
                                top: Math.min(startPos.y, currentPos.y),
                                width: Math.abs(currentPos.x - startPos.x),
                                height: Math.abs(currentPos.y - startPos.y)
                            }} />
                        )}

                        <div className="editor-hint">Click and drag to select an area to censor</div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; }
                .toolbar { background: white; border: 1px solid var(--border); border-radius: 1rem; padding: 1rem; display: flex; justify-content: space-between; align-items: center; }
                .tools { display: flex; gap: 0.5rem; }
                .tool-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; border-radius: 0.75rem; font-weight: 600; font-size: 0.9rem; transition: all 0.2s; }
                .tool-btn.active { background: var(--primary); color: white; }
                .black-box { width: 18px; height: 18px; background: #000; border: 1px solid #fff; }
                
                .stage { background: #f0f2f5; border-radius: 1.5rem; border: 1px solid var(--border); overflow: hidden; min-height: 500px; display: flex; align-items: center; justify-content: center; position: relative; }
                .upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 1rem; color: var(--secondary); cursor: pointer; padding: 4rem; text-align: center; }
                
                .editor-container { position: relative; cursor: crosshair; line-height: 0; }
                .editor-container img { max-width: 100%; max-height: 700px; border-radius: 0.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
                
                .region { position: absolute; border: 1px solid rgba(255,255,255,0.5); pointer-events: none; }
                .region.blur { backdrop-filter: blur(15px); }
                .region.pixel { background-image: radial-gradient(#888 20%, transparent 20%); background-size: 10px 10px; backdrop-filter: brightness(0.8); }
                .region.black { background: #000; }
                
                .remove-reg { position: absolute; top: -10px; right: -10px; width: 20px; height: 20px; border-radius: 50%; background: #ef4444; color: white; border: none; font-size: 14px; line-height: 1; pointer-events: auto; cursor: pointer; }
                
                .drawing-region { position: absolute; border: 2px dashed var(--primary); background: rgba(37, 99, 235, 0.1); pointer-events: none; }
                
                .btn-icon { padding: 0.6rem; border-radius: 0.75rem; border: 1px solid var(--border); transition: all 0.2s; }
                .btn-icon:hover { color: #ef4444; border-color: #ef4444; }
                .btn-primary { background: var(--primary); color: white; padding: 0.6rem 1.5rem; border-radius: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }
                .btn-primary:disabled { opacity: 0.5; }
                
                .editor-hint { position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); color: white; padding: 0.5rem 1rem; border-radius: 2rem; font-size: 0.75rem; pointer-events: none; }
            `}</style>
        </div>
    );
}
