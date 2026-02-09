'use client';

import { useState } from 'react';
import { Upload, Sparkles, Copy, Check, RefreshCw, Wand2, Settings } from 'lucide-react';

export default function ImageCaptionGenerator() {
    const [image, setImage] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target?.result as string);
                setResult(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const generateCaption = async () => {
        if (!image) return;
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'image-caption',
                    image: image,
                    userApiKey: apiKey || localStorage.getItem('gemini_api_key'),
                    topic: 'Image Captioning' // Dummy topic to pass validation
                }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setResult(data.text);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (!result) return;
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="top-bar">
                <button
                    className="settings-toggle"
                    onClick={() => setShowSettings(!showSettings)}
                >
                    <Settings size={18} /> {showSettings ? 'Hide Settings' : 'API Settings'}
                </button>
            </div>

            {showSettings && (
                <div className="settings-panel">
                    <h3>Gemini API Configuration</h3>
                    <p>Enter your own Gemini API key for free unlimited access. We don't store your key.</p>
                    <input
                        type="password"
                        placeholder="Paste your Gemini API Key here..."
                        value={apiKey}
                        onChange={(e) => {
                            setApiKey(e.target.value);
                            localStorage.setItem('gemini_api_key', e.target.value);
                        }}
                    />
                </div>
            )}

            <div className="main-grid">
                <div className="upload-section">
                    {!image ? (
                        <label className="uploader">
                            <Upload size={48} />
                            <h3>Upload Image</h3>
                            <p>Select a photo to generate AI captions</p>
                            <input type="file" hidden accept="image/*" onChange={handleUpload} />
                        </label>
                    ) : (
                        <div className="preview-wrap">
                            <img src={image} alt="Target" />
                            <div className="overlay-actions">
                                <button onClick={() => setImage(null)} className="btn-glass">Change</button>
                                <button onClick={generateCaption} disabled={isLoading} className="btn-ai">
                                    {isLoading ? <RefreshCw size={20} className="spin" /> : <Sparkles size={20} />}
                                    {isLoading ? 'Thinking...' : 'Generate Captions'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="results-section">
                    <div className="result-header">
                        <Wand2 size={20} />
                        <h3>AI Generated Captions</h3>
                        {result && (
                            <button onClick={handleCopy} className="copy-btn">
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        )}
                    </div>

                    <div className="result-content">
                        {isLoading ? (
                            <div className="loader">
                                <div className="shimmer" />
                                <div className="shimmer" />
                                <div className="shimmer" />
                            </div>
                        ) : result ? (
                            <div className="markdown" dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br/>') }} />
                        ) : (
                            <div className="empty">
                                <Sparkles size={32} />
                                <p>Captions and hashtags will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
                .top-bar { display: flex; justify-content: flex-end; }
                .settings-toggle { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 700; color: var(--secondary); background: var(--background); padding: 0.5rem 1rem; border-radius: 2rem; border: 1px solid var(--border); }
                
                .settings-panel { background: #fffbeb; border: 1px solid #fde68a; border-radius: 1rem; padding: 1.5rem; }
                .settings-panel h3 { font-size: 1rem; margin-bottom: 0.5rem; color: #92400e; }
                .settings-panel p { font-size: 0.8rem; color: #b45309; margin-bottom: 1rem; }
                .settings-panel input { width: 100%; padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid #fde68a; }

                .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
                .upload-section { background: var(--card-bg, #f8f9fa); border: 2px dashed var(--border); border-radius: 2rem; min-height: 450px; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
                
                .uploader { cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 1rem; color: var(--secondary); text-align: center; }
                .preview-wrap { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 2rem; }
                .preview-wrap img { max-width: 100%; max-height: 400px; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
                
                .overlay-actions { position: absolute; bottom: 1.5rem; display: flex; gap: 1rem; background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); padding: 0.75rem 1.5rem; border-radius: 3rem; }
                .btn-glass { background: rgba(255,255,255,0.2); color: white; border-radius: 2rem; padding: 0.5rem 1rem; font-weight: 600; font-size: 0.85rem; }
                .btn-ai { background: var(--primary); color: white; border-radius: 2rem; padding: 0.5rem 1.5rem; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; }
                
                .results-section { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; display: flex; flex-direction: column; }
                .result-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 0.5rem; }
                .result-header h3 { flex: 1; font-size: 1rem; font-weight: 700; }
                .copy-btn { padding: 0.5rem; border-radius: 0.5rem; background: var(--background); }
                
                .result-content { padding: 1.5rem; flex: 1; min-height: 300px; overflow-y: auto; }
                .markdown { font-size: 0.95rem; line-height: 1.6; }
                .empty { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--border); gap: 1rem; text-align: center; }
                
                .loader { display: flex; flex-direction: column; gap: 1rem; }
                .shimmer { height: 1rem; background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 1rem; }
                @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                @media (max-width: 800px) {
                    .main-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
