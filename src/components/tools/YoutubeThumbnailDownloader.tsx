'use client';

import { useState } from 'react';
import { Youtube, Download, Link as LinkIcon, AlertCircle, Image as ImageIcon } from 'lucide-react';

export default function YoutubeThumbnailDownloader() {
    const [url, setUrl] = useState('');
    const [videoId, setVideoId] = useState('');
    const [error, setError] = useState('');

    const extractVideoId = (input: string) => {
        const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = input.match(regExp);
        if (match && match[2].length === 11) {
            return match[2];
        }
        return null;
    };

    const handleProcess = () => {
        setError('');
        const id = extractVideoId(url);
        if (id) {
            setVideoId(id);
        } else {
            setError('Invalid YouTube URL. Please enter a valid video link.');
            setVideoId('');
        }
    };

    const thumbnails = videoId ? [
        { label: 'Maximum Resolution (HD)', url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, size: '1280x720' },
        { label: 'High Quality (SD)', url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`, size: '640x480' },
        { label: 'Medium Quality', url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, size: '480x360' },
        { label: 'Standard Quality', url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`, size: '320x180' },
    ] : [];

    return (
        <div className="tool-ui">
            <div className="card-input">
                <div className="input-group">
                    <label><Youtube size={16} /> YouTube Video URL</label>
                    <div className="input-with-btn">
                        <input
                            type="text"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <button onClick={handleProcess} className="primary-btn">Get Thumbnails</button>
                    </div>
                </div>
                {error && (
                    <div className="error-box">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {videoId && (
                <div className="results-grid">
                    {thumbnails.map((thumb, index) => (
                        <div key={index} className="thumb-card">
                            <div className="thumb-preview">
                                <img src={thumb.url} alt={thumb.label} onError={(e) => (e.currentTarget.style.display = 'none')} />
                                <div className="thumb-overlay">
                                    <span>{thumb.size}</span>
                                </div>
                            </div>
                            <div className="thumb-info">
                                <h3>{thumb.label}</h3>
                                <a href={thumb.url} target="_blank" rel="noopener noreferrer" download className="download-btn">
                                    <Download size={16} /> Download JPG
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                .tool-ui { display: flex; flex-direction: column; gap: 2.5rem; }
                .card-input { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow); }
                .input-group label { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--secondary); }
                .input-with-btn { display: flex; gap: 1rem; }
                .input-with-btn input { flex: 1; padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); font-weight: 500; }
                .primary-btn { padding: 0 2rem; background: var(--primary); color: white; border-radius: 0.75rem; font-weight: 700; }
                
                .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }
                .thumb-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.25rem; overflow: hidden; transition: transform 0.2s; }
                .thumb-card:hover { transform: translateY(-4px); }
                .thumb-preview { position: relative; aspect-ratio: 16/9; background: #000; display: flex; align-items: center; justify-content: center; }
                .thumb-preview img { width: 100%; height: 100%; object-fit: cover; }
                .thumb-overlay { position: absolute; bottom: 0.75rem; right: 0.75rem; background: rgba(0,0,0,0.7); color: white; padding: 0.25rem 0.5rem; border-radius: 0.4rem; font-size: 0.75rem; font-weight: 700; }
                
                .thumb-info { padding: 1.25rem; }
                .thumb-info h3 { font-size: 1rem; margin-bottom: 1rem; font-weight: 700; }
                .download-btn { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem; background: var(--primary-soft); color: var(--primary); border-radius: 0.75rem; font-weight: 700; font-size: 0.9rem; transition: background 0.2s; }
                .download-btn:hover { background: var(--primary); color: white; }

                .error-box { margin-top: 1rem; padding: 1rem; background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; border-radius: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
            `}</style>
        </div>
    );
}
