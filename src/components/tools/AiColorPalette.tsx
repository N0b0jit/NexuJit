'use client';

import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Copy, Check, Palette, Lightbulb } from 'lucide-react';

interface Color {
    hex: string;
    name: string;
}

interface PaletteResult {
    colors: Color[];
    description: string;
}

export default function AiColorPalette() {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PaletteResult | null>(null);
    const [error, setError] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) setApiKey(savedKey);
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImagePreview(ev.target?.result as string);
                setTopic(`Extract colors from this image: ${file.name}`);
            };
            reader.readAsDataURL(file);
        }
    };

    const generatePalette = async () => {
        if (!topic.trim() && !imagePreview) return;
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const body = {
                topic: imagePreview ? 'Extract a 5-color palette from the provided image.' : topic,
                heading: topic, // pass original text as context if needed
                type: 'color-palette',
                userApiKey: apiKey,
                image: imagePreview ? imagePreview.split(',')[1] : undefined // Send base64 without prefix
            };

            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);
            if (!data.colors) throw new Error('Invalid response format from AI');

            setResult(data);
        } catch (err: any) {
            setError(err.message || 'Failed to generate palette');
        } finally {
            setLoading(false);
        }
    };

    const copyColor = (hex: string) => {
        navigator.clipboard.writeText(hex);
    };

    return (
        <div className="palette-tool">
            <div className="input-section">
                <div className="input-group">
                    <label><Lightbulb size={18} /> Describe your theme or Upload Image</label>
                    <div className="input-wrapper-col">
                        <div className="text-input-row">
                            <input
                                type="text"
                                placeholder="e.g. Cyberpunk Neon City, Cozy Autumn Cafe"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && generatePalette()}
                                disabled={!!imagePreview}
                            />
                            <label className="upload-btn-icon" title="Upload Image to Extract Colors">
                                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                                <Sparkles size={20} />
                            </label>
                            <button
                                className="generate-btn"
                                onClick={generatePalette}
                                disabled={loading || (!topic && !imagePreview)}
                            >
                                {loading ? <RefreshCw className="spin" size={20} /> : <Palette size={20} />}
                                Generate
                            </button>
                        </div>

                        {imagePreview && (
                            <div className="image-preview-box">
                                <img src={imagePreview} alt="Preview" />
                                <button onClick={() => { setImagePreview(null); setTopic(''); }} className="remove-img">&times;</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <div className="result-area">
                {result ? (
                    <div className="palette-display">
                        <div className="colors-grid">
                            {result.colors.map((color, idx) => (
                                <div
                                    key={idx}
                                    className="color-card"
                                    style={{ backgroundColor: color.hex }}
                                    onClick={() => copyColor(color.hex)}
                                    title="Click to copy HEX"
                                >
                                    <div className="color-info">
                                        <span className="hex">{color.hex}</span>
                                        <span className="name">{color.name}</span>
                                    </div>
                                    <div className="copy-overlay">
                                        <Copy size={24} color="#fff" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="palette-desc">
                            <h3><Palette size={18} /> Why this works</h3>
                            <p>{result.description}</p>
                        </div>
                    </div>
                ) : (
                    !loading && (
                        <div className="placeholder-state">
                            <Palette size={48} className="ghost-icon" />
                            <p>Enter a theme above to generate a unique AI-curated color palette.</p>
                        </div>
                    )
                )}

                {loading && (
                    <div className="loading-state">
                        <div className="loader-bars">
                            <div className="bar" style={{ animationDelay: '0s' }}></div>
                            <div className="bar" style={{ animationDelay: '0.1s' }}></div>
                            <div className="bar" style={{ animationDelay: '0.2s' }}></div>
                            <div className="bar" style={{ animationDelay: '0.3s' }}></div>
                            <div className="bar" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <p>Mixing colors...</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .palette-tool { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }
                .input-section { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
                .input-group label { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; margin-bottom: 1rem; color: var(--secondary); }
                .input-wrapper-col { display: flex; flex-direction: column; gap: 1rem; width: 100%; }
                .text-input-row { display: flex; gap: 1rem; align-items: center; width: 100%; }
                input { flex: 1; padding: 1rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); font-size: 1rem; transition: 0.3s; }
                input:focus { border-color: var(--primary); outline: none; }
                input:disabled { opacity: 0.7; user-select: none; }
                
                .upload-btn-icon { display: flex; align-items: center; justify-content: center; width: 3.5rem; height: 3.5rem; background: var(--surface); border: 2px dashed var(--border); border-radius: 1rem; cursor: pointer; color: var(--secondary); transition: 0.2s; }
                .upload-btn-icon:hover { color: var(--primary); border-color: var(--primary); background: var(--primary-soft); }

                .generate-btn { padding: 0 2rem; height: 3.5rem; background: var(--primary); color: #fff; border: none; border-radius: 1rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: 0.3s; white-space: nowrap; }
                .generate-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 5px 15px var(--primary-soft); }
                .generate-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                
                .image-preview-box { position: relative; width: 100px; height: 100px; border-radius: 1rem; overflow: hidden; border: 2px solid var(--border); box-shadow: var(--shadow-sm); }
                .image-preview-box img { width: 100%; height: 100%; object-fit: cover; }
                .remove-img { position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.6); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; border: none; }

                .error-msg { background: #fee2e2; color: #ef4444; padding: 1rem; border-radius: 0.5rem; text-align: center; }

                .result-area { min-height: 400px; position: relative; }
                
                .colors-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); height: 300px; border-radius: 1.5rem; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
                .color-card { position: relative; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; padding: 1.5rem; cursor: pointer; transition: 0.3s; }
                .color-card:hover .copy-overlay { opacity: 1; }
                .color-info { background: rgba(0,0,0,0.2); backdrop-filter: blur(10px); padding: 0.75rem; border-radius: 0.75rem; color: #fff; display: flex; flex-direction: column; gap: 0.2rem; transform: translateY(0); transition: 0.3s; }
                .hex { font-family: monospace; font-weight: 700; font-size: 1.1rem; letter-spacing: 1px; text-transform: uppercase; }
                .name { font-size: 0.8rem; opacity: 0.9; }
                
                .copy-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; }

                .palette-desc { margin-top: 2rem; background: var(--surface); padding: 1.5rem; border-radius: 1rem; border: 1px solid var(--border); }
                .palette-desc h3 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-size: 1.1rem; }
                .palette-desc p { color: var(--secondary); line-height: 1.6; }

                .placeholder-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; color: var(--secondary); text-align: center; gap: 1rem; border: 2px dashed var(--border); border-radius: 1.5rem; }
                .ghost-icon { opacity: 0.2; }

                .loading-state { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(255,255,255,0.8); z-index: 10; backdrop-filter: blur(5px); }
                .loader-bars { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
                .bar { width: 12px; height: 40px; background: var(--primary); animation: bounce 1s infinite; border-radius: 6px; }
                @keyframes bounce { 0%, 100% { transform: scaleY(0.5); opacity: 0.5; } 50% { transform: scaleY(1); opacity: 1; } }
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                @media (max-width: 768px) {
                    .colors-grid { grid-template-columns: 1fr; height: auto; }
                    .color-card { height: 100px; flex-direction: row; align-items: center; justify-content: space-between; }
                    .color-info { background: transparent; backdrop-filter: none; text-align: right; }
                    .text-input-row { flex-direction: column; }
                    .upload-btn-icon, .generate-btn { width: 100%; }
                }
            `}</style>
        </div>
    );
}
